import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstitucionesPage } from './instituciones.page';

const routes: Routes = [
  {
    path: '',
    component: InstitucionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstitucionesPageRoutingModule {}
