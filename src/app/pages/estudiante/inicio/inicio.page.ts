import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../../servicios/categorias.service';
import { Categoria } from '../../../modelos/categoria.interface';

// Paleta de colores vibrantes para las tarjetas de categoría
const CATEGORIA_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
];

const CATEGORIA_ICONS = [
  'flask-outline',
  'hardware-chip-outline',
  'leaf-outline',
  'planet-outline',
  'medical-outline',
  'telescope-outline',
  'book-outline',
  'analytics-outline',
];

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {

  searchTerm: string = '';
  categorias: (Categoria & { color: string; icono: string })[] = [];
  cargandoCategorias: boolean = true;
  errorCategorias: boolean = false;

  categoriaSeleccionada: (Categoria & { color: string; icono: string }) | null = null;

  publicaciones = [
    {
      id: 1,
      titulo: 'Avances en la Edición Genética CRISPR',
      investigador: 'Dr. Roberto Sánchez',
      resumen: 'Explorando las nuevas fronteras de la edición genética y su impacto en enfermedades hereditarias.',
      imagen: 'https://images.unsplash.com/photo-1532187875605-1ef6c237c145?auto=format&fit=crop&q=80&w=600',
      fecha: '05 Feb 2026',
      categoria: 'Biotecnología'
    },
    {
      id: 2,
      titulo: 'Modelos de Lenguaje Eficientes para Móviles',
      investigador: 'Dra. María García',
      resumen: 'Cómo optimizar la arquitectura de transformadores para dispositivos móviles con recursos limitados.',
      imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
      fecha: '03 Feb 2026',
      categoria: 'Inteligencia Artificial'
    },
    {
      id: 3,
      titulo: 'Nuevos Materiales para Energía Solar',
      investigador: 'Dr. Carlos Ruiz',
      resumen: 'Nuevos materiales de perovskita que superan el límite de eficiencia convencional.',
      imagen: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
      fecha: '01 Feb 2026',
      categoria: 'Física'
    }
  ];

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  /**
   * Carga las categorías desde el backend y les asigna
   * colores e íconos de forma dinámica.
   */
  cargarCategorias() {
    this.cargandoCategorias = true;
    this.errorCategorias = false;

    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data.map((cat, index) => ({
          ...cat,
          color: CATEGORIA_COLORS[index % CATEGORIA_COLORS.length],
          icono: CATEGORIA_ICONS[index % CATEGORIA_ICONS.length],
        }));
        this.cargandoCategorias = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.errorCategorias = true;
        this.cargandoCategorias = false;
      }
    });
  }

  seleccionarCategoria(cat: Categoria & { color: string; icono: string }) {
    this.categoriaSeleccionada = this.categoriaSeleccionada?.id === cat.id ? null : cat;
    // Aquí se puede filtrar publicaciones por categoría en el futuro
  }

  buscar(event: any) {
    this.searchTerm = event.detail.value;
  }
}
