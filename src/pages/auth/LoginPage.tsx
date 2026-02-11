import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FiPackage } from "react-icons/fi"
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'

export default function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setErrorMessage('')

        try {
            const result = await authService.login(data.email, data.password)

            if (!result.success) {
                setErrorMessage(result.message)
                return
            }

            // Login berhasil, redirect ke dashboard
            navigate('/', { replace: true })
        } catch (error) {
            setErrorMessage('Terjadi kesalahan saat login')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--color-bg-main) p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo & Brand */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="p-3 bg-(--color-surface-dark) rounded-xl">
                            <FiPackage className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-(--color-text-primary)">
                        MegaPlafon
                    </h1>
                    <p className="text-sm text-(--color-text-muted)">
                        Sistem Manajemen Gudang
                    </p>
                </div>

                {/* Login Card */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center pb-4">
                        <CardTitle className="text-2xl font-semibold text-(--color-text-primary)">
                            Masuk
                        </CardTitle>
                        <CardDescription className="text-(--color-text-muted)">
                            Masukkan email dan password untuk melanjutkan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Error Alert */}
                        {errorMessage && (
                            <Alert variant="destructive">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    {...register('email')}
                                    disabled={isLoading}
                                    className="h-11 border-(--color-surface-light)/30 focus:border-(--color-action-primary) transition-colors"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className="h-11 border-(--color-surface-light)/30 focus:border-(--color-action-primary) transition-colors"
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-(--color-action-primary) hover:bg-(--color-action-hover) text-white font-medium transition-colors mt-6"
                            >
                                {isLoading ? 'Sedang masuk...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-(--color-text-muted)">
                    © 2024 MegaPlafon. Sistem Manajemen Gudang.
                </p>
            </div>
        </div>
    )
}