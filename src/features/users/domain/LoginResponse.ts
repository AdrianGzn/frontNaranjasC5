export interface LoginResponse {
    success?: boolean;
    token?: string;
    user?: {
        name: string;
        rol: string;
        username: string;
    };
    error?: {
        message: string;
        statusCode: number;
    };
}