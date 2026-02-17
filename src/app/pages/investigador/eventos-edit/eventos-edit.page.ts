import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventosService } from '../../../servicios/eventos.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eventos-edit',
  templateUrl: './eventos-edit.page.html',
  styleUrls: ['./eventos-edit.page.scss'],
  standalone: false,
})
export class EventosEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private eventosService = inject(EventosService);
  private categoriasService = inject(CategoriasService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  eventoForm!: FormGroup;
  categorias: any[] = [];
  eventoId: number | null = null;
  imgPreview: string | null = null;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.cargarCategorias();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventoId = +id;
      this.cargarEvento(this.eventoId);
    }
  }

  initForm() {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.minLength(10), Validators.maxLength(255)]],
      descripcion: ['', [Validators.minLength(50)]],
      tipo_evento: ['', [Validators.maxLength(100)]],
      fecha: [''],
      hora: [''],
      modalidad: [''],
      lugar_enlace: ['', [Validators.maxLength(500)]],
      categoria_id: [''],
      ponentes: ['', [Validators.minLength(5)]],
      publico_objetivo: ['', [Validators.maxLength(255)]],
      investigador_organizador_id: [null]
    });

    // Obtener ID del usuario logueado
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

  cargarEvento(id: number) {
    this.eventosService.getEvento(id).subscribe({
      next: (evento) => {
        // Formatear fecha para input date (YYYY-MM-DD)
        let fechaFormateada = '';
        if (evento.fecha) {
          fechaFormateada = new Date(evento.fecha).toISOString().split('T')[0];
        }

        // Formatear hora para input time (HH:mm)
        let horaFormateada = evento.hora || '';
        if (horaFormateada && horaFormateada.length > 5) {
          horaFormateada = horaFormateada.substring(0, 5);
        }

        this.eventoForm.patchValue({
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          tipo_evento: evento.tipo_evento,
          fecha: fechaFormateada,
          hora: horaFormateada,
          modalidad: evento.modalidad,
          lugar_enlace: evento.lugar_enlace,
          categoria_id: evento.categoria_id,
          ponentes: evento.ponentes,
          publico_objetivo: evento.publico_objetivo
        });
        this.imgPreview = `http://localhost:3000/eventos/${id}/imagen`;
      },
      error: (err) => {
        console.error('Error al cargar evento', err);
        this.showToast('No se encontró el evento', 'danger');
        this.router.navigate(['/investigador/inicio']);
      }
    });
  }

  async onSubmit() {
    if (this.eventoForm.invalid) {
      this.showToast('Por favor verifica los requisitos de los campos (longitud mínima, etc.)', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando evento...',
      spinner: 'crescent'
    });
    await loading.present();

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
