import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import { EstadoEventoPipe } from '../../../pipes/estado-evento.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventosPageRoutingModule
  ],
  declarations: [EventosPage, EstadoEventoPipe]
})
export class EventosPageModule { }
