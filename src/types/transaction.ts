// ===== src/types/transaction.ts =====

export type TransactionType = 'IN' | 'OUT'

export interface Transaction {
    id: string
    type: TransactionType
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    transaction_date: string  // format: YYYY-MM-DD
    notes: string | null
    created_at: string
    updated_at: string

    // Join dari tabel products (ada kalau di-fetch dengan .select('*, products(...)'))
    products?: {
        id: string
        code: string
        name: string
        unit: string
        current_stock: number
    }
}