import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MdEdit,
    MdDelete,
    MdWarning,
} from 'react-icons/md';
import type { Product, StockInfo } from '@/types/product';
import DeleteProductDialog from './DeleteProductDialog';

interface ProductTableProps {
    products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Helper: Get stock status info
    const getStockInfo = (product: Product): StockInfo => {
        if (product.current_stock === 0) {
            return {
                status: 'out',
                label: 'Habis',
                color: 'bg-red-100 text-red-700 border-red-200',
            };
        } else if (product.current_stock <= product.min_stock) {
            return {
                status: 'low',
                label: 'Rendah',
                color: 'bg-orange-100 text-orange-700 border-orange-200',
            };
        } else {
            return {
                status: 'safe',
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

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        // TODO: Implement delete logic with Supabase
        console.log('Delete product:', selectedProduct);
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
    };

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Kode</TableHead>
                            <TableHead className="font-semibold">Nama Produk</TableHead>
                            <TableHead className="font-semibold">Kategori</TableHead>
                            <TableHead className="font-semibold text-center">Stok</TableHead>
                            <TableHead className="font-semibold">Satuan</TableHead>
                            <TableHead className="font-semibold text-right">Harga Beli</TableHead>
                            <TableHead className="font-semibold text-right">Harga Jual</TableHead>
                            <TableHead className="font-semibold text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            const stockInfo = getStockInfo(product);

                            return (
                                <TableRow key={product.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-(--color-text-primary)">
                                        {product.code}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-(--color-text-primary)">
                                                {product.name}
                                            </p>
                                            {product.description && (
                                                <p className="text-xs text-(--color-text-muted) mt-1 line-clamp-1">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-(--color-text-secondary)">
                                            {product.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-semibold text-(--color-text-primary)">
                                                {product.current_stock}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${stockInfo.color}`}
                                            >
                                                {stockInfo.status === 'out' && <MdWarning className="h-3 w-3 mr-1" />}
                                                {stockInfo.label}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-(--color-text-muted)">
                                            {product.unit}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-medium text-(--color-text-primary)">
                                            {formatRupiah(product.last_buy_price)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-medium text-green-600">
                                            {formatRupiah(product.last_sell_price)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <Link to={`/products/${product.id}/edit`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <MdEdit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleDeleteClick(product)}
                                            >
                                                <MdDelete className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {products.map((product) => {
                    const stockInfo = getStockInfo(product);

                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
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
                                            className={`text-xs ${stockInfo.color}`}
                                        >
                                            {stockInfo.label}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-(--color-text-primary)">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-(--color-text-muted) mt-1">
                                        {product.category}
                                    </p>
                                </div>
                            </div>

                            {/* Stock & Price Info */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-(--color-text-muted) text-xs mb-1">Stok</p>
                                    <p className="font-semibold text-(--color-text-primary)">
                                        {product.current_stock} {product.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-(--color-text-muted) text-xs mb-1">Min Stok</p>
                                    <p className="font-semibold text-(--color-text-primary)">
                                        {product.min_stock} {product.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-(--color-text-muted) text-xs mb-1">Harga Beli</p>
                                    <p className="font-semibold text-(--color-text-primary)">
                                        {formatRupiah(product.last_buy_price)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-(--color-text-muted) text-xs mb-1">Harga Jual</p>
                                    <p className="font-semibold text-green-600">
                                        {formatRupiah(product.last_sell_price)}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <Link to={`/products/${product.id}/edit`} className="flex-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        <MdEdit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 border-red-200"
                                    onClick={() => handleDeleteClick(product)}
                                >
                                    <MdDelete className="h-4 w-4 mr-2" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteProductDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                product={selectedProduct}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}