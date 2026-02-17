import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { AiService } from '../../../servicios/ai.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
  standalone: false,
})
export class PublicacionPage implements OnInit {
  private fb = inject(FormBuilder);
  private publicacionesService = inject(PublicacionesService);
  private aiService = inject(AiService);
  private categoriasService = inject(CategoriasService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  publicacionId: number | null = null;
  isEditMode = false;

  publicacionForm!: FormGroup;
  categorias: any[] = [];
  selectedPdf: File | null = null;
  selectedImg: File | null = null;
  pdfPreview: string | null = null;
  imgPreview: string | null = null;

  isGeneratingAiSummary = false;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.cargarCategorias();

    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicacionId = +id;
      this.isEditMode = true;
      this.cargarPublicacion(this.publicacionId);
    }
  }

  cargarPublicacion(id: number) {
    this.publicacionesService.getPublicacion(id).subscribe({
      next: (pub) => {
        this.publicacionForm.patchValue({
          titulo: pub.titulo,
          categoria_id: pub.categoria_id,
          sub_categoria: pub.sub_categoria,
          colaboradores: pub.colaboradores,
          sintesis_investigador: pub.sintesis_investigador,
          sintesis_ia: pub.sintesis_ia,
          links_referencia: pub.links_referencia,
          videos_url: pub.videos_url,
          investigador_principal_id: pub.investigador_principal_id
        });
        this.imgPreview = `http://localhost:3000/publicacion/${id}/imagen`;
      },
      error: (err) => console.error('Error al cargar publicación', err)
    });
  }

  initForm() {
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      categoria_id: ['', [Validators.required]],
      sub_categoria: ['', [Validators.required, Validators.minLength(3)]],
      colaboradores: [''],
      sintesis_investigador: ['', [Validators.required, Validators.minLength(500)]],
      sintesis_ia: [''],
      links_referencia: [''],
      videos_url: [''],
      investigador_principal_id: [1] // ID temporal, debería venir del usuario logueado
    });

    // Intentar obtener el ID del investigador logueado
    const invUser = localStorage.getItem('inv_user');
    if (invUser) {
      const user = JSON.parse(invUser);
      this.publicacionForm.patchValue({ investigador_principal_id: user.id });
    }
  }

  resetForm() {
    this.initForm(); // Reinicializa con el ID del investigador y valores por defecto
    this.selectedPdf = null;
    this.selectedImg = null;
    this.pdfPreview = null;
    this.imgPreview = null;
    this.isGeneratingAiSummary = false;
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  async onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdf = file;
      this.pdfPreview = file.name;

      // Generar síntesis con IA automáticamente
      await this.generarSintesisIA(file);
    } else {
      this.showToast('Por favor selecciona un archivo PDF válido', 'warning');
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
    } else {
      this.showToast('Por favor selecciona una imagen válida', 'warning');
    }
  }

  async generarSintesisIA(file: File) {
    if (this.isGeneratingAiSummary) return;

    this.isGeneratingAiSummary = true;
    const loading = await this.loadingCtrl.create({
      message: 'Analizando PDF con IA...',
      spinner: 'crescent'
    });
    await loading.present();

    this.aiService.extraerTextoPdf(file).subscribe({
      next: (texto) => {
        this.aiService.generarSintesis(texto).subscribe({
          next: (sintesis) => {
            this.publicacionForm.patchValue({ sintesis_ia: sintesis });
            this.isGeneratingAiSummary = false;
            loading.dismiss();
            this.showToast('Síntesis de IA generada con éxito', 'success');
          },
          error: (err) => {
            this.isGeneratingAiSummary = false;
            loading.dismiss();
            const msg = err.message || 'Error al generar síntesis con IA.';
            this.showToast(msg, 'danger');
          }
        });
      },
      error: (err) => {
        this.isGeneratingAiSummary = false;
        loading.dismiss();
        this.showToast('Error al leer el texto del PDF', 'danger');
      }
    });
  }

  reintentarSintesis() {
    if (this.selectedPdf) {
      this.generarSintesisIA(this.selectedPdf);
    } else {
      this.showToast('Primero selecciona un archivo PDF', 'warning');
    }
  }

  async onSubmit() {
    if (this.publicacionForm.invalid) {
      this.showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    if (!this.isEditMode && (!this.selectedPdf || !this.selectedImg)) {
      this.showToast('Debe subir el PDF y la imagen de portada', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Actualizando investigación...' : 'Publicando investigación...',
    });
    await loading.present();

    if (this.isEditMode) {
      this.publicacionesService.actualizarPublicacion(this.publicacionId!, this.publicacionForm.value).subscribe({
        next: () => {
          loading.dismiss();
          this.showToast('¡Investigación actualizada con éxito!', 'success');
          this.router.navigate(['/investigador/inicio']);
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error al actualizar', err);
          this.showToast('Error al actualizar la investigación', 'danger');
        }
      });
    } else {
      this.publicacionesService.crearPublicacion(
        this.publicacionForm.value,
        this.selectedPdf!,
        this.selectedImg!
      ).subscribe({
        next: (res) => {
          loading.dismiss();
          this.showToast('¡Investigación publicada con éxito!', 'success');
          this.resetForm();
          this.router.navigate(['/investigador/inicio']);
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error al publicar', err);
          this.showToast('Error al publicar la investigación', 'danger');
        }
      });
    }
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
