import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-researcher-home',
  templateUrl: './researcher-home.page.html',
  styleUrls: ['./researcher-home.page.scss'],
  standalone: false
})
export class ResearcherHomePage implements OnInit {

  private router = inject(Router);

  publications = [
    {
      id: 1,
      title: 'Nanotecnología Aplicada a la Medicina Moderna',
      category: 'Medicina',
      image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800',
      synthesis: 'Esta investigación explora el uso de nanopartículas para la entrega dirigida de fármacos en tratamientos oncológicos, reduciendo efectos secundarios significativamente.',
      comments: [
        { user: 'Dr. García', text: 'Excelente aporte a la comunidad científica.' },
        { user: 'Elena Pérez', text: 'Muy interesante el enfoque que utilizaste.' }
      ]
    },
    {
      id: 2,
      title: 'Impacto de la IA en el Análisis de Datos Climáticos',
      category: 'Ciencias Ambientales',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
      synthesis: 'Estudio sobre algoritmos de aprendizaje profundo para predecir patrones de cambio climático global con una precisión del 94%.',
      comments: [
        { user: 'Sonia Ruiz', text: '¿Qué dataset utilizaron para el entrenamiento?' }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
    // Inicialización si es necesaria
  }

  editPublication(pub: any) {
    console.log('Editando:', pub.title);
  }

  deletePublication(pub: any) {
    console.log('Eliminando:', pub.title);
  }

  logout() {
    this.router.navigate(['/login']);
  }

}
