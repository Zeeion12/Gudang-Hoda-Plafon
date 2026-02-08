import { useLocation } from 'react-router-dom';
import { MdMenu, MdSearch, MdNotifications, MdLogout, MdPerson, MdSettings } from 'react-icons/md';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
    onMenuClick?: () => void; // Untuk trigger mobile nav
}

export default function Header({ onMenuClick }: HeaderProps) {
    const location = useLocation();

    // Generate breadcrumb dari pathname
    const generateBreadcrumb = () => {
        // Handle root path
        if (location.pathname === '/') {
            return ['Dashboard'];
        }

        const paths = location.pathname.split('/').filter(Boolean);

        // Mapping path ke label yang lebih friendly
        const pathLabels: Record<string, string> = {
            products: 'Products',
            add: 'Add Product',
            edit: 'Edit Product',
            transactions: 'Transactions',
            'stock-in': 'Stock In',
            'stock-out': 'Stock Out',
            reports: 'Reports',
        };

        return paths.map((path) => pathLabels[path] || path);
    };

    const breadcrumbs = generateBreadcrumb();

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logout clicked');
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
                {/* Left Section: Mobile Menu + Breadcrumb */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-main) lg:hidden transition-colors"
                        aria-label="Open menu"
                    >
                        <MdMenu className="h-5 w-5" />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-(--color-text-primary)">
                            {breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'}
                        </h1>
                        {breadcrumbs.length > 1 && (
                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="text-(--color-text-muted)">/</span>
                                <span className="text-sm text-(--color-text-muted)">
                                    {breadcrumbs.slice(0, -1).join(' / ')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Search, Notifications, User */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Search Bar (Desktop) */}
                    <div className="relative hidden md:block">
                        <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-text-muted)" />
                        <input
                            type="search"
                            placeholder="Search products..."
                            className="
                h-9 w-64 rounded-lg border border-gray-200
                bg-(--color-bg-main) pl-9 pr-4
                text-sm text-(--color-text-primary)
                placeholder:text-(--color-text-muted)
                focus:border-(--color-action-primary)
                focus:outline-none focus:ring-2 focus:ring-(--color-action-primary)/20
                transition-all
              "
                        />
                    </div>

                    {/* Search Button (Mobile) */}
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-main) md:hidden transition-colors"
                        aria-label="Search"
                    >
                        <MdSearch className="h-5 w-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-main) transition-colors"
                        aria-label="Notifications"
                    >
                        <MdNotifications className="h-5 w-5" />
                        {/* Notification Badge */}
                        <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-error) opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-(--color-error)"></span>
                        </span>
                    </button>

                    {/* User Menu Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex h-9 items-center gap-2 rounded-lg bg-(--color-bg-main) px-3 hover:bg-(--color-surface-light)/30 transition-colors">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="bg-(--color-action-primary) text-white text-xs font-semibold">
                                        M
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden text-sm font-medium text-(--color-text-primary) sm:block">
                                    Manager
                                </span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div>
                                    <p className="text-sm font-medium text-(--color-text-primary)">
                                        Manager
                                    </p>
                                    <p className="text-xs text-(--color-text-muted)">
                                        manager@warehouse.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <MdPerson className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <MdSettings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-(--color-error) focus:text-(--color-error)"
                            >
                                <MdLogout className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}