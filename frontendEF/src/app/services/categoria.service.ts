import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../entities/categoria.entity';
import { environment } from '../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    protected http = inject(HttpClient);
    protected baseUrl = `${environment.apiUrl}/categorie`;

    getAll(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.baseUrl);
    }

    create(nomeCategoria: string): Observable<Categoria> {
        return this.http.post<Categoria>(this.baseUrl, { nomeCategoria });
    }
}
