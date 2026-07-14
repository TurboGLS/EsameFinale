import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assegnazione } from '../../entities/assegnazione.entity';

// dumb: presenta una singola assegnazione ed emette gli eventi di azione.
// Non conosce la logica applicativa: riceve i dati e notifica le intenzioni dell'utente.
@Component({
  selector: 'app-assegnazione-card',
  standalone: false,
  templateUrl: './assegnazione-card.html',
  styleUrl: './assegnazione-card.css',
})
export class AssegnazioneCardComponent {
  @Input() assegnazione!: Assegnazione;

  // mostra il nome del dipendente (utile nella vista referente)
  @Input() mostraDipendente = false;

  // abilita il pulsante "completa" (es. per il dipendente proprietario)
  @Input() puoCompletare = false;

  // abilita i controlli di gestione (modifica/annulla) per il referente
  @Input() puoGestire = false;

  @Output() completa = new EventEmitter<Assegnazione>();
  @Output() modifica = new EventEmitter<Assegnazione>();
  @Output() annulla = new EventEmitter<Assegnazione>();

  // il completamento ha senso solo su un'assegnazione ancora attiva
  get completabile(): boolean {
    return this.assegnazione.stato === 'Assegnato' || this.assegnazione.stato === 'Scaduto';
  }
}
