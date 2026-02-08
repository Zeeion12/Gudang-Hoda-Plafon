import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { publicRoutes } from './PublicRoutes'
import { protectedRoutes } from './ProtectedRoutes'

const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes]

export const router = createBrowserRouter(routes)
