import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResearcherHomePage } from './researcher-home.page';

const routes: Routes = [
  {
    path: '',
    component: ResearcherHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResearcherHomePageRoutingModule {}
