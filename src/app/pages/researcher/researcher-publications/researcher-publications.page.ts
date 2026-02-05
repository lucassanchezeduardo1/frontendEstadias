import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-researcher-publications',
  templateUrl: './researcher-publications.page.html',
  styleUrls: ['./researcher-publications.page.scss'],
  standalone: false
})
export class ResearcherPublicationsPage implements OnInit {

  publicationData = {
    title: '',
    category: '',
    subcategories: '',
    image: '',
    collaborators: '',
    synthesis: '',
    pdf: '',
    video: '',
    references: ''
  };

  constructor() { }

  ngOnInit() {
    // Inicialización de publicaciones
  }

  onSubmit() {
    console.log('Publicación enviada:', this.publicationData);
    alert('Publicación enviada con éxito');
    this.resetForm();
  }

  resetForm() {
    this.publicationData = {
      title: '',
      category: '',
      subcategories: '',
      image: '',
      collaborators: '',
      synthesis: '',
      pdf: '',
      video: '',
      references: ''
    };
  }

}
