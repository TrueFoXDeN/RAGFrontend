import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HistoryComponent } from './history/history.component';
import { DocumentsComponent } from './documents/documents.component';
import { Configuration, RagService } from './api-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, HistoryComponent, DocumentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  title = 'RAGFrontend';

  constructor(private ragService: RagService) {}

  ngOnInit(): void {
    const baseUrl = 'http://localhost:8000';
    const apiConfig = new Configuration({ basePath: baseUrl });
    this.ragService.configuration = apiConfig;
  }
}
