import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestigadorDetallePage } from './investigador-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: InvestigadorDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestigadorDetallePageRoutingModule {}
