import { nanoid } from '../../util';
import type List from './List';
import type Card from './Card';

export default class Board {
  id: string;
  title: string;
  color: string;
  isStarred: boolean;
  lastViewTime: number;
  lists: List[];

  constructor(title: string) {
    this.id = nanoid();
    this.title = title;
    this.isStarred = false;
    this.lastViewTime = new Date().getTime();
    this.lists = new Array<List>();

    Object.defineProperties(this, {
      lists: { value: [], enumerable: false, writable: true }
    });
  }

  setTitle(title: string): void {
    this.title = title;
  }
}