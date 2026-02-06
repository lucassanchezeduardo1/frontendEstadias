import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directorios',
  templateUrl: './directorios.page.html',
  styleUrls: ['./directorios.page.scss'],
  standalone: false
})
export class DirectoriosPage implements OnInit {

  investigadores = [
    {
      id: 1,
      nombre: 'Dr. Roberto Sánchez',
      especialidad: 'Biotecnología Genómica',
      institucion: 'Universidad Politécnica de Chiapas',
      proyectos: 15,
      seguidores: '1.2k',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      color: '#4facfe'
    },
    {
      id: 2,
      nombre: 'Dra. María García',
      especialidad: 'Inteligencia Artificial',
      institucion: 'Instituto Tecnológico de Tuxtla',
      proyectos: 8,
      seguidores: '950',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      color: '#f093fb'
    },
    {
      id: 3,
      nombre: 'Dr. Carlos Ruiz',
      especialidad: 'Energías Renovables',
      institucion: 'UNACH',
      proyectos: 12,
      seguidores: '2.1k',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      color: '#667eea'
    },
    {
      id: 4,
      nombre: 'Dra. Elena Torres',
      especialidad: 'Ecología Marina',
      institucion: 'ECOSUR',
      proyectos: 20,
      seguidores: '3.4k',
      foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      color: '#30cfd0'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
