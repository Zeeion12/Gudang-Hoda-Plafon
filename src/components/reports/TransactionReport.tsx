import { useState } from 'react';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import DateRangePicker, { type DateRange } from './DateRangePicker';
import ExportButton from './ExportButton';

// Transaction type
type TransactionType = 'IN' | 'OUT';

interface Transaction {
    id: string;
    product_code: string;
    product_name: string;
    type: TransactionType;
    quantity: number;
    unit: string;
    price: number;
    total: number;
    transaction_date: string;
    notes: string | null;
}

// Dummy data untuk preview
const DUMMY_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        product_code: 'PLF-001',
        product_name: 'Plafon PVC Putih 6m',
        type: 'IN',
        quantity: 50,
        unit: 'batang',
        price: 45000,
        total: 2250000,
        transaction_date: '2024-02-08T10:30:00',
        notes: 'Pembelian dari supplier A',
    },
    {
        id: '2',
        product_code: 'PLF-001',
        product_name: 'Plafon PVC Putih 6m',
        type: 'OUT',
        quantity: 5,
        unit: 'batang',
        price: 55000,
        total: 275000,
        transaction_date: '2024-02-08T14:15:00',
        notes: 'Penjualan ke Toko Bangunan Jaya',
    },
    {
        id: '3',
        product_code: 'PLF-002',
        product_name: 'Plafon PVC Coklat 6m',
        type: 'IN',
        quantity: 30,
        unit: 'batang',
        price: 48000,
        total: 1440000,
        transaction_date: '2024-02-07T09:00:00',
        notes: null,
    },
    {
        id: '4',
        product_code: 'ACC-001',
        product_name: 'Sekrup Plafon 3cm',
        type: 'OUT',
        quantity: 10,
        unit: 'box',
        price: 20000,
        total: 200000,
        transaction_date: '2024-02-07T16:45:00',
        notes: 'Penjualan ke kontraktor',
    },
    {
        id: '5',
        product_code: 'PLF-002',
        product_name: 'Plafon PVC Coklat 6m',
        type: 'OUT',
        quantity: 12,
        unit: 'batang',
        price: 58000,
        total: 696000,
        transaction_date: '2024-02-06T11:20:00',
        notes: null,
    },
    {
        id: '6',
        product_code: 'ACC-002',
        product_name: 'Lem PVC 500ml',
        type: 'IN',
        quantity: 20,
        unit: 'pcs',
        price: 35000,
        total: 700000,
        transaction_date: '2024-02-05T13:30:00',
        notes: 'Restok bulanan',
    },
    {
        id: '7',
        product_code: 'PLF-003',
        product_name: 'Plafon PVC Motif Kayu 6m',
        type: 'OUT',
        quantity: 8,
        unit: 'batang',
        price: 65000,
        total: 520000,
        transaction_date: '2024-02-05T15:00:00',
        notes: 'Penjualan premium',
    },
];

