import { Component, OnInit, inject } from '@angular/core';
import { InvestigadorService } from '../../../servicios/investigador.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-directorios',
  templateUrl: './directorios.page.html',
  styleUrls: ['./directorios.page.scss'],
  standalone: false
})
export class DirectoriosPage implements OnInit {

  private invService = inject(InvestigadorService);
  private router = inject(Router);

  investigadores: any[] = [];
  loading: boolean = true;
  readonly API_URL = 'http://localhost:3000/investigador';

  constructor() { }

  ngOnInit() {
    this.cargarInvestigadores();
  }

  cargarInvestigadores() {
    this.loading = true;
    this.invService.getAprobados().subscribe({
      next: (data: any[]) => {
        this.investigadores = data.map(inv => ({
          ...inv,
          // Definir un color basado en el ID para el fondo de la tarjeta si no tiene uno
          color: this.getRandomColor(inv.id || 0)
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar investigadores:', err);
        this.loading = false;
      }
    });
  }

  verPerfil(id: number) {
    this.router.navigate(['/estudiante/tabs/directorios', id]);
  }

  getRandomColor(id: number) {
    const colors = ['#4facfe', '#f093fb', '#667eea', '#30cfd0', '#ff9a9e', '#a18cd1'];
    return colors[id % colors.length];
  }

}
