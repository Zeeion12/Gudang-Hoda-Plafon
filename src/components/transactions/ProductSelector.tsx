// ===== src/components/transactions/ProductSelector.tsx =====
import { useState } from 'react'
import { MdSearch, MdKeyboardArrowDown, MdClose } from 'react-icons/md'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/product'

interface ProductSelectorProps {
    value: string
    onSelect: (product: Product) => void
    onClear?: () => void
}

// ---------- DUMMY DATA ----------
// TODO: Ganti dengan fetch dari Supabase
// Contoh query nanti:
// const { data } = await supabase
//   .from('products')
//   .select('id, code, name, unit, current_stock, min_stock, last_buy_price, last_sell_price')
//   .order('name')
const DUMMY_PRODUCTS: Product[] = [
    {
        id: '1', code: 'PLF-001', name: 'Plafon PVC Putih 6m',
        category: 'Plafon PVC', unit: 'batang',
        current_stock: 8, min_stock: 20,
        last_buy_price: 45000, last_sell_price: 55000,
        description: null, created_at: '', updated_at: '',
    },
    {
        id: '2', code: 'PLF-002', name: 'Plafon PVC Kayu 6m',
        category: 'Plafon PVC', unit: 'batang',
        current_stock: 25, min_stock: 15,
        last_buy_price: 52000, last_sell_price: 65000,
        description: null, created_at: '', updated_at: '',
    },
    {
        id: '3', code: 'PLF-003', name: 'Plafon PVC Glossy 6m',
        category: 'Plafon PVC', unit: 'batang',
        current_stock: 0, min_stock: 10,
        last_buy_price: 48000, last_sell_price: 60000,
        description: null, created_at: '', updated_at: '',
    },
    {
        id: '4', code: 'PLF-004', name: 'Plafon PVC Motif Bunga',
        category: 'Plafon PVC', unit: 'batang',
        current_stock: 5, min_stock: 10,
        last_buy_price: 50000, last_sell_price: 62000,
        description: null, created_at: '', updated_at: '',
    },
]

// ---------- Sub-component: badge stok ----------
function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
    if (stock === 0)
        return (
            <Badge variant="outline" className="shrink-0 text-xs bg-red-100 text-red-700 border-red-200">
                Habis
            </Badge>
        )
    if (stock <= minStock)
        return (
            <Badge variant="outline" className="shrink-0 text-xs bg-orange-100 text-orange-700 border-orange-200">
                Rendah
            </Badge>
        )
    return (
        <Badge variant="outline" className="shrink-0 text-xs bg-green-100 text-green-700 border-green-200">
            Aman
        </Badge>
    )
}

export default function ProductSelector({ value, onSelect, onClear }: ProductSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')

    const selected = DUMMY_PRODUCTS.find((p) => p.id === value) ?? null

    const filtered = DUMMY_PRODUCTS.filter(
        (p) =>
            p.code.toLowerCase().includes(search.toLowerCase()) ||
            p.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (product: Product) => {
        onSelect(product)
        setIsOpen(false)
        setSearch('')
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onClear?.()
        setSearch('')
    }

    const close = () => {
        setIsOpen(false)
        setSearch('')
    }

    return (
        <div className="relative">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={[
                    'w-full flex items-center justify-between gap-2',
                    'h-10 px-3 py-2 text-sm rounded-md border bg-background text-left',
                    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isOpen
                        ? 'border-(--color-action-primary) ring-2 ring-(--color-action-primary)/20'
                        : 'border-input hover:border-gray-400',
                ].join(' ')}
            >
                {selected ? (
                    <span className="flex-1 truncate">
                        <span className="font-medium text-(--color-text-secondary)">
                            {selected.code}
                        </span>
                        {' – '}
                        <span className="text-(--color-text-primary)">{selected.name}</span>
                    </span>
                ) : (
                    <span className="text-muted-foreground">Pilih produk...</span>
                )}

                <span className="flex items-center gap-1 shrink-0">
                    {selected && (
                        <span
                            onClick={handleClear}
                            className="p-0.5 rounded hover:bg-gray-200 cursor-pointer"
                            aria-label="Hapus pilihan"
                        >
                            <MdClose className="h-3.5 w-3.5 text-gray-400" />
                        </span>
                    )}
                    <MdKeyboardArrowDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop untuk close saat klik di luar */}
                    <div className="fixed inset-0 z-40" onClick={close} />

                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {/* Search bar */}
                        <div className="p-2 border-b bg-gray-50">
                            <div className="relative">
                                <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kode atau nama produk..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-(--color-action-primary)"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Product list */}
                        <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <li className="py-8 text-center text-sm text-gray-500">
                                    Produk tidak ditemukan
                                </li>
                            ) : (
                                filtered.map((product) => (
                                    <li key={product.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(product)}
                                            className={[
                                                'w-full flex items-center justify-between px-3 py-2.5',
                                                'text-left text-sm transition-colors hover:bg-blue-50',
                                                value === product.id
                                                    ? 'bg-blue-50 border-l-2 border-(--color-action-primary)'
                                                    : '',
                                            ].join(' ')}
                                        >
                                            <div className="flex-1 min-w-0 mr-3">
                                                <p className="font-medium truncate">
                                                    <span className="text-(--color-text-secondary)">
                                                        {product.code}
                                                    </span>
                                                    {' – '}
                                                    <span className="text-(--color-text-primary)">
                                                        {product.name}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Stok saat ini: {product.current_stock} {product.unit}
                                                </p>
                                            </div>
                                            <StockBadge
                                                stock={product.current_stock}
                                                minStock={product.min_stock}
                                            />
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    )
}