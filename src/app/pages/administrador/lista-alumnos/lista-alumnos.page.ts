import { Component, OnInit, inject } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-lista-alumnos',
    templateUrl: './lista-alumnos.page.html',
    styleUrls: ['./lista-alumnos.page.scss'],
    standalone: false
})
export class ListaAlumnosPage implements OnInit {

    private usuariosService = inject(UsuariosService);
    private navCtrl = inject(NavController);
    private alertCtrl = inject(AlertController);
    private toastCtrl = inject(ToastController);

    alumnos: any[] = [];
    alumnosFiltrados: any[] = [];
    cargando: boolean = true;
    termino: string = '';
    readonly API_URL = 'http://localhost:3000';

    constructor() { }

    ngOnInit() {
        this.cargarAlumnos();
    }

    cargarAlumnos() {
        this.cargando = true;
        this.usuariosService.getTodos().subscribe({
            next: (data) => {
                this.alumnos = data;
                this.alumnosFiltrados = [...data];
                this.cargando = false;
            },
            error: (err) => {
                console.error('Error al cargar alumnos:', err);
                this.cargando = false;
            }
        });
    }

    filtrar(event: any) {
        const val = event.target.value?.toLowerCase() || '';
        this.alumnosFiltrados = this.alumnos.filter(al =>
            (al.nombre + ' ' + al.apellidos + ' ' + al.email).toLowerCase().includes(val)
        );
    }

    getFotoUrl(id: number): string {
        return `${this.API_URL}/usuarios/${id}/foto`;
    }

    async eliminarAlumno(al: any) {
        const alert = await this.alertCtrl.create({
            header: 'Eliminar Alumno',
            message: `¿Estás seguro de eliminar a ${al.nombre} ${al.apellidos}? Esta acción no se puede deshacer.`,
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    handler: () => {
                        this.usuariosService.eliminar(al.id).subscribe({
                            next: () => {
                                this.alumnos = this.alumnos.filter(a => a.id !== al.id);
                                this.alumnosFiltrados = this.alumnosFiltrados.filter(a => a.id !== al.id);
                                this.mostrarToast('Alumno eliminado correctamente', 'success');
                            },
                            error: (err) => {
                                console.error('Error al eliminar:', err);
                                this.mostrarToast('Error al eliminar el alumno', 'danger');
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
