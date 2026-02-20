import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-detalle-publicacion',
    templateUrl: './detalle-publicacion.page.html',
    styleUrls: ['./detalle-publicacion.page.scss'],
    standalone: false
})
export class DetallePublicacionPage implements OnInit {

    publicacion: any = null;
    cargando: boolean = true;
    error: boolean = false;
    readonly API_URL = 'http://localhost:3000';

    constructor(
        private route: ActivatedRoute,
        private publicacionesService: PublicacionesService,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.cargarDetalle(Number(id));
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
}
