export interface User {
    id: string
    email: string
    role?: string
    created_at?: string
}

export interface AuthResponse {
    success: boolean
    message: string
    user?: User
}
