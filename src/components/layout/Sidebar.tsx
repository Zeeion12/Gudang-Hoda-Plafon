import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdDashboard,
    MdInventory,
    MdDownload,
    MdUpload,
    MdHistory,
    MdAssessment,
    MdChevronLeft,
    MdChevronRight,
    MdWarehouse,
} from 'react-icons/md';

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

export default function Sidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path: string) => {
        // Exact match untuk root path
        if (path === '/') {
            return location.pathname === '/';
        }
        // Untuk path lain, check starts with
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <aside
            className={`
        fixed left-0 top-0 z-30 h-screen
        bg-(--color-surface-dark)
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        hidden lg:block
      `}
        >
            {/* Header / Logo Area */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-action-primary)">
                            <MdWarehouse className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">WMS</h1>
                            <p className="text-xs text-white/60">Warehouse System</p>
                        </div>
                    </div>
                )}

                {isCollapsed && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-action-primary) mx-auto">
                        <MdWarehouse className="h-6 w-6 text-white" />
                    </div>
                )}

                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`
            absolute -right-3 top-6 
            flex h-6 w-6 items-center justify-center 
            rounded-full border-2 border-(--color-surface-dark)
            bg-(--color-action-primary)
            text-white
            hover:bg-(--color-action-hover)
            transition-colors
            ${isCollapsed ? 'left-1/2 -translate-x-1/2' : ''}
          `}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <MdChevronRight className="h-4 w-4" />
                    ) : (
                        <MdChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5
                transition-all duration-200
                ${active
                                    ? 'bg-(--color-action-primary) text-white shadow-lg'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon
                                className={`
                  h-5 w-5 shrink-0
                  ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}
                `}
                            />
                            {!isCollapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}

                            {/* Active Indicator */}
                            {active && !isCollapsed && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Info */}
            {!isCollapsed && (
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-action-primary) text-sm font-semibold text-white">
                            M
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Manager</p>
                            <p className="text-xs text-white/60 truncate">manager@warehouse.com</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}