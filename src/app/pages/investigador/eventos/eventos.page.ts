import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventosService } from '../../../servicios/eventos.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

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
  private route = inject(ActivatedRoute);

  eventoId: number | null = null;
  isEditMode = false;

  eventoForm!: FormGroup;
  categorias: any[] = [];
  selectedImg: File | null = null;
  imgPreview: string | null = null;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.cargarCategorias();

    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventoId = +id;
      this.isEditMode = true;
      this.cargarEvento(this.eventoId);
    }
  }

  cargarEvento(id: number) {
    this.eventosService.getEvento(id).subscribe({
      next: (evento) => {
        this.eventoForm.patchValue({
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          tipo_evento: evento.tipo_evento,
          fecha: evento.fecha,
          hora: evento.hora,
          modalidad: evento.modalidad,
          lugar_enlace: evento.lugar_enlace,
          categoria_id: evento.categoria_id,
          ponentes: evento.ponentes,
          publico_objetivo: evento.publico_objetivo,
          investigador_organizador_id: evento.investigador_organizador_id
        });
        this.imgPreview = `http://localhost:3000/eventos/${id}/imagen`;
      },
      error: (err) => console.error('Error al cargar evento', err)
    });
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

    // Cargar ID del investigador logueado
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
      const maxSize = 5 * 1024 * 1024; // 5MB
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
      this.showToast('Por favor selecciona una imagen válida (JPEG, PNG, WebP)', 'warning');
    }
  }

  async onSubmit() {
    if (this.eventoForm.invalid) {
      this.showToast('Por favor completa todos los campos requeridos', 'warning');
      this.eventoForm.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && !this.selectedImg) {
      this.showToast('Por favor selecciona una imagen para el evento', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Actualizando evento...' : 'Publicando evento...',
      spinner: 'crescent'
    });
    await loading.present();

    if (this.isEditMode) {
      this.eventosService.actualizarEvento(this.eventoId!, this.eventoForm.value).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('¡Evento actualizado con éxito!', 'success');
          this.router.navigate(['/investigador/inicio']);
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error al actualizar evento', err);
          this.showToast('Error al actualizar el evento', 'danger');
        }
      });
    } else {
      this.eventosService.crearEvento(this.eventoForm.value, this.selectedImg!).subscribe({
        next: (res) => {
          loading.dismiss();
          this.showToast('¡Evento publicado con éxito!', 'success');
          this.resetForm();
          this.router.navigate(['/investigador/inicio']);
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error al publicar evento', err);
          const errorMsg = err.error?.message || 'Error al conectar con el servidor';
          this.showToast(errorMsg, 'danger');
        }
      });
    }
  }

  resetForm() {
    this.initForm();
    this.selectedImg = null;
    this.imgPreview = null;
    // Marcamos como no tocados para limpiar mensajes de error
    Object.keys(this.eventoForm.controls).forEach(key => {
      const control = this.eventoForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
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
}

