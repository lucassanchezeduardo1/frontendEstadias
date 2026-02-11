export interface Institucion {
    id?: number;
    nombre: string;
    tipo_institucion: string;
    pais: string;
    estado: string;
    direccion: string;
    created_at?: Date;
    updated_at?: Date;
}
