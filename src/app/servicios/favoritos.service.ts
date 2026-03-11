import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosService } from './usuarios.service';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../modelos/paginated-response.interface';

@Injectable({
    providedIn: 'root'
})
export class FavoritosService {
    private http = inject(HttpClient);
    private usuariosService = inject(UsuariosService);
    private readonly API_URL = `${environment.apiUrl}/favoritos`;

    constructor() { }

    private get userId(): number {
        return this.usuariosService.getUser()?.id || 0;
    }

    getFavoritos(page: number = 1, limit: number = 10): Observable<PaginatedResponse<any>> {
        const params = new HttpParams()
            .set('usuarioId', this.userId.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<PaginatedResponse<any>>(this.API_URL, { params });
    }

    /**
     * Verificar si una publicación es favorita
     */
    esFavorito(publicacionId: number): Observable<any> {
        const params = new HttpParams().set('usuarioId', this.userId.toString());
        return this.http.get<any>(`${this.API_URL}/verificar/${publicacionId}`, { params });
    }

    /**
     * Agregar o quitar de favoritos (Toggle)
     */
    toggleFavorito(publicacionId: number): Observable<any> {
        const params = new HttpParams().set('usuarioId', this.userId.toString());
        return this.http.post<any>(`${this.API_URL}/toggle/${publicacionId}`, {}, { params });
    }

    eliminarFavorito(publicacionId: number): Observable<any> {
        const params = new HttpParams().set('usuarioId', this.userId.toString());
        return this.http.delete<any>(`${this.API_URL}/publicacion/${publicacionId}`, { params });
    }
}
