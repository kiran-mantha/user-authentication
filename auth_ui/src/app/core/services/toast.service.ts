import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  dismissible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  private dismissSubject = new Subject<string>();

  public toast$ = this.toastSubject.asObservable();
  public dismiss$ = this.dismissSubject.asObservable();

  show(message: string, type: ToastMessage['type'] = 'info', duration: number = 5000): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      message,
      type,
      duration,
      dismissible: true
    };
    this.toastSubject.next(toast);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration || 8000);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: string): void {
    this.dismissSubject.next(id);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}