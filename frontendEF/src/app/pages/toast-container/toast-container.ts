import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-toast-container',
  standalone: false,
  templateUrl: './toast-container.html',
})
export class ToastContainerComponent {
  protected toastSrv = inject(ToastService);

  toasts$ = this.toastSrv.toasts$;

  onDismiss(id: number) {
    this.toastSrv.remove(id);
  }
}
