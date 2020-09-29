﻿import Dexie from 'dexie';
import Board from './models/Board';
import List from './models/List';
import Card from './models/Card';

export class nimboDB extends Dexie {
  boards: Dexie.Table<Board, string>;
  cards: Dexie.Table<Card, string>;
  lists: Dexie.Table<List, string>;
  
  constructor() {
    super("nimboDB");

    let db = this;

    db.version(1).stores({
      boards: "&id, title",
      cards: "&id, title, listId, index",
      lists: "&id, boardId, index"
    });

    db.boards.mapToClass(Board);
    db.cards.mapToClass(Card);
    db.lists.mapToClass(List);
  }
}