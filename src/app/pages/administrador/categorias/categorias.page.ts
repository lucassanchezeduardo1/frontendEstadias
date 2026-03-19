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

  // Estado de edición
  isEditing = false;
  selectedId: number | null = null;

  constructor() { }

  ngOnInit() {
    this.cargarCategorias();
  }

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

  editCategory(cat: Categoria) {
    this.isEditing = true;
    this.selectedId = cat.id || null;
    this.newCategory = {
      nombre: cat.nombre,
      descripcion: cat.descripcion
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedId = null;
    this.resetForm();
  }

  async saveCategory() {
    const { nombre, descripcion } = this.newCategory;
    
    if (!nombre || !descripcion) {
      this.showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditing ? 'Actualizando...' : 'Guardando...'
    });
    await loading.present();

    // Limpiamos el objeto para enviar solo lo que el DTO espera
    const payload = { nombre, descripcion };

    const operation = (this.isEditing && this.selectedId)
      ? this.catService.updateCategoria(this.selectedId, payload)
      : this.catService.createCategoria(payload);

    operation.subscribe({
      next: () => {
        loading.dismiss();
        const msg = this.isEditing ? 'Categoría actualizada con éxito' : 'Categoría registrada con éxito';
        this.showToast(msg, 'success');
        this.cancelEdit();
        this.cargarCategorias();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error:', err);
        const errMsg = err.error?.message || 'Error al procesar la solicitud';
        this.showToast(Array.isArray(errMsg) ? errMsg[0] : errMsg, 'danger');
      }
    });
  }


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
            this.catService.deleteCategoria(id).subscribe({
              next: () => {
                this.showToast('Categoría eliminada', 'success');
                this.cargarCategorias();
              },
              error: (err) => {
                const msg = err.error?.message || 'Error al eliminar';
                this.showToast(msg, 'danger');
              }
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
}
