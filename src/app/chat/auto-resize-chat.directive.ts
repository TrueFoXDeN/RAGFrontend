import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
  standalone: true,
})
export class AutoResizeChatDirective {
  constructor(private element: ElementRef) {}

  @HostListener('input') onInput() {
    this.adjustTextareaHeight();
  }

  ngOnInit() {
    this.adjustTextareaHeight();
  }

  private adjustTextareaHeight(): void {
    const textarea = this.element.nativeElement;
    const text = textarea.value;
    const newlineCount = (text.match(/\n/g) || []).length;
    textarea.style.height = 'auto'; // Setze Höhe zurück, um den tatsächlichen Inhalt zu messen

    let newHeight = textarea.scrollHeight;
    if (newlineCount == 0) {
      newHeight -= 24;
    }
    textarea.style.height = Math.min(newHeight, 408) + 'px'; // Passe die Höhe an den Inhalt an
  }
}
