import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Statistica } from '../entities/statistica.entity';
import { environment } from '../../enviroments/enviroments';

export type StatisticheFilters = {
    mese?: string;
    categoria?: string;
    dipendente?: string;
};

@Injectable({
    providedIn: 'root'
})
export class StatisticheService {
    protected http = inject(HttpClient);
    protected baseUrl = `${environment.apiUrl}/statistiche`;

    getAcademy(filters: StatisticheFilters = {}): Observable<Statistica[]> {
        let params = new HttpParams();
        if (filters.mese) params = params.set('mese', filters.mese);
        if (filters.categoria) params = params.set('categoria', filters.categoria);
        if (filters.dipendente) params = params.set('dipendente', filters.dipendente);
        return this.http.get<Statistica[]>(`${this.baseUrl}/academy`, { params });
    }
}
