import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

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
