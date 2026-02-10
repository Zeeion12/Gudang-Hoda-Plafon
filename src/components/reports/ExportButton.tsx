import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MdDownload } from 'react-icons/md';

interface ExportButtonProps {
    onExport: () => Promise<void>;
    disabled?: boolean;
    label?: string;
}

export default function ExportButton({
    onExport,
    disabled = false,
    label = 'Export ke Excel',
}: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await onExport();
        } catch (error) {
            console.error('Export error:', error);
            // TODO: Show toast error notification
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={disabled || isExporting}
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            <MdDownload className="h-4 w-4 mr-2" />
            {isExporting ? 'Mengexport...' : label}
        </Button>
    );
}