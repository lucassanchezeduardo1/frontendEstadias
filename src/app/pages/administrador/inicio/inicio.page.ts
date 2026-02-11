import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {

  researcherRequests = [
    { id: 1, name: 'Dr. Roberto Gómez', institution: 'UNAM', area: 'Biotecnología' },
    { id: 2, name: 'Dra. María Curiel', institution: 'IPN', area: 'Física Cuántica' }
  ];

  acceptedResearchers = [
    { id: 3, name: 'Dr. Albert Sans', institution: 'Tec de Monterrey', area: 'Robótica' },
    { id: 4, name: 'Dra. Elena Poniatowska', institution: 'UAM', area: 'Sociología' }
  ];

  constructor() { }

  ngOnInit() {
  }

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
