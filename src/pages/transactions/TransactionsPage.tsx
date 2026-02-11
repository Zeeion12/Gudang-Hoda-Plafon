import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    MdAdd, MdSearch, MdArrowDownward,
    MdArrowUpward, MdSwapVert, MdFilterList,
} from 'react-icons/md'
import type { Transaction } from '@/types/transaction'

const rupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(n)

// ── Dummy data ──────────────────────────────────────────────────────
// TODO: Ganti dengan fetch dari Supabase
// Query: supabase.from('transactions').select('*, products(code, name, unit)').order('transaction_date', { ascending: false })
const DUMMY_TRANSACTIONS: Transaction[] = [
    {
        id: '1', type: 'IN', product_id: '1', quantity: 50, unit_price: 45000,
        total_price: 2250000, transaction_date: '2026-02-10',
        notes: 'Pembelian dari supplier ABC', created_at: '', updated_at: '',
        products: { id: '1', code: 'PLF-001', name: 'Plafon PVC Putih 6m', unit: 'batang', current_stock: 8 },
    },
    {
        id: '2', type: 'OUT', product_id: '1', quantity: 12, unit_price: 55000,
        total_price: 660000, transaction_date: '2026-02-09',
        notes: 'Proyek Bapak Rudi', created_at: '', updated_at: '',
        products: { id: '1', code: 'PLF-001', name: 'Plafon PVC Putih 6m', unit: 'batang', current_stock: 8 },
    },
    {
        id: '3', type: 'IN', product_id: '2', quantity: 30, unit_price: 52000,
        total_price: 1560000, transaction_date: '2026-02-08',
        notes: null, created_at: '', updated_at: '',
        products: { id: '2', code: 'PLF-002', name: 'Plafon PVC Kayu 6m', unit: 'batang', current_stock: 25 },
    },
    {
        id: '4', type: 'OUT', product_id: '2', quantity: 5, unit_price: 65000,
        total_price: 325000, transaction_date: '2026-02-07',
        notes: 'Proyek Ibu Sari, Jl. Kenanga', created_at: '', updated_at: '',
        products: { id: '2', code: 'PLF-002', name: 'Plafon PVC Kayu 6m', unit: 'batang', current_stock: 25 },
    },
    {
        id: '5', type: 'OUT', product_id: '3', quantity: 8, unit_price: 60000,
        total_price: 480000, transaction_date: '2026-02-05',
        notes: null, created_at: '', updated_at: '',
        products: { id: '3', code: 'PLF-003', name: 'Plafon PVC Glossy 6m', unit: 'batang', current_stock: 0 },
    },
]

