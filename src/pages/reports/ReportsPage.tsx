import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MdInventory, MdHistory } from 'react-icons/md';
import StockReport from '@/components/reports/StockReport';
import TransactionReport from '@/components/reports/TransactionReport';

export default function ReportsPage() {
    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-(--color-text-primary)">
                    Laporan
                </h2>
                <p className="text-sm text-(--color-text-muted)">
                    Lihat dan export laporan stok & transaksi
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="stock" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="stock" className="flex items-center gap-2">
                        <MdInventory className="h-4 w-4" />
                        <span>Laporan Stok</span>
                    </TabsTrigger>
                    <TabsTrigger value="transaction" className="flex items-center gap-2">
                        <MdHistory className="h-4 w-4" />
                        <span>Laporan Transaksi</span>
                    </TabsTrigger>
                </TabsList>

                {/* Stock Report Tab */}
                <TabsContent value="stock" className="mt-6">
                    <StockReport />
                </TabsContent>

                {/* Transaction Report Tab */}
                <TabsContent value="transaction" className="mt-6">
                    <TransactionReport />
                </TabsContent>
            </Tabs>
        </div>
    );
}