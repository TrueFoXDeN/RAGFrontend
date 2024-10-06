import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import {
  ChatCollectionResponse,
  ChatRequestOutput,
  DatabaseService,
} from '../api-client';
import { HistoryService } from './history.service';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [Button],
  templateUrl: './history.component.html',
  styleUrl: './history.component.sass',
})
export class HistoryComponent implements OnInit {
  constructor(
    private databaseService: DatabaseService,
    protected historyService: HistoryService,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.databaseService.getChats().subscribe({
      next: (res: ChatCollectionResponse) => {
        this.historyService.chatHistoryCollection = {
          chats: res.chats.map((chat) => ({
            ...chat,
            created_on: new Date(chat.created_on),
          })),
        };
      },
    });
  }

  newChat() {
    this.chatService.currentChatId = '';
    this.chatService.messages = [];
    this.chatService.setFocusEvent.next();
  }

  loadChat(chat_id: string) {
    if (this.chatService.currentChatId !== chat_id) {
      this.databaseService.getChatById(chat_id).subscribe({
        next: (data: ChatRequestOutput) => {
          this.chatService.currentChatId = data.chat_id;
          this.chatService.messages = [...data.messages];
          this.chatService.setFocusEvent.next();
          this.chatService.scrollToBottomEvent.next();
        },
      });
    }
  }
}
