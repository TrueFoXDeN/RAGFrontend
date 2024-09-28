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
import { Message } from './message.model';
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
  codeBlockActive: boolean = false;

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

      let promptMessage: Message = {
        text: this.messageText,
        type: 'prompt',
        context: [],
      };
      this.chatService.messages.push(promptMessage);

      let responseMessage: Message = {
        text: '',
        type: 'response',
        context: [],
      };

      this.chatService.messages.push(responseMessage);

      let index = this.chatService.messages.length - 1;

      this.chatService.startStream(this.messageText).subscribe({
        next: (data) => {
          if (data === '[CONTEXT-END]') {
            this.contextActive = false;
            return;
          }

          if (data === '[DONE]') {
            return;
          }

          if (this.contextActive) {
            data = JSON.parse(data);
            this.chatService.messages[index].context = data.context;
          } else {
            let tempMessage = this.chatService.messages[index].text + data;
            // Herausfinden ob Anzahl ` im text ungerade ist -> wenn ja, innerhalb des codeblocks
            this.codeBlockActive =
              (tempMessage.match(/`/g) || []).length % 2 !== 0;
            if (this.codeBlockActive) {
              data = data.replaceAll('[NEWLINE][NEWLINE]', '  \n\n');
            } else {
              data = data.replaceAll(
                '[NEWLINE][NEWLINE]',
                '  \n&nbsp;&nbsp;\n',
              );
            }

            data = data.replaceAll('[NEWLINE]', '  \n');

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
      this.codeBlockActive = false;
    }
  }

  finishReceive() {
    console.log(this.response);
  }
}
