import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  private router = inject(Router);
  private usrService = inject(UsuariosService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  usuario: any = null;
  isEditing: boolean = false;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  // URL base para las fotos
  readonly API_URL = 'http://localhost:3000';

  constructor() { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const data = this.usrService.getUser();
    if (data) {
      this.usuario = { ...data };
      this.photoPreview = `${this.API_URL}/usuarios/${this.usuario.id}/foto`;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  toggleEdit() {
    if (this.isEditing) {
      this.cargarDatos();
      this.selectedFile = null;
    }
    this.isEditing = !this.isEditing;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async confirmSave() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de que deseas guardar los cambios realizados en tu perfil?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, Guardar',
          handler: () => this.saveChanges()
        }
      ]
    });
    await alert.present();
  }

  async saveChanges() {
    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();

    // Filtramos los campos que NO queremos enviar al backend para evitar el error 500
    // Eliminamos relaciones y metadatos que TypeORM no espera en el DTO de actualización
    const { id, password, created_at, updated_at, favoritos, comentarios, ...datosAEnviar } = this.usuario;

    // Asegurarse de que edad sea número
    if (datosAEnviar.edad) {
      datosAEnviar.edad = Number(datosAEnviar.edad);
    }

    this.usrService.actualizar(this.usuario.id, datosAEnviar, this.selectedFile || undefined).subscribe({
      next: (res: any) => {
        loading.dismiss();
        this.usrService.saveSession(res); // Actualizar localStorage
        this.usuario = { ...res };
        this.isEditing = false;
        this.selectedFile = null;
        this.showToast('Perfil actualizado correctamente', 'success');
      },
      error: (err: any) => {
        loading.dismiss();
        console.error('Error al actualizar:', err);
        const errorMsg = err.error?.message || 'Error al actualizar el perfil';
        this.showToast(errorMsg, 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, Salir',
          handler: () => {
            this.usrService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

}
