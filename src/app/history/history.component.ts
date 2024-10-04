import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { ChatCollectionResponse, DatabaseService } from '../api-client';
import { HistoryService } from './history.service';

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
}
