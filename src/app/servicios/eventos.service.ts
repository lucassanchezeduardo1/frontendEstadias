import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventosService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/eventos';

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

    getEventos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/all`);
    }

    getMisEventosById(investigadorId: number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/investigador/${investigadorId}`);
    }

    getMisEventos(): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/mis-eventos`);
    }

    getEvento(id: number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${id}`);
    }

    actualizarEvento(id: number, datos: any): Observable<any> {
        return this.http.patch(`${this.API_URL}/${id}`, datos);
    }

    eliminarEvento(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}
