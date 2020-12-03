import { nanoid } from '../../util';
import type List from './List';
import type { ChecklistItem, PRIORITY, LABEL_COLOR, TimeEntry } from '../../types';

export default class Card {
  created: number;
  checklist: ChecklistItem[];
  description: string;
  due: number;
  id: string;
  isComplete: boolean;
  index: number;
  label: LABEL_COLOR;
  listId: string;
  log: TimeEntry[];
  priority: PRIORITY;
  title: string;

  constructor(list: List, title: string) {
    this.id = nanoid();
    this.checklist = new Array<ChecklistItem>();
    this.created = new Date().getTime();
    this.description = "";
    this.index = list.cards.length;
    this.label = null;
    this.listId = list.id;
    this.log = new Array<TimeEntry>();
    this.title = title;
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

  setLabel(label: LABEL_COLOR) {
    this.label = label;
  }
  
  setPriority(priority: PRIORITY) {
    this.priority = priority;
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