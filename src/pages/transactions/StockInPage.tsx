import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form, FormControl, FormDescription,
    FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { MdArrowBack, MdCheckCircle, MdArrowDownward } from 'react-icons/md'
import { transactionSchema, type TransactionFormValues } from '@/schemas/transaction.schema'
import ProductSelector from '@/components/transactions/ProductSelector'
import type { Product } from '@/types/product'

const rupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(n)

export default function StockInPage() {
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

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product)
        form.setValue('product_id', product.id, { shouldValidate: true })
        if (product.last_buy_price) {
            form.setValue('unit_price', product.last_buy_price)
        }
    }

    const handleProductClear = () => {
        setSelectedProduct(null)
        form.setValue('product_id', '')
        form.setValue('unit_price', 0)
    }

    const onSubmit = async (data: TransactionFormValues) => {
        try {
            // TODO: Ganti dengan Supabase insert
            // const { error } = await supabase.from('transactions').insert({
            //   type: 'IN',
            //   product_id: data.product_id,
            //   quantity: data.quantity,
            //   unit_price: data.unit_price,
            //   total_price: data.quantity * data.unit_price,
            //   transaction_date: data.transaction_date,
            //   notes: data.notes || null,
            // })
            // if (error) throw error
            console.log('Barang Masuk:', { ...data, type: 'IN', total_price: total })
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
                                Barang Masuk Tercatat!
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
                                <span className="text-(--color-text-muted)">Jumlah Masuk</span>
                                <span className="font-semibold text-blue-600">
                                    +{successData.quantity} {selectedProduct.unit}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-(--color-text-muted)">Total Harga Beli</span>
                                <span className="font-semibold">{rupiah(successData.total)}</span>
                            </div>
                            <div className="border-t pt-2.5 flex justify-between">
                                <span className="text-(--color-text-muted)">Stok Setelah</span>
                                <span className="font-bold text-(--color-text-primary)">
                                    {selectedProduct.current_stock + successData.quantity} {selectedProduct.unit}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => navigate('/transactions')}>
                                Lihat Riwayat
                            </Button>
                            <Button
                                className="flex-1 bg-(--color-action-primary) hover:bg-(--color-action-hover) text-white"
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
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <MdArrowDownward className="h-4 w-4 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-(--color-text-primary)">Barang Masuk</h2>
                    </div>
                    <p className="text-sm text-(--color-text-muted) ml-9">Catat penerimaan barang ke gudang</p>
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

                            {/* Info stok saat ini */}
                            {selectedProduct && (
                                <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                    <MdArrowDownward className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-blue-800">
                                            Stok saat ini:{' '}
                                            <strong>{selectedProduct.current_stock} {selectedProduct.unit}</strong>
                                        </p>
                                        {qty > 0 && (
                                            <p className="text-blue-700 mt-0.5">
                                                Setelah input:{' '}
                                                <strong className="text-green-600">
                                                    {selectedProduct.current_stock + qty} {selectedProduct.unit}
                                                </strong>
                                            </p>
                                        )}
                                    </div>
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
                                                    type="number" min="1" placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            {selectedProduct && (
                                                <FormDescription>Satuan: {selectedProduct.unit}</FormDescription>
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
                                            <FormLabel>Harga Beli / Unit <span className="text-red-500">*</span></FormLabel>
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
                            {total > 0 && (
                                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-(--color-text-muted)">Total Harga Pembelian</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {qty} {selectedProduct?.unit ?? 'item'} × {rupiah(price)}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-(--color-text-primary)">{rupiah(total)}</p>
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
                                                placeholder="Contoh: Dari supplier ABC, invoice #123..."
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
                                    className="bg-blue-600 hover:bg-blue-700 min-w-44 text-white"
                                    disabled={form.formState.isSubmitting || !selectedProduct}
                                >
                                    {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Barang Masuk'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}