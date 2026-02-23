import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { AiService } from '../../../servicios/ai.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { InvestigadorService } from '../../../servicios/investigador.service';
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
  private investigadorService = inject(InvestigadorService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private router = inject(Router);

  publicacionForm!: FormGroup;
  categorias: any[] = [];
  selectedPdf: File | null = null;
  selectedImg: File | null = null;
  selectedImgContenido: File | null = null;
  pdfPreview: string | null = null;
  imgPreview: string | null = null;
  imgContenidoPreview: string | null = null;

  isGeneratingAiSummary = false;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.cargarCategorias();
    this.syncUser();
  }

  async syncUser() {
    await this.investigadorService.ready;
    const user = this.investigadorService.getLoggedUser();
    if (user) {
      this.publicacionForm.patchValue({ investigador_principal_id: user.id });
    }
  }

  initForm() {
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      categoria_id: ['', [Validators.required]],
      sub_categoria: ['', [Validators.required, Validators.minLength(3)]],
      colaboradores: [''],
      descripcion_investigacion: ['', [Validators.required]],
      sintesis_ia: [''],
      links_referencia: [''],
      videos_url: [''],
      investigador_principal_id: [null, [Validators.required]]
    });
  }

  resetForm() {
    this.initForm();
    this.syncUser();
    this.selectedPdf = null;
    this.selectedImg = null;
    this.selectedImgContenido = null;
    this.pdfPreview = null;
    this.imgPreview = null;
    this.imgContenidoPreview = null;
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

  onImgContenidoSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImgContenido = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imgContenidoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.showToast('Por favor selecciona una imagen válida para el contenido', 'warning');
    }
  }

  contarPalabras(texto: string): number {
    if (!texto) return 0;
    return texto.trim().split(/\s+/).filter(word => word.length > 0).length;
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
    const desc = this.publicacionForm.get('descripcion_investigacion')?.value || '';
    const wordCount = this.contarPalabras(desc);

    if (this.publicacionForm.invalid || !this.selectedPdf || !this.selectedImg) {
      this.showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    if (wordCount < 30) {
      this.showToast('La descripción de la investigación debe tener al menos 30 palabras. (Tienes ' + wordCount + ')', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Publicando investigación...',
    });
    await loading.present();

    this.publicacionesService.crearPublicacion(
      this.publicacionForm.value,
      this.selectedPdf!,
      this.selectedImg!,
      this.selectedImgContenido || undefined
    ).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('¡Investigación publicada con éxito!', 'success');
        this.resetForm();
        this.router.navigate(['/investigador/tabs/inicio']);
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
