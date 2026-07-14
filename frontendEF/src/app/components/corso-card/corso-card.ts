import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Corso } from '../../entities/corso.entity';

// dumb: presenta un corso del catalogo ed emette gli eventi di gestione
@Component({
  selector: 'app-corso-card',
  standalone: false,
  templateUrl: './corso-card.html',
  styleUrl: './corso-card.css',
})
export class CorsoCardComponent {
  @Input() corso!: Corso;

  @Output() modifica = new EventEmitter<Corso>();
  @Output() disattiva = new EventEmitter<Corso>();
  @Output() elimina = new EventEmitter<Corso>();
}
