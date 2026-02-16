import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestigadorDetallePageRoutingModule } from './investigador-detalle-routing.module';

import { InvestigadorDetallePage } from './investigador-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestigadorDetallePageRoutingModule
  ],
  declarations: [InvestigadorDetallePage]
})
export class InvestigadorDetallePageModule {}
