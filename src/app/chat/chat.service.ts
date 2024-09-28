import { Injectable } from '@angular/core';
import { RagService } from '../api-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private ragService: RagService,
    private http: HttpClient,
  ) {}

  messages: Message[] = [];
  private apiUrl = 'http://192.168.140.22:8000';

  startStream(query: string): Observable<any> {
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(
        this.apiUrl + `/query?query=${query}`,
      );

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  health(): Observable<any> {
    return this.http.get(this.apiUrl + '/health');
  }
}
