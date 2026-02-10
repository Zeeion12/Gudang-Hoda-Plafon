import { z } from 'zod';

// Schema untuk Add/Edit Product Form
export const productSchema = z.object({
    code: z
        .string()
        .min(1, 'Kode produk wajib diisi')
        .max(50, 'Kode produk maksimal 50 karakter')
        .regex(/^[A-Z0-9-]+$/, 'Kode produk hanya boleh huruf besar, angka, dan tanda strip (-)'),

    name: z
        .string()
        .min(1, 'Nama produk wajib diisi')
        .max(255, 'Nama produk maksimal 255 karakter'),

    category: z
        .string()
        .min(1, 'Kategori wajib dipilih'),

    unit: z
        .string()
        .min(1, 'Satuan wajib dipilih'),

    min_stock: z
        .number()
        .min(0, 'Minimal stok tidak boleh negatif')
        .int('Minimal stok harus bilangan bulat'),

    current_stock: z
        .number()
        .min(0, 'Stok awal tidak boleh negatif')
        .int('Stok awal harus bilangan bulat')
        .optional()
        .default(0),

    last_buy_price: z
        .number()
        .min(0, 'Harga beli tidak boleh negatif')
        .optional()
        .nullable(),

    last_sell_price: z
        .number()
        .min(0, 'Harga jual tidak boleh negatif')
        .optional()
        .nullable(),

    description: z
        .string()
        .max(1000, 'Deskripsi maksimal 1000 karakter')
        .optional()
        .nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// Constants untuk dropdown options
export const PRODUCT_CATEGORIES = [
    'Plafon PVC',
    // Bisa ditambah nanti: 'Lis', 'Aksesoris', dll
] as const;

export const PRODUCT_UNITS = [
    'pcs',
    'batang',
    'box',
    'meter',
    'lembar',
    'set',
] as const;