import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

// This matches your current middleware flash data structure
interface FlashData {
    message: string | null;
    type: 'success' | 'error' | 'info' | 'warning' | null;
}

// Interface for page props
interface PageProps {
    flash: FlashData;
    [key: string]: any;
}

export default function Flash() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if there's a flash message
        if (flash?.message) {
            setVisible(true);

            // Auto-hide the message after 5 seconds
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [flash]);

    // Don't render anything if there's no message or it's not visible
    if (!visible || !flash?.message) return null;

    const typeToClass: Record<string, string> = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    const bgClass = flash.type ? typeToClass[flash.type] : typeToClass.info;

    const IconComponent = () => {
        if (!flash.type) return <Info className="h-4 w-4" />;

        switch (flash.type) {
            case 'success':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'error':
                return <AlertCircle className="h-4 w-4" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4" />;
            case 'info':
                return <Info className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    return (
        <Alert className={`fixed top-4 right-4 z-50 w-auto max-w-md shadow-md ${bgClass}`} variant="default">
            <IconComponent />
            <AlertDescription>{flash.message}</AlertDescription>
            <button onClick={() => setVisible(false)} className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-200">
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </Alert>
    );
}
