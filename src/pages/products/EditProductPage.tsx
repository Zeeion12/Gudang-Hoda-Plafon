import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MdArrowBack } from 'react-icons/md';
import ProductForm from '@/components/products/ProductForm';
import type { ProductFormValues } from '@/schemas/product.schema';
import type { Product } from '@/types/product';

export default function EditProductPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch product dari Supabase by ID
        // For now, dummy data
        setTimeout(() => {
            setProduct({
                id: '1',
                code: 'PLF-001',
                name: 'Plafon PVC Putih 6m',
                category: 'Plafon PVC',
                unit: 'batang',
                current_stock: 8,
                min_stock: 20,
                last_buy_price: 45000,
                last_sell_price: 55000,
                description: 'Plafon PVC warna putih ukuran 6 meter',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
            setLoading(false);
        }, 500);
    }, [id]);

    const handleSubmit = async (data: ProductFormValues) => {
        try {
            // TODO: Implement Supabase update
            console.log('Update product:', id, data);

            // Show success toast
            // toast.success('Produk berhasil diperbarui');

            // Redirect to products page
            navigate('/products');
        } catch (error) {
            console.error('Error updating product:', error);
            // toast.error('Gagal memperbarui produk');
        }
    };

    if (loading) {
        return (
            <div className="w-full space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Card className="p-6 bg-white">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </Card>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full">
                <Card className="p-12 bg-white">
                    <div className="text-center space-y-4">
                        <div className="text-6xl">❌</div>
                        <h3 className="text-xl font-semibold text-(--color-text-primary)">
                            Produk Tidak Ditemukan
                        </h3>
                        <p className="text-sm text-(--color-text-muted)">
                            Produk yang Anda cari tidak ada atau telah dihapus
                        </p>
                        <Button onClick={() => navigate('/products')}>
                            Kembali ke Daftar Produk
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Prepare initial values for form
    const initialValues: ProductFormValues = {
        code: product.code,
        name: product.name,
        category: product.category,
        unit: product.unit,
        min_stock: product.min_stock,
        current_stock: product.current_stock,
        last_buy_price: product.last_buy_price,
        last_sell_price: product.last_sell_price,
        description: product.description,
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/products')}
                    className="hover:bg-gray-100"
                >
                    <MdArrowBack className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">
                        Edit Produk
                    </h2>
                    <p className="text-sm text-(--color-text-muted)">
                        {product.code} - {product.name}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="p-6 bg-white">
                <ProductForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/products')}
                    isEdit
                />
            </Card>
        </div>
    );
}