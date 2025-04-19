// useFlash.tsx`
import { usePage } from '@inertiajs/react';

type FlashType = 'success' | 'error' | 'warning' | 'info';

interface FlashMessage {
    message: string | null;
    type: FlashType;
}

interface PageProps {
    flash: FlashMessage;
    [key: string]: any;
}

export interface FlashData {
    message: string | null;
    type: FlashType;
    isVisible: boolean;
    hasMessage: boolean;
}

export function useFlash(): FlashData {
    const { flash } = usePage<PageProps>().props;
    console.log('Flash data:', flash.message);

    return {
        message: flash?.message || null,
        type: flash?.type || 'success',
        isVisible: !!flash?.message,
        hasMessage: !!flash?.message,
    };
}
