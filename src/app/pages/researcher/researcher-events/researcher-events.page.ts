import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-researcher-events',
  templateUrl: './researcher-events.page.html',
  styleUrls: ['./researcher-events.page.scss'],
  standalone: false
})
export class ResearcherEventsPage implements OnInit {

  eventData = {
    title: '',
    image: '',
    description: '',
    type: '',
    category: '',
    date: '',
    time: '',
    modality: 'presencial',
    location: '',
    speakers: '',
    targetAudience: ''
  };

  constructor() { }

  ngOnInit() {
    // Inicialización de eventos
  }

  onSubmit() {
    console.log('Evento registrado:', this.eventData);
    alert('Evento registrado con éxito');
    this.resetForm();
  }

  resetForm() {
    this.eventData = {
      title: '',
      image: '',
      description: '',
      type: '',
      category: '',
      date: '',
      time: '',
      modality: 'presencial',
      location: '',
      speakers: '',
      targetAudience: ''
    };
  }

}
