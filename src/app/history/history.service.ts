import { Injectable } from '@angular/core';
import { ChatHistoryCollectionModel } from './chatsHistory.model';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  chatHistoryCollection: ChatHistoryCollectionModel = { chats: [] };

  constructor() {}
}
