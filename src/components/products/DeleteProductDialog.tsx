import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MdWarning } from 'react-icons/md';
import type { Product } from '@/types/product';

interface DeleteProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onConfirm: () => void;
}

export default function DeleteProductDialog({
    open,
    onOpenChange,
    product,
    onConfirm,
}: DeleteProductDialogProps) {
    if (!product) return null;

    // TODO: Check if product has transactions
    // For now, just dummy logic
    const hasTransactions = false; // Replace with actual check

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MdWarning className="h-5 w-5 text-red-600" />
                        Hapus Produk
                    </DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus produk ini?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Product Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-(--color-text-muted)">Kode:</span>
                            <span className="text-sm font-medium">{product.code}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-(--color-text-muted)">Nama:</span>
                            <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-(--color-text-muted)">Stok:</span>
                            <span className="text-sm font-medium">
                                {product.current_stock} {product.unit}
                            </span>
                        </div>
                    </div>

                    {/* Warning if has transactions */}
                    {hasTransactions && (
                        <Alert variant="destructive">
                            <MdWarning className="h-4 w-4" />
                            <AlertDescription>
                                Produk ini memiliki riwayat transaksi. Menghapus produk akan
                                menghapus semua riwayat transaksi terkait. Tindakan ini tidak
                                dapat dibatalkan.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Warning message */}
                    <p className="text-sm text-(--color-text-muted)">
                        {hasTransactions
                            ? 'Data produk dan seluruh riwayat transaksi akan dihapus permanen.'
                            : 'Data produk akan dihapus permanen dan tidak dapat dikembalikan.'
                        }
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {hasTransactions ? 'Hapus Tetap' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}