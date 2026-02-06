import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  isEditing = false;

  researcher = {
    name: 'Dr. Alejandro Sánchez',
    email: 'asanchez@universidad.edu',
    institution: 'Instituto de Innovación Tecnológica',
    area: 'Ciencias de la Computación',
    bio: 'Investigador especializado en inteligencia artificial y aprendizaje profundo con más de 10 años de experiencia.',
    publicationsCount: 24,
    degree: 'Doctorado en Ciencias'
  };

  constructor() { }

  ngOnInit() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.isEditing = false;
    // logic to save
  }

}
