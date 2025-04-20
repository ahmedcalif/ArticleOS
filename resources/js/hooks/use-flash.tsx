import { usePage } from '@inertiajs/react';

// Interface matching your existing flash data structure
interface FlashData {
    message: string | null;
    type: 'success' | 'error' | 'info' | 'warning' | null;
}

export interface UseFlashReturn {
    message: string | null;
    type: 'success' | 'error' | 'info' | 'warning' | null;
    hasMessage: boolean;
}

interface PageProps {
    flash: FlashData;
    [key: string]: any;
}

export function useFlash(): UseFlashReturn {
    const { flash } = usePage<PageProps>().props;

    return {
        message: flash?.message || null,
        type: flash?.type || null,
        hasMessage: !!flash?.message,
    };
}
