import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicacionEditPage } from './publicacion-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PublicacionEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicacionEditPageRoutingModule {}
