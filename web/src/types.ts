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