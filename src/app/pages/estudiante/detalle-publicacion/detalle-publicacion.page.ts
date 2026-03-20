import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { ComentarioService } from '../../../servicios/comentarios.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { PruebasIaService } from '../../../servicios/pruebas-ia.service';
import { NavController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { ExamenIaComponent } from './examen-ia/examen-ia.component';
import { environment } from '../../../../environments/environment';
import { Publicacion } from '../../../modelos/publicacion.interface';
import { Browser } from '@capacitor/browser';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
    selector: 'app-detalle-publicacion',
    templateUrl: './detalle-publicacion.page.html',
    styleUrls: ['./detalle-publicacion.page.scss'],
    standalone: false
})
export class DetallePublicacionPage implements OnInit, OnDestroy {

    publicacion: Publicacion | null = null;
    nuevoComentario: string = '';
    usuarioActual: any = null;
    cargando: boolean = true;
    enviando: boolean = false;
    error: boolean = false;
    readonly API_URL = environment.apiUrl;

    // Para la lectura por voz (Nativa con Capacitor)
    reproduciendo: 'investigador' | 'ia' | null = null;

    constructor(
        private route: ActivatedRoute,
        private publicacionesService: PublicacionesService,
        private comentarioService: ComentarioService,
        private usuariosService: UsuariosService,
        private pruebasService: PruebasIaService,
        private navCtrl: NavController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
    ) { }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.usuarioActual = this.usuariosService.getUser();

        if (id) {
            const pubId = Number(id);
            this.cargarDetalle(pubId);
        } else {
            this.error = true;
            this.cargando = false;
        }
    }

    cargarDetalle(id: number) {
        this.cargando = true;
        this.error = false;
        this.publicacionesService.getPublicacion(id).subscribe({
            next: (data) => {
                this.publicacion = data;
                this.cargando = false;
                // Incrementar vistas al entrar
                this.publicacionesService.incrementarVistas(data.id).subscribe();
            },
            error: (err) => {
                console.error('Error al cargar detalle:', err);
                this.error = true;
                this.cargando = false;
            }
        });
    }


    async enviarComentario() {
        if (!this.nuevoComentario.trim() || !this.publicacion) return;
        if (!this.usuarioActual) {
            this.mostrarToast('Debes iniciar sesión para comentar', 'warning');
            return;
        }

        this.enviando = true;
        const datos = {
            contenido: this.nuevoComentario,
            publicacion_id: this.publicacion.id,
            usuario_id: this.usuarioActual.id
        };

        this.comentarioService.crearComentario(datos).subscribe({
            next: (res) => {
                this.nuevoComentario = '';
                this.mostrarToast('Comentario enviado con éxito', 'success');
                this.enviando = false;
            },
            error: (err) => {
                console.error('Error al enviar comentario:', err);
                this.mostrarToast('Error al enviar el comentario', 'danger');
                this.enviando = false;
            }
        });
    }

    async mostrarToast(mensaje: string, color: string) {
        const toast = await this.toastCtrl.create({
            message: mensaje,
            duration: 2000,
            color: color,
            position: 'bottom'
        });
        toast.present();
    }

    regresar() {
        this.navCtrl.back();
    }

    async descargarPdf() {
        if (!this.publicacion || !this.publicacion.id) return;

        const alert = await this.alertCtrl.create({
            header: 'Acceso Restringido',
            subHeader: 'Por favor, introduce el código de acceso para ver y descargar el documento.',
            inputs: [
                {
                    name: 'codigo',
                    type: 'password',
                    placeholder: 'Introduce el código...'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Confirmar',
                    handler: async (data) => {
                        if (data.codigo === 'Ab3j4') {
                            // Incrementar contador en el backend
                            this.publicacionesService.incrementarDescargas(this.publicacion!.id).subscribe();

                            // Abrir PDF con Capacitor Browser
                            const url = `${this.API_URL}/publicacion/${this.publicacion!.id}/pdf?codigo=${data.codigo}`;
                            
                            try {
                                await Browser.open({ url });
                                this.mostrarToast('Abriendo documento...', 'success');
                            } catch (error) {
                                console.error('Error al abrir el navegador:', error);
                                // Fallback a window.open si algo falla
                                window.open(url, '_blank');
                            }
                            return true;
                        } else {
                            this.mostrarToast('Código incorrecto. No tienes permiso para descargar este archivo.', 'danger');
                            return false;
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    async abrirEnlaceExterno(url: string) {
        if (!url) return;
        try {
            await Browser.open({ url });
        } catch (error) {
            console.error('Error al abrir enlace:', error);
            window.open(url, '_blank');
        }
    }

    /** Convierte un string separado por comas en un array de strings limpios */
    parseLista(valor: string): string[] {
        if (!valor) return [];
        return valor.split(',').map(v => v.trim()).filter(v => v.length > 0);
    }

    formatearFecha(fechaIso: string): string {
        if (!fechaIso) return '';
        const fecha = new Date(fechaIso);
        return fecha.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    getImagenContenidoUrl(id: number): string {
        return `${this.API_URL}/publicacion/${id}/imagen-contenido`;
    }

    /** Control de lectura por voz nativa */
    async escucharSintesis(texto: string, tipo: 'investigador' | 'ia') {
        // Si ya se está reproduciendo lo mismo, detenerlo
        if (this.reproduciendo === tipo) {
            await TextToSpeech.stop();
            this.reproduciendo = null;
            return;
        }

        // Detener cualquier reproducción anterior antes de iniciar la nueva
        await TextToSpeech.stop();

        try {
            this.reproduciendo = tipo;
            await TextToSpeech.speak({
                text: texto,
                lang: 'es-MX',
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0,
                category: 'ambient',
            });
            // Una vez que termina de hablar
            this.reproduciendo = null;
        } catch (error) {
            console.error('Error en TTS:', error);
            this.reproduciendo = null;
            this.mostrarToast('Error al iniciar la lectura por voz', 'danger');
        }
    }

    /** Logic for AI Test */
    async abrirTest() {
        if (!this.usuarioActual) {
            this.mostrarToast('Debes iniciar sesión para realizar el test', 'warning');
            return;
        }

        const puedeSiguente = await this.pruebasService.puedeGenerarTest(this.usuarioActual.id);

        if (!puedeSiguente) {
            const restantes = await this.pruebasService.obtenerIntentosRestantes(this.usuarioActual.id);
            this.mostrarToast('Has alcanzado el límite de 2 tests por día.', 'danger');
            return;
        }

        const modal = await this.modalCtrl.create({
            component: ExamenIaComponent,
            componentProps: {
                publicacion: this.publicacion,
                usuarioId: this.usuarioActual.id
            }
        });

        return await modal.present();
    }

    ngOnDestroy() {
        // Asegurar que el audio se detenga al salir de la página
        TextToSpeech.stop();
    }
}
