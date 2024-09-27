import { Injectable } from '@angular/core';
import { RagService } from '../api-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private ragService: RagService,
    private http: HttpClient,
  ) {}
  messages: any = [];
  private apiUrl = '/api';

  startStream(query: string): Observable<any> {
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(
        this.apiUrl + `/query?query=${query}`,
      );

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      return () => eventSource.close();
    });
  }

  health(): Observable<any> {
    return this.http.get(this.apiUrl + '/health');
  }
}
