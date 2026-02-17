import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosEditPageRoutingModule } from './eventos-edit-routing.module';

import { EventosEditPage } from './eventos-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EventosEditPageRoutingModule
  ],
  declarations: [EventosEditPage]
})
export class EventosEditPageModule { }
