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
   * Cargar datos en el formulario para editar
   */
  editCategory(cat: Categoria) {
    this.isEditing = true;
    this.selectedId = cat.id || null;
    this.newCategory = { ...cat };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedId = null;
    this.resetForm();
  }

  /**
   * Guardar (Crear o Actualizar)
   */
  async saveCategory() {
    if (!this.newCategory.nombre || !this.newCategory.descripcion) {
      this.showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditing ? 'Actualizando...' : 'Guardando...'
    });
    await loading.present();

    if (this.isEditing && this.selectedId) {
      // ACTUALIZAR
      this.catService.updateCategoria(this.selectedId, this.newCategory).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('Categoría actualizada con éxito', 'success');
          this.cancelEdit();
          this.cargarCategorias();
        },
        error: () => {
          loading.dismiss();
          this.showToast('Error al actualizar', 'danger');
        }
      });
    } else {
      // CREAR
      this.catService.createCategoria(this.newCategory).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('Categoría registrada con éxito', 'success');
          this.resetForm();
          this.cargarCategorias();
        },
        error: (err) => {
          loading.dismiss();
          this.showToast('Error al guardar', 'danger');
        }
      });
    }
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
}
