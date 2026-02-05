import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResearcherProfilePageRoutingModule } from './researcher-profile-routing.module';

import { ResearcherProfilePage } from './researcher-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResearcherProfilePageRoutingModule
  ],
  declarations: [ResearcherProfilePage]
})
export class ResearcherProfilePageModule {}
