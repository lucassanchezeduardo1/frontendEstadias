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

    /**
     * Obtener todas las instituciones
     */
    getInstituciones(): Observable<Institucion[]> {
        return this.http.get<Institucion[]>(`${this.API_URL}/all`);
    }

    /**
     * Registrar una nueva institución
     */
    createInstitucion(institucion: Institucion): Observable<Institucion> {
        return this.http.post<Institucion>(this.API_URL, institucion);
    }

    /**
     * Eliminar una institución
     */
    deleteInstitution(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    /**
     * Actualizar una institución
     */
    updateInstitucion(id: number, institucion: Partial<Institucion>): Observable<Institucion> {
        return this.http.patch<Institucion>(`${this.API_URL}/${id}`, institucion);
    }
}
