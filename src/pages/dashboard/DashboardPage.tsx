import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    MdTrendingUp,
    MdTrendingDown,
    MdAttachMoney,
    MdToday,
} from "react-icons/md"

export default function DashboardPage() {
    // TODO: Replace dengan real data dari Supabase
    // Untuk sekarang pakai dummy data untuk visualisasi

    // Dummy data - 30 hari terakhir
    const metrics = {
        // Total Barang Keluar 30 hari terakhir
        totalOut: {
            transactions: 45,
            quantity: 234,
            totalValue: 12500000, // Rp 12.5 juta
        },
        // Total Barang Masuk 30 hari terakhir  
        totalIn: {
            transactions: 32,
            quantity: 450,
            totalValue: 9800000, // Rp 9.8 juta
        },
        // Keuntungan = Total OUT - Total IN (simplified untuk MVP)
        profit: {
            amount: 2700000, // Rp 2.7 juta
            percentage: 27.5, // 27.5% margin
        },
        // Transaksi Hari Ini
        today: {
            transactions: 8,
            inCount: 5,
            outCount: 3,
        }
    }

    // Helper function untuk format Rupiah
    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }

    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-(--color-text-primary)">
                    Ringkasan 30 Hari Terakhir
                </h2>
                <p className="text-sm text-(--color-text-muted)">
                    Statistik transaksi barang masuk & keluar
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Barang Keluar */}
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-red-500 p-3 rounded-lg">
                                <MdTrendingDown className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-(--color-text-muted)">
                                Barang Keluar
                            </p>
                            <h3 className="text-2xl font-bold text-(--color-text-primary)">
                                {formatRupiah(metrics.totalOut.totalValue)}
                            </h3>
                            <p className="text-xs text-(--color-text-muted)">
                                {metrics.totalOut.quantity} item • {metrics.totalOut.transactions} transaksi
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Barang Masuk */}
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <MdTrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-(--color-text-muted)">
                                Barang Masuk
                            </p>
                            <h3 className="text-2xl font-bold text-(--color-text-primary)">
                                {formatRupiah(metrics.totalIn.totalValue)}
                            </h3>
                            <p className="text-xs text-(--color-text-muted)">
                                {metrics.totalIn.quantity} item • {metrics.totalIn.transactions} transaksi
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Keuntungan */}
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-500 p-3 rounded-lg">
                                <MdAttachMoney className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-(--color-text-muted)">
                                Keuntungan
                            </p>
                            <h3 className="text-2xl font-bold text-green-600">
                                {formatRupiah(metrics.profit.amount)}
                            </h3>
                            <p className="text-xs text-(--color-text-muted)">
                                Margin {metrics.profit.percentage}%
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4: Transaksi Hari Ini */}
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-500 p-3 rounded-lg">
                                <MdToday className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-(--color-text-muted)">
                                Transaksi Hari Ini
                            </p>
                            <h3 className="text-2xl font-bold text-(--color-text-primary)">
                                {metrics.today.transactions}
                            </h3>
                            <p className="text-xs text-(--color-text-muted)">
                                {metrics.today.inCount} masuk • {metrics.today.outCount} keluar
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1 - Pergerakan Transaksi (7 hari terakhir) */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                            Pergerakan Transaksi
                        </CardTitle>
                        <p className="text-sm text-(--color-text-muted)">
                            Barang masuk vs keluar (7 hari terakhir)
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="text-center space-y-2">
                                <p className="text-(--color-text-muted)">
                                    Line Chart: IN vs OUT
                                </p>
                                <p className="text-xs text-(--color-text-muted)">
                                    (akan diimplementasi dengan Recharts)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart 2 - Top 5 Produk Terlaris */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                            Produk Terlaris
                        </CardTitle>
                        <p className="text-sm text-(--color-text-muted)">
                            Top 5 produk yang paling banyak keluar
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="text-center space-y-2">
                                <p className="text-(--color-text-muted)">
                                    Bar Chart: Top 5 Products
                                </p>
                                <p className="text-xs text-(--color-text-muted)">
                                    (akan diimplementasi dengan Recharts)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alert Section */}
            <Card className="border-none shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                        ⚠️ Produk Stok Menipis
                    </CardTitle>
                    <p className="text-sm text-(--color-text-muted)">
                        Produk yang perlu restock segera
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {/* Placeholder untuk low stock items */}
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-(--color-text-primary)">
                                        PLF-001 - Plafon PVC Putih 6m
                                    </p>
                                    <p className="text-sm text-(--color-text-muted)">
                                        Stok tersisa: <span className="font-semibold text-orange-600">8 batang</span> (Min: 20)
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                                    Restock
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-(--color-text-primary)">
                                        ACC-001 - Sekrup Plafon 3cm
                                    </p>
                                    <p className="text-sm text-(--color-text-muted)">
                                        Stok tersisa: <span className="font-semibold text-red-600">5 box</span> (Min: 10)
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
                                    Restock
                                </button>
                            </div>
                        </div>

                        {/* Empty state jika tidak ada low stock */}
                        {/* <div className="text-center py-8 text-[var(--color-text-muted)]">
                            <p>✅ Semua produk stoknya aman!</p>
                        </div> */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}