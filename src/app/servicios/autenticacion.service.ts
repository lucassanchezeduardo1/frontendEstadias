import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador, AuthResponse } from '../modelos/administrador.interface';

@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {
    private http = inject(HttpClient);

    // URL base de tu backend NestJS
    private readonly API_URL = 'http://localhost:3000';

    constructor() { }

    /**
     * Iniciar sesión como administrador
     * @param email Correo electrónico
     * @param password Contraseña
     */
    loginAdmin(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/administrador/login`, {
            email,
            password
        });
    }

    /**
     * Guardar el token de sesión en localStorage
     * @param token JWT Token
     */
    saveToken(token: string) {
        localStorage.setItem('admin_token', token);
    }

    /**
     * Guardar los datos del usuario en localStorage
     * @param user Datos del administrador
     */
    saveUser(user: Administrador) {
        localStorage.setItem('admin_user', JSON.stringify(user));
    }

    /**
     * Obtener los datos del usuario logueado
     */
    getUser(): Administrador | null {
        const user = localStorage.getItem('admin_user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Obtener el token de sesión
     */
    getToken(): string | null {
        return localStorage.getItem('admin_token');
    }

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    }
}
