// Product Types
export interface Product {
    id: string;
    code: string;
    name: string;
    category: string;
    unit: string;
    current_stock: number;
    min_stock: number;
    last_buy_price: number | null;
    last_sell_price: number | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

// Form types for Add/Edit
export interface ProductFormData {
    code: string;
    name: string;
    category: string;
    unit: string;
    min_stock: number;
    current_stock?: number; // Optional, default 0
    last_buy_price?: number | null;
    last_sell_price?: number | null;
    description?: string | null;
}

// Stock status untuk badge
export type StockStatus = 'safe' | 'low' | 'out';

export interface StockInfo {
    status: StockStatus;
    label: string;
    color: string;
}