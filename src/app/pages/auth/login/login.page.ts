import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
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
                next: (res) => {
                    loading.dismiss();
                    this.authService.saveToken(res.token);
                    this.authService.saveUser(res.user);
                    this.showToast('¡Bienvenido Administrador!', 'success');
                    this.router.navigate(['/administrador']);
                },
                error: (err) => {
                    loading.dismiss();
                    console.error('Error detallado:', err);
                    if (err.status === 0) {
                        this.showToast('Error de conexión: Verifica que tu backend NestJS esté encendido y tenga CORS habilitado.', 'danger');
                    } else {
                        this.showToast('Credenciales incorrectas o error en el servidor', 'danger');
                    }
                }
            });
        } else if (this.selectedUserType === 'researcher') {
            // Navegar al inicio del investigador (pendiente conectar backend)
            loading.dismiss();
            this.router.navigate(['/investigador']);
        } else if (this.selectedUserType === 'student') {
            // Navegar al inicio del estudiante (pendiente conectar backend)
            loading.dismiss();
            this.router.navigate(['/estudiante']);
        } else {
            loading.dismiss();
            console.log('Funcionalidad para otros roles en desarrollo');
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
