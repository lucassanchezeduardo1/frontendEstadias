import { Component, OnInit, inject } from '@angular/core';
import { FavoritosService } from '../../../servicios/favoritos.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { UsuariosService } from '../../../servicios/usuarios.service';

@Component({
    selector: 'app-favoritos',
    templateUrl: './favoritos.page.html',
    styleUrls: ['./favoritos.page.scss'],
    standalone: false
})
export class FavoritosPage implements OnInit {
    private favoritosService = inject(FavoritosService);
    private router = inject(Router);
    private toastCtrl = inject(ToastController);
    private alertCtrl = inject(AlertController);
    private usuariosService = inject(UsuariosService);

    favoritos: any[] = [];
    cargando: boolean = true;
    apiUrl = 'http://localhost:3000/publicacion';

    constructor() { }

    ngOnInit() {
        this.cargarFavoritos();
    }

    ionViewWillEnter() {
        this.cargarFavoritos();
    }

    async cargarFavoritos() {
        this.cargando = true;
        await this.usuariosService.ready;
        this.favoritosService.getFavoritos().subscribe({
            next: (res: any) => {
                // El backend devuelve { total, favoritos: [...] }
                // Mapeamos para aplanar la estructura y que coincida con el template
                this.favoritos = res.favoritos.map((f: any) => ({
                    ...f.publicacion,
                    id_favorito: f.id // Por si necesitamos el ID del favorito
                }));
                this.cargando = false;
            },
            error: (err) => {
                console.error('Error al cargar favoritos', err);
                this.cargando = false;
                this.showToast('No se pudieron cargar tus favoritos', 'danger');
            }
        });
    }

    verDetalle(id: number) {
        this.router.navigate(['/estudiante/detalle-publicacion', id]);
    }

    async confirmarEliminar(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Quitar de favoritos',
            message: '¿Estás seguro de que deseas quitar esta publicación de tus favoritos?',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Quitar',
                    handler: () => this.eliminar(id)
                }
            ]
        });
        await alert.present();
    }

    eliminar(publicacionId: number) {
        this.favoritosService.eliminarFavorito(publicacionId).subscribe({
            next: () => {
                this.favoritos = this.favoritos.filter(f => f.id !== publicacionId);
                this.showToast('Publicación quitada de favoritos', 'success');
            },
            error: (err) => {
                console.error('Error al eliminar favorito', err);
                this.showToast('Error al quitar de favoritos', 'danger');
            }
        });
    }

    getImagenUrl(id: number): string {
        return `${this.apiUrl}/${id}/imagen`;
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
