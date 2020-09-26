import { nanoid } from '../../util';

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
  title: string;
  description: string;
  created: number;
  checklist: ChecklistItem[];
  due: number;
  log: Activity[];

  constructor(listId: string, title: string) {
    this.id = nanoid();
    this.listId = listId;
    this.title = title;
    this.created = new Date().getTime();
    this.checklist = new Array<ChecklistItem>();
    this.log = new Array<Activity>();
  }

  setDescription(text: string) {
    this.description = text;
  }

  setTitle(title: string) {
    this.title = title;
  }
}