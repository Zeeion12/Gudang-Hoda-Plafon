import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    productSchema,
    PRODUCT_CATEGORIES,
    PRODUCT_UNITS
} from '@/schemas/product.schema';
import type { ProductFormValues } from '@/schemas/product.schema';

interface ProductFormProps {
    initialValues?: ProductFormValues;
    onSubmit: (data: ProductFormValues) => void;
    onCancel: () => void;
    isEdit?: boolean;
}

export default function ProductForm({
    initialValues,
    onSubmit,
    onCancel,
    isEdit = false,
}: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema as any),
        defaultValues: initialValues || {
            code: '',
            name: '',
            category: '',
            unit: '',
            min_stock: 10,
            current_stock: 0,
            last_buy_price: null,
            last_sell_price: null,
            description: '',
        },
    });

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Informasi Dasar */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-(--color-text-primary) border-b pb-2">
                        Informasi Dasar
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kode Produk */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Kode Produk <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="PLF-001"
                                            {...field}
                                            className="uppercase"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Format: Huruf besar, angka, dan tanda strip (-)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Nama Produk */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nama Produk <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Plafon PVC Putih 6m"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kategori */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Kategori <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PRODUCT_CATEGORIES.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Satuan */}
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Satuan <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih satuan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PRODUCT_UNITS.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Deskripsi */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi (Opsional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Deskripsi produk..."
                                        className="resize-none"
                                        rows={3}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Stok */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-(--color-text-primary) border-b pb-2">
                        Pengaturan Stok
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stok Awal */}
                        <FormField
                            control={form.control}
                            name="current_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stok Awal</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            value={field.value || 0}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Stok saat produk pertama kali ditambahkan
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Minimal Stok */}
                        <FormField
                            control={form.control}
                            name="min_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Minimal Stok <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="10"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Alert akan muncul jika stok kurang dari nilai ini
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Harga */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-(--color-text-primary) border-b pb-2">
                        Harga (Opsional)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Harga Beli */}
                        <FormField
                            control={form.control}
                            name="last_buy_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga Beli Terakhir</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="45000"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Harga pembelian per satuan (Rupiah)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Harga Jual */}
                        <FormField
                            control={form.control}
                            name="last_sell_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga Jual Terakhir</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="55000"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Harga penjualan per satuan (Rupiah)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        className="bg-(--color-action-primary) hover:bg-(--color-action-hover) text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}