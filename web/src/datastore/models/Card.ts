import { nanoid } from '../../util';
import type List from './List';
import type { ChecklistItem, TimeEntry } from '../../types';

export default class Card {
  id: string;
  listId: string;
  index: number;
  title: string;
  description: string;
  created: number;
  checklist: ChecklistItem[];
  due: number;
  isComplete: boolean;
  log: TimeEntry[];

  constructor(list: List, title: string) {
    this.id = nanoid();
    this.listId = list.id;
    this.index = list.cards.length + 1;
    this.title = title;
    this.description = "";
    this.created = new Date().getTime();
    this.checklist = new Array<ChecklistItem>();
    this.log = new Array<TimeEntry>();
  }

  addToChecklist(text: string) {
    this.checklist.push({
      checked: false,
      text
    });
  }

  deleteFromChecklist(index: number) {
    this.checklist.splice(index, 1);
  }

  deleteTimeEntry(index: number) {
    this.log.splice(index, 1);
  }

  setComplete(complete: boolean) {
    this.isComplete = complete;
  }

  setDueDate(timestamp: number) {
    this.due = timestamp;
  }
  
  setDescription(text: string) {
    this.description = text;
  }

  setTitle(title: string) {
    this.title = title;
  }

  trackTime(duration: number) {
    this.log.push({
      duration,
      date: new Date().getTime()
    });
  }
}