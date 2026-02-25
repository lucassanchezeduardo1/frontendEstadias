import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';
import { ListaInvestigadoresPage } from './lista-investigadores.page';

const routes: Routes = [
    { path: '', component: ListaInvestigadoresPage }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ListaInvestigadoresPage]
})
export class ListaInvestigadoresPageModule { }
