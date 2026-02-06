import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestigadorPageRoutingModule } from './investigador-routing.module';

import { InvestigadorPage } from './investigador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestigadorPageRoutingModule
  ],
  declarations: [InvestigadorPage]
})
export class InvestigadorPageModule {}
