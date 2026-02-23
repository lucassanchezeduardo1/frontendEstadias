import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Investigador } from '../../../modelos/investigador.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  private fb = inject(FormBuilder);
  private invService = inject(InvestigadorService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  isEditing = false;
  user: Investigador | null = null;
  profileForm!: FormGroup;
  selectedImg: File | null = null;
  imgPreview: string | null = null;
  apiUrl = 'http://localhost:3000/investigador';
  defaultAvatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor() { }

  async ngOnInit() {
    await this.invService.ready;
    this.loadUserData();
  }

  async ionViewWillEnter() {
    await this.invService.ready;
    this.loadUserData();
  }

  loadUserData() {
    const loggedUser = this.invService.getLoggedUser();

    if (!loggedUser || !loggedUser.id) {
      console.warn('No hay usuario logueado en PerfilPage');
      return;
    }

    // Recargar desde el servidor para tener datos frescos
    this.invService.getInvestigador(loggedUser.id).subscribe({
      next: (data) => {
        this.user = data;
        this.initForm(data);
      },
      error: (err) => {
        console.error('Error al cargar datos del perfil', err);
        this.user = loggedUser;
        this.initForm(loggedUser);
      }
    });
  }

  initForm(data: Investigador) {
    this.profileForm = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      apellidos: [data.apellidos, [Validators.required]],
      grado_academico: [data.grado_academico, [Validators.required]],
      cargo_actual: [data.cargo_actual, [Validators.required]],
      areas_investigacion: [data.areas_investigacion, [Validators.required]],
      descripcion_trayectoria: [data.descripcion_trayectoria, [Validators.required]],
      google_academico_url: [data.google_academico_url || ''],
      researchgate_url: [data.researchgate_url || ''],
      direccion_oficina: [data.direccion_oficina || ''],
      horario_atencion: [data.horario_atencion || '']
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserData(); // Cancelar y recargar
    }
  }

  onImgSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImg = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando perfil...',
      spinner: 'crescent'
    });
    await loading.present();

    this.invService.update(this.user!.id!, this.profileForm.value, this.selectedImg || undefined).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('Perfil actualizado con éxito', 'success');
        this.isEditing = false;

        // Actualizar localmente la sesión
        this.invService.saveSession(res.investigador || res, 'TOKEN_INV'); // Rescatamos el token o mantenemos el actual si fuera necesario
        this.user = res.investigador || res;
        this.imgPreview = null;
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al actualizar perfil', err);
        this.showToast('Error al actualizar el perfil', 'danger');
      }
    });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, Salir',
          handler: () => {
            this.invService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
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
}
