import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Investigador } from '../modelos/investigador.interface';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class InvestigadorService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);
    private readonly API_URL = 'http://localhost:3000/investigador';
    private currentInvestigador: Investigador | null = null;
    public ready: Promise<void>;

    constructor() {
        this.ready = this.init();
    }

    private async init() {
        this.currentInvestigador = await this.storage.get('inv_user');
    }


    login(datos: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.API_URL}/login`, datos);
    }

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


    getPendientes(): Observable<Investigador[]> {
        return this.http.get<Investigador[]>(`${this.API_URL}/pendientes`);
    }

    //Aprobar un investigador
    aprobar(id: number): Observable<any> {
        return this.http.patch(`${this.API_URL}/${id}/aprobar`, {});
    }

    //Rechazar un investigador
    rechazar(id: number): Observable<any> {
        return this.http.patch(`${this.API_URL}/${id}/rechazar`, {});
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    getInvestigador(id: number): Observable<Investigador> {
        return this.http.get<Investigador>(`${this.API_URL}/${id}`);
    }

    getAprobados(): Observable<Investigador[]> {
        return this.http.get<Investigador[]>(`${this.API_URL}/aprobados`);
    }

    getTodos(): Observable<Investigador[]> {
        return this.http.get<Investigador[]>(`${this.API_URL}/all`);
    }


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
     * Gestión de sesión persistente (APK)
     */
    async saveSession(user: any, token: string) {
        this.currentInvestigador = user;
        await this.storage.set('inv_token', token);
        await this.storage.set('inv_user', user);
        localStorage.setItem('inv_user', JSON.stringify(user)); // Fallback
    }

    getLoggedUser(): Investigador | null {
        if (!this.currentInvestigador) {
            const local = localStorage.getItem('inv_user');
            if (local) this.currentInvestigador = JSON.parse(local);
        }
        return this.currentInvestigador;
    }

    async logout() {
        this.currentInvestigador = null;
        await this.storage.remove('inv_token');
        await this.storage.remove('inv_user');
        localStorage.removeItem('inv_token');
        localStorage.removeItem('inv_user');
    }
}
