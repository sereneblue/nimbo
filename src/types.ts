import type { Board, Card, List } from "./datastore/models";

export const BOARD_COLORS: string[] = [
  "#DC7684",
  "#A0C1B8",
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

export type BoardColor = typeof BOARD_COLORS[number];

export type BoardLabel = {
  color: LABEL_COLOR;
  text: string;
}

export type CardDetails = {
  board: Board;
  list: List;
  card: Card;
}

export type ChecklistItem = {
  text: string;
  checked: boolean;
}

export type DueFilterOptions = "all" | "overdue" | "month" | "tomorrow" | "week";

export enum PRIORITY {
  P1,
  P2,
  P3,
  P4
}

export enum LABEL_COLOR {
  RED,
  ORANGE,
  YELLOW,
  GREEN,
  TEAL,
  BLUE,
  PURPLE
}

export enum RESULT_TYPE {
  BOARD,
  CARD
}

export type SearchObject = {
  type: RESULT_TYPE;
  text: string;
  path: string;
}

export type SortObject = {
  boardId: string,
  from: {
    list: string,
    index: number
  },
  to: {
    list: string,
    index: number
  }
}

export type SwapObject = {
  from: number;
  to: number;
}

export type TimeEntry = {
  date: number;
  duration: number;
}

export type Theme = "dark" | "light";