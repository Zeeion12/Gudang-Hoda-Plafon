import { useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface DashboardLayoutProps {
    children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-(--color-bg-main)">
            {/* Sidebar - Desktop Only */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Mobile Navigation Drawer */}
            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
            />

            {/* Header + Main Content Wrapper */}
            <div
                className={`
                    flex flex-1 flex-col transition-all duration-300
                    ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
                `}
            >
                {/* Header - Fixed */}
                <Header onMenuClick={() => setIsMobileNavOpen(true)} />

                {/* Main Content Area - Scrollable */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {/* Content Container */}
                    <div className="mx-auto max-w-7xl">
                        {/* Support both Outlet (untuk nested routes) dan children */}
                        {children || <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
}