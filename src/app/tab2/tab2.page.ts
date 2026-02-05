import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  categories = [
    { id: 1, name: 'Tecnología', description: 'Investigaciones sobre avances tecnológicos.' },
    { id: 2, name: 'Biología', description: 'Estudios sobre seres vivos y su entorno.' }
  ];

  newCategory = {
    name: '',
    description: ''
  };

  constructor() { }

  addCategory() {
    if (this.newCategory.name && this.newCategory.description) {
      this.categories.push({
        id: Date.now(),
        ...this.newCategory
      });
      this.newCategory = { name: '', description: '' };
    }
  }

  editCategory(cat: any) {
    console.log('Editando categoría:', cat);
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
  }
}
