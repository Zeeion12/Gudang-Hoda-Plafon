import type { RouteObject } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'

export const publicRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <LoginPage />,
    },
]
