import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-response-file',
  standalone: true,
  imports: [],
  templateUrl: './response-file.component.html',
  styleUrl: './response-file.component.sass',
})
export class ResponseFileComponent {
  @Input() file: string = '';
  @Input() page: number = 0;
  @Input() text: string = '';
}
