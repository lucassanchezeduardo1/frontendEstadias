import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosEditPage } from './eventos-edit.page';

const routes: Routes = [
  {
    path: '',
    component: EventosEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosEditPageRoutingModule {}
