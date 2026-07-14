import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assegnazione } from '../../entities/assegnazione.entity';

@Component({
  selector: 'app-assegnazione-card',
  standalone: false,
  templateUrl: './assegnazione-card.html',
  styleUrl: './assegnazione-card.css',
})
export class AssegnazioneCardComponent {
  @Input() assegnazione!: Assegnazione;

  // mostra il nome del dipendente
  @Input() mostraDipendente = false;

  // abilita il pulsante completa
  @Input() puoCompletare = false;

  // abilita i controlli modifica e annulla per il referente
  @Input() puoGestire = false;

  @Output() completa = new EventEmitter<Assegnazione>();
  @Output() modifica = new EventEmitter<Assegnazione>();
  @Output() annulla = new EventEmitter<Assegnazione>();

  // il completamento solo su un'assegnazione ancora attiva
  get completabile(): boolean {
    return this.assegnazione.stato === 'Assegnato' || this.assegnazione.stato === 'Scaduto';
  }
}
