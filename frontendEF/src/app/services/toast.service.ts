import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastType } from '../entities/toast.entity';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // durata di default prima dell'auto-dismiss (ms)
  private readonly defaultDuration = 5000;

  // contatore per generare id univoci
  private counter = 0;

  private _toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts$.asObservable();

  // notifica di conferma (verde)
  success(message: string, title = 'Operazione completata', duration?: number) {
    this.show('success', message, title, duration);
  }

  // notifica di errore (rossa)
  error(message: string, title = 'Si è verificato un errore', duration?: number) {
    this.show('error', message, title, duration);
  }

  // notifica informativa (blu)
  info(message: string, title = 'Informazione', duration?: number) {
    this.show('info', message, title, duration);
  }

  show(type: ToastType, message: string, title?: string, duration = this.defaultDuration) {
    const toast: Toast = { id: ++this.counter, type, title, message };
    this._toasts$.next([...this._toasts$.value, toast]);

    // se duration > 0 programmo la rimozione automatica
    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  remove(id: number) {
    this._toasts$.next(this._toasts$.value.filter(toast => toast.id !== id));
  }

  clear() {
    this._toasts$.next([]);
  }
}
