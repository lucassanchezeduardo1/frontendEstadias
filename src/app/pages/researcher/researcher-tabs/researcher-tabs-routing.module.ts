import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResearcherTabsPage } from './researcher-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: ResearcherTabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../researcher-home/researcher-home.module').then(m => m.ResearcherHomePageModule)
      },
      {
        path: 'publications',
        loadChildren: () => import('../researcher-publications/researcher-publications.module').then(m => m.ResearcherPublicationsPageModule)
      },
      {
        path: 'events',
        loadChildren: () => import('../researcher-events/researcher-events.module').then(m => m.ResearcherEventsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../researcher-profile/researcher-profile.module').then(m => m.ResearcherProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/researcher-tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/researcher-tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResearcherTabsPageRoutingModule { }
