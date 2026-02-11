import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { Administrador } from '../../../modelos/administrador.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  private router = inject(Router);
  private authService = inject(AutenticacionService);

  // Almacenar datos del administrador real
  admin: Administrador | null = null;

  constructor() { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.admin = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
