import { Component, Input } from '@angular/core';
import { StatoAssegnazione } from '../../entities/assegnazione.entity';

// dumb: mostra lo stato di una assegnazione come badge colorato
@Component({
  selector: 'app-stato-badge',
  standalone: false,
  templateUrl: './stato-badge.html',
})
export class StatoBadgeComponent {
  @Input() stato!: StatoAssegnazione;

  // mappa lo stato sulla classe Bootstrap del badge
  get badgeClass(): string {
    switch (this.stato) {
      case 'Completato': return 'bg-success';
      case 'Scaduto': return 'bg-danger';
      case 'Annullato': return 'bg-secondary';
      default: return 'bg-primary'; // Assegnato
    }
  }
}
