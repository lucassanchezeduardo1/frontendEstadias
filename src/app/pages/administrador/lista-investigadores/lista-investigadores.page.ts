import { Component, OnInit, inject } from '@angular/core';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-lista-investigadores',
    templateUrl: './lista-investigadores.page.html',
    styleUrls: ['./lista-investigadores.page.scss'],
    standalone: false
})
export class ListaInvestigadoresPage implements OnInit {

    private invService = inject(InvestigadorService);
    private navCtrl = inject(NavController);
    private alertCtrl = inject(AlertController);
    private toastCtrl = inject(ToastController);

    investigadores: any[] = [];
    investigadoresFiltrados: any[] = [];
    cargando: boolean = true;
    termino: string = '';
    readonly API_URL = 'http://localhost:3000';

    constructor() { }

    ngOnInit() {
        this.cargarInvestigadores();
    }

    cargarInvestigadores() {
        this.cargando = true;
        this.invService.getTodos().subscribe({
            next: (data: any[]) => {
                // Todos los investigadores
                this.investigadores = data.map((inv: any) => {
                    let estadoLabel = 'Pendiente';
                    const st = inv.estado?.toLowerCase();
                    if (st === 'aprobado') estadoLabel = 'Aprobado';
                    else if (st === 'rechazado') estadoLabel = 'Rechazado';

                    return { ...inv, estadoLabel };
                });
                this.investigadoresFiltrados = [...this.investigadores];
                this.cargando = false;
            },
            error: (err: any) => {
                console.error('Error al cargar investigadores:', err);
                this.cargando = false;
            }
        });
    }

    filtrar(event: any) {
        const val = event.target.value?.toLowerCase() || '';
        this.investigadoresFiltrados = this.investigadores.filter(inv =>
            (inv.nombre + ' ' + inv.apellidos + ' ' + inv.email).toLowerCase().includes(val)
        );
    }

    getFotoUrl(id: number): string {
        return `${this.API_URL}/investigador/${id}/foto`;
    }

    async eliminarInvestigador(inv: any) {
        const alert = await this.alertCtrl.create({
            header: 'Eliminar Investigador',
            message: `¿Estás seguro de eliminar a ${inv.nombre} ${inv.apellidos}? Esta acción no se puede deshacer.`,
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    cssClass: 'alert-danger',
                    handler: () => {
                        this.invService.eliminar(inv.id).subscribe({
                            next: () => {
                                this.investigadores = this.investigadores.filter(i => i.id !== inv.id);
                                this.investigadoresFiltrados = this.investigadoresFiltrados.filter(i => i.id !== inv.id);
                                this.mostrarToast('Investigador eliminado correctamente', 'success');
                            },
                            error: (err: any) => {
                                console.error('Error al eliminar:', err);
                                this.mostrarToast('Error al eliminar el investigador', 'danger');
                            }
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    regresar() {
        this.navCtrl.back();
    }

    async mostrarToast(mensaje: string, color: string) {
        const toast = await this.toastCtrl.create({
            message: mensaje,
            duration: 2500,
            color,
            position: 'bottom'
        });
        toast.present();
    }
}
