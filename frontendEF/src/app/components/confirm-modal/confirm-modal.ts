import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
  @Input() confermaClass = 'btn-primary';
}
