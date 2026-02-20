import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstudiantePage } from './estudiante.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: EstudiantePage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'directorios',
        loadChildren: () => import('./directorios/directorios.module').then(m => m.DirectoriosPageModule)
      },
      {
        path: 'eventos',
        loadChildren: () => import('./eventos/eventos.module').then(m => m.EventosPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'detalle-publicacion/:id',
    loadChildren: () => import('./detalle-publicacion/detalle-publicacion.module').then(m => m.DetallePublicacionPageModule)
  },
  {
    path: '',
    redirectTo: 'tabs/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstudiantePageRoutingModule { }
