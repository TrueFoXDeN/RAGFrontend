import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ResponseBubbleComponent } from './response-bubble/response-bubble.component';
import { PromptBubbleComponent } from './prompt-bubble/prompt-bubble.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ResponseBubbleComponent, PromptBubbleComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass',
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContent') private chatContent!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop =
        this.chatContent.nativeElement.scrollHeight;
    } catch (err) {
      console.log('Error while scrolling:', err);
    }
  }
}
