export interface ServerError {
    message: string;
    errors?: string[];
}

// ВИПРАВЛЕНО: HttpErrorResponse замість HttpErrorResponce
export interface HttpErrorResponse {
    error: ServerError;
}

// ВИПРАВЛЕНО: HttpErrorResponse замість HttpErrroResponce
export function formatError(error: HttpErrorResponse): string {
    return error.error.errors 
        ? `${error.error.message}. ${error.error.errors}`
        : error.error.message || 'Невідома помилка';
}