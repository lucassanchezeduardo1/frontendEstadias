import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestigadorPage } from './investigador.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: InvestigadorPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'publicacion',
        loadChildren: () => import('./publicacion/publicacion.module').then(m => m.PublicacionPageModule)
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
    path: '',
    redirectTo: 'tabs/inicio',
    pathMatch: 'full'
  },
  {
    path: 'publicacion-edit/:id',
    loadChildren: () => import('./publicacion-edit/publicacion-edit.module').then(m => m.PublicacionEditPageModule)
  },
  {
    path: 'eventos-edit/:id',
    loadChildren: () => import('./eventos-edit/eventos-edit.module').then(m => m.EventosEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestigadorPageRoutingModule { }
