import type Board from "./datastore/models/Board";
import type Card from "./datastore/models/Card";
import type List from "./datastore/models/List";

export type CardDetails = {
  board: Board;
  list: List;
  card: Card;
}

export type ChecklistItem = {
  text: string;
  checked: boolean;
}

export enum RESULT_TYPE {
  BOARD,
  CARD,
};

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

export type TimeLogItem = {
  date: number;
  description: string;
  duration: number;
}