import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Categoria } from '../../entities/categoria.entity';
import { Corso, CorsoPayload } from '../../entities/corso.entity';

// dumb: form di creazione/modifica corso. Riceve i dati in input,
// valida a livello di presentazione ed emette il payload al salvataggio.
@Component({
  selector: 'app-corso-form',
  standalone: false,
  templateUrl: './corso-form.html',
})
export class CorsoFormComponent implements OnChanges {
  protected fb = inject(FormBuilder);

  // corso da modificare; null in creazione
  @Input() corso: Corso | null = null;
  @Input() categorie: Categoria[] = [];
  @Input() salvataggioInCorso = false;

  @Output() salva = new EventEmitter<CorsoPayload>();
  @Output() annulla = new EventEmitter<void>();

  corsoForm = this.fb.group({
    titolo: ['', Validators.required],
    descrizione: [''],
    categoria: ['', Validators.required],
    durataOre: [1, [Validators.required, Validators.min(1)]],
    obbligatorio: [false],
    attivo: [true],
  });

  ngOnChanges(): void {
    if (this.corso) {
      this.corsoForm.patchValue({
        titolo: this.corso.titolo,
        descrizione: this.corso.descrizione ?? '',
        categoria: this.corso.categoria?.id ?? '',
        durataOre: this.corso.durataOre,
        obbligatorio: this.corso.obbligatorio,
        attivo: this.corso.attivo,
      });
    } else {
      this.corsoForm.reset({ titolo: '', descrizione: '', categoria: '', durataOre: 1, obbligatorio: false, attivo: true });
    }
  }

  onSubmit(): void {
    if (this.corsoForm.invalid) {
      this.corsoForm.markAllAsTouched();
      return;
    }
    const v = this.corsoForm.value;
    this.salva.emit({
      titolo: v.titolo!,
      descrizione: v.descrizione ?? '',
      categoria: v.categoria!,
      durataOre: Number(v.durataOre),
      obbligatorio: !!v.obbligatorio,
      attivo: !!v.attivo,
    });
  }
}
