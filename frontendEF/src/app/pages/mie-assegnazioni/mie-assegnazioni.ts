import { Component, inject, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Assegnazione, STATI_ASSEGNAZIONE, StatoAssegnazione } from '../../entities/assegnazione.entity';
import { Categoria } from '../../entities/categoria.entity';
import { AssegnazioneService } from '../../services/assegnazione.service';
import { CategoriaService } from '../../services/categoria.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

// smart: area dipendente. Carica le assegnazioni proprie (il backend le
// restringe già all'utente), gestisce i filtri e il completamento.
@Component({
  selector: 'app-mie-assegnazioni',
  standalone: false,
  templateUrl: './mie-assegnazioni.html',
})
export class MieAssegnazioniComponent implements OnInit {
  protected assegnazioneSrv = inject(AssegnazioneService);
  protected categoriaSrv = inject(CategoriaService);
  protected toastSrv = inject(ToastService);
  protected confirmSrv = inject(ConfirmService);

  assegnazioni: Assegnazione[] = [];
  categorie: Categoria[] = [];
  readonly stati = STATI_ASSEGNAZIONE;

  // stato dei filtri (stato e categoria sono applicati lato server;
  // la scadenza è applicata lato client sulla lista già caricata)
  filtroStato: StatoAssegnazione | '' = '';
  filtroCategoria = '';
  filtroScadenza: NgbDateStruct | null = null;

  loading = false;

  ngOnInit(): void {
    this.categoriaSrv.getAll().subscribe(categorie => this.categorie = categorie);
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.assegnazioneSrv.getAll({
      stato: this.filtroStato || undefined,
      categoria: this.filtroCategoria || undefined,
    }).subscribe({
      next: assegnazioni => {
        this.assegnazioni = assegnazioni;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  // assegnazioni effettivamente mostrate: applica il filtro "scadenza entro il"
  get assegnazioniVisibili(): Assegnazione[] {
    if (!this.filtroScadenza) {
      return this.assegnazioni;
    }
    const { year, month, day } = this.filtroScadenza;
    // limite = fine della giornata selezionata
    const limite = new Date(year, month - 1, day, 23, 59, 59).getTime();
    return this.assegnazioni.filter(a => new Date(a.dataScadenza).getTime() <= limite);
  }

  azzeraFiltri(): void {
    this.filtroStato = '';
    this.filtroCategoria = '';
    this.filtroScadenza = null;
    this.carica();
  }

  completa(assegnazione: Assegnazione): void {
    this.confirmSrv.ask({
      titolo: 'Completa corso',
      messaggio: `Segnare "${assegnazione.corso.titolo}" come completato?`,
      confermaLabel: 'Conferma',
      confermaClass: 'btn-success',
    }).then(conferma => {
      if (!conferma) {
        return;
      }
      this.assegnazioneSrv.completa(assegnazione.id).subscribe({
        next: () => {
          this.toastSrv.success('Corso segnato come completato.', 'Completato');
          this.carica();
        },
      });
    });
  }
}
