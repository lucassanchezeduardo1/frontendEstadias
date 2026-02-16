import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000';

    constructor() { }

    /**
     * Registrar un nuevo estudiante (Usuario)
     * @param usuario Datos del usuario
     * @param foto Archivo de imagen de perfil
     */
    registrar(usuario: any, foto: File): Observable<any> {
        const formData = new FormData();

        // Agregar los campos del usuario al FormData
        Object.keys(usuario).forEach(key => {
            formData.append(key, usuario[key]);
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
     * Guardar sesión en localStorage
     */
    saveSession(usuario: any, token?: string) {
        localStorage.setItem('student_user', JSON.stringify(usuario));
        if (token) localStorage.setItem('student_token', token);
    }

    /**
     * Obtener datos del usuario logueado
     */
    getUser() {
        const user = localStorage.getItem('student_user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('student_user');
        localStorage.removeItem('student_token');
    }
}
