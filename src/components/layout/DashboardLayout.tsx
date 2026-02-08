import { useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface DashboardLayoutProps {
    children?: ReactNode; // Optional untuk backward compatibility
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-(--color-bg-main)">
            {/* Sidebar - Desktop */}
            <Sidebar />

            {/* Mobile Navigation Drawer */}
            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
            />

            {/* Main Content Area */}
            <div className="lg:pl-64">
                {/* Header */}
                <Header onMenuClick={() => setIsMobileNavOpen(true)} />

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
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