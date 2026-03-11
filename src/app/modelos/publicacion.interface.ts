import { Categoria } from './categoria.interface';
import { Investigador } from './investigador.interface';

export interface Publicacion {
    id: number;
    titulo: string;
    descripcion_investigacion: string;
    sintesis_ia?: string;
    img_portada?: string;
    img_contenido?: string;
    pdf_url?: string;
    categoria_id: number;
    investigador_id: number;
    vistas: number;
    descargas: number;
    sub_categoria?: string;
    colaboradores?: string;
    links_referencia?: string;
    videos_url?: string;
    created_at: string;
    updated_at: string;
    esFavorito?: boolean;
    
    // Relaciones (opcionales dependiendo de la consulta)
    categoria?: Categoria;
    investigador_principal?: Investigador;
}
