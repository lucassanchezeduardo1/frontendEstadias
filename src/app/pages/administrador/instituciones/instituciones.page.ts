import { Component, OnInit, inject } from '@angular/core';
import { InstitucionesService } from '../../../servicios/instituciones.service';
import { Institucion } from '../../../modelos/institucion.interface';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.page.html',
  styleUrls: ['./instituciones.page.scss'],
  standalone: false
})
export class InstitucionesPage implements OnInit {

  private instService = inject(InstitucionesService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  // Lista de instituciones desde la BD
  institutions: Institucion[] = [];

  // Objeto para el formulario 
  newInstitution: Institucion = {
    nombre: '',
    tipo_institucion: '',
    pais: '',
    estado: '',
    direccion: ''
  };

  // Estado de edición
  isEditing = false;
  selectedId: number | null = null;

  constructor() { }

  ngOnInit() {
    this.cargarInstituciones();
  }


  async cargarInstituciones() {
    this.instService.getInstituciones().subscribe({
      next: (data) => {
        this.institutions = data;
      },
      error: (err) => {
        console.error('Error al cargar instituciones:', err);
        this.showToast('No se pudieron cargar las instituciones', 'danger');
      }
    });
  }


  editInstitution(inst: Institucion) {
    this.isEditing = true;
    this.selectedId = inst.id || null;
    // Clonamos el objeto para no editar la lista directamente antes de guardar
    this.newInstitution = { ...inst };
    // Scroll suave hacia arriba para que el usuario vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedId = null;
    this.resetForm();
  }


  async saveInstitution() {
    if (!this.newInstitution.nombre || !this.newInstitution.tipo_institucion ||
      !this.newInstitution.pais || !this.newInstitution.estado || !this.newInstitution.direccion) {
      this.showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: this.isEditing ? 'Actualizando...' : 'Guardando...' });
    await loading.present();

    if (this.isEditing && this.selectedId) {
      // ACTUALIZAR
      this.instService.updateInstitucion(this.selectedId, this.newInstitution).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('Institución actualizada con éxito', 'success');
          this.cancelEdit();
          this.cargarInstituciones();
        },
        error: () => {
          loading.dismiss();
          this.showToast('Error al actualizar', 'danger');
        }
      });
    } else {
      // CREAR
      this.instService.createInstitucion(this.newInstitution).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('Institución registrada con éxito', 'success');
          this.resetForm();
          this.cargarInstituciones();
        },
        error: (err) => {
          loading.dismiss();
          this.showToast('Error al guardar', 'danger');
        }
      });
    }
  }


  async deleteInstitution(id: number | undefined) {
    if (!id) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Estás seguro de eliminar esta institución?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.instService.deleteInstitution(id).subscribe(() => {
              this.showToast('Institución eliminada', 'success');
              this.cargarInstituciones();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  resetForm() {
    this.newInstitution = {
      nombre: '',
      tipo_institucion: '',
      pais: '',
      estado: '',
      direccion: ''
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
