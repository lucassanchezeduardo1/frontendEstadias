import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: false
})
export class LoginPage implements OnInit {

    // Tipo de usuario seleccionado
    selectedUserType: 'student' | 'researcher' | 'admin' = 'student';

    // Campos del formulario
    email: string = '';
    password: string = '';
    showPassword: boolean = false;

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
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
    onLogin() {
        if (this.email && this.password) {
            console.log('Iniciando sesión como:', this.selectedUserType);

            if (this.selectedUserType === 'admin') {
                // Navegar al panel de administración
                this.router.navigate(['/tabs/tab1']);
            } else {
                console.log('Funcionalidad para otros roles en desarrollo');
            }
        } else {
            console.log('Por favor completa todos los campos');
        }
    }

}
