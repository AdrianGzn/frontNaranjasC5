export interface LoginResponse {
    success?: boolean;
    token?: string;
    user?: {
        name: string;
        rol: string;
        username: string;
        email: string;
        id: number
        id_jefe: number
    };
    error?: {
        message: string;
        statusCode: number;
    };
}