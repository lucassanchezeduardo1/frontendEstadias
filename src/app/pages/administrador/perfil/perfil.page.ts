import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';
import { Administrador } from '../../../modelos/administrador.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  private router = inject(Router);
  private authService = inject(AutenticacionService);
  private alertCtrl = inject(AlertController);

  admin: Administrador | null = null;

  constructor() { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.admin = this.authService.getUser();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, Salir',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

}
