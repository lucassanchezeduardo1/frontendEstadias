import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publicacion-edit',
  templateUrl: './publicacion-edit.page.html',
  styleUrls: ['./publicacion-edit.page.scss'],
  standalone: false,
})
export class PublicacionEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private publicacionesService = inject(PublicacionesService);
  private categoriasService = inject(CategoriasService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  publicacionForm!: FormGroup;
  categorias: any[] = [];
  publicacionId: number | null = null;
  imgPreview: string | null = null;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.cargarCategorias();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicacionId = +id;
      this.cargarPublicacion(this.publicacionId);
    }
  }

  initForm() {
    // Al editar, los campos pueden ser opcionales ya que el backend permite parches
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.minLength(5), Validators.maxLength(255)]],
      categoria_id: [''],
      sub_categoria: ['', [Validators.minLength(3)]],
      colaboradores: [''],
      descripcion_investigacion: ['', [Validators.minLength(150)]],
      sintesis_ia: [''],
      links_referencia: [''],
      videos_url: ['']
    });
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarPublicacion(id: number) {
    this.publicacionesService.getPublicacion(id).subscribe({
      next: (pub) => {
        this.publicacionForm.patchValue({
          titulo: pub.titulo,
          categoria_id: pub.categoria_id,
          sub_categoria: pub.sub_categoria,
          colaboradores: pub.colaboradores,
          descripcion_investigacion: pub.descripcion_investigacion,
          sintesis_ia: pub.sintesis_ia,
          links_referencia: pub.links_referencia,
          videos_url: pub.videos_url
        });
        // Vista previa de la imagen actual
        this.imgPreview = `http://localhost:3000/publicacion/${id}/imagen`;
      },
      error: (err) => {
        console.error('Error al cargar la investigación', err);
        this.showToast('No se encontró la investigación', 'danger');
        this.router.navigate(['/investigador/inicio']);
      }
    });
  }

  async onSubmit() {
    if (this.publicacionForm.invalid) {
      this.showToast('Por favor verifica los requisitos (Título min 5, Descripción min 30 palabras)', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...',
    });
    await loading.present();

    // Solo enviamos los campos que tienen valor
    const dataToUpdate = { ...this.publicacionForm.value };

    this.publicacionesService.actualizarPublicacion(this.publicacionId!, dataToUpdate).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('¡Investigación actualizada con éxito!', 'success');
        this.router.navigate(['/investigador/tabs/inicio']);
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al actualizar', err);
        this.showToast('Error al actualizar la investigación', 'danger');
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
