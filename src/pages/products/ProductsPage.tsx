import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    MdAdd,
    MdSearch,
    MdFilterList,
} from 'react-icons/md';
import ProductTable from '@/components/products/ProductTable';
import type { Product } from '@/types/product';

export default function ProductsPage() {
    // TODO: Replace dengan real data dari Supabase
    const [products] = useState<Product[]>([
        {
            id: '1',
            code: 'PLF-001',
            name: 'Plafon PVC Putih 6m',
            category: 'Plafon PVC',
            unit: 'batang',
            current_stock: 8,
            min_stock: 20,
            last_buy_price: 45000,
            last_sell_price: 55000,
            description: 'Plafon PVC warna putih ukuran 6 meter',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            code: 'PLF-002',
            name: 'Plafon PVC Kayu 6m',
            category: 'Plafon PVC',
            unit: 'batang',
            current_stock: 25,
            min_stock: 15,
            last_buy_price: 52000,
            last_sell_price: 65000,
            description: 'Plafon PVC motif kayu ukuran 6 meter',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '3',
            code: 'PLF-003',
            name: 'Plafon PVC Glossy 6m',
            category: 'Plafon PVC',
            unit: 'batang',
            current_stock: 0,
            min_stock: 10,
            last_buy_price: 48000,
            last_sell_price: 60000,
            description: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');

    // Filter products based on search and filters
    const filteredProducts = products.filter((product) => {
        // Search filter
        const matchesSearch =
            product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
            categoryFilter === 'all' || product.category === categoryFilter;

        // Stock status filter
        let matchesStock = true;
        if (stockFilter === 'safe') {
            matchesStock = product.current_stock > product.min_stock;
        } else if (stockFilter === 'low') {
            matchesStock = product.current_stock > 0 && product.current_stock <= product.min_stock;
        } else if (stockFilter === 'out') {
            matchesStock = product.current_stock === 0;
        }

        return matchesSearch && matchesCategory && matchesStock;
    });

    const hasProducts = products.length > 0;

    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">
                        Daftar Produk
                    </h2>
                    <p className="text-sm text-(--color-text-muted)">
                        Kelola produk plafon PVC
                    </p>
                </div>

                <Link to="/products/add">
                    <Button className="bg-(--color-action-primary) hover:bg-(--color-action-hover) text-white">
                        <MdAdd className="h-5 w-5 mr-2 text-white" />
                        Tambah Produk
                    </Button>
                </Link>
            </div>

            {hasProducts ? (
                <>
                    {/* Search & Filters */}
                    <Card className="p-4 bg-white">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--color-text-muted)" />
                                <Input
                                    type="search"
                                    placeholder="Cari kode atau nama produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <MdFilterList className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="Plafon PVC">Plafon PVC</SelectItem>
                                    {/* Tambah kategori lain nanti */}
                                </SelectContent>
                            </Select>

                            {/* Stock Status Filter */}
                            <Select
                                value={stockFilter}
                                onValueChange={setStockFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Semua Stok" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Stok</SelectItem>
                                    <SelectItem value="safe">Stok Aman</SelectItem>
                                    <SelectItem value="low">Stok Rendah</SelectItem>
                                    <SelectItem value="out">Habis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-(--color-text-muted)">
                            Menampilkan {filteredProducts.length} dari {products.length} produk
                        </div>
                    </Card>

                    {/* Products Table */}
                    {filteredProducts.length > 0 ? (
                        <ProductTable products={filteredProducts} />
                    ) : (
                        <Card className="p-12 bg-white">
                            <div className="text-center space-y-3">
                                <div className="text-6xl">🔍</div>
                                <h3 className="text-lg font-semibold text-(--color-text-primary)">
                                    Produk tidak ditemukan
                                </h3>
                                <p className="text-sm text-(--color-text-muted)">
                                    Coba ubah kata kunci pencarian atau filter
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCategoryFilter('all');
                                        setStockFilter('all');
                                    }}
                                >
                                    Reset Filter
                                </Button>
                            </div>
                        </Card>
                    )}
                </>
            ) : (
                /* Empty State - Belum ada produk */
                <Card className="p-12 bg-white">
                    <div className="text-center space-y-4">
                        <div className="text-8xl">📦</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-(--color-text-primary)">
                                Belum Ada Produk
                            </h3>
                            <p className="text-sm text-(--color-text-muted) max-w-md mx-auto">
                                Mulai dengan menambahkan produk pertama Anda untuk melacak stok dan transaksi
                            </p>
                        </div>
                        <Link to="/products/add">
                            <Button className="bg-(--color-action-primary) hover:bg-(--color-action-hover)">
                                <MdAdd className="h-5 w-5 mr-2" />
                                Tambah Produk Pertama
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}
        </div>
    );
}