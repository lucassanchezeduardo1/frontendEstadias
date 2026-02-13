import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { AiService } from '../../../servicios/ai.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

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
            console.error(err);
            this.isGeneratingAiSummary = false;
            loading.dismiss();
            this.showToast('Error al generar síntesis con IA. Verifica la clave de API.', 'danger');
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isGeneratingAiSummary = false;
        loading.dismiss();
        this.showToast('Error al leer el texto del PDF', 'danger');
      }
    });
  }

  async onSubmit() {
    if (this.publicacionForm.invalid || !this.selectedPdf || !this.selectedImg) {
      this.showToast('Por favor completa todos los campos requeridos y sube los archivos', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Publicando investigación...',
    });
    await loading.present();

    this.publicacionesService.crearPublicacion(
      this.publicacionForm.value,
      this.selectedPdf,
      this.selectedImg
    ).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('¡Investigación publicada con éxito!', 'success');
        this.router.navigate(['/investigador/inicio']);
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al publicar', err);
        this.showToast('Error al publicar la investigación', 'danger');
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
