import { Component, OnInit, inject } from '@angular/core';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { InstitucionesService } from '../../../servicios/instituciones.service';
import { CategoriasService } from '../../../servicios/categorias.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { Investigador } from '../../../modelos/investigador.interface';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {

  private invService = inject(InvestigadorService);
  private instService = inject(InstitucionesService);
  private catService = inject(CategoriasService);
  private usuariosService = inject(UsuariosService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private router = inject(Router);

  // Estadísticas rápidas
  stats = {
    totalResearchers: 0,
    totalInstitutions: 0,
    totalCategories: 0,
    totalStudents: 0
  };

  // Solicitudes pendientes reales
  researcherRequests: Investigador[] = [];

  // Modal Detalles
  selectedResearcher: Investigador | null = null;
  isModalOpen = false;

  // URL base del API para imágenes
  readonly API_URL = `${environment.apiUrl}/investigador`;

  // Cache de Instituciones
  instituciones: any[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarDatosDashboard();
  }


  getInstitutionName(id: number): string {
    const inst = this.instituciones.find(i => i.id === id);
    return inst ? inst.nombre : `ID: ${id}`;
  }


  async viewDetails(investigador: Investigador) {
    if (!investigador.id) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando detalles...',
      spinner: 'circles',
      duration: 5000 // Timeout de seguridad
    });
    await loading.present();

    this.invService.getInvestigador(investigador.id).subscribe({
      next: (fullData) => {
        this.selectedResearcher = fullData;
        this.isModalOpen = true;
        loading.dismiss();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error cargando detalles:', err);
        this.showToast('No se pudieron cargar los detalles completos', 'warning');
        // Si hay error, mostramos al menos lo básico que tenemos
        this.selectedResearcher = investigador;
        this.isModalOpen = true;
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedResearcher = null;
  }


  getProfileImage(investigador: Investigador): string {
    const foto = investigador.foto_perfil;
    if (!foto) return 'assets/images/default-avatar.png';

    // Si viene como buffer byte array e.g. { type: 'Buffer', data: [...] }
    if (foto && typeof foto === 'object' && (foto as any).type === 'Buffer' && (foto as any).data) {
      const binary = String.fromCharCode(...(foto as any).data);
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }

    // Si ya es una URL completa o datos base64
    if (typeof foto === 'string' && (foto.startsWith('http') || foto.startsWith('data:'))) {
      return foto;
    }

    // Para cualquier otro caso (ID de Google Drive, string corto, etc.)
    // delegamos al endpoint del backend que sabe cómo obtener la foto
    if (investigador.id) {
      return `${environment.apiUrl}/investigador/${investigador.id}/foto`;
    }

    return 'assets/images/default-avatar.png';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }

  async cargarDatosDashboard() {
    // Cargar Investigadores Pendientes
    this.invService.getPendientes().subscribe({
      next: (data) => {
        this.researcherRequests = data.items;
      },
      error: (err) => {
        console.error('Error al cargar pendientes:', err);
      }
    });

    // Cargar Estadísticas
    this.instService.getInstituciones().subscribe(data => {
      this.instituciones = data;
      this.stats.totalInstitutions = data.length;
    });
    this.catService.getCategorias().subscribe(data => this.stats.totalCategories = data.length);
    this.invService.getAprobados().subscribe(data => this.stats.totalResearchers = data.total);
    this.usuariosService.getTodos().subscribe({
      next: (data) => this.stats.totalStudents = data.total,
      error: () => this.stats.totalStudents = 0
    });
  }

  //Aprobar solicitud
  async approveRequest(id: number | undefined) {
    if (!id) return;

    const loading = await this.loadingCtrl.create({ message: 'Aprobando...' });
    await loading.present();

    this.invService.aprobar(id).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Investigador aprobado correctamente', 'success');
        this.cargarDatosDashboard();
      },
      error: () => {
        loading.dismiss();
        this.showToast('Error al aprobar solicitud', 'danger');
      }
    });
  }

  //Rechazar solicitud
  async rejectRequest(id: number | undefined) {
    if (!id) return;

    const alert = await this.alertCtrl.create({
      header: 'Rechazar Solicitud',
      message: '¿Estás seguro de que deseas rechazar este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Rechazar',
          cssClass: 'alert-danger',
          handler: () => {
            this.invService.rechazar(id).subscribe(() => {
              this.showToast('Solicitud rechazada', 'warning');
              this.cargarDatosDashboard();
            });
          }
        }
      ]
    });
    await alert.present();
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

  navegarA(tab: string) {
    this.router.navigate(['/administrador', tab]);
  }
}
