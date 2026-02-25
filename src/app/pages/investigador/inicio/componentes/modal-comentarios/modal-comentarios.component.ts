import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComentarioService } from '../../../../../servicios/comentarios.service';

@Component({
    selector: 'app-modal-comentarios',
    templateUrl: './modal-comentarios.component.html',
    styleUrls: ['./modal-comentarios.component.scss'],
    standalone: false
})
export class ModalComentariosComponent implements OnInit {
    @Input() publicacion: any;
    @Input() investigadorId: number | undefined;

    comentarios: any[] = [];
    cargando: boolean = true;
    error: boolean = false;

    private modalCtrl = inject(ModalController);
    private comentarioService = inject(ComentarioService);

    constructor() { }

    ngOnInit() {
        if (this.publicacion && this.publicacion.id) {
            this.cargarComentarios();
        }
    }

    cargarComentarios() {
        this.cargando = true;
        this.error = false;
        this.comentarioService
            .getComentariosPorPublicacion(this.publicacion.id, this.investigadorId)
            .subscribe({
                next: (res) => {
                    this.comentarios = res;
                    this.cargando = false;
                },
                error: (err) => {
                    console.error('Error al cargar comentarios:', err);
                    this.error = true;
                    this.cargando = false;
                }
            });
    }

    cerrar() {
        this.modalCtrl.dismiss();
    }

    formatearFecha(fechaIso: string): string {
        if (!fechaIso) return '';
        const fecha = new Date(fechaIso);
        return fecha.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
