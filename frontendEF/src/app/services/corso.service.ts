import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Corso, CorsoPayload } from '../entities/corso.entity';
import { environment } from '../../enviroments/enviroments';

export type CorsoFilters = {
    categoria?: string;
    attivo?: boolean;
};

@Injectable({
    providedIn: 'root'
})
export class CorsoService {
    protected http = inject(HttpClient);
    protected baseUrl = `${environment.apiUrl}/corsi`;

    getAll(filters: CorsoFilters = {}): Observable<Corso[]> {
        let params = new HttpParams();
        if (filters.categoria) {
            params = params.set('categoria', filters.categoria);
        }
        if (typeof filters.attivo === 'boolean') {
            params = params.set('attivo', filters.attivo);
        }
        return this.http.get<Corso[]>(this.baseUrl, { params });
    }

    getById(id: string): Observable<Corso> {
        return this.http.get<Corso>(`${this.baseUrl}/${id}`);
    }

    create(payload: CorsoPayload): Observable<Corso> {
        return this.http.post<Corso>(this.baseUrl, payload);
    }

    update(id: string, payload: CorsoPayload): Observable<Corso> {
        return this.http.put<Corso>(`${this.baseUrl}/${id}`, payload);
    }

    disattiva(id: string): Observable<Corso> {
        return this.http.put<Corso>(`${this.baseUrl}/${id}/disattiva`, {});
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
