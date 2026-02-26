import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InstitucionesService } from '../../../servicios/instituciones.service';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { Institucion } from '../../../modelos/institucion.interface';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: false
})
export class RegisterPage implements OnInit {

    private router = inject(Router);
    private instService = inject(InstitucionesService);
    private invService = inject(InvestigadorService);
    private usrService = inject(UsuariosService);
    private toastCtrl = inject(ToastController);
    private loadingCtrl = inject(LoadingController);

    selectedUserType: 'student' | 'researcher' = 'student';
    showPassword: boolean = false;

    // Lista de instituciones
    institutions: Institucion[] = [];

    // Objeto para registro de investigador
    newInvestigador: any = {
        nombre: '',
        apellidos: '',
        grado_academico: '',
        cargo_actual: '',
        direccion_oficina: '',
        horario_atencion: '',
        email: '',
        password: '',
        matricula: '',
        institucion_id: null,
        google_academico_url: '',
        researchgate_url: '',
        descripcion_trayectoria: '',
        areas_investigacion: ''
    };

    // Objeto para registro de estudiante
    newEstudiante: any = {
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        oficio: '',
        grado_academico: '',
        edad: null
    };

    selectedFile: File | null = null;

    constructor() { }

    ngOnInit() {
        this.cargarInstituciones();
    }

    cargarInstituciones() {
        this.instService.getInstituciones().subscribe({
            next: (data) => this.institutions = data,
            error: (err) => console.error('Error cargando instituciones', err)
        });
    }

    selectUserType(type: 'student' | 'researcher') {
        this.selectedUserType = type;
        this.selectedFile = null;
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    async onRegister() {
        if (this.selectedUserType === 'researcher') {
            await this.registerInvestigador();
        } else {
            await this.registerEstudiante();
        }
    }

    async registerEstudiante() {
        if (!this.selectedFile) {
            this.showToast('Debes subir una foto de perfil', 'warning');
            return;
        }

        if (!this.newEstudiante.nombre || !this.newEstudiante.email || !this.newEstudiante.password || !this.newEstudiante.edad) {
            this.showToast('Por favor completa los campos obligatorios', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Registrando estudiante...' });
        await loading.present();

        this.usrService.registrar(this.newEstudiante, this.selectedFile).subscribe({
            next: (res) => {
                loading.dismiss();
                this.showToast('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                loading.dismiss();
                console.error('Error registro estudiante:', err);
                const msg = err.error?.message || 'Error al registrar. Verifica tus datos.';
                this.showToast(msg, 'danger');
            }
        });
    }

    async registerInvestigador() {
        if (!this.selectedFile) {
            this.showToast('Debes subir una foto de perfil', 'warning');
            return;
        }

        if (!this.newInvestigador.nombre || !this.newInvestigador.email || !this.newInvestigador.password) {
            this.showToast('Por favor completa los campos obligatorios', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Enviando solicitud...' });
        await loading.present();

        this.invService.registrar(this.newInvestigador, this.selectedFile).subscribe({
            next: (res) => {
                loading.dismiss();
                this.showToast('¡Solicitud enviada! Espera la aprobación del administrador.', 'success');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                loading.dismiss();
                console.error('Error registro:', err);
                const msg = err.error?.message || 'Error al registrar. Verifica tus datos.';
                this.showToast(msg, 'danger');
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
