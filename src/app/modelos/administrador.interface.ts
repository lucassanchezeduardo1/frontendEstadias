export interface Administrador {
    id?: number;
    nombre: string;
    email: string;
    password?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface AuthResponse {
    token: string;
    user: Administrador;
}
