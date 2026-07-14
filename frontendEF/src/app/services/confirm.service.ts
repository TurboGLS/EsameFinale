import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal';

export type ConfirmOptions = {
  titolo?: string;
  messaggio: string;
  confermaLabel?: string;
  confermaClass?: string;
};

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private modalSrv = inject(NgbModal);

  ask(opts: ConfirmOptions): Promise<boolean> {
    const ref = this.modalSrv.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
    Object.assign(ref.componentInstance, opts);
    return ref.result.then(() => true, () => false);
  }
}
