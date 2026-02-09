import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { authService } from '@/services/auth.service'

interface AuthContextType {
    user: SupabaseUser | null
    loading: boolean
    isAuthenticated: boolean
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check current session on mount
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)
            } catch (error) {
                console.error('Auth error:', error)
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription?.unsubscribe()
    }, [])

    const handleLogout = async () => {
        try {
            await authService.logout()
            setUser(null)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        logout: handleLogout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}
