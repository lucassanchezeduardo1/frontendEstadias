import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);

    private readonly API_URL = 'http://localhost:3000';
    private currentUser: any = null;
    public ready: Promise<void>;

    constructor() {
        this.ready = this.init();
    }

    private async init() {
        this.currentUser = await this.storage.get('student_user');
    }

    /**
     * Registrar un nuevo estudiante (Usuario)
     * @param usuario Datos del usuario
     * @param foto Archivo de imagen de perfil
     */
    registrar(usuario: any, foto: File): Observable<any> {
        const formData = new FormData();

        // Agregar los campos del usuario al FormData
        Object.keys(usuario).forEach(key => {
            formData.append(key, usuario[key as string]);
        });

        // Agregar la foto
        formData.append('foto_perfil', foto);

        return this.http.post(`${this.API_URL}/usuarios`, formData);
    }

    /**
     * Iniciar sesión como estudiante
     * @param credentials Email y password
     */
    login(credentials: any): Observable<any> {
        return this.http.post(`${this.API_URL}/usuarios/login`, credentials);
    }

    /**
     * Guardar sesión de forma persistente (Compatible con APK)
     */
    async saveSession(usuario: any, token?: string) {
        this.currentUser = usuario;
        await this.storage.set('student_user', usuario);
        if (token) await this.storage.set('student_token', token);

        // Mantenemos fallback temporal
        localStorage.setItem('student_user', JSON.stringify(usuario));
    }

    /**
     * Obtener datos del usuario logueado (Síncrono desde memoria)
     */
    getUser() {
        if (!this.currentUser) {
            const local = localStorage.getItem('student_user');
            if (local) this.currentUser = JSON.parse(local);
        }
        return this.currentUser;
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        this.currentUser = null;
        await this.storage.remove('student_user');
        await this.storage.remove('student_token');
        localStorage.removeItem('student_user');
        localStorage.removeItem('student_token');
    }

    /**
     * Actualizar perfil de usuario
     */
    actualizar(id: number, usuario: any, foto?: File): Observable<any> {
        const formData = new FormData();

        // Agregar los campos del usuario al FormData
        Object.keys(usuario).forEach(key => {
            if (usuario[key as string] !== null && usuario[key as string] !== undefined) {
                formData.append(key, usuario[key as string]);
            }
        });

        // Agregar la foto si existe
        if (foto) {
            formData.append('foto_perfil', foto);
        }

        return this.http.patch(`${this.API_URL}/usuarios/${id}`, formData);
    }

    /**
     * Obtener todos los usuarios/alumnos (para el administrador)
     */
    getTodos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/usuarios/all`);
    }

    /**
     * Eliminar un alumno (para el administrador)
     */
    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/usuarios/${id}`);
    }
}
