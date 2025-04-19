import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import React from 'react';

interface LogoutButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ variant = 'ghost', size = 'default', className = '', children }) => {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            className={`flex items-center justify-start bg-gray-50 text-gray-900 hover:bg-gray-100 ${className}`}
        >
            <LogOut className="mr-2 h-5 w-5" />
            {children || 'Sign out'}
        </Button>
    );
};

export default LogoutButton;
