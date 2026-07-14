import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Corso, CorsoPayload } from '../../entities/corso.entity';
import { Categoria } from '../../entities/categoria.entity';
import { CorsoService } from '../../services/corso.service';
import { CategoriaService } from '../../services/categoria.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-catalogo-corsi',
  standalone: false,
  templateUrl: './catalogo-corsi.html',
})
export class CatalogoCorsiComponent implements OnInit {
  protected corsoSrv = inject(CorsoService);
  protected categoriaSrv = inject(CategoriaService);
  protected toastSrv = inject(ToastService);
  protected confirmSrv = inject(ConfirmService);
  protected modalSrv = inject(NgbModal);

  @ViewChild('formModal') formModal!: TemplateRef<unknown>;
  private modalRef?: NgbModalRef;

  corsi: Corso[] = [];
  categorie: Categoria[] = [];

  // filtri
  filtroCategoria = '';
  filtroAttivo = '';

  loading = false;

  // corso in fase di modifica, null in creazione
  corsoInModifica: Corso | null = null;
  salvataggioInCorso = false;

  ngOnInit(): void {
    this.categoriaSrv.getAll().subscribe(categorie => this.categorie = categorie);
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.corsoSrv.getAll({
      categoria: this.filtroCategoria || undefined,
      attivo: this.filtroAttivo === '' ? undefined : this.filtroAttivo === 'true',
    }).subscribe({
      next: corsi => {
        this.corsi = corsi;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  azzeraFiltri(): void {
    this.filtroCategoria = '';
    this.filtroAttivo = '';
    this.carica();
  }

  apriCreazione(): void {
    this.corsoInModifica = null;
    this.apriModale();
  }

  apriModifica(corso: Corso): void {
    this.corsoInModifica = corso;
    this.apriModale();
  }

  private apriModale(): void {
    this.modalRef = this.modalSrv.open(this.formModal, { size: 'lg', backdrop: 'static' });
  }

  chiudiForm(): void {
    this.modalRef?.dismiss();
  }

  salva(payload: CorsoPayload): void {
    this.salvataggioInCorso = true;
    const richiesta$ = this.corsoInModifica
      ? this.corsoSrv.update(this.corsoInModifica.id, payload)
      : this.corsoSrv.create(payload);

    richiesta$.subscribe({
      next: () => {
        this.toastSrv.success(
          this.corsoInModifica ? 'Corso aggiornato.' : 'Corso creato.',
          'Operazione completata'
        );
        this.salvataggioInCorso = false;
        this.modalRef?.close();
        this.carica();
      },
      error: () => this.salvataggioInCorso = false,
    });
  }

  disattiva(corso: Corso): void {
    this.confirmSrv.ask({
      titolo: 'Disattiva corso',
      messaggio: `Disattivare il corso "${corso.titolo}"? Non sarà più proponibile per nuove assegnazioni.`,
      confermaLabel: 'Disattiva',
      confermaClass: 'btn-warning',
    }).then(conferma => {
      if (!conferma) {
        return;
      }
      this.corsoSrv.disattiva(corso.id).subscribe({
        next: () => {
          this.toastSrv.success('Corso disattivato.', 'Operazione completata');
          this.carica();
        },
      });
    });
  }

  elimina(corso: Corso): void {
    this.confirmSrv.ask({
      titolo: 'Elimina corso',
      messaggio: `Eliminare definitivamente il corso "${corso.titolo}"?`,
      confermaLabel: 'Elimina',
      confermaClass: 'btn-danger',
    }).then(conferma => {
      if (!conferma) {
        return;
      }
      this.corsoSrv.remove(corso.id).subscribe({
        next: () => {
          this.toastSrv.success('Corso eliminato.', 'Operazione completata');
          this.carica();
        },
      });
    });
  }
}
