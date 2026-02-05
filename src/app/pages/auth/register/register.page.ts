import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: false
})
export class RegisterPage implements OnInit {

    selectedUserType: 'student' | 'researcher' = 'student';
    showPassword: boolean = false;

    // Instituciones ficticias para el dropdown
    institutions = [
        'UNAM',
        'IPN',
        'Tec de Monterrey',
        'UAM',
        'UAEM'
    ];

    constructor(private router: Router) { }

    ngOnInit() {
    }

    selectUserType(type: 'student' | 'researcher') {
        this.selectedUserType = type;
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    onRegister() {
        console.log('Registro enviado para:', this.selectedUserType);
        // Simulación de éxito
        alert('Registro exitoso. Si eres investigador, debes esperar aprobación del administrador.');
        this.router.navigate(['/login']);
    }

}
