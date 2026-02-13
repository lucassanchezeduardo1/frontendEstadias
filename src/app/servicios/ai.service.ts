import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as pdfjsLib from 'pdfjs-dist';

// Configuración del worker de PDF.js (usando la copia local definida en angular.json)
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private http = inject(HttpClient);

    // URL de la API de Gemini (Versión estable v1)
    private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

    // ESTA CLAVE DEBE SER PROPORCIONADA POR EL USUARIO O GUARDADA EN ENVIRONMENT
    private readonly API_KEY = 'AIzaSyCjCxg8ZhWRqnaKWtEqpYHPcp_mTN1U3TY';

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
     * Genera una síntesis con IA a partir del texto de la investigación
     * @param texto Texto completo de la investigación
     * @returns Observable con la síntesis generada
     */
    generarSintesis(texto: string): Observable<string> {
        const prompt = `Actúa como un divulgador científico experto. Resume la siguiente investigación científica de manera clara, profesional y atractiva para un público interesado en la ciencia. La síntesis debe ser de aproximadamente 300 palabras y resaltar los hallazgos más importantes: \n\n ${texto}`;

        const body = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        return this.http.post<any>(`${this.GEMINI_API_URL}?key=${this.API_KEY}`, body).pipe(
            map(res => {
                if (res.candidates && res.candidates[0] && res.candidates[0].content && res.candidates[0].content.parts) {
                    return res.candidates[0].content.parts[0].text;
                }
                throw new Error('No se pudo generar la síntesis');
            }),
            catchError(err => {
                console.error('Error detallado de Gemini API:', err);
                if (err.error) {
                    console.error('MENSAJE DE GOOGLE:', err.error);
                }
                throw err;
            })
        );
    }
}
