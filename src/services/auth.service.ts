import { supabase } from '@/lib/supabase'
import type { AuthResponse, User } from '@/types'

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                return {
                    success: false,
                    message: error.message || 'Login gagal',
                }
            }

            if (!data.user) {
                return {
                    success: false,
                    message: 'User tidak ditemukan',
                }
            }

            const user: User = {
                id: data.user.id,
                email: data.user.email || '',
                created_at: data.user.created_at,
            }

            return {
                success: true,
                message: 'Login berhasil',
                user,
            }
        } catch (error) {
            console.error('Login error:', error)
            return {
                success: false,
                message: 'Terjadi kesalahan saat login',
            }
        }
    },

    async logout(): Promise<AuthResponse> {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                return {
                    success: false,
                    message: error.message || 'Logout gagal',
                }
            }

            return {
                success: true,
                message: 'Logout berhasil',
            }
        } catch (error) {
            console.error('Logout error:', error)
            return {
                success: false,
                message: 'Terjadi kesalahan saat logout',
            }
        }
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                return null
            }

            return {
                id: user.id,
                email: user.email || '',
                created_at: user.created_at,
            }
        } catch (error) {
            console.error('Get current user error:', error)
            return null
        }
    },
}
