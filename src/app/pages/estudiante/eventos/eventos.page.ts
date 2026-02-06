import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: false
})
export class EventosPage implements OnInit {

  eventos = [
    {
      id: 1,
      titulo: 'Congreso Internacional de Biología 2026',
      fecha: '15 Mar',
      hora: '09:00 AM',
      modalidad: 'Presencial',
      lugar: 'Centro de Convenciones Tuxtla',
      imagen: 'https://images.unsplash.com/photo-1540575861501-7ad067638dfb?auto=format&fit=crop&q=80&w=600',
      color: '#ff9a9e',
      categoria: 'Ciencias Naturales'
    },
    {
      id: 2,
      titulo: 'Webinar: Futuro de la IA en la Educación',
      fecha: '20 Mar',
      hora: '05:00 PM',
      modalidad: 'Virtual',
      lugar: 'Plataforma Zoom',
      imagen: 'https://images.unsplash.com/photo-1591115765373-520b7a217282?auto=format&fit=crop&q=80&w=600',
      color: '#a18cd1',
      categoria: 'Tecnología'
    },
    {
      id: 3,
      titulo: 'Taller de Redacción Científica',
      fecha: '05 Abr',
      hora: '10:00 AM',
      modalidad: 'Híbrida',
      lugar: 'BCU UNACH / MS Teams',
      imagen: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=600',
      color: '#fbc2eb',
      categoria: 'Metodología'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
