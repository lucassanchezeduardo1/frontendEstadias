import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  usuario = {
    nombre: 'Juan Pérez García',
    matricula: '2022340567',
    carrera: 'Ingeniería en Desarrollo de Software',
    universidad: 'Universidad Politécnica de Chiapas',
    correo: 'juan.perez@upchiapas.edu.mx',
    intereses: ['IA', 'Biotecnología', 'Física'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  };

  isEditing: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  cerrarSesion() {
    // Redirigir al login
    this.router.navigate(['/auth/login']);
  }

}
