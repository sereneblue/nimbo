import { nimboDB } from './datastore/db';
import Board from './datastore/models/Board';
import List from './datastore/models/List';
import Card from './datastore/models/Card';
import { BoardLabel, CardDetails, RESULT_TYPE, SearchObject, SortObject, SwapObject } from './types';

export default class nimbo {
  db: nimboDB;
  boards: Board[];
  showCommandPalette: boolean;

  constructor() {
    this.db = new nimboDB();
    this.boards = new Array<Board>();
    this.showCommandPalette = false;
  }

  public async init(): Promise<boolean> {
    this.boards = await this.db.boards.toArray();
    
    let lists: List[][] = await Promise.all(this.boards.map(b => this.db.lists.where({ boardId: b.id }).toArray()));

    for (let i: number = 0; i < lists.length; i++) {
      this.boards[i].lists = lists[i].sort((a: List, b: List): number => {
        return a.index - b.index
      });

      let cards: Card[][] = await Promise.all(this.boards[i].lists.map(l => this.db.cards.where({ listId: l.id }).toArray()));
      
      for (let j: number = 0; j < this.boards[i].lists.length; j++) {
        this.boards[i].lists[j].cards = cards[j].sort((a: Card, b: Card): number => {
          return a.index - b.index
        });
      }
    }

    return true;
  }
  
  public openPalette() {
    this.showCommandPalette = true;
  }

  public closePalette() {
    this.showCommandPalette = false;
  }

  public async addNewCard(list: List, title: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === list.boardId);
    
