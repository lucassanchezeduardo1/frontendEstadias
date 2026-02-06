import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  stats = [
    { label: 'Publicaciones', value: '12', icon: 'document-text', color: '#800020' },
    { label: 'Vistas', value: '1.2k', icon: 'eye', color: '#C70039' },
    { label: 'Descargas', value: '450', icon: 'cloud-download', color: '#FF5733' },
    { label: 'Citas', value: '89', icon: 'bookmark', color: '#900C3F' }
  ];

  publications = [
    {
      id: 1,
      title: 'Inteligencia Artificial en la Medicina Moderna',
      category: 'Tecnología',
      image: 'https://img.freepik.com/free-photo/doctor-working-with-ai_23-2151107332.jpg',
      date: '2024-05-10',
      comments: [
        { user: 'Dr. García', text: 'Excelente investigación, muy útil.' },
        { user: 'Marta R.', text: '¿Tienen el dataset disponible?' }
      ]
    },
    {
      id: 2,
      title: 'Impacto del Cambio Climático en la Biodiversidad',
      category: 'Ciencias Naturales',
      image: 'https://img.freepik.com/free-photo/dry-cracked-earth-background_23-2148824933.jpg',
      date: '2024-03-22',
      comments: [
        { user: 'Prof. Wilson', text: 'Datos muy precisos sobre la fauna.' }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  editPublication(pub: any) {
    console.log('Edit', pub);
  }

  deletePublication(id: number) {
    this.publications = this.publications.filter(p => p.id !== id);
  }

}
