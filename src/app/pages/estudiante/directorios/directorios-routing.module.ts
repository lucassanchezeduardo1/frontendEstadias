import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectoriosPage } from './directorios.page';

const routes: Routes = [
  {
    path: '',
    component: DirectoriosPage
  },
  {
    path: ':id',
    loadChildren: () => import('./investigador-detalle/investigador-detalle.module').then(m => m.InvestigadorDetallePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectoriosPageRoutingModule { }
