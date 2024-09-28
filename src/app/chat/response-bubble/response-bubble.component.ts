import { Component, Input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { ContextItem } from '../message.model';
import { ResponseFileComponent } from './response-file/response-file.component';

@Component({
  selector: 'app-response-bubble',
  standalone: true,
  imports: [MarkdownComponent, ResponseFileComponent],
  templateUrl: './response-bubble.component.html',
  styleUrl: './response-bubble.component.sass',
})
export class ResponseBubbleComponent {
  @Input() text: string = '';
  @Input() context: ContextItem[] = [];
}
