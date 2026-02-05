import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-researcher-profile',
  templateUrl: './researcher-profile.page.html',
  styleUrls: ['./researcher-profile.page.scss'],
  standalone: false
})
export class ResearcherProfilePage implements OnInit {

  private router = inject(Router);

  researcher = {
    name: 'Dr. Lucas Sánchez Eduardo',
    title: 'Ph.D. en Ciencias de la Computación',
    specialty: 'Inteligencia Artificial y Nanotecnología',
    email: 'lucas.sanchez@universidad.edu',
    institution: 'Instituto Tecnológico Nacional',
    bio: 'Investigador senior con más de 15 años de experiencia en el desarrollo de soluciones tecnológicas aplicadas a la salud pública y el medio ambiente. Autor de múltiples artículos científicos indexados.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  };

  editing = false;

  constructor() { }

  ngOnInit() {
    // Inicialización de perfil
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (!this.editing) {
      console.log('Datos guardados:', this.researcher);
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

}
