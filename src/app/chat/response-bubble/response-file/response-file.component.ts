import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-response-file',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './response-file.component.html',
  styleUrl: './response-file.component.sass',
})
export class ResponseFileComponent {
  @Input() file: string = '';
  @Input() page: number = 0;
  @Input() text: string = '';

  textVisible: boolean = false;

  showText() {
    this.textVisible = !this.textVisible;
  }
}
