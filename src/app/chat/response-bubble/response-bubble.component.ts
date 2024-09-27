import { Component, Input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-response-bubble',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './response-bubble.component.html',
  styleUrl: './response-bubble.component.sass',
})
export class ResponseBubbleComponent {
  @Input() text: string = '';
}
