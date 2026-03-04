import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class PruebasIaService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);

    // URL de nuestro backend (Proxy de IA seguro)
    private readonly API_URL = 'http://localhost:3000/ai/examen';

    constructor() { }

    /**
     * Verifica si el usuario puede generar un test hoy (límite de 2 por día)
     * @param usuarioId ID del usuario
     * @returns Promesa con un booleano
     */
    async puedeGenerarTest(usuarioId: number): Promise<boolean> {
        const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const key = `tests_usuario_${usuarioId}_${hoy}`;

        const intentos = await this.storage.get(key) || 0;
        return intentos < 2;
    }

    /**
     * Incrementa el contador de tests generados hoy
     * @param usuarioId ID del usuario
     */
    async registrarTestGenerado(usuarioId: number): Promise<void> {
        const hoy = new Date().toISOString().split('T')[0];
        const key = `tests_usuario_${usuarioId}_${hoy}`;

        const intentos = await this.storage.get(key) || 0;
        await this.storage.set(key, intentos + 1);
    }

    /**
     * Obtiene el número de intentos restantes hoy
     */
    async obtenerIntentosRestantes(usuarioId: number): Promise<number> {
        const hoy = new Date().toISOString().split('T')[0];
        const key = `tests_usuario_${usuarioId}_${hoy}`;
        const intentos = await this.storage.get(key) || 0;
        return Math.max(0, 2 - intentos);
    }

    /**
     * Genera un test de opción múltiple usando el backend (Groq)
     * @param contenido Texto base (síntesis o texto extraído del PDF)
     * @param titulo Título de la investigación para contexto
     * @returns Observable con el arreglo de preguntas
     */
    generarTest(contenido: string, titulo: string): Observable<any[]> {
        const body = { contenido, titulo };

        return this.http.post<any>(this.API_URL, body).pipe(
            map(res => {
                if (res && res.preguntas) {
                    return res.preguntas;
                }
                throw new Error('La respuesta del servidor no contiene las preguntas');
            }),
            catchError(err => {
                console.error('Error llamando al backend para examen:', err);
                let message = 'Error al generar el test';

                if (err.status === 0) {
                    message = 'No se pudo conectar con el servidor backend. Asegúrate de que esté encendido (Puerto 3000).';
                } else if (err.error && err.error.message) {
                    message = `Error del servidor: ${err.error.message}`;
                }

                return throwError(() => new Error(message));
            })
        );
    }
}
