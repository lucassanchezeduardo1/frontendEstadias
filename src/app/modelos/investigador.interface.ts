export interface Investigador {
    id?: number;
    nombre: string;
    apellidos: string;
    grado_academico: string;
    cargo_actual: string;
    direccion_oficina: string;
    horario_atencion: string;
    email: string;
    password?: string;
    matricula: string;
    institucion_id: number;
    foto_perfil?: any; // Buffer o Base64 string
    google_academico_url?: string;
    researchgate_url?: string;
    descripcion_trayectoria: string;
    areas_investigacion: string;
    estado?: 'pendiente' | 'aprobado' | 'rechazado';
    created_at?: Date;
    updated_at?: Date;
    num_publicaciones?: number;
    num_eventos?: number;
}
