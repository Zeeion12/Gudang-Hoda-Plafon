import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MdDashboard,
    MdInventory,
    MdDownload,
    MdUpload,
    MdHistory,
    MdAssessment,
    MdLogout,
} from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/',
        icon: MdDashboard,
    },
    {
        label: 'Produk',
        path: '/products',
        icon: MdInventory,
    },
    {
        label: 'Barang Masuk',
        path: '/stock-in',
        icon: MdDownload,
    },
    {
        label: 'Barang Keluar',
        path: '/stock-out',
        icon: MdUpload,
    },
    {
        label: 'Riwayat Transaksi',
        path: '/transactions',
        icon: MdHistory,
    },
    {
        label: 'Laporan',
        path: '/reports',
        icon: MdAssessment,
    },
];

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // ✅ ALTERNATIVE FIX: Manual navigation dengan proper timing
    // Ganti Link dengan button + onClick handler
    const handleNavigate = (path: string) => {
        // Step 1: Navigate dulu
        navigate(path);

        // Step 2: Close drawer setelah navigation start (delayed)
        setTimeout(() => {
            onClose();
        }, 100);
    };

    // Prevent scroll saat drawer open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 z-50 h-full w-72 bg-(--color-surface-dark) shadow-2xl lg:hidden overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="border-b border-white/10 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-action-primary)">
                                    <MdDashboard className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white">MegaPlafon</h1>
                                    <p className="text-xs text-white/60">Warehouse System</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation - Using button instead of Link */}
                        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <button
                                            onClick={() => handleNavigate(item.path)}
                                            className={`
                                                group flex items-center gap-3 rounded-lg px-3 py-2.5
                                                transition-all duration-200 w-full text-left
                                                ${active
                                                    ? 'bg-(--color-action-primary) text-white shadow-lg'
                                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                }
                                            `}
                                        >
                                            <Icon
                                                className={`
                                                    h-5 w-5 shrink-0
                                                    ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}
                                                `}
                                            />
                                            <span className="text-sm font-medium">{item.label}</span>

                                            {/* Active Indicator */}
                                            {active && (
                                                <motion.div
                                                    layoutId="activeIndicatorMobile"
                                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                                                />
                                            )}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* Footer / Logout */}
                        <div className="border-t border-white/10 p-4">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <MdLogout className="h-5 w-5" />
                                <span className="text-sm font-medium">Keluar</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}