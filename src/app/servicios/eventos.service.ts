import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../modelos/paginated-response.interface';

@Injectable({
    providedIn: 'root'
})
export class EventosService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/eventos`;

    constructor() { }

    /**
     * Crear un nuevo evento
     * @param datos Objeto con los datos del evento (CreateEventoDto)
     * @param imagen Archivo de imagen del evento
     * @returns Observable con la respuesta del servidor
     */
    crearEvento(datos: any, imagen: File): Observable<any> {
        const formData = new FormData();

        Object.keys(datos).forEach(key => {
            formData.append(key, datos[key]);
        });

        formData.append('imagen', imagen);

        return this.http.post(this.API_URL, formData);
    }

    getEventos(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
        return this.http.get<PaginatedResponse<any>>(`${this.API_URL}/all?page=${page}&limit=${limit}`);
    }

    getMisEventosById(investigadorId: number, page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
        return this.http.get<PaginatedResponse<any>>(`${this.API_URL}/investigador/${investigadorId}?page=${page}&limit=${limit}`);
    }

    getMisEventos(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
        return this.http.get<PaginatedResponse<any>>(`${this.API_URL}/mis-eventos?page=${page}&limit=${limit}`);
    }

    getEvento(id: number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${id}`);
    }

    actualizarEvento(id: number, datos: any, imagen?: File): Observable<any> {
        // Si no hay imagen, enviamos JSON normal
        if (!imagen) {
            return this.http.patch(`${this.API_URL}/${id}`, datos);
        }

        // Si hay imagen, usamos FormData
        const formData = new FormData();
        Object.keys(datos).forEach(key => {
            if (datos[key] !== null && datos[key] !== undefined) {
                formData.append(key, datos[key]);
            }
        });

        formData.append('imagen', imagen);

        return this.http.patch(`${this.API_URL}/${id}`, formData);
    }


    eliminarEvento(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}
