import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assegnazione, AssegnazionePayload, StatoAssegnazione } from '../entities/assegnazione.entity';
import { environment } from '../../enviroments/enviroments';

export type AssegnazioneFilters = {
    stato?: StatoAssegnazione;
    categoria?: string;
    corso?: string;
    dipendente?: string;
};

@Injectable({
    providedIn: 'root'
})
export class AssegnazioneService {
    protected http = inject(HttpClient);
    protected baseUrl = `${environment.apiUrl}/assegnazioni`;

    getAll(filters: AssegnazioneFilters = {}): Observable<Assegnazione[]> {
        let params = new HttpParams();
        if (filters.stato) params = params.set('stato', filters.stato);
        if (filters.categoria) params = params.set('categoria', filters.categoria);
        if (filters.corso) params = params.set('corso', filters.corso);
        if (filters.dipendente) params = params.set('dipendente', filters.dipendente);
        return this.http.get<Assegnazione[]>(this.baseUrl, { params });
    }

    getById(id: string): Observable<Assegnazione> {
        return this.http.get<Assegnazione>(`${this.baseUrl}/${id}`);
    }

    create(payload: AssegnazionePayload): Observable<Assegnazione> {
        return this.http.post<Assegnazione>(this.baseUrl, payload);
    }

    update(id: string, payload: Partial<AssegnazionePayload>): Observable<Assegnazione> {
        return this.http.put<Assegnazione>(`${this.baseUrl}/${id}`, payload);
    }

    completa(id: string): Observable<Assegnazione> {
        return this.http.put<Assegnazione>(`${this.baseUrl}/${id}/completa`, {});
    }

    annulla(id: string): Observable<Assegnazione> {
        return this.http.put<Assegnazione>(`${this.baseUrl}/${id}/annulla`, {});
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
