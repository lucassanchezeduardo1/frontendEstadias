import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { ComentarioService } from '../../../servicios/comentarios.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-detalle-publicacion',
    templateUrl: './detalle-publicacion.page.html',
    styleUrls: ['./detalle-publicacion.page.scss'],
    standalone: false
})
export class DetallePublicacionPage implements OnInit, OnDestroy {

    publicacion: any = null;
    nuevoComentario: string = '';
    usuarioActual: any = null;
    cargando: boolean = true;
    enviando: boolean = false;
    error: boolean = false;
    readonly API_URL = 'http://localhost:3000';

    // Para la lectura por voz
    reproduciendo: 'investigador' | 'ia' | null = null;
    synth = window.speechSynthesis;
    utterance: SpeechSynthesisUtterance | null = null;

    constructor(
        private route: ActivatedRoute,
        private publicacionesService: PublicacionesService,
        private comentarioService: ComentarioService,
        private usuariosService: UsuariosService,
        private navCtrl: NavController,
        private toastCtrl: ToastController
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
        if (!this.nuevoComentario.trim()) return;
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

    descargarPdf() {
        if (this.publicacion && this.publicacion.id) {
            // Incrementar contador en el backend de forma silenciosa
            this.publicacionesService.incrementarDescargas(this.publicacion.id).subscribe();

            const url = `${this.API_URL}/publicacion/${this.publicacion.id}/pdf`;
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

    /** Control de lectura por voz */
    escucharSintesis(texto: string, tipo: 'investigador' | 'ia') {
        // Si ya se está reproduciendo lo mismo, detenerlo
        if (this.reproduciendo === tipo) {
            this.synth.cancel();
            this.reproduciendo = null;
            return;
        }

        // Detener cualquier reproducción anterior
        this.synth.cancel();

        this.utterance = new SpeechSynthesisUtterance(texto);
        this.utterance.lang = 'es-MX';
        this.utterance.rate = 1;

        // Intentar buscar una voz en español
        const voces = this.synth.getVoices();
        const vozEspañol = voces.find(v => v.lang.includes('es'));
        if (vozEspañol) this.utterance.voice = vozEspañol;

        this.utterance.onend = () => {
            this.reproduciendo = null;
        };

        this.utterance.onerror = () => {
            this.reproduciendo = null;
        };

        this.reproduciendo = tipo;
        this.synth.speak(this.utterance);
    }

    ngOnDestroy() {
        // Asegurar que el audio se detenga al salir de la página
        if (this.synth) {
            this.synth.cancel();
        }
    }
}
