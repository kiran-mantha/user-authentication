import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input() message = 'An error occurred';
  @Input() title = 'Error';
  @Input() showRetry = false;
  @Input() type: 'error' | 'warning' | 'info' = 'error';
  
  @Output() retry = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismissed.emit();
  }
}