export default function TransactionsPage() {
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')

    // ── Filter ─────────────────────────────────────────────────────
    const filtered = DUMMY_TRANSACTIONS.filter((t) => {
        const matchSearch =
            (t.products?.code ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (t.products?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (t.notes ?? '').toLowerCase().includes(search.toLowerCase())
        const matchType = typeFilter === 'all' || t.type === typeFilter
        return matchSearch && matchType
    })

    // ── Ringkasan angka ────────────────────────────────────────────
    const totalIn = DUMMY_TRANSACTIONS.filter((t) => t.type === 'IN')
        .reduce((sum, t) => sum + t.total_price, 0)
    const totalOut = DUMMY_TRANSACTIONS.filter((t) => t.type === 'OUT')
        .reduce((sum, t) => sum + t.total_price, 0)

    const formatTanggal = (dateStr: string) =>
        format(parseISO(dateStr), 'dd MMM yyyy', { locale: localeId })

    return (
        <div className="w-full space-y-5">
            {/* ── Page Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">
                        Riwayat Transaksi
                    </h2>
                    <p className="text-sm text-(--color-text-muted)">
                        Semua catatan barang masuk dan keluar
                    </p>
                </div>

                {/* Tombol aksi cepat */}
                <div className="flex gap-2 shrink-0">
                    <Link to="/stock-in">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-400 text-blue-600 hover:bg-blue-50"
                        >
                            <MdArrowDownward className="h-4 w-4 mr-1" />
                            Barang Masuk
                        </Button>
                    </Link>
                    <Link to="/stock-out">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-500 hover:bg-red-50"
                        >
                            <MdArrowUpward className="h-4 w-4 mr-1" />
                            Barang Keluar
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Masuk */}
                <div className="bg-white rounded-xl border border-blue-100 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <MdArrowDownward className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-(--color-text-muted)">Total Masuk</p>
                        <p className="font-bold text-(--color-text-primary) text-sm">{rupiah(totalIn)}</p>
                    </div>
                </div>

                {/* Total Keluar */}
                <div className="bg-white rounded-xl border border-red-100 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <MdArrowUpward className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-xs text-(--color-text-muted)">Total Keluar</p>
                        <p className="font-bold text-(--color-text-primary) text-sm">{rupiah(totalOut)}</p>
                    </div>
                </div>

                {/* Total Transaksi */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <MdSwapVert className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs text-(--color-text-muted)">Total Transaksi</p>
                        <p className="font-bold text-(--color-text-primary) text-sm">
                            {DUMMY_TRANSACTIONS.length} transaksi
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Filter & Search ── */}
            <Card className="p-4 bg-white">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Cari kode produk, nama, atau catatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Filter tipe */}
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-44">
                            <MdFilterList className="h-4 w-4 mr-2 text-gray-400" />
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="IN">Barang Masuk</SelectItem>
                            <SelectItem value="OUT">Barang Keluar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-xs text-(--color-text-muted) mt-3">
                    {filtered.length} dari {DUMMY_TRANSACTIONS.length} transaksi
                </p>
            </Card>

            {/* ── Tabel Desktop ── */}
            {filtered.length > 0 ? (
                <>
                    <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Tanggal</TableHead>
                                    <TableHead className="font-semibold">Tipe</TableHead>
                                    <TableHead className="font-semibold">Produk</TableHead>
                                    <TableHead className="font-semibold text-right">Jumlah</TableHead>
                                    <TableHead className="font-semibold text-right">Harga / Unit</TableHead>
                                    <TableHead className="font-semibold text-right">Total</TableHead>
                                    <TableHead className="font-semibold">Catatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-gray-50">
                                        {/* Tanggal */}
                                        <TableCell className="text-sm text-(--color-text-muted) whitespace-nowrap">
                                            {formatTanggal(t.transaction_date)}
                                        </TableCell>

                                        {/* Tipe badge */}
                                        <TableCell>
                                            {t.type === 'IN' ? (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                                                    <MdArrowDownward className="h-3 w-3" />
                                                    Masuk
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1">
                                                    <MdArrowUpward className="h-3 w-3" />
                                                    Keluar
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Produk */}
                                        <TableCell>
                                            <p className="font-medium text-(--color-text-primary) text-sm">
                                                {t.products?.name ?? '–'}
                                            </p>
                                            <p className="text-xs text-(--color-text-muted)">
                                                {t.products?.code ?? '–'}
                                            </p>
                                        </TableCell>

                                        {/* Jumlah */}
                                        <TableCell className="text-right">
                                            <span className={[
                                                'font-semibold text-sm',
                                                t.type === 'IN' ? 'text-blue-600' : 'text-red-500',
                                            ].join(' ')}>
                                                {t.type === 'IN' ? '+' : '-'}{t.quantity}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-1">
                                                {t.products?.unit ?? ''}
                                            </span>
                                        </TableCell>

                                        {/* Harga unit */}
                                        <TableCell className="text-right text-sm text-(--color-text-muted)">
                                            {rupiah(t.unit_price)}
                                        </TableCell>

                                        {/* Total */}
                                        <TableCell className="text-right">
                                            <span className={[
                                                'font-semibold text-sm',
                                                t.type === 'OUT' ? 'text-green-600' : 'text-(--color-text-primary)',
                                            ].join(' ')}>
                                                {rupiah(t.total_price)}
                                            </span>
                                        </TableCell>

                                        {/* Catatan */}
                                        <TableCell className="max-w-48">
                                            <p className="text-sm text-(--color-text-muted) line-clamp-1">
                                                {t.notes ?? '–'}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ── Mobile Cards ── */}
                    <div className="md:hidden space-y-3">
                        {filtered.map((t) => (
                            <div
                                key={t.id}
                                className={[
                                    'bg-white rounded-xl border p-4 space-y-3',
                                    t.type === 'IN' ? 'border-blue-100' : 'border-red-100',
                                ].join(' ')}
                            >
                                {/* Header baris */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-(--color-text-primary) text-sm">
                                            {t.products?.name ?? '–'}
                                        </p>
                                        <p className="text-xs text-(--color-text-muted) mt-0.5">
                                            {t.products?.code} · {formatTanggal(t.transaction_date)}
                                        </p>
                                    </div>
                                    {t.type === 'IN' ? (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 shrink-0">
                                            <MdArrowDownward className="h-3 w-3" />
                                            Masuk
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1 shrink-0">
                                            <MdArrowUpward className="h-3 w-3" />
                                            Keluar
                                        </Badge>
                                    )}
                                </div>

                                {/* Angka detail */}
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs text-(--color-text-muted)">Jumlah</p>
                                        <p className={[
                                            'font-semibold',
                                            t.type === 'IN' ? 'text-blue-600' : 'text-red-500',
                                        ].join(' ')}>
                                            {t.type === 'IN' ? '+' : '-'}{t.quantity} {t.products?.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--color-text-muted)">Harga/unit</p>
                                        <p className="font-medium text-(--color-text-primary)">
                                            {rupiah(t.unit_price)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--color-text-muted)">Total</p>
                                        <p className={[
                                            'font-bold',
                                            t.type === 'OUT' ? 'text-green-600' : 'text-(--color-text-primary)',
                                        ].join(' ')}>
                                            {rupiah(t.total_price)}
                                        </p>
                                    </div>
                                </div>

                                {/* Catatan */}
                                {t.notes && (
                                    <p className="text-xs text-(--color-text-muted) border-t pt-2">
                                        📝 {t.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* Empty state */
                <Card className="p-12 bg-white">
                    <div className="text-center space-y-3">
                        {search || typeFilter !== 'all' ? (
                            <>
                                <div className="text-5xl">🔍</div>
                                <h3 className="text-lg font-semibold text-(--color-text-primary)">
                                    Transaksi tidak ditemukan
                                </h3>
                                <p className="text-sm text-(--color-text-muted)">
                                    Coba ubah kata kunci atau reset filter
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSearch(''); setTypeFilter('all') }}
                                >
                                    Reset Filter
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="text-5xl">📋</div>
                                <h3 className="text-lg font-semibold text-(--color-text-primary)">
                                    Belum Ada Transaksi
                                </h3>
                                <p className="text-sm text-(--color-text-muted)">
                                    Mulai catat barang masuk atau keluar
                                </p>
                                <div className="flex justify-center gap-3 pt-2">
                                    <Link to="/stock-in">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            <MdAdd className="h-4 w-4 mr-1" />
                                            Barang Masuk
                                        </Button>
                                    </Link>
                                    <Link to="/stock-out">
                                        <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50">
                                            <MdAdd className="h-4 w-4 mr-1" />
                                            Barang Keluar
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}