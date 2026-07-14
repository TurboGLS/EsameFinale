import { Component, Input } from '@angular/core';
import { StatoAssegnazione } from '../../entities/assegnazione.entity';

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
      default: return 'bg-primary'; // passo Assegnato come default
    }
  }
}
