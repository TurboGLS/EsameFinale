import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Corso } from '../../entities/corso.entity';
import { User } from '../../entities/user.entity';
import { Assegnazione, AssegnazionePayload } from '../../entities/assegnazione.entity';

@Component({
  selector: 'app-assegnazione-form',
  standalone: false,
  templateUrl: './assegnazione-form.html',
})
export class AssegnazioneFormComponent implements OnChanges {
  protected fb = inject(FormBuilder);

  @Input() assegnazione: Assegnazione | null = null;
  @Input() corsi: Corso[] = [];
  @Input() dipendenti: User[] = [];
  @Input() salvataggioInCorso = false;

  @Output() salva = new EventEmitter<AssegnazionePayload>();
  @Output() annulla = new EventEmitter<void>();

  assegnazioneForm = this.fb.group({
    corso: ['', Validators.required],
    dipendente: ['', Validators.required],
    dataScadenza: ['', Validators.required],
  });

  get isModifica(): boolean {
    return !!this.assegnazione;
  }

  ngOnChanges(): void {
    if (this.assegnazione) {
      this.assegnazioneForm.patchValue({
        corso: this.assegnazione.corso?.id ?? '',
        dipendente: this.assegnazione.dipendente?.id ?? '',
        dataScadenza: this.assegnazione.dataScadenza?.substring(0, 10) ?? '',
      });
    } else {
      this.assegnazioneForm.reset({ corso: '', dipendente: '', dataScadenza: '' });
    }
  }

  onSubmit(): void {
    if (this.assegnazioneForm.invalid) {
      this.assegnazioneForm.markAllAsTouched();
      return;
    }
    const v = this.assegnazioneForm.value;
    this.salva.emit({
      corso: v.corso!,
      dipendente: v.dipendente!,
      dataScadenza: v.dataScadenza!,
    });
  }
}
