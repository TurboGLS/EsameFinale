import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Toast } from '../../entities/toast.entity';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  @Input()
  toasts: Toast[] = [];

  @Output()
  dismiss = new EventEmitter<number>();

  onDismiss(id: number) {
    this.dismiss.emit(id);
  }
}
