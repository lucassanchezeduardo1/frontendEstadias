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

  // Objeto para el formulario (vaciado según tu entidad)
  newInstitution: Institucion = {
    nombre: '',
    tipo_institucion: '',
    pais: '',
    estado: '',
    direccion: ''
  };

  constructor() { }

  ngOnInit() {
    this.cargarInstituciones();
  }

  /**
   * Cargar lista de instituciones desde el backend
   */
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

  /**
   * Registrar una nueva institución con validación
   */
  async addInstitution() {
    // Validación: Ninguno puede ir vacío
    if (!this.newInstitution.nombre || !this.newInstitution.tipo_institucion ||
      !this.newInstitution.pais || !this.newInstitution.estado || !this.newInstitution.direccion) {
      this.showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    this.instService.createInstitucion(this.newInstitution).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('Institución registrada con éxito', 'success');
        this.resetForm();
        this.cargarInstituciones(); // Recargar lista
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al guardar:', err);
        if (err.status === 400 || err.status === 409) {
          this.showToast('Error: El nombre de la institución ya existe o los datos son inválidos', 'danger');
        } else {
          this.showToast('Error al conectar con el servidor', 'danger');
        }
      }
    });
  }

  /**
   * Eliminar institución con confirmación
   */
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

  // Placeholder para edición
  editInstitution(inst: Institucion) {
    console.log('Editando:', inst);
    // Próximamente implementar modal de edición
  }
}
