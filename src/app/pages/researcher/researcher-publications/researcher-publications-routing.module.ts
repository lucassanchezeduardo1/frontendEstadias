import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResearcherPublicationsPage } from './researcher-publications.page';

const routes: Routes = [
  {
    path: '',
    component: ResearcherPublicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResearcherPublicationsPageRoutingModule {}
