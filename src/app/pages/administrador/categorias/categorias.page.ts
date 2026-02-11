import { Component, OnInit, inject } from '@angular/core';
import { CategoriasService } from '../../../servicios/categorias.service';
import { Categoria } from '../../../modelos/categoria.interface';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false
})
export class CategoriasPage implements OnInit {

  private catService = inject(CategoriasService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  // Lista de categorías desde la BD
  categories: Categoria[] = [];

  // Objeto para el formulario
  newCategory: Categoria = {
    nombre: '',
    descripcion: ''
  };

  constructor() { }

  ngOnInit() {
    this.cargarCategorias();
  }

  /**
   * Cargar lista de categorías desde el backend
   */
  async cargarCategorias() {
    this.catService.getCategorias().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.showToast('No se pudieron cargar las categorías', 'danger');
      }
    });
  }

  /**
   * Registrar una nueva categoría con validación
   */
  async addCategory() {
    if (!this.newCategory.nombre || !this.newCategory.descripcion) {
      this.showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    this.catService.createCategoria(this.newCategory).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('Categoría registrada con éxito', 'success');
        this.resetForm();
        this.cargarCategorias(); // Recargar lista
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al guardar:', err);
        if (err.status === 400 || err.status === 409) {
          this.showToast('Error: El nombre de la categoría ya existe', 'danger');
        } else {
          this.showToast('Error al conectar con el servidor', 'danger');
        }
      }
    });
  }

  /**
   * Eliminar categoría con confirmación
   */
  async deleteCategory(id: number | undefined) {
    if (!id) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Estás seguro de eliminar esta categoría?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.catService.deleteCategoria(id).subscribe(() => {
              this.showToast('Categoría eliminada', 'success');
              this.cargarCategorias();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  resetForm() {
    this.newCategory = {
      nombre: '',
      descripcion: ''
    };
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  editCategory(cat: Categoria) {
    console.log('Editando:', cat);
    // Próximamente implementar modal de edición
  }
}
