import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';
import { ListaAlumnosPage } from './lista-alumnos.page';

const routes: Routes = [
    { path: '', component: ListaAlumnosPage }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ListaAlumnosPage]
})
export class ListaAlumnosPageModule { }
