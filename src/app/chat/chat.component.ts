import {
  AfterViewChecked,
  ChangeDetectorRef,
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
import { ChatService } from './chat.service';
import { RagService } from '../api-client';
import { HttpEventType } from '@angular/common/http';
import { filter, map } from 'rxjs';

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
  @ViewChild('chatInput') private chatInput!: ElementRef;

  messageText: string = '';
  isTextEntered: boolean = false;
  response: string = '';
  context: string = '';
  contextActive = true;
  // messages: any = [];

  constructor(
    protected chatService: ChatService,
    private ragService: RagService,
    private cdr: ChangeDetectorRef,
  ) {}

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

  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
      // Wenn Shift + Enter gedrückt wird, füge eine neue Zeile ein
      return;
    }

    event.preventDefault();
    this.sendPrompt();
  }

  onSendPress() {
    this.sendPrompt();
  }

  sendPrompt() {
    if (this.isTextEntered) {
      const textareaElement = this.chatInput.nativeElement;

      if (textareaElement) {
        textareaElement.style.height = 48 + 'px';
      }
      this.isTextEntered = false;
      this.scrollToBottom();
      this.chatService.messages.push({
        text: this.messageText,
        type: 'prompt',
        context: {},
      });

      // this.chatService.health().subscribe({
      //   next: (data) =>{
      //     console.log(data);
      //   }
      // })

      this.chatService.messages.push({
        text: '',
        type: 'response',
        context: {},
      });

      let index = this.chatService.messages.length - 1;

      this.chatService.startStream(this.messageText).subscribe({
        next: (data) => {
          if (data == '[CONTEXT-END]') {
            this.contextActive = false;
            return;
          }

          if (data == '[DONE]') {
            return;
          }

          if (this.contextActive) {
            this.chatService.messages[index].context = data;
          } else {
            // console.log(data);
            this.chatService.messages[index].text += data;
            this.cdr.markForCheck();
          }
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
      this.messageText = '';
      this.contextActive = true;
    }
  }

  finishReceive() {
    console.log(this.response);
  }
}
