import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicacionEditPageRoutingModule } from './publicacion-edit-routing.module';

import { PublicacionEditPage } from './publicacion-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PublicacionEditPageRoutingModule
  ],
  declarations: [PublicacionEditPage]
})
export class PublicacionEditPageModule { }
