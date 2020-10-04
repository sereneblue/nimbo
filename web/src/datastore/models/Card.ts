import { nanoid } from '../../util';
import type List from './List';

enum ActivityType {};

type ChecklistItem = {
  text: string;
  checked: boolean;
}

type Activity = {
  type: ActivityType;
  timestamp: number;
}

export default class Card {
  id: string;
  listId: string;
  index: number;
  title: string;
  description: string;
  created: number;
  checklist: ChecklistItem[];
  due: number;
  log: Activity[];

  constructor(list: List, title: string) {
    this.id = nanoid();
    this.listId = list.id;
    this.index = list.cards.length + 1;
    this.title = title;
    this.description = "";
    this.created = new Date().getTime();
    this.checklist = new Array<ChecklistItem>();
    this.log = new Array<Activity>();
  }

  addToChecklist(text: string) {
    this.checklist.push({
      checked: false,
      text
    });
  }

  setDescription(text: string) {
    this.description = text;
  }

  setTitle(title: string) {
    this.title = title;
  }
}