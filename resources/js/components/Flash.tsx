// Flash.tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define the flash message type
interface FlashMessage {
    message?: string | null;
    type?: 'success' | 'error' | 'warning' | 'info' | string;
}

// Add to the PageProps interface
interface PageProps {
    flash?: FlashMessage;
    [key: string]: any;
}

export default function Flash() {
    const { flash = {} } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.message]);

    if (!flash?.message || !visible) return null;

    const typeToClass: Record<string, string> = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    const bgClass = typeToClass[flash.type || 'success'] || typeToClass.success;

    return (
        <Alert className={`fixed top-4 right-4 z-50 w-auto max-w-md shadow-md ${bgClass}`} variant="default">
            {flash.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            {flash.type !== 'success' && <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{flash.message}</AlertDescription>
            <button onClick={() => setVisible(false)} className="ml-4 text-sm focus:outline-none">
                &times;
            </button>
        </Alert>
    );
}
