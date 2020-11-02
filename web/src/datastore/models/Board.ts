import { nanoid } from '../../util';
import { LABEL_COLOR } from '../../types';
import type { BoardLabel, SwapObject } from '../../types';
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
  color: string;
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

  private getRandomColor(): string {
    return BOARD_COLORS[Math.floor(Math.random() * BOARD_COLORS.length)];
  }

  setTitle(title: string): void {
    this.title = title;
  }

  swapLists(l: SwapObject): void {
    this.lists[l.from - 1].index = l.to;
    this.lists[l.to - 1].index = l.from;
    
    let tmp: List = this.lists[l.from - 1];
    this.lists[l.from - 1] = this.lists[l.to - 1];
    this.lists[l.to - 1] = tmp;
  }

  toggleBoardArchive(): void {
    this.isArchived = !this.isArchived;
  }

  toggleBoardStar(): void {
    this.isStarred = !this.isStarred;
  }
}