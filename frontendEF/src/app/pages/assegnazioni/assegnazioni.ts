import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Assegnazione, AssegnazionePayload, STATI_ASSEGNAZIONE, StatoAssegnazione } from '../../entities/assegnazione.entity';
import { Corso } from '../../entities/corso.entity';
import { Categoria } from '../../entities/categoria.entity';
import { User } from '../../entities/user.entity';
import { AssegnazioneService } from '../../services/assegnazione.service';
import { CorsoService } from '../../services/corso.service';
import { CategoriaService } from '../../services/categoria.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-assegnazioni',
  standalone: false,
  templateUrl: './assegnazioni.html',
})
export class AssegnazioniComponent implements OnInit {
  protected assegnazioneSrv = inject(AssegnazioneService);
  protected corsoSrv = inject(CorsoService);
  protected categoriaSrv = inject(CategoriaService);
  protected userSrv = inject(UserService);
  protected toastSrv = inject(ToastService);
  protected confirmSrv = inject(ConfirmService);
  protected modalSrv = inject(NgbModal);

  @ViewChild('formModal') formModal!: TemplateRef<unknown>;
  private modalRef?: NgbModalRef;

  assegnazioni: Assegnazione[] = [];
  corsiAttivi: Corso[] = [];
  categorie: Categoria[] = [];
  dipendenti: User[] = [];
  readonly stati = STATI_ASSEGNAZIONE;

  // filtri
  filtroStato: StatoAssegnazione | '' = '';
  filtroCategoria = '';
  filtroCorso = '';
  filtroDipendente = '';

  loading = false;

  // assegnazione in fase di modifica, null in creazione
  assegnazioneInModifica: Assegnazione | null = null;
  salvataggioInCorso = false;

  ngOnInit(): void {
    // passo i dati per filtri e form
    this.corsoSrv.getAll({ attivo: true }).subscribe(corsi => this.corsiAttivi = corsi);
    this.categoriaSrv.getAll().subscribe(categorie => this.categorie = categorie);
    this.userSrv.getDipendenti().subscribe(dipendenti => this.dipendenti = dipendenti);
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.assegnazioneSrv.getAll({
      stato: this.filtroStato || undefined,
      categoria: this.filtroCategoria || undefined,
      corso: this.filtroCorso || undefined,
      dipendente: this.filtroDipendente || undefined,
    }).subscribe({
      next: assegnazioni => {
        this.assegnazioni = assegnazioni;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  azzeraFiltri(): void {
    this.filtroStato = '';
    this.filtroCategoria = '';
    this.filtroCorso = '';
    this.filtroDipendente = '';
    this.carica();
  }

  apriCreazione(): void {
    this.assegnazioneInModifica = null;
    this.apriModale();
  }

  apriModifica(assegnazione: Assegnazione): void {
    this.assegnazioneInModifica = assegnazione;
    this.apriModale();
  }

  private apriModale(): void {
    this.modalRef = this.modalSrv.open(this.formModal, { size: 'lg', backdrop: 'static' });
  }

  chiudiForm(): void {
    this.modalRef?.dismiss();
  }

  salva(payload: AssegnazionePayload): void {
    this.salvataggioInCorso = true;
    const richiesta$ = this.assegnazioneInModifica
      ? this.assegnazioneSrv.update(this.assegnazioneInModifica.id, payload)
      : this.assegnazioneSrv.create(payload);

    richiesta$.subscribe({
      next: () => {
        this.toastSrv.success(
          this.assegnazioneInModifica ? 'Assegnazione aggiornata.' : 'Assegnazione creata.',
          'Operazione completata'
        );
        this.salvataggioInCorso = false;
        this.modalRef?.close();
        this.carica();
      },
      error: () => this.salvataggioInCorso = false,
    });
  }

  annulla(assegnazione: Assegnazione): void {
    this.confirmSrv.ask({
      titolo: 'Annulla assegnazione',
      messaggio: `Annullare l'assegnazione del corso "${assegnazione.corso.titolo}" a ${assegnazione.dipendente.fullName}?`,
      confermaLabel: 'Annulla assegnazione',
      confermaClass: 'btn-danger',
    }).then(conferma => {
      if (!conferma) {
        return;
      }
      this.assegnazioneSrv.annulla(assegnazione.id).subscribe({
        next: () => {
          this.toastSrv.success('Assegnazione annullata.', 'Operazione completata');
          this.carica();
        },
      });
    });
  }
}
