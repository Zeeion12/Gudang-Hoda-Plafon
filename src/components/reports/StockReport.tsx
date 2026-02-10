import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MdWarning } from 'react-icons/md';
import ExportButton from './ExportButton';
import type { Product } from '@/types/product';

// Dummy data untuk preview
const DUMMY_PRODUCTS: Product[] = [
    {
        id: '1',
        code: 'PLF-001',
        name: 'Plafon PVC Putih 6m',
        category: 'Plafon PVC',
        unit: 'batang',
        current_stock: 45,
        min_stock: 20,
        last_buy_price: 45000,
        last_sell_price: 55000,
        description: null,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '2',
        code: 'PLF-002',
        name: 'Plafon PVC Coklat 6m',
        category: 'Plafon PVC',
        unit: 'batang',
        current_stock: 8,
        min_stock: 20,
        last_buy_price: 48000,
        last_sell_price: 58000,
        description: null,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '3',
        code: 'PLF-003',
        name: 'Plafon PVC Motif Kayu 6m',
        category: 'Plafon PVC',
        unit: 'batang',
        current_stock: 0,
        min_stock: 15,
        last_buy_price: 52000,
        last_sell_price: 65000,
        description: null,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '4',
        code: 'ACC-001',
        name: 'Sekrup Plafon 3cm',
        category: 'Plafon PVC',
        unit: 'box',
        current_stock: 25,
        min_stock: 10,
        last_buy_price: 15000,
        last_sell_price: 20000,
        description: null,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '5',
        code: 'ACC-002',
        name: 'Lem PVC 500ml',
        category: 'Plafon PVC',
        unit: 'pcs',
        current_stock: 12,
        min_stock: 15,
        last_buy_price: 35000,
        last_sell_price: 45000,
        description: null,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
];

export default function StockReport() {
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // TODO: Replace dengan data dari Supabase
    const products = DUMMY_PRODUCTS;

    // Filter by category
    const filteredProducts =
        categoryFilter === 'all'
            ? products
            : products.filter((p) => p.category === categoryFilter);

    // Get unique categories
    const categories = Array.from(new Set(products.map((p) => p.category)));

    // Helper: Get stock status
    const getStockStatus = (product: Product) => {
        if (product.current_stock === 0) {
            return {
                status: 'out' as const,
                label: 'Habis',
                color: 'bg-red-100 text-red-700 border-red-200',
            };
        } else if (product.current_stock <= product.min_stock) {
            return {
                status: 'low' as const,
                label: 'Rendah',
                color: 'bg-orange-100 text-orange-700 border-orange-200',
            };
        } else {
            return {
                status: 'safe' as const,
                label: 'Aman',
                color: 'bg-green-100 text-green-700 border-green-200',
            };
        }
    };

    // Helper: Format Rupiah
    const formatRupiah = (amount: number | null): string => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate summary stats
    const summary = {
        totalProducts: filteredProducts.length,
        lowStock: filteredProducts.filter(
            (p) => p.current_stock > 0 && p.current_stock <= p.min_stock
        ).length,
        outOfStock: filteredProducts.filter((p) => p.current_stock === 0).length,
        totalValue: filteredProducts.reduce(
            (sum, p) => sum + (p.current_stock * (p.last_buy_price || 0)),
            0
        ),
    };

    // TODO: Implement actual Excel export logic
    const handleExport = async () => {
        console.log('Exporting stock report to Excel...');
        // Simulate export delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Export complete!');
        // TODO: Use ExcelJS to generate actual file
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <p className="text-sm text-(--color-text-muted) mb-1">
                            Total Produk
                        </p>
                        <h3 className="text-2xl font-bold text-(--color-text-primary)">
                            {summary.totalProducts}
                        </h3>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <p className="text-sm text-(--color-text-muted) mb-1">
                            Stok Rendah
                        </p>
                        <h3 className="text-2xl font-bold text-orange-600">
                            {summary.lowStock}
                        </h3>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <p className="text-sm text-(--color-text-muted) mb-1">
                            Stok Habis
                        </p>
                        <h3 className="text-2xl font-bold text-red-600">
                            {summary.outOfStock}
                        </h3>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <p className="text-sm text-(--color-text-muted) mb-1">
                            Total Nilai Stok
                        </p>
                        <h3 className="text-xl font-bold text-green-600">
                            {formatRupiah(summary.totalValue)}
                        </h3>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Export */}
            <Card className="border-none shadow-md bg-white">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                            Laporan Stok Produk
                        </CardTitle>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            {/* Category Filter */}
                            <div className="w-full sm:w-48">
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Export Button */}
                            <ExportButton onExport={handleExport} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Desktop Table */}
                    <div className="hidden md:block rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Kode</TableHead>
                                    <TableHead className="font-semibold">Nama Produk</TableHead>
                                    <TableHead className="font-semibold">Kategori</TableHead>
                                    <TableHead className="font-semibold text-center">
                                        Stok Saat Ini
                                    </TableHead>
                                    <TableHead className="font-semibold text-center">
                                        Stok Minimal
                                    </TableHead>
                                    <TableHead className="font-semibold">Satuan</TableHead>
                                    <TableHead className="font-semibold text-right">
                                        Harga Beli
                                    </TableHead>
                                    <TableHead className="font-semibold text-right">
                                        Total Nilai
                                    </TableHead>
                                    <TableHead className="font-semibold text-center">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => {
                                    const stockStatus = getStockStatus(product);
                                    const totalValue =
                                        product.current_stock * (product.last_buy_price || 0);

                                    return (
                                        <TableRow key={product.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">
                                                {product.code}
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell className="text-sm text-(--color-text-muted)">
                                                {product.category}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">
                                                {product.current_stock}
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-(--color-text-muted)">
                                                {product.min_stock}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {product.unit}
                                            </TableCell>
                                            <TableCell className="text-right text-sm">
                                                {formatRupiah(product.last_buy_price)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatRupiah(totalValue)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${stockStatus.color}`}
                                                    >
                                                        {stockStatus.status === 'out' && (
                                                            <MdWarning className="h-3 w-3 mr-1" />
                                                        )}
                                                        {stockStatus.label}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product);
                            const totalValue =
                                product.current_stock * (product.last_buy_price || 0);

                            return (
                                <div
                                    key={product.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-(--color-text-muted)">
                                                    {product.code}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${stockStatus.color}`}
                                                >
                                                    {stockStatus.label}
                                                </Badge>
                                            </div>
                                            <h4 className="font-semibold text-(--color-text-primary)">
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-(--color-text-muted) mt-1">
                                                {product.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-(--color-text-muted) text-xs mb-1">
                                                Stok Saat Ini
                                            </p>
                                            <p className="font-semibold text-(--color-text-primary)">
                                                {product.current_stock} {product.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-(--color-text-muted) text-xs mb-1">
                                                Stok Minimal
                                            </p>
                                            <p className="font-semibold text-(--color-text-primary)">
                                                {product.min_stock} {product.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-(--color-text-muted) text-xs mb-1">
                                                Harga Beli
                                            </p>
                                            <p className="font-semibold text-(--color-text-primary)">
                                                {formatRupiah(product.last_buy_price)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-(--color-text-muted) text-xs mb-1">
                                                Total Nilai
                                            </p>
                                            <p className="font-semibold text-green-600">
                                                {formatRupiah(totalValue)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-(--color-text-muted)">
                                Tidak ada produk yang ditemukan
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}