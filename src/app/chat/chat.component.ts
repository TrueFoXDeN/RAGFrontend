import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ResponseBubbleComponent } from './response-bubble/response-bubble.component';
import { PromptBubbleComponent } from './prompt-bubble/prompt-bubble.component';
import { AutoResizeChatDirective } from './auto-resize-chat.directive';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ResponseBubbleComponent,
    PromptBubbleComponent,
    AutoResizeChatDirective,
    Button,
    NgClass,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass',
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContent') private chatContent!: ElementRef;
  messageText: string = ''; // Holds the textarea content
  isTextEntered: boolean = false;

  onInputChange() {
    this.isTextEntered = this.messageText.length > 0;
  }

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
