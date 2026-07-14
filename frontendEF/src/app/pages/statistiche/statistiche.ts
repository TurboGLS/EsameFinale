import { Component, inject, OnInit } from '@angular/core';
import { Statistica } from '../../entities/statistica.entity';
import { Categoria } from '../../entities/categoria.entity';
import { User } from '../../entities/user.entity';
import { StatisticheService } from '../../services/statistiche.service';
import { CategoriaService } from '../../services/categoria.service';
import { UserService } from '../../services/user.service';

// smart: riepilogo statistiche per mese e categoria (solo referente).
@Component({
  selector: 'app-statistiche',
  standalone: false,
  templateUrl: './statistiche.html',
})
export class StatisticheComponent implements OnInit {
  protected statisticheSrv = inject(StatisticheService);
  protected categoriaSrv = inject(CategoriaService);
  protected userSrv = inject(UserService);

  statistiche: Statistica[] = [];
  categorie: Categoria[] = [];
  dipendenti: User[] = [];

  // filtri
  filtroMese = '';       // formato YYYY-MM
  filtroCategoria = '';
  filtroDipendente = '';

  loading = false;

  ngOnInit(): void {
    this.categoriaSrv.getAll().subscribe(categorie => this.categorie = categorie);
    this.userSrv.getDipendenti().subscribe(dipendenti => this.dipendenti = dipendenti);
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.statisticheSrv.getAcademy({
      mese: this.filtroMese || undefined,
      categoria: this.filtroCategoria || undefined,
      dipendente: this.filtroDipendente || undefined,
    }).subscribe({
      next: statistiche => {
        this.statistiche = statistiche;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  azzeraFiltri(): void {
    this.filtroMese = '';
    this.filtroCategoria = '';
    this.filtroDipendente = '';
    this.carica();
  }
}
