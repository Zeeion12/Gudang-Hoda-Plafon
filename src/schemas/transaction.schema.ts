import { z } from 'zod'

export const transactionSchema = z.object({
    product_id: z
        .string()
        .min(1, 'Produk wajib dipilih'),

    quantity: z
        .number()
        .refine((val) => Number.isInteger(val), {
            message: 'Jumlah harus bilangan bulat',
        })
        .min(1, 'Jumlah minimal 1'),

    unit_price: z
        .number()
        .refine((val) => !Number.isNaN(val), {
            message: 'Harga harus berupa angka',
        })
        .min(0, 'Harga tidak boleh negatif'),

    transaction_date: z
        .string()
        .min(1, 'Tanggal transaksi wajib diisi'),

    notes: z
        .string()
        .max(500, 'Catatan maksimal 500 karakter')
        .optional()
        .nullable(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
