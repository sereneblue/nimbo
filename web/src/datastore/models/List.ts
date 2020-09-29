import { nanoid } from '../../util';
import type Card from './Card';

export default class List {
  id: string;
  boardId: string;
  index: number;
  title: string;
  cards: Card[];

  constructor(boardId: string, index: number) {
    this.id = nanoid();
    this.title = "New List";
    this.index = index;
    this.boardId = boardId;
    this.cards = new Array<Card>();

    Object.defineProperties(this, {
      cards: { value: [], enumerable: false, writable: true }
    });
  }

  setTitle(title: string): void {
    this.title = title;
  }
}