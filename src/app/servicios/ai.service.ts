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

    // URL de la API de Gemini
    private readonly GEMINI_API_URL = environment.geminiApiUrl;

    // CLAVE DE API desde environment
    private readonly API_KEY = environment.geminiApiKey;

    constructor() {
        if (!this.API_KEY) {
            console.error('CRÍTICO: No se ha configurado la clave de API de Gemini en environment.ts');
        }
    }

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
     * Genera una síntesis con IA a partir del texto de la investigación
     * @param texto Texto completo de la investigación
     * @returns Observable con la síntesis generada
     */
    generarSintesis(texto: string): Observable<string> {
        if (!texto || texto.trim().length === 0) {
            throw new Error('No se pudo extraer texto del PDF para generar la síntesis');
        }

        const prompt = `Actúa como un divulgador científico experto de alto nivel.
        Resume la siguiente investigación científica de manera clara, profesional, coherente y atractiva para un público interesado en la ciencia. 
        La síntesis debe ser de aproximadamente 300 a 400 palabras, resaltar los hallazgos más importantes, la metodología y las conclusiones principales.
        Usa un lenguaje formal pero accesible.
        
        Investigación: \n\n ${texto}`;

        const body = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        return this.http.post<any>(this.GEMINI_API_URL, body, {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': this.API_KEY
            }
        }).pipe(
            map(res => {
                if (res.candidates && res.candidates[0] && res.candidates[0].content && res.candidates[0].content.parts) {
                    return res.candidates[0].content.parts[0].text;
                }
                throw new Error('No se pudo generar la síntesis');
            }),
            catchError(err => {
                console.error('Error detallado de Gemini API:', err);
                let message = 'Error al generar la síntesis';

                if (err.status === 429) {
                    message = 'Se ha alcanzado el límite de peticiones de la IA (429). Por favor, intenta de nuevo en unos momentos.';
                } else if (err.status === 404) {
                    message = 'El modelo de IA solicitado no fue encontrado (404). Verifica la URL y el nombre del modelo.';
                } else if (err.error && err.error.error && err.error.error.message) {
                    message = `Error de la IA: ${err.error.error.message}`;
                }

                throw new Error(message);
            })
        );
    }
}
