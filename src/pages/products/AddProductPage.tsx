import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MdArrowBack } from 'react-icons/md';
import ProductForm from '@/components/products/ProductForm';
import type { ProductFormValues } from '@/schemas/product.schema';

export default function AddProductPage() {
    const navigate = useNavigate();

    const handleSubmit = async (data: ProductFormValues) => {
        try {
            // TODO: Implement Supabase insert
            console.log('Add product:', data);

            // Show success toast
            // toast.success('Produk berhasil ditambahkan');

            // Redirect to products page
            navigate('/products');
        } catch (error) {
            console.error('Error adding product:', error);
            // toast.error('Gagal menambahkan produk');
        }
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
                        Tambah Produk Baru
                    </h2>
                    <p className="text-sm text-(--color-text-muted)">
                        Lengkapi informasi produk di bawah ini
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="p-6 bg-white">
                <ProductForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/products')}
                />
            </Card>
        </div>
    );
}