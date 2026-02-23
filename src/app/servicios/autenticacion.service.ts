import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador, AuthResponse } from '../modelos/administrador.interface';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);

    // URL base de tu backend NestJS
    private readonly API_URL = 'http://localhost:3000';
    private currentAdmin: Administrador | null = null;
    private currentToken: string | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        this.currentAdmin = await this.storage.get('admin_user');
        this.currentToken = await this.storage.get('admin_token');
    }

    /**
     * Iniciar sesión como administrador
     * @param username Nombre de usuario
     * @param password Contraseña
     */
    loginAdmin(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/administrador/login`, {
            username,
            password
        });
    }

    /**
     * Guardar el token de sesión persistente
     */
    async saveToken(token: string) {
        this.currentToken = token;
        await this.storage.set('admin_token', token);
        localStorage.setItem('admin_token', token);
    }

    /**
     * Guardar los datos del usuario persistente
     */
    async saveUser(user: Administrador) {
        this.currentAdmin = user;
        await this.storage.set('admin_user', user);
        localStorage.setItem('admin_user', JSON.stringify(user));
    }

    /**
     * Obtener los datos del usuario logueado (Síncrono)
     */
    getUser(): Administrador | null {
        if (!this.currentAdmin) {
            const local = localStorage.getItem('admin_user');
            if (local) this.currentAdmin = JSON.parse(local);
        }
        return this.currentAdmin;
    }

    /**
     * Obtener el token de sesión (Síncrono)
     */
    getToken(): string | null {
        if (!this.currentToken) {
            this.currentToken = localStorage.getItem('admin_token');
        }
        return this.currentToken;
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        this.currentAdmin = null;
        this.currentToken = null;
        await this.storage.remove('admin_token');
        await this.storage.remove('admin_user');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    }
}
