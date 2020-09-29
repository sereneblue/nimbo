import { nimboDB } from './datastore/db';
import Board from './datastore/models/Board';
import type List from './datastore/models/List';
import type Card from './datastore/models/Card';

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
        this.boards[i].lists[j].cards = cards[j];
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

  public async toggleBoardStar(boardId: string): Promise<void> {
    let boardIndex: number = this.boards.findIndex(b => b.id === boardId);

    if (boardIndex > -1) {
      this.boards[boardIndex].isStarred = !this.boards[boardIndex].isStarred;
    }

    await this.db.boards.update(boardId, {
      isStarred: this.boards[boardIndex].isStarred
    });
  }

  public async updateViewTime(boardId: string): Promise<void> {
    await this.db.boards.update(boardId, {
      lastViewTime: new Date().getTime()
    });
  }
}