export default function TransactionReport() {
    // Initialize dengan 30 hari terakhir
    const [dateRange, setDateRange] = useState<DateRange>(() => {
        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { from: monthAgo, to: today };
    });

    const [typeFilter, setTypeFilter] = useState<string>('all');

    // TODO: Replace dengan data dari Supabase
    const transactions = DUMMY_TRANSACTIONS;

    // Filter by transaction type
    const filteredTransactions =
        typeFilter === 'all'
            ? transactions
            : transactions.filter((t) => t.type === typeFilter);

    // Helper: Format Rupiah
    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate summary stats
    const summary = {
        totalTransactions: filteredTransactions.length,
        totalIn: {
            count: filteredTransactions.filter((t) => t.type === 'IN').length,
            quantity: filteredTransactions
                .filter((t) => t.type === 'IN')
                .reduce((sum, t) => sum + t.quantity, 0),
            value: filteredTransactions
                .filter((t) => t.type === 'IN')
                .reduce((sum, t) => sum + t.total, 0),
        },
        totalOut: {
            count: filteredTransactions.filter((t) => t.type === 'OUT').length,
            quantity: filteredTransactions
                .filter((t) => t.type === 'OUT')
                .reduce((sum, t) => sum + t.quantity, 0),
            value: filteredTransactions
                .filter((t) => t.type === 'OUT')
                .reduce((sum, t) => sum + t.total, 0),
        },
    };

    // Net change (OUT - IN untuk profit)
    summary.totalOut.value - summary.totalIn.value;

    // TODO: Implement actual Excel export logic
    const handleExport = async () => {
        console.log('Exporting transaction report to Excel...');
        console.log('Date range:', dateRange);
        console.log('Type filter:', typeFilter);
        // Simulate export delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Export complete!');
        // TODO: Use ExcelJS to generate actual file
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-(--color-text-muted)">
                                Total Barang Masuk
                            </p>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <MdTrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-(--color-text-primary) mb-1">
                            {summary.totalIn.quantity}
                        </h3>
                        <p className="text-xs text-(--color-text-muted)">
                            {summary.totalIn.count} transaksi • {formatRupiah(summary.totalIn.value)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-(--color-text-muted)">
                                Total Barang Keluar
                            </p>
                            <div className="bg-red-100 p-2 rounded-lg">
                                <MdTrendingDown className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-(--color-text-primary) mb-1">
                            {summary.totalOut.quantity}
                        </h3>
                        <p className="text-xs text-(--color-text-muted)">
                            {summary.totalOut.count} transaksi • {formatRupiah(summary.totalOut.value)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-(--color-text-muted)">
                                Total Transaksi
                            </p>
                        </div>
                        <h3 className="text-2xl font-bold text-(--color-text-primary) mb-1">
                            {summary.totalTransactions}
                        </h3>
                        <p className="text-xs text-green-600 font-medium">
                            Periode: {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM yyyy')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Export */}
            <Card className="border-none shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                        Laporan Transaksi
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Filter Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date Range Picker */}
                        <DateRangePicker value={dateRange} onChange={setDateRange} />

                        {/* Transaction Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-(--color-text-secondary)">
                                Jenis Transaksi
                            </label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Transaksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Transaksi</SelectItem>
                                    <SelectItem value="IN">Barang Masuk</SelectItem>
                                    <SelectItem value="OUT">Barang Keluar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Export Button */}
                        <div className="flex items-end">
                            <ExportButton onExport={handleExport} label="Export Laporan" />
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Tanggal</TableHead>
                                    <TableHead className="font-semibold">Kode</TableHead>
                                    <TableHead className="font-semibold">Produk</TableHead>
                                    <TableHead className="font-semibold text-center">
                                        Jenis
                                    </TableHead>
                                    <TableHead className="font-semibold text-center">
                                        Jumlah
                                    </TableHead>
                                    <TableHead className="font-semibold text-right">
                                        Harga
                                    </TableHead>
                                    <TableHead className="font-semibold text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="font-semibold">Keterangan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            {format(
                                                new Date(transaction.transaction_date),
                                                'dd MMM yyyy HH:mm'
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {transaction.product_code}
                                        </TableCell>
                                        <TableCell>{transaction.product_name}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        transaction.type === 'IN'
                                                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                            : 'bg-red-100 text-red-700 border-red-200'
                                                    }
                                                >
                                                    {transaction.type === 'IN' ? (
                                                        <>
                                                            <MdTrendingUp className="h-3 w-3 mr-1" />
                                                            Masuk
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdTrendingDown className="h-3 w-3 mr-1" />
                                                            Keluar
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold">
                                            {transaction.quantity} {transaction.unit}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            {formatRupiah(transaction.price)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatRupiah(transaction.total)}
                                        </TableCell>
                                        <TableCell className="text-sm text-(--color-text-muted) max-w-xs truncate">
                                            {transaction.notes || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-(--color-text-muted)">
                                                {transaction.product_code}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    transaction.type === 'IN'
                                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                }
                                            >
                                                {transaction.type === 'IN' ? 'Masuk' : 'Keluar'}
                                            </Badge>
                                        </div>
                                        <h4 className="font-semibold text-(--color-text-primary)">
                                            {transaction.product_name}
                                        </h4>
                                        <p className="text-xs text-(--color-text-muted) mt-1">
                                            {format(
                                                new Date(transaction.transaction_date),
                                                'dd MMM yyyy, HH:mm'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-(--color-text-muted) text-xs mb-1">
                                            Jumlah
                                        </p>
                                        <p className="font-semibold text-(--color-text-primary)">
                                            {transaction.quantity} {transaction.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-(--color-text-muted) text-xs mb-1">
                                            Harga Satuan
                                        </p>
                                        <p className="font-semibold text-(--color-text-primary)">
                                            {formatRupiah(transaction.price)}
                                        </p>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-(--color-text-muted)">
                                            Total Nilai
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                            {formatRupiah(transaction.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Notes */}
                                {transaction.notes && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-(--color-text-muted)">
                                            Keterangan:
                                        </p>
                                        <p className="text-sm text-(--color-text-primary) mt-1">
                                            {transaction.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-(--color-text-muted)">
                                Tidak ada transaksi yang ditemukan
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}