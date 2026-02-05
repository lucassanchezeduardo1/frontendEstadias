import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResearcherHomePageRoutingModule } from './researcher-home-routing.module';

import { ResearcherHomePage } from './researcher-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResearcherHomePageRoutingModule
  ],
  declarations: [ResearcherHomePage]
})
export class ResearcherHomePageModule {}
