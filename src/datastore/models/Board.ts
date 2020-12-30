import { nanoid } from '../../util';
import { BOARD_COLORS, BoardColor, LABEL_COLOR } from '../../types';
import type { BoardLabel, SwapObject } from '../../types';
import type List from './List';
import type Card from './Card';

const BOARD_LABELS: BoardLabel[] = [
  { color: LABEL_COLOR.RED, text: "Red" },
  { color: LABEL_COLOR.ORANGE, text: "Orange" },
  { color: LABEL_COLOR.YELLOW, text: "Yellow" },
  { color: LABEL_COLOR.GREEN, text: "Green" },
  { color: LABEL_COLOR.TEAL, text: "Teal" },
  { color: LABEL_COLOR.BLUE, text: "Blue" },
  { color: LABEL_COLOR.PURPLE, text: "Purple" }
]; 

export default class Board {
  id: string;
  title: string;
  color: number;
  isArchived: boolean;
  isStarred: boolean;
  labels: BoardLabel[];
  lastViewTime: number;
  lists: List[];

  constructor(title: string) {
    this.id = nanoid();
    this.title = title;
    this.isArchived = false;
    this.isStarred = false;
    this.lastViewTime = new Date().getTime();
    this.color = this.getRandomColor();
    this.lists = new Array<List>();
    this.labels = BOARD_LABELS;

    Object.defineProperties(this, {
      lists: { value: [], enumerable: false, writable: true }
    });
  }

  private getRandomColor(): number {
    return Math.floor(Math.random() * BOARD_COLORS.length);
  }

  setLabels(labels: BoardLabel[]): void {
    this.labels = labels;
  }

  setLastViewTime(timestamp: number): void {
    this.lastViewTime = timestamp;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  swapLists(l: SwapObject): void {
    this.lists[l.from].index = l.to;
    this.lists[l.to].index = l.from;
    
    let tmp: List = this.lists[l.from];
    this.lists[l.from] = this.lists[l.to];
    this.lists[l.to] = tmp;
  }

  toggleBoardArchive(): void {
    this.isArchived = !this.isArchived;
  }

  toggleBoardStar(): void {
    this.isStarred = !this.isStarred;
  }
}