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
    this.newInstitution = {
      nombre: inst.nombre,
      tipo_institucion: inst.tipo_institucion,
      pais: inst.pais,
      estado: inst.estado,
      direccion: inst.direccion
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedId = null;
    this.resetForm();
  }


  async saveInstitution() {
    const { nombre, tipo_institucion, pais, estado, direccion } = this.newInstitution;
    
    if (!nombre || !tipo_institucion || !pais || !estado || !direccion) {
      this.showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditing ? 'Actualizando...' : 'Guardando...'
    });
    await loading.present();

    const payload = { nombre, tipo_institucion, pais, estado, direccion };

    const operation = (this.isEditing && this.selectedId)
      ? this.instService.updateInstitucion(this.selectedId, payload)
      : this.instService.createInstitucion(payload);

    operation.subscribe({
      next: () => {
        loading.dismiss();
        const msg = this.isEditing ? 'Institución actualizada con éxito' : 'Institución registrada con éxito';
        this.showToast(msg, 'success');
        this.cancelEdit();
        this.cargarInstituciones();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error Api:', err);
        const errMsg = err.error?.message || 'Error al procesar la solicitud';
        this.showToast(Array.isArray(errMsg) ? errMsg[0] : errMsg, 'danger');
      }
    });
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
            this.instService.deleteInstitution(id).subscribe({
              next: () => {
                this.showToast('Institución eliminada', 'success');
                this.cargarInstituciones();
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
