import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Investigador } from '../modelos/investigador.interface';

@Injectable({
    providedIn: 'root'
})
export class InvestigadorService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/investigador';

    constructor() { }

    /**
     * Login de investigador
     */
    login(datos: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.API_URL}/login`, datos);
    }

    /**
     * Registrar nuevo investigador (Usa FormData para enviar la foto)
     */
    registrar(datos: any, foto: File): Observable<any> {
        const formData = new FormData();

        // Agregamos todos los campos al FormData
        Object.keys(datos).forEach(key => {
            formData.append(key, datos[key]);
        });

        // Agregamos la foto
        formData.append('foto_perfil', foto);

        return this.http.post(this.API_URL, formData);
    }

    /**
     * Obtener investigadores pendientes (Para el Administrador)
     */
    getPendientes(): Observable<Investigador[]> {
        return this.http.get<Investigador[]>(`${this.API_URL}/pendientes`);
    }

    /**
     * Aprobar un investigador
     */
    aprobar(id: number): Observable<any> {
        return this.http.patch(`${this.API_URL}/${id}/aprobar`, {});
    }

    /**
     * Rechazar un investigador
     */
    rechazar(id: number): Observable<any> {
        return this.http.patch(`${this.API_URL}/${id}/rechazar`, {});
    }

    /**
     * Eliminar un investigador (Ya aceptado o rechazado)
     */
    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    /**
     * Obtener un investigador por ID (Para detalles completos)
     */
    getInvestigador(id: number): Observable<Investigador> {
        return this.http.get<Investigador>(`${this.API_URL}/${id}`);
    }

    /**
     * Obtener todos los investigadores aprobados (Para el directorio público)
     */
    getAprobados(): Observable<Investigador[]> {
        return this.http.get<Investigador[]>(`${this.API_URL}/aprobados`);
    }

    /**
     * Actualizar datos del investigador
     */
    update(id: number, datos: any, foto?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(datos).forEach(key => {
            if (datos[key] !== null && datos[key] !== undefined) {
                formData.append(key, datos[key]);
            }
        });

        if (foto) {
            formData.append('foto_perfil', foto);
        }

        return this.http.patch(`${this.API_URL}/${id}`, formData);
    }

    /**
     * Gestión de sesión
     */
    saveSession(user: any, token: string) {
        localStorage.setItem('inv_token', token);
        localStorage.setItem('inv_user', JSON.stringify(user));
    }

    getLoggedUser(): Investigador | null {
        const user = localStorage.getItem('inv_user');
        return user ? JSON.parse(user) : null;
    }

    logout() {
        localStorage.removeItem('inv_token');
        localStorage.removeItem('inv_user');
    }
}
