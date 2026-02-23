import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/publicacion';

  constructor() { }

  /**
   * Crear una nueva publicación
   * @param datos Objeto con los datos de la publicación
   * @param pdf Archivo PDF
   * @param imagenPortada Archivo de imagen de portada
   * @param imagenContenido Archivo opcional de imagen de contenido (infografía, etc)
   * @returns Observable con la respuesta del servidor
   */
  crearPublicacion(datos: any, pdf: File, imagenPortada: File, imagenContenido?: File): Observable<any> {
    const formData = new FormData();

    // Agregamos los campos del DTO
    Object.keys(datos).forEach(key => {
      formData.append(key, datos[key]);
    });

    // Agregamos los archivos con los nombres que espera el backend
    formData.append('pdf', pdf);
    formData.append('img_portada', imagenPortada);

    if (imagenContenido) {
      formData.append('img_contenido', imagenContenido);
    }

    return this.http.post(this.API_URL, formData);
  }

  /**
   * Obtener publicaciones de un investigador específico
   */
  getMisPublicaciones(investigadorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/investigador/${investigadorId}`);
  }

  /**
   * Obtener todas las publicaciones
   */
  getPublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  /**
   * Obtener una publicación por ID
   */
  getPublicacion(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  /**
   * Actualizar una publicación (solo campos de texto)
   */
  actualizarPublicacion(id: number, datos: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, datos);
  }

  /**
   * Eliminar una publicación
   */
  eliminarPublicacion(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  /**
   * Incrementar el contador de vistas
   */
  incrementarVistas(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/vistas`, {});
  }

  /**
   * Incrementar el contador de descargas
   */
  incrementarDescargas(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/descargas`, {});
  }
}
