import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../../servicios/categorias.service';
import { PublicacionesService } from '../../../servicios/publicaciones.service';
import { Categoria } from '../../../modelos/categoria.interface';
import { NavController } from '@ionic/angular';

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

  readonly API_URL = 'http://localhost:3000';

  searchTerm: string = '';

  // Categorías
  categorias: (Categoria & { color: string; icono: string })[] = [];
  cargandoCategorias: boolean = true;
  errorCategorias: boolean = false;
  categoriaSeleccionada: (Categoria & { color: string; icono: string }) | null = null;

  // Publicaciones
  todasLasPublicaciones: any[] = [];
  publicacionesFiltradas: any[] = [];
  cargandoPublicaciones: boolean = true;
  errorPublicaciones: boolean = false;

  constructor(
    private categoriasService: CategoriasService,
    private publicacionesService: PublicacionesService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarPublicaciones();
  }

  /** Navega al detalle de la publicación */
  verDetalle(id: number) {
    this.navCtrl.navigateForward(['/estudiante/detalle-publicacion', id]);
  }

  /** Carga las categorías desde el backend */
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

  /** Carga todas las publicaciones desde el backend */
  cargarPublicaciones() {
    this.cargandoPublicaciones = true;
    this.errorPublicaciones = false;

    this.publicacionesService.getPublicaciones().subscribe({
      next: (data) => {
        this.todasLasPublicaciones = data;
        this.aplicarFiltro();
        this.cargandoPublicaciones = false;
      },
      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
        this.errorPublicaciones = true;
        this.cargandoPublicaciones = false;
      }
    });
  }

  /** Aplica el filtro de categoría y búsqueda */
  aplicarFiltro() {
    let resultado = [...this.todasLasPublicaciones];

    // Filtrar por categoría seleccionada
    if (this.categoriaSeleccionada) {
      resultado = resultado.filter(pub =>
        pub.categoria?.id === this.categoriaSeleccionada!.id
      );
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const termino = this.searchTerm.toLowerCase();
      resultado = resultado.filter(pub =>
        pub.titulo?.toLowerCase().includes(termino) ||
        pub.descripcion_investigacion?.toLowerCase().includes(termino) ||
        pub.categoria?.nombre?.toLowerCase().includes(termino) ||
        pub.investigador_principal?.nombre?.toLowerCase().includes(termino) ||
        pub.investigador_principal?.apellidos?.toLowerCase().includes(termino)
      );
    }

    this.publicacionesFiltradas = resultado;
  }

  /** Selecciona o deselecciona una categoría y filtra publicaciones */
  seleccionarCategoria(cat: Categoria & { color: string; icono: string }) {
    this.categoriaSeleccionada = this.categoriaSeleccionada?.id === cat.id ? null : cat;
    this.aplicarFiltro();
  }

  /** Maneja la búsqueda por texto */
  buscar(event: any) {
    this.searchTerm = event.detail.value;
    this.aplicarFiltro();
  }

  /** Convierte un string separado por comas en un array de strings limpios */
  parseLista(valor: string): string[] {
    if (!valor) return [];
    return valor.split(',').map(v => v.trim()).filter(v => v.length > 0);
  }

  /** Retorna la URL de la imagen de portada de una publicación */
  getImagenUrl(id: number): string {
    return `${this.API_URL}/publicacion/${id}/imagen`;
  }

  /** Formatea una fecha ISO a dd/MM/yyyy */
  formatearFecha(fechaIso: string): string {
    if (!fechaIso) return '';
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
