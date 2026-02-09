import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
        label: 'Products',
        path: '/products',
        icon: MdInventory,
    },
    {
        label: 'Stock In',
        path: '/stock-in',
        icon: MdDownload,
    },
    {
        label: 'Stock Out',
        path: '/stock-out',
        icon: MdUpload,
    },
    {
        label: 'Transactions',
        path: '/transactions',
        icon: MdHistory,
    },
    {
        label: 'Reports',
        path: '/reports',
        icon: MdAssessment,
    },
];

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        // Exact match untuk root path
        if (path === '/') {
            return location.pathname === '/';
        }
        // Untuk path lain, check starts with
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Close drawer saat route berubah
    useEffect(() => {
        onClose();
    }, [location.pathname, onClose]);

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

    const handleLogout = () => {
        // TODO: Implement logout
        console.log('Logout clicked');
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
                        className="fixed inset-0 z-25 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-16 z-40 h-[calc(100%-4rem)] w-72 bg-(--color-surface-dark) shadow-2xl lg:hidden overflow-y-auto"
                    >
                        {/* User Info Section */}
                        <div className="border-b border-white/10 p-4">
                            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-action-primary) text-sm font-semibold text-white">
                                    M
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">Manager</p>
                                    <p className="text-xs text-white/60 truncate">manager@warehouse.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
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
                                        <Link
                                            to={item.path}
                                            className={`
                        group flex items-center gap-3 rounded-lg px-3 py-2.5
                        transition-all duration-200
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
                                                    layoutId="activeIndicator"
                                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                                                />
                                            )}
                                        </Link>
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
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}