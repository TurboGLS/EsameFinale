import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Toast } from '../../entities/toast.entity';

/**
 * Dumb component: riceve i toast in input, li presenta in alto a destra
 * ed emette un evento quando l'utente chiude una notifica.
 * Non conosce la logica applicativa.
 */
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
