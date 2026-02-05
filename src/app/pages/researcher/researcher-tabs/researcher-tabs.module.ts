import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResearcherTabsPageRoutingModule } from './researcher-tabs-routing.module';

import { ResearcherTabsPage } from './researcher-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResearcherTabsPageRoutingModule
  ],
  declarations: [ResearcherTabsPage]
})
export class ResearcherTabsPageModule {}
