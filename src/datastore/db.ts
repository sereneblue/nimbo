﻿import Dexie from 'dexie';
import { Board, Card, List, Settings } from './models';

export class nimboDB extends Dexie {
  boards: Dexie.Table<Board, string>;
  cards: Dexie.Table<Card, string>;
  lists: Dexie.Table<List, string>;
  settings: Dexie.Table<Settings, string>;

  constructor() {
    super("nimboDB");

    let db = this;

    db.version(1).stores({
      boards: "&id, title",
      cards: "&id, title, listId, index",
      lists: "&id, boardId, index",
      settings: "&id"
    });

    db.boards.mapToClass(Board);
    db.cards.mapToClass(Card);
    db.lists.mapToClass(List);
    db.settings.mapToClass(Settings);
  }
}