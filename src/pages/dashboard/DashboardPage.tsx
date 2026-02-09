import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FiPackage,
    FiTrendingUp,
    FiAlertTriangle,
    FiShoppingCart
} from "react-icons/fi"

export default function DashboardPage() {

    // Dummy data untuk metrics
    const metrics = [
        {
            title: "Total Produk",
            value: "248",
            icon: FiPackage,
            color: "bg-blue-500",
            trend: "+12 bulan ini"
        },
        {
            title: "Nilai Stok",
            value: "Rp 45.2M",
            icon: FiTrendingUp,
            color: "bg-green-500",
            trend: "+8.2% dari bulan lalu"
        },
        {
            title: "Stok Menipis",
            value: "8",
            icon: FiAlertTriangle,
            color: "bg-orange-500",
            trend: "Perlu restock"
        },
        {
            title: "Transaksi Hari Ini",
            value: "24",
            icon: FiShoppingCart,
            color: "bg-purple-500",
            trend: "15 masuk, 9 keluar"
        }
    ]

    return (
        <div className="w-full space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <Card
                        key={index}
                        className="border-none shadow-md hover:shadow-lg transition-shadow bg-white"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${metric.color} p-3 rounded-lg`}>
                                    <metric.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-(--color-text-muted)">
                                    {metric.title}
                                </p>
                                <h3 className="text-2xl font-bold text-(--color-text-primary)">
                                    {metric.value}
                                </h3>
                                <p className="text-xs text-(--color-text-muted)">
                                    {metric.trend}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1 - Pergerakan Stok */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                            Pergerakan Stok
                        </CardTitle>
                        <p className="text-sm text-(--color-text-muted)">
                            Transaksi 7 hari terakhir
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-(--color-text-muted)">
                                Chart akan ditampilkan di sini
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart 2 - Stok per Kategori */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-(--color-text-primary)">
                            Stok per Kategori
                        </CardTitle>
                        <p className="text-sm text-(--color-text-muted)">
                            Distribusi produk berdasarkan kategori
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-(--color-text-muted)">
                                Chart akan ditampilkan di sini
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}