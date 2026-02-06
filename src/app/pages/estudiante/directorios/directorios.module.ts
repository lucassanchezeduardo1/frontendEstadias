import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectoriosPageRoutingModule } from './directorios-routing.module';

import { DirectoriosPage } from './directorios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectoriosPageRoutingModule
  ],
  declarations: [DirectoriosPage]
})
export class DirectoriosPageModule {}
