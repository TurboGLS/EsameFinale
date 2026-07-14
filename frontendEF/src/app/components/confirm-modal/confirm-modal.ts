import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// dumb: modale di conferma generico. Riceve testi in input e chiude
// il modale con true (Conferma) o lo scarta (Annulla).
@Component({
  selector: 'app-confirm-modal',
  standalone: false,
  templateUrl: './confirm-modal.html',
})
export class ConfirmModalComponent {
  activeModal = inject(NgbActiveModal);

  @Input() titolo = 'Conferma';
  @Input() messaggio = 'Sei sicuro di voler procedere?';
  @Input() confermaLabel = 'Conferma';
  // classe Bootstrap del pulsante di conferma (es. btn-danger per le eliminazioni)
  @Input() confermaClass = 'btn-primary';
}
