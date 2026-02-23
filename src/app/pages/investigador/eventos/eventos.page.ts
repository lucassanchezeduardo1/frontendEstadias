import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventosService } from '../../../servicios/eventos.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: false,
})
export class EventosPage implements OnInit {
  private fb = inject(FormBuilder);
  private eventosService = inject(EventosService);
  private categoriasService = inject(CategoriasService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private router = inject(Router);

  eventoForm!: FormGroup;
  categorias: any[] = [];
  selectedImg: File | null = null;
  imgPreview: string | null = null;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  initForm() {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      descripcion: ['', [Validators.required, Validators.minLength(50)]],
      tipo_evento: ['', [Validators.required, Validators.maxLength(100)]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      modalidad: ['', [Validators.required]],
      lugar_enlace: ['', [Validators.required, Validators.maxLength(500)]],
      categoria_id: ['', [Validators.required]],
      ponentes: ['', [Validators.required, Validators.minLength(5)]],
      publico_objetivo: ['', [Validators.required, Validators.maxLength(255)]],
      investigador_organizador_id: [null]
    });

    const invUser = localStorage.getItem('inv_user');
    if (invUser) {
      const user = JSON.parse(invUser);
      this.eventoForm.patchValue({ investigador_organizador_id: user.id });
    }
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  onImgSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showToast('La imagen no puede superar los 5MB', 'warning');
        return;
      }
      this.selectedImg = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.showToast('Por favor selecciona una imagen válida', 'warning');
    }
  }

  async onSubmit() {
    if (this.eventoForm.invalid || !this.selectedImg) {
      this.showToast('Por favor completa todos los campos y selecciona una imagen', 'warning');
      this.eventoForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Publicando evento...',
      spinner: 'crescent'
    });
    await loading.present();

    this.eventosService.crearEvento(this.eventoForm.value, this.selectedImg!).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('¡Evento publicado con éxito!', 'success');
        this.resetForm();
        this.router.navigate(['/investigador/tabs/inicio']);
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al publicar evento', err);
        this.showToast('Error al publicar el evento', 'danger');
      }
    });
  }

  resetForm() {
    this.initForm();
    this.selectedImg = null;
    this.imgPreview = null;
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
