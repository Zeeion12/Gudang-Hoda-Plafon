import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Form, FormControl, FormDescription,
    FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { MdArrowBack, MdCheckCircle, MdArrowUpward, MdWarning } from 'react-icons/md'
import { transactionSchema, type TransactionFormValues } from '@/schemas/transaction.schema'
import ProductSelector from '@/components/transactions/ProductSelector'
import type { Product } from '@/types/product'

const rupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(n)

export default function StockOutPage() {
    const navigate = useNavigate()
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [successData, setSuccessData] = useState<{ quantity: number; total: number } | null>(null)

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            product_id: '',
            quantity: 1,
            unit_price: 0,
            transaction_date: format(new Date(), 'yyyy-MM-dd'),
            notes: '',
        },
    })

    const qty = form.watch('quantity') || 0
    const price = form.watch('unit_price') || 0
    const total = qty * price

    // Stok setelah transaksi (bisa negatif kalau melebihi stok)
    const stockAfter = selectedProduct ? selectedProduct.current_stock - qty : 0

    // Validasi: apakah stok CUKUP?
    const isStockInsufficient =
        selectedProduct !== null && qty > 0 && qty > selectedProduct.current_stock

    // Apakah stok akan jadi sangat rendah setelah transaksi?
    const willBeLow =
        !isStockInsufficient &&
        selectedProduct !== null &&
        qty > 0 &&
        stockAfter <= selectedProduct.min_stock &&
        stockAfter > 0

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product)
        form.setValue('product_id', product.id, { shouldValidate: true })
        if (product.last_sell_price) {
            form.setValue('unit_price', product.last_sell_price)
        }
    }

    const handleProductClear = () => {
        setSelectedProduct(null)
        form.setValue('product_id', '')
        form.setValue('unit_price', 0)
    }

    const onSubmit = async (data: TransactionFormValues) => {
        // Safety check – kalau stok kurang, jangan lanjut
        if (isStockInsufficient) return

        try {
            // TODO: Ganti dengan Supabase insert
            // const { error } = await supabase.from('transactions').insert({
            //   type: 'OUT',
            //   product_id: data.product_id,
            //   quantity: data.quantity,
            //   unit_price: data.unit_price,
            //   total_price: data.quantity * data.unit_price,
            //   transaction_date: data.transaction_date,
            //   notes: data.notes || null,
            // })
            // if (error) throw error
            // Trigger di database akan otomatis kurangi current_stock produk
            console.log('Barang Keluar:', { ...data, type: 'OUT', total_price: total })
            setSuccessData({ quantity: data.quantity, total })
        } catch (err) {
            console.error(err)
        }
    }

    const handleInputLagi = () => {
        form.reset({
            product_id: '',
            quantity: 1,
            unit_price: 0,
            transaction_date: format(new Date(), 'yyyy-MM-dd'),
            notes: '',
        })
        setSelectedProduct(null)
        setSuccessData(null)
    }

    // ── Sukses Screen ──────────────────────────────────────────────────
    if (successData && selectedProduct) {
        const remainingStock = selectedProduct.current_stock - successData.quantity
        const isLowAfter = remainingStock <= selectedProduct.min_stock && remainingStock > 0
        const isOutAfter = remainingStock === 0

        return (
            <div className="w-full max-w-md mx-auto pt-4">
                <Card className="bg-white shadow-md border-0">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                <MdCheckCircle className="w-11 h-11 text-green-500" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-(--color-text-primary)">
                                Barang Keluar Tercatat!
                            </h3>
                            <p className="text-sm text-(--color-text-muted) mt-1">
                                Stok berhasil diperbarui
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-(--color-text-muted)">Produk</span>
                                <span className="font-medium text-right">
                                    {selectedProduct.code} – {selectedProduct.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-(--color-text-muted)">Jumlah Keluar</span>
                                <span className="font-semibold text-red-600">
                                    -{successData.quantity} {selectedProduct.unit}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-(--color-text-muted)">Total Harga Jual</span>
                                <span className="font-semibold text-green-600">{rupiah(successData.total)}</span>
                            </div>
                            <div className="border-t pt-2.5 flex justify-between items-center">
                                <span className="text-(--color-text-muted)">Sisa Stok</span>
                                <span className={[
                                    'font-bold',
                                    isOutAfter ? 'text-red-600' : isLowAfter ? 'text-orange-500' : 'text-(--color-text-primary)',
                                ].join(' ')}>
                                    {remainingStock} {selectedProduct.unit}
                                    {isOutAfter && ' (Habis!)'}
                                    {isLowAfter && ' (Rendah)'}
                                </span>
                            </div>
                        </div>

                        {/* Peringatan stok rendah */}
                        {(isLowAfter || isOutAfter) && (
                            <div className={[
                                'flex items-start gap-2 p-3 rounded-lg text-sm text-left',
                                isOutAfter
                                    ? 'bg-red-50 border border-red-200 text-red-700'
                                    : 'bg-orange-50 border border-orange-200 text-orange-700',
                            ].join(' ')}>
                                <MdWarning className="h-4 w-4 mt-0.5 shrink-0" />
                                <p>
                                    {isOutAfter
                                        ? 'Stok produk ini sudah habis. Segera lakukan pembelian!'
                                        : 'Stok produk ini sudah rendah. Pertimbangkan untuk restock.'}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => navigate('/transactions')}>
                                Lihat Riwayat
                            </Button>
                            <Button
                                className="flex-1 bg-(--color-action-primary) hover:bg-(--color-action-hover)"
                                onClick={handleInputLagi}
                            >
                                Input Lagi
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── Form Screen ────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-2xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost" size="icon" type="button"
                    onClick={() => navigate(-1)}
                    className="hover:bg-gray-100 shrink-0"
                >
                    <MdArrowBack className="h-5 w-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                            <MdArrowUpward className="h-4 w-4 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-(--color-text-primary)">Barang Keluar</h2>
                    </div>
                    <p className="text-sm text-(--color-text-muted) ml-9">Catat pengeluaran barang dari gudang</p>
                </div>
            </div>

            <Card className="bg-white shadow-md border-0">
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                            {/* Pilih Produk */}
                            <FormField
                                control={form.control}
                                name="product_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Produk <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <ProductSelector
                                                value={field.value}
                                                onSelect={handleProductSelect}
                                                onClear={handleProductClear}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Info stok + validasi */}
                            {selectedProduct && (
                                <div>
                                    {/* Stok habis — tidak bisa transaksi sama sekali */}
                                    {selectedProduct.current_stock === 0 ? (
                                        <Alert variant="destructive">
                                            <MdWarning className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Stok produk ini sudah habis.</strong>{' '}
                                                Tidak bisa melakukan pengeluaran barang.
                                                Silakan lakukan barang masuk terlebih dahulu.
                                            </AlertDescription>
                                        </Alert>
                                    ) : isStockInsufficient ? (
                                        /* Jumlah melebihi stok */
                                        <Alert variant="destructive">
                                            <MdWarning className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Stok tidak cukup!</strong>{' '}
                                                Stok tersedia hanya{' '}
                                                <strong>{selectedProduct.current_stock} {selectedProduct.unit}</strong>,
                                                tidak bisa mengeluarkan{' '}
                                                <strong>{qty} {selectedProduct.unit}</strong>.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        /* Stok info normal / warning rendah */
                                        <div className={[
                                            'flex items-start gap-2.5 p-3 rounded-lg border text-sm',
                                            willBeLow
                                                ? 'bg-orange-50 border-orange-200'
                                                : 'bg-gray-50 border-gray-200',
                                        ].join(' ')}>
                                            <MdWarning className={[
                                                'h-4 w-4 mt-0.5 shrink-0',
                                                willBeLow ? 'text-orange-400' : 'text-gray-400',
                                            ].join(' ')} />
                                            <div>
                                                <p className={willBeLow ? 'text-orange-700' : 'text-gray-600'}>
                                                    Stok saat ini:{' '}
                                                    <strong>{selectedProduct.current_stock} {selectedProduct.unit}</strong>
                                                    {qty > 0 && (
                                                        <>
                                                            {' → '}sisa setelah:{' '}
                                                            <strong className={
                                                                stockAfter === 0 ? 'text-red-600' :
                                                                    willBeLow ? 'text-orange-600' : 'text-green-600'
                                                            }>
                                                                {stockAfter} {selectedProduct.unit}
                                                            </strong>
                                                        </>
                                                    )}
                                                </p>
                                                {willBeLow && (
                                                    <p className="text-orange-600 text-xs mt-0.5">
                                                        ⚠ Stok akan di bawah batas minimal ({selectedProduct.min_stock} {selectedProduct.unit})
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Jumlah & Harga */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jumlah <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number" min="1"
                                                    max={selectedProduct?.current_stock}
                                                    placeholder="0"
                                                    className={isStockInsufficient ? 'border-red-400 focus-visible:ring-red-400' : ''}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            {selectedProduct && (
                                                <FormDescription>
                                                    Maks:{' '}
                                                    <span className={selectedProduct.current_stock === 0 ? 'text-red-500' : ''}>
                                                        {selectedProduct.current_stock} {selectedProduct.unit}
                                                    </span>
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="unit_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Harga Jual / Unit <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number" min="0" placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormDescription>Dalam Rupiah (Rp)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Total otomatis */}
                            {total > 0 && !isStockInsufficient && (
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-(--color-text-muted)">Total Harga Penjualan</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {qty} {selectedProduct?.unit ?? 'item'} × {rupiah(price)}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-green-600">{rupiah(total)}</p>
                                </div>
                            )}

                            {/* Tanggal */}
                            <FormField
                                control={form.control}
                                name="transaction_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Transaksi <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Catatan */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Catatan (Opsional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Contoh: Penjualan ke Bapak Rudi, proyek Jl. Merdeka..."
                                                rows={3} className="resize-none"
                                                {...field}
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2 border-t">
                                <Button
                                    type="button" variant="outline"
                                    onClick={() => navigate(-1)}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 min-w-44"
                                    disabled={
                                        form.formState.isSubmitting ||
                                        !selectedProduct ||
                                        isStockInsufficient ||
                                        selectedProduct?.current_stock === 0
                                    }
                                >
                                    {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Barang Keluar'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}