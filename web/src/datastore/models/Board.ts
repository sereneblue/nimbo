import { nanoid } from '../../util';
import type List from './List';
import type Card from './Card';

const BOARD_COLORS: string[] = [
  "#DC7684",
  "#E4CA99",
  "#2D7F9D",
  "#A1B6B4",
  "#717D84",
  "#B5A25D",
  "#6B436E",
  "#9A83A3",
  "#737088",
  "#A63D11",
  "#E97140",
  "#818773"
];

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
    this.color = this.getRandomColor();
    this.lists = new Array<List>();

    Object.defineProperties(this, {
      lists: { value: [], enumerable: false, writable: true }
    });
  }

  private getRandomColor(): string {
    return BOARD_COLORS[Math.floor(Math.random() * BOARD_COLORS.length)];
  }

  setTitle(title: string): void {
    this.title = title;
  }
}