import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.page.html',
  styleUrls: ['./instituciones.page.scss'],
  standalone: false
})
export class InstitucionesPage implements OnInit {

  institutions = [
    { id: 1, name: 'Universidad Nacional Autónoma de México', type: 'Pública', country: 'México', state: 'CDMX', address: 'Av. Universidad 3000' },
    { id: 2, name: 'Instituto Politécnico Nacional', type: 'Pública', country: 'México', state: 'CDMX', address: 'Luis Enrique Erro s/n' }
  ];

  newInstitution = {
    name: '',
    type: '',
    country: '',
    state: '',
    address: ''
  };

  constructor() { }

  ngOnInit() {
  }

  addInstitution() {
    if (this.newInstitution.name && this.newInstitution.type) {
      this.institutions.push({
        id: Date.now(),
        ...this.newInstitution
      });
      this.resetForm();
    }
  }

  resetForm() {
    this.newInstitution = {
      name: '',
      type: '',
      country: '',
      state: '',
      address: ''
    };
  }

  editInstitution(inst: any) {
    console.log('Editando institución:', inst);
  }

  deleteInstitution(id: number) {
    this.institutions = this.institutions.filter(i => i.id !== id);
  }

}
