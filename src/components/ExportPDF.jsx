import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function ExportPDF({ onExport }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        // Brief delay to show loading state before synchronous PDF generation blocks thread
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            await onExport();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all
        ${isExporting
                    ? 'bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed'
                    : 'bg-[var(--text-primary)] text-[var(--bg-color)] hover:opacity-90 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                }`}
        >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export Report
        </button>
    );
}
