import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PruebasIaService } from '../../../../servicios/pruebas-ia.service';

@Component({
    selector: 'app-examen-ia',
    templateUrl: './examen-ia.component.html',
    styleUrls: ['./examen-ia.component.css'],
    standalone: false
})
export class ExamenIaComponent implements OnInit {
    @Input() publicacion!: any;
    @Input() usuarioId!: number;

    cargando: boolean = true;
    generando: boolean = false;
    error: string | null = null;

    preguntas: any[] = [];
    respuestasUsuario: number[] = [];
    examenFinalizado: boolean = false;
    puntaje: number = 0;

    constructor(
        private modalCtrl: ModalController,
        private pruebasService: PruebasIaService
    ) { }

    async ngOnInit() {
        this.iniciarGeneracion();
    }

    async iniciarGeneracion() {
        this.generando = true;
        this.error = null;

        try {
            // Decidimos usar la síntesis de IA si existe, sino la del investigador
            const contenidoBase = this.publicacion.sintesis_ia || this.publicacion.descripcion_investigacion;

            this.pruebasService.generarTest(contenidoBase, this.publicacion.titulo).subscribe({
                next: async (preguntas) => {
                    this.preguntas = preguntas;
                    this.respuestasUsuario = new Array(preguntas.length).fill(-1);
                    this.generando = false;
                    this.cargando = false;

                    // Registrar el intento exitoso
                    await this.pruebasService.registrarTestGenerado(this.usuarioId);
                },
                error: (err) => {
                    this.error = err.message || 'Error al generar el test';
                    this.generando = false;
                    this.cargando = false;
                }
            });
        } catch (err) {
            this.error = 'No se pudo preparar el contenido para el examen.';
            this.generando = false;
            this.cargando = false;
        }
    }

    seleccionarOpcion(idxPregunta: number, idxOpcion: number) {
        if (this.examenFinalizado) return;
        this.respuestasUsuario[idxPregunta] = idxOpcion;
    }

    finalizarExamen() {
        // Verificar que todas estén respondidas
        if (this.respuestasUsuario.includes(-1)) {
            // Podríamos mostrar un aviso, pero por simplicidad permitimos finalizar
        }

        let aciertos = 0;
        this.preguntas.forEach((p, i) => {
            if (this.respuestasUsuario[i] === p.respuestaCorrecta) {
                aciertos++;
            }
        });

        this.puntaje = Math.round((aciertos / this.preguntas.length) * 100);
        this.examenFinalizado = true;
    }

    cerrar() {
        this.modalCtrl.dismiss();
    }

    getLetra(index: number): string {
        return String.fromCharCode(65 + index); // A, B, C, D
    }

    get obtenerContadorRespuestas(): number {
        return this.respuestasUsuario.filter(r => r !== -1).length;
    }
}
