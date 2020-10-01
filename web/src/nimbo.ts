import { nimboDB } from './datastore/db';
import Board from './datastore/models/Board';
import List from './datastore/models/List';
import type Card from './datastore/models/Card';
import type { SwapObject } from './types';

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
        
        await this.db.lists.delete(listId);
        await this.db.cards.where({ listId }).delete();
        await this.updateListIndexes(updateFromIndex);
      }
    }
  }

  public getBoard(boardId: string): Board | null {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      return this.boards[boardIndex];
    }

    return null;
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

  private async updateListIndexes(startIndex: number): Promise<void> {
    await this.db.lists.where("index").above(startIndex).modify(l => {
      l.index = l.index - 1;
    });
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