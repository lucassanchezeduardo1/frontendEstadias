import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriasService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/categorias`;

    constructor() { }

    getCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.API_URL}/all`);
    }

    createCategoria(categoria: Categoria): Observable<Categoria> {
        return this.http.post<Categoria>(this.API_URL, categoria);
    }

    deleteCategoria(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    updateCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
        return this.http.patch<Categoria>(`${this.API_URL}/${id}`, categoria);
    }
}
