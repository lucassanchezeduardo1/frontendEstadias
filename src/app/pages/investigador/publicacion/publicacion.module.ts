import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicacionPageRoutingModule } from './publicacion-routing.module';

import { PublicacionPage } from './publicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PublicacionPageRoutingModule
  ],
  declarations: [PublicacionPage]
})
export class PublicacionPageModule { }
