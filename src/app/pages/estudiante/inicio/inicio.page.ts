import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  searchTerm: string = '';

  categorias = [
    { id: 1, nombre: 'Biotecnología', icono: 'flask-outline', color: '#4facfe' },
    { id: 2, nombre: 'Inteligencia Artificial', icono: 'hardware-chip-outline', color: '#00f2fe' },
    { id: 3, nombre: 'Física Cuántica', icono: 'atom-outline', color: '#764ba2' },
    { id: 4, nombre: 'Ecología', icono: 'leaf-outline', color: '#667eea' },
    { id: 5, nombre: 'Medicina', icono: 'medical-outline', color: '#f093fb' },
  ];

  publicaciones = [
    {
      id: 1,
      titulo: 'Avances en la CRISPR 2026',
      investigador: 'Dr. Roberto Sánchez',
      resumen: 'Explorando las nuevas fronteras de la edición genética y su impacto en enfermedades hereditarias.',
      imagen: 'https://images.unsplash.com/photo-1532187875605-1ef6c237c145?auto=format&fit=crop&q=80&w=600',
      fecha: '05 Feb 2026',
      categoria: 'Biotecnología'
    },
    {
      id: 2,
      titulo: 'Modelos de Lenguaje Eficientes',
      investigador: 'Dra. María García',
      resumen: 'Cómo optimizar la arquitectura de transformadores para dispositivos móviles.',
      imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
      fecha: '03 Feb 2026',
      categoria: 'Inteligencia Artificial'
    },
    {
      id: 3,
      titulo: 'Energía Solar de Alta Eficiencia',
      investigador: 'Dr. Carlos Ruiz',
      resumen: 'Nuevos materiales de perovskita que superan el límite de Shockley-Queisser.',
      imagen: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
      fecha: '01 Feb 2026',
      categoria: 'Energía'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  buscar(event: any) {
    this.searchTerm = event.detail.value;
  }
}
