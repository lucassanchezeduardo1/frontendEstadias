import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: false
})
export class LoginPage implements OnInit {

    private router = inject(Router);
    private authService = inject(AutenticacionService);
    private invService = inject(InvestigadorService);
    private usrService = inject(UsuariosService);
    private loadingCtrl = inject(LoadingController);
    private toastCtrl = inject(ToastController);

    // Tipo de usuario seleccionado
    selectedUserType: 'student' | 'researcher' | 'admin' = 'student';

    // Campos del formulario
    usernameOrEmail: string = '';
    password: string = '';
    showPassword: boolean = false;

    constructor() { }

    ngOnInit() {
        // Inicialización de login
    }

    /**
     * Se ejecuta cada vez que la vista entra (útil al regresar tras logout)
     */
    ionViewDidEnter() {
        this.usernameOrEmail = '';
        this.password = '';
    }

    /**
     * Seleccionar tipo de usuario
     */
    selectUserType(type: 'student' | 'researcher' | 'admin') {
        this.selectedUserType = type;
    }

    /**
     * Manejar el envío del formulario de login
     */
    async onLogin() {
        if (!this.usernameOrEmail || !this.password) {
            this.showToast('Por favor completa todos los campos', 'warning');
            return;
        }

        const loading = await this.loadingCtrl.create({
            message: 'Iniciando sesión...',
            spinner: 'circles'
        });
        await loading.present();

        if (this.selectedUserType === 'admin') {
            this.authService.loginAdmin(this.usernameOrEmail, this.password).subscribe({
                next: (res: any) => {
                    loading.dismiss();
                    this.authService.saveToken(res.token);
                    this.authService.saveUser(res.user);
                    this.showToast('¡Bienvenido Administrador!', 'success');
                    this.router.navigate(['/administrador']);
                },
                error: (err: any) => {
                    loading.dismiss();
                    console.error('Error detallado:', err);
                    if (err.status === 0) {
                        this.showToast('Error de conexión', 'danger');
                    } else {
                        this.showToast('Credenciales incorrectas o error en el servidor', 'danger');
                        // Limpiar formulario en caso de error
                        this.password = '';
                    }
                }
            });
        } else if (this.selectedUserType === 'researcher') {
            this.invService.login({ email: this.usernameOrEmail, password: this.password }).subscribe({
                next: (res: any) => {
                    loading.dismiss();
                    // El backend devuelve { message, investigador }
                    const user = res.investigador || res;
                    const token = res.token || 'TOKEN_INV';

                    this.invService.saveSession(user, token);

                    this.showToast('¡Bienvenido Investigador!', 'success');
                    this.router.navigate(['/investigador']);
                },
                error: (err: any) => {
                    loading.dismiss();
                    console.error('Error login investigador:', err);
                    if (err.status === 400 && err.error?.message) {
                        this.showToast(err.error.message, 'warning');
                    } else if (err.status === 401 || err.status === 403) {
                        this.showToast('Credenciales incorrectas', 'danger');
                        this.password = '';
                    } else {
                        this.showToast('Error al iniciar sesión', 'danger');
                        this.password = '';
                    }
                }
            });
        } else if (this.selectedUserType === 'student') {
            this.usrService.login({ email: this.usernameOrEmail, password: this.password }).subscribe({
                next: (res: any) => {
                    loading.dismiss();
                    this.usrService.saveSession(res.usuario, res.token || 'TOKEN_STUDENT');
                    this.showToast('¡Bienvenido Estudiante!', 'success');
                    this.router.navigate(['/estudiante']);
                },
                error: (err: any) => {
                    loading.dismiss();
                    console.error('Error login estudiante:', err);
                    if (err.status === 400 || err.status === 401) {
                        const msg = err.error?.message || 'Credenciales incorrectas';
                        this.showToast(msg, 'danger');
                        this.password = '';
                    } else {
                        this.showToast('Error al conectar con el servidor', 'danger');
                        this.password = '';
                    }
                }
            });
        } else {
            loading.dismiss();
            this.showToast('Funcionalidad para otros roles en desarrollo', 'warning');
        }
    }

    async showToast(message: string, color: 'success' | 'danger' | 'warning') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color,
            position: 'bottom'
        });
        await toast.present();
    }

}
