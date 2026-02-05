import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab4',
    templateUrl: 'tab4.page.html',
    styleUrls: ['tab4.page.scss'],
    standalone: false,
})
export class Tab4Page {
    constructor(private router: Router) { }

    logout() {
        console.log('Cerrando sesión...');
        this.router.navigate(['/login']);
    }
}
