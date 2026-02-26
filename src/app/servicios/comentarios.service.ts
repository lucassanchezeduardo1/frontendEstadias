import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ComentarioService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/comentarios';

    constructor() { }

    getComentariosPorPublicacion(publicacionId: number, investigadorId?: number): Observable<any[]> {
        // Si viene investigadorId, lo pasamos para el permiso, si no, intentamos obtenerlos (el backend puede restringirlos)
        const url = investigadorId
            ? `${this.API_URL}/publicacion/${publicacionId}?investigadorId=${investigadorId}`
            : `${this.API_URL}/publicacion/${publicacionId}`;
        return this.http.get<any[]>(url);
    }

    crearComentario(datos: { contenido: string; publicacion_id: number; usuario_id: number }): Observable<any> {
        // El backend espera usuarioId por query si no hay JWT
        return this.http.post(`${this.API_URL}?usuarioId=${datos.usuario_id}`, {
            contenido: datos.contenido,
            publicacion_id: datos.publicacion_id
        });
    }

    eliminarComentario(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}
