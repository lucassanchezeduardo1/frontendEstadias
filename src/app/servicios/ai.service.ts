import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as pdfjsLib from 'pdfjs-dist';

import { environment } from '../../environments/environment';

// Configuración del worker de PDF.js (usando la copia local definida en angular.json)
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private http = inject(HttpClient);

    // URL de nuestro backend (Proxy de IA seguro)
    private readonly API_URL = 'http://localhost:3000/ai/sintesis';

    constructor() { }

    /**
     * Extrae el texto de un archivo PDF
     * @param file Archivo PDF
     * @returns Observable con el texto extraído
     */
    extraerTextoPdf(file: File): Observable<string> {
        const reader = new FileReader();

        return from(new Promise<string>((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const typedarray = new Uint8Array(reader.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map((item: any) => item.str).join(' ');
                        fullText += pageText + '\n';

                        // Limitamos a las primeras 10 páginas para no saturar la IA en la síntesis inicial
                        if (i >= 10) break;
                    }

                    resolve(fullText);
                } catch (error) {
                    reject('Error al procesar el PDF: ' + error);
                }
            };

            reader.onerror = () => reject('Error al leer el archivo');
            reader.readAsArrayBuffer(file);
        }));
    }

    /**
     * Genera una síntesis con IA a través de nuestro servidor (usando Groq)
     * @param texto Texto completo de la investigación
     * @returns Observable con la síntesis generada
     */
    generarSintesis(texto: string): Observable<string> {
        if (!texto || texto.trim().length === 0) {
            throw new Error('No se pudo extraer texto del PDF para generar la síntesis');
        }

        const body = { texto };

        return this.http.post<any>(this.API_URL, body).pipe(
            map(res => {
                if (res && res.sintesis) {
                    return res.sintesis;
                }
                throw new Error('La respuesta del servidor no contiene la síntesis');
            }),
            catchError(err => {
                console.error('Error detallado llamando al backend AI:', err);
                let message = 'Error al generar la síntesis';

                if (err.status === 0) {
                    message = 'No se pudo conectar con el servidor backend. Asegúrate de que esté encendido (Puerto 3000).';
                } else if (err.error && err.error.message) {
                    message = `Error del servidor: ${err.error.message}`;
                }

                throw new Error(message);
            })
        );
    }
}
