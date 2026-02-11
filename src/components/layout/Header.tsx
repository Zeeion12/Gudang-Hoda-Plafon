import { useLocation, useNavigate } from 'react-router-dom';
import { MdMenu, MdLogout } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
    onMenuClick?: () => void; // Untuk trigger mobile nav
}

export default function Header({ onMenuClick }: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Generate breadcrumb dari pathname
    const generateBreadcrumb = () => {
        // Handle root path
        if (location.pathname === '/') {
            return 'Dashboard';
        }

        const paths = location.pathname.split('/').filter(Boolean);

        // Mapping path ke label yang lebih friendly (Bahasa Indonesia)
        const pathLabels: Record<string, string> = {
            products: 'Produk',
            add: 'Tambah Produk',
            edit: 'Edit Produk',
            transactions: 'Riwayat Transaksi',
            'stock-in': 'Barang Masuk',
            'stock-out': 'Barang Keluar',
            reports: 'Laporan',
        };

        // Ambil label terakhir saja (current page)
        const currentPath = paths[paths.length - 1];
        return pathLabels[currentPath] || currentPath;
    };

    const pageTitle = generateBreadcrumb();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="sticky top-0 z-20 h-16 border-b border-gray-200 bg-white shadow-sm w-full">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
                {/* Left Section: Mobile Menu + Page Title */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuClick?.();
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-main) lg:hidden transition-colors"
                        aria-label="Open menu"
                    >
                        <MdMenu className="h-5 w-5" />
                    </button>

                    {/* Page Title */}
                    <div>
                        <h1 className="text-xl font-bold text-(--color-text-primary)">
                            {pageTitle}
                        </h1>
                        <p className="text-xs text-(--color-text-muted) hidden sm:block">
                            MegaPlafon Warehouse Management
                        </p>
                    </div>
                </div>

                {/* Right Section: Logout Button */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                        <MdLogout className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Keluar</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}