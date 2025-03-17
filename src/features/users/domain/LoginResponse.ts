export interface LoginResponse {
    success: boolean;
    token?: string;
    error?: {
        message: string;
        statusCode: number;
    };
}