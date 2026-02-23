import { Component, OnInit, inject } from '@angular/core';
import { EventosService } from '../../../servicios/eventos.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: false
})
export class EventosPage implements OnInit {

  private eventosService = inject(EventosService);

  eventos: any[] = [];
  cargando: boolean = true;
  readonly API_URL = 'http://localhost:3000';

  constructor() { }

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.cargando = true;
    this.eventosService.getEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos', err);
        this.cargando = false;
      }
    });
  }

  getImagenUrl(id: number): string {
    return `${this.API_URL}/eventos/${id}/imagen`;
  }

  getDia(fecha: string): string {
    const dStr = fecha.split('T')[0];
    const parts = dStr.split('-');
    return parseInt(parts[2], 10).toString();
  }

  getMes(fecha: string): string {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const dStr = fecha.split('T')[0];
    const parts = dStr.split('-');
    const mesIndex = parseInt(parts[1], 10) - 1;
    return meses[mesIndex];
  }
}
