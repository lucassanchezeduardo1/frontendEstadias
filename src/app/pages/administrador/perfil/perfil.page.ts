import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  private router = inject(Router);
  private authService = inject(AutenticacionService);

  constructor() { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
