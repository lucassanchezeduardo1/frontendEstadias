import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstitucionesPageRoutingModule } from './instituciones-routing.module';

import { InstitucionesPage } from './instituciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstitucionesPageRoutingModule
  ],
  declarations: [InstitucionesPage]
})
export class InstitucionesPageModule {}
