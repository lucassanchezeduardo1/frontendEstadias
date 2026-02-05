import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResearcherPublicationsPageRoutingModule } from './researcher-publications-routing.module';

import { ResearcherPublicationsPage } from './researcher-publications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResearcherPublicationsPageRoutingModule
  ],
  declarations: [ResearcherPublicationsPage]
})
export class ResearcherPublicationsPageModule {}
