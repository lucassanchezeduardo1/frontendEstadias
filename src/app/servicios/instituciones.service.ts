import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institucion } from '../modelos/institucion.interface';

@Injectable({
    providedIn: 'root'
})
export class InstitucionesService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/instituciones';

    constructor() { }

    getInstituciones(): Observable<Institucion[]> {
        return this.http.get<Institucion[]>(`${this.API_URL}/all`);
    }

    createInstitucion(institucion: Institucion): Observable<Institucion> {
        return this.http.post<Institucion>(this.API_URL, institucion);
    }

    deleteInstitution(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    updateInstitucion(id: number, institucion: Partial<Institucion>): Observable<Institucion> {
        return this.http.patch<Institucion>(`${this.API_URL}/${id}`, institucion);
    }
}
