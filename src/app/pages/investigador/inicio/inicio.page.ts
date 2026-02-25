import { Component, OnInit, inject } from '@angular/core';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { EventosService } from '../../../servicios/eventos.service';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalComentariosComponent } from './componentes/modal-comentarios/modal-comentarios.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {
  private publicacionesService = inject(PublicacionesService);
  private eventosService = inject(EventosService);
  private investigadorService = inject(InvestigadorService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  publications: any[] = [];
  events: any[] = [];
  investigadorId: number | undefined = undefined;

  constructor() { }

  async ngOnInit() {
    await this.investigadorService.ready;
    const user = this.investigadorService.getLoggedUser();
    console.log('Investigador cargado en ngOnInit:', user);

    if (user) {
      this.investigadorId = user.id;
      this.cargarDatos();
    }
  }

  async ionViewWillEnter() {
    await this.investigadorService.ready;
    const user = this.investigadorService.getLoggedUser();
    console.log('Investigador en ionViewWillEnter:', user);

    if (user) {
      this.investigadorId = user.id;
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (!this.investigadorId) {
      console.warn('No se pueden cargar datos: investigadorId es nulo');
      return;
    }

    console.log('Cargando publicaciones y eventos para ID:', this.investigadorId);

    // Cargar mis publicaciones
    this.publicacionesService.getMisPublicaciones(this.investigadorId).subscribe({
      next: (res) => {
        console.log('Publicaciones recibidas:', res);
        this.publications = res;
      },
      error: (err) => console.error('Error al cargar publicaciones', err)
    });

    // Cargar mis eventos
    this.eventosService.getMisEventosById(this.investigadorId).subscribe({
      next: (res) => {
        console.log('Eventos recibidos:', res);
        this.events = res.eventos || [];
      },
      error: (err) => console.error('Error al cargar eventos', err)
    });
  }

  getImagenUrl(pubId: number) {
    return `http://localhost:3000/publicacion/${pubId}/imagen`;
  }

  getEventoImagenUrl(eventoId: number) {
    return `http://localhost:3000/eventos/${eventoId}/imagen`;
  }

  editPublication(pub: any) {
    this.router.navigate(['/investigador/publicacion-edit', pub.id]);
  }

  editEvent(event: any) {
    this.router.navigate(['/investigador/eventos-edit', event.id]);
  }

  async deletePublication(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Publicación',
      message: '¿Estás seguro de que deseas eliminar esta investigación? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.publicacionesService.eliminarPublicacion(id).subscribe({
              next: () => {
                this.publications = this.publications.filter(p => p.id !== id);
                this.showToast('Investigación eliminada con éxito', 'success');
              },
              error: (err) => {
                console.error('Error al eliminar', err);
                this.showToast('Error al eliminar la investigación', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteEvent(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Evento',
      message: '¿Estás seguro de que deseas eliminar este evento?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eventosService.eliminarEvento(id).subscribe({
              next: () => {
                this.events = this.events.filter(e => e.id !== id);
                this.showToast('Evento eliminado con éxito', 'success');
              },
              error: (err) => {
                console.error('Error al eliminar evento', err);
                this.showToast('Error al eliminar el evento', 'danger');
              }
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
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async verComentarios(pub: any) {
    const modal = await this.modalCtrl.create({
      component: ModalComentariosComponent,
      componentProps: {
        publicacion: pub,
        investigadorId: this.investigadorId
      },
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8
    });
    return await modal.present();
  }
}
