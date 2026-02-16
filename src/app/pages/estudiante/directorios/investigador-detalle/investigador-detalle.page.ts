import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestigadorService } from '../../../../servicios/investigador.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-investigador-detalle',
  templateUrl: './investigador-detalle.page.html',
  styleUrls: ['./investigador-detalle.page.scss'],
  standalone: false
})
export class InvestigadorDetallePage implements OnInit {

  private route = inject(ActivatedRoute);
  private invService = inject(InvestigadorService);
  private location = inject(Location);

  investigador: any = null;
  loading: boolean = true;
  readonly API_URL = 'http://localhost:3000/investigador';

  constructor() { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalle(+id);
    }
  }

  cargarDetalle(id: number) {
    this.loading = true;
    this.invService.getInvestigador(id).subscribe({
      next: (data: any) => {
        this.investigador = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar detalle:', err);
        this.loading = false;
      }
    });
  }

  regresar() {
    this.location.back();
  }

}