    if (boardIndex > -1) {
      let listIndex: number = this.boards[boardIndex].lists.findIndex(l => l.id === list.id); 

      if (listIndex > -1) {
        let c: Card = new Card(list, title);

        this.boards[boardIndex].lists[listIndex].cards = [...this.boards[boardIndex].lists[listIndex].cards, c];

        await this.db.cards.add(c);
      }
    }
  }

  public async addNewList(boardId: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);
    
    if (boardIndex > -1) {
      let l: List = new List(boardId, this.boards[boardIndex].lists.length + 1); 
      this.boards[boardIndex].lists = [...this.boards[boardIndex].lists, l];

      await this.db.lists.add(l);
    }
  }

  public async createBoard(title: string): Promise<string> {
    let b: Board = new Board(title);
    this.boards = [...this.boards, b];

    await this.db.boards.add(b);

    return b.id;
  }

  public async deleteBoard(id: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === id);

    if (boardIndex > -1) {
      this.boards.splice(boardIndex, 1);
    }

    await this.db.boards.delete(id);
  }

  public async deleteCard(list: List, cardId: string): Promise<void> {
    for (let i: number = 0; i < this.boards.length; i++) {
      for (let j: number = 0; j < this.boards[i].lists.length; j++) {
        if (this.boards[i].lists[j].id === list.id) {
          list.deleteCard(cardId);

          this.boards[i].lists[j] = list;
        }
      }
    }

    await this.db.cards.delete(cardId);
  }

  public async deleteList(boardId: string, listId: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);
    
    if (boardIndex > -1) {
      let listIndex: number = this.boards[boardIndex].lists.findIndex(l => l.id === listId); 

      if (listIndex > -1) {
        let updateFromIndex: number = this.boards[boardIndex].lists[listIndex].index;
        this.boards[boardIndex].lists.splice(listIndex, 1);
        
        for (let i: number = 0; i < this.boards[boardIndex].lists.length; i++) {
          this.boards[boardIndex].lists[i].index = i + 1;
        };

        await this.db.transaction('rw', this.db.lists, this.db.cards, async (): Promise<void> =>{
          await Promise.all([
            this.db.lists.delete(listId),
            this.db.cards.where({ listId }).delete()
          ]);
        });
        await this.updateListIndexes(updateFromIndex);
      }
    }
  }

  public everything(): SearchObject[] {
    return (this.boards.map((b) => {
      if (b.isArchived) return [];

      return [{
        type: RESULT_TYPE.BOARD,
        text: b.title,
        path: `/b/${b.id}`
      }, b.lists.map(l => {
          return l.cards.map(c => {
            return {
              type: RESULT_TYPE.CARD,
              text: c.title,
              path: `/c/${c.id}`
            };
          });
        })
      ];
    }) as any).flat(4);
  }

  public getBoard(boardId: string): Board | null {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      return this.boards[boardIndex];
    }

    return null;
  }

  public getCardDetails(cardId: string): CardDetails | null {
    for (let i: number = 0; i < this.boards.length; i++) {
      for (let j: number = 0; j < this.boards[i].lists.length; j++) {
        for (let k: number = 0; k < this.boards[i].lists[j].cards.length; k++) {
          if (this.boards[i].lists[j].cards[k].id === cardId) {
            return {
              board: this.boards[i],
              list: this.boards[i].lists[j],
              card: this.boards[i].lists[j].cards[k]
            }
          }
        }
      }
    }

    return null;
  }

  public async moveCard(c: SortObject): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === c.boardId);

    if (boardIndex > -1) {
      let listFromIndex: number = this.boards[boardIndex].lists.findIndex(l => l.id === c.from.list); 
      let listToIndex: number = this.boards[boardIndex].lists.findIndex(l => l.id === c.to.list); 

      if (listFromIndex > -1 && listToIndex > -1) {
        if (c.from.list != c.to.list) {
          let fromListId: string;

          let tmp: Card = this.boards[boardIndex].lists[listFromIndex].cards.splice(c.from.index, 1)[0]; 
          fromListId = tmp.listId;

          tmp.listId = this.boards[boardIndex].lists[listToIndex].id;
          tmp.index = c.to.index + 1;

          for (let i: number = c.from.index; i < this.boards[boardIndex].lists[listFromIndex].cards.length; i++) {
            this.boards[boardIndex].lists[listFromIndex].cards[i].index--; 
          }
          
          this.boards[boardIndex].lists[listToIndex].cards.splice(c.to.index, 0, tmp);

          for (let i: number = c.to.index + 1; i < this.boards[boardIndex].lists[listToIndex].cards.length; i++) {
            this.boards[boardIndex].lists[listToIndex].cards[i].index++; 
          }

          await this.updateCardIndexes(tmp, fromListId, c.from.index, c.to.index);
        } else {
          if (c.from.index != c.to.index) {
            let tmp: Card = this.boards[boardIndex].lists[listFromIndex].cards.splice(c.from.index, 1)[0];
            tmp.index = c.to.index + 1;

            let positions: number[] = [c.from.index, c.to.index].sort();

            // only change indexes of indexes between from/to
            for (let i: number = positions[0]; i < positions[1]; i++) {
              if (c.from.index < c.to.index) {
                this.boards[boardIndex].lists[listFromIndex].cards[i].index--;
              } else {
                this.boards[boardIndex].lists[listFromIndex].cards[i].index++;
              }
            }

            this.boards[boardIndex].lists[listFromIndex].cards.splice(c.to.index, 0, tmp);

            await this.updateCardIndexes(tmp, tmp.listId, c.from.index, c.to.index);
          }
        }
      }
    }
  }

  public async swapLists(boardId: string, l: SwapObject): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      this.boards[boardIndex].swapLists(l);

      await this.db.transaction('rw', this.db.lists, async (): Promise<void> =>{
        let [from, to]: List[] = await Promise.all([
          this.db.lists.get({ boardId, index: l.from }),
          this.db.lists.get({ boardId, index: l.to })
        ]);
        
        from.index = l.to;
        to.index = l.from;

        await this.db.lists.bulkPut([from, to]);
      });
    }
  }

  public async toggleBoardArchive(boardId: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      this.boards[boardIndex].toggleBoardArchive();

      await this.db.boards.update(boardId, {
        isArchived: this.boards[boardIndex].isArchived
      });
    }
  }

  public async toggleBoardStar(boardId: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      this.boards[boardIndex].toggleBoardStar();

      await this.db.boards.update(boardId, {
        isStarred: this.boards[boardIndex].isStarred
      });
    }
  }

  public async updateBoardTitle(boardId: string, title: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      this.boards[boardIndex].setTitle(title);

      await this.db.boards.update(boardId, {
        title
      });
    }
  }

  public async updateCard(c: Card, property: string): Promise<void> {
    for (let i: number = 0; i < this.boards.length; i++) {
      for (let j: number = 0; j < this.boards[i].lists.length; j++) {
        for (let k: number = 0; k < this.boards[i].lists[j].cards.length; k++) {
          if (this.boards[i].lists[j].cards[k].id === c.id) {            
            this.boards[i].lists[j].cards[k] = c;
          }
        }
      }
    }
    
    await this.db.cards.update(c.id, {
      [property]: c[property]
    });
  }

  private async updateCardIndexes(c: Card, fromListId: string, fromIndex: number, toIndex: number): Promise<void> {
    await this.db.transaction('rw', this.db.cards, this.db.lists, async (): Promise<void> =>{
      if (c.listId != fromListId) {
        await this.db.cards.where({ listId: fromListId }).filter((c: Card): boolean => {
          return c.index > fromIndex
        }).modify(c => {
          c.index--;
        });
  
        await this.db.cards.where({ listId: c.listId }).filter((c: Card): boolean => {
          return c.index > toIndex
        }).modify(c => {
          c.index++;
        });
      } else {
        let positions: number[] = [fromIndex, toIndex].sort();
        
        await this.db.cards.where({ listId: fromListId }).filter((c: Card): boolean => {
          if (fromIndex < toIndex) {
            return positions[0] + 1 < c.index && c.index <= positions[1] + 1;
          }

          return positions[0] < c.index && c.index <= positions[1];
        }).modify(c => {
          if (fromIndex < toIndex) {
            c.index--;
          } else {
            c.index++;
          }
        });
      }

      await this.db.cards.update(c.id, {
        listId: c.listId,
        index: c.index
      });
    });
  }

  private async updateListIndexes(startIndex: number): Promise<void> {
    await this.db.lists.where("index").above(startIndex).modify(l => {
      l.index = l.index - 1;
    });
  }

  public async updateLabels(boardId: string, labels: BoardLabel[]): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      this.boards[boardIndex].setLabels(labels);

      await this.db.boards.update(boardId, {
        labels
      });
    }
  }

  public async updateListTitle(boardId: string, listId: string, title: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);
    
    if (boardIndex > -1) {
      let listIndex: number = this.boards[boardIndex].lists.findIndex(l => l.id === listId); 

      if (listIndex > -1) {
        this.boards[boardIndex].lists[listIndex].setTitle(title);

        await this.db.lists.update(listId, {
          title
        });
      }
    }
  }

  public async updateViewTime(boardId: string): Promise<void> {
    await this.db.boards.update(boardId, {
      lastViewTime: new Date().getTime()
    });
  }
}