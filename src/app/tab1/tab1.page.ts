import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  researcherRequests = [
    { id: 1, name: 'Dr. Roberto Gómez', institution: 'UNAM', area: 'Biotecnología' },
    { id: 2, name: 'Dra. María Curiel', institution: 'IPN', area: 'Física Cuántica' }
  ];

  acceptedResearchers = [
    { id: 3, name: 'Dr. Albert Sans', institution: 'Tec de Monterrey', area: 'Robótica' },
    { id: 4, name: 'Dra. Elena Poniatowska', institution: 'UAM', area: 'Sociología' }
  ];

  constructor() { }

  acceptResearcher(id: number) {
    console.log('Aceptando investigador:', id);
  }

  rejectResearcher(id: number) {
    console.log('Rechazando investigador:', id);
  }

  deleteResearcher(id: number) {
    console.log('Eliminando investigador:', id);
  }
}
