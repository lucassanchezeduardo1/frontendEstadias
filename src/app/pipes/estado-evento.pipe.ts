import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe que determina si un evento ya ocurrió o está por ocurrir.
 * Retorna 'pasado' si la fecha es anterior a hoy, 'proximo' si es hoy o futuro.
 */
@Pipe({
    name: 'estadoEvento',
    standalone: false
})
export class EstadoEventoPipe implements PipeTransform {
    transform(fechaStr: string): 'pasado' | 'proximo' {
        if (!fechaStr) return 'proximo';

        // Fecha actual sin horas para comparación justa de días
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Parseo manual de la fecha (YYYY-MM-DD o ISO) para evitar problemas de zona horaria
        const dStr = fechaStr.split('T')[0];
        const [año, mes, dia] = dStr.split('-').map(Number);

        const fechaEvento = new Date(año, mes - 1, dia);
        fechaEvento.setHours(0, 0, 0, 0);

        return fechaEvento.getTime() < hoy.getTime() ? 'pasado' : 'proximo';
    }
}
