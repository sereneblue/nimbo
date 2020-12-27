import type { DueFilterOptions, Theme } from '../../types';

export default class Settings {
  id: number;
  dueFilter: DueFilterOptions;
  listFilter: string;
  maxCards: number;
  theme: Theme;
  selectedBoards: string[];

  constructor() {
    this.id = 1;
    this.theme = "dark";
    this.maxCards = 5;
    this.dueFilter = "all";
    this.listFilter = "";
    this.selectedBoards = ["all"];
  }
}