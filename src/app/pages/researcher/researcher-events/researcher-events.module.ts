import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResearcherEventsPageRoutingModule } from './researcher-events-routing.module';

import { ResearcherEventsPage } from './researcher-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResearcherEventsPageRoutingModule
  ],
  declarations: [ResearcherEventsPage]
})
export class ResearcherEventsPageModule {}
