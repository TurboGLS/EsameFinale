import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal';

export type ConfirmOptions = {
  titolo?: string;
  messaggio: string;
  confermaLabel?: string;
  confermaClass?: string;
};

// smart: apre il modale di conferma e restituisce una Promise<boolean>
// (true = Conferma, false = Annulla/chiusura).
@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private modalSrv = inject(NgbModal);

  ask(opts: ConfirmOptions): Promise<boolean> {
    const ref = this.modalSrv.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
    Object.assign(ref.componentInstance, opts);
    // ref.result si risolve su close(true) e viene rigettata su dismiss()
    return ref.result.then(() => true, () => false);
  }
}
