import { Component, OnInit, inject } from '@angular/core';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { EventosService } from '../../../servicios/eventos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {
  private publicacionesService = inject(PublicacionesService);
  private eventosService = inject(EventosService);

  publications: any[] = [];
  events: any[] = [];
  investigadorId: number | null = null;

  constructor() { }

  ngOnInit() {
    const invUser = localStorage.getItem('inv_user');
    if (invUser) {
      const user = JSON.parse(invUser);
      this.investigadorId = user.id;
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (this.investigadorId) {
      // Cargar mis publicaciones
      this.publicacionesService.getMisPublicaciones(this.investigadorId).subscribe({
        next: (res) => this.publications = res,
        error: (err) => console.error('Error al cargar publicaciones', err)
      });

      // Cargar mis eventos
      this.eventosService.getMisEventosById(this.investigadorId).subscribe({
        next: (res) => this.events = res.eventos || [],
        error: (err) => console.error('Error al cargar eventos', err)
      });
    }
  }

  getImagenUrl(pubId: number) {
    return `http://localhost:3000/publicacion/${pubId}/imagen`;
  }

  getEventoImagenUrl(eventoId: number) {
    return `http://localhost:3000/eventos/${eventoId}/imagen`;
  }

  editPublication(pub: any) {
    console.log('Edit', pub);
  }

  deletePublication(id: number) {
    this.publicacionesService.eliminarPublicacion(id).subscribe({
      next: () => {
        this.publications = this.publications.filter(p => p.id !== id);
      },
      error: (err) => console.error('Error al eliminar publicación', err)
    });
  }

  deleteEvent(id: number) {
    this.eventosService.eliminarEvento(id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== id);
      },
      error: (err) => console.error('Error al eliminar evento', err)
    });
  }
}
