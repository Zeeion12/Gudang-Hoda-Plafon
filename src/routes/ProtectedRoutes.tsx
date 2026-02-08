import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Pages
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ProductsPage from '@/pages/products/ProductsPage'
import AddProductPage from '@/pages/products/AddProductPage'
import EditProductPage from '@/pages/products/EditProductPage'
import StockInPage from '@/pages/transactions/StockInPage'
import StockOutPage from '@/pages/transactions/StockOutPage'
import TransactionsPage from '@/pages/transactions/TransactionsPage'
import ReportsPage from '@/pages/reports/ReportsPage'

export const protectedRoutes: RouteObject[] = [
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            // Products routes
            {
                path: 'products',
                element: <ProductsPage />,
            },
            {
                path: 'products/add',
                element: <AddProductPage />,
            },
            {
                path: 'products/:id/edit',
                element: <EditProductPage />,
            },
            // Transactions routes
            {
                path: 'transactions',
                element: <TransactionsPage />,
            },
            {
                path: 'stock-in',
                element: <StockInPage />,
            },
            {
                path: 'stock-out',
                element: <StockOutPage />,
            },
            // Reports route
            {
                path: 'reports',
                element: <ReportsPage />,
            },
        ],
    },
]
