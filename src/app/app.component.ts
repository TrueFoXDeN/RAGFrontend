import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HistoryComponent } from './history/history.component';
import { DocumentsComponent } from './documents/documents.component';
import {
  Configuration,
  DatabaseService,
  ManagementService,
  RagService,
} from './api-client';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, HistoryComponent, DocumentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  title = 'RAGFrontend';

  constructor(
    private ragService: RagService,
    private databaseService: DatabaseService,
    private managementService: ManagementService,
  ) {}

  ngOnInit(): void {
    const baseUrl = environment.baseUrl;
    const apiConfig = new Configuration({ basePath: baseUrl });
    this.ragService.configuration = apiConfig;
    this.databaseService.configuration = apiConfig;
    this.managementService.configuration = apiConfig;
  }
}
