import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import React from 'react';

interface LogoutButtonProps {
    variant?: string;
    className?: string;
    children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '', children }) => {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="flex flex-col">
            <button
                onClick={handleLogout}
                className="flex h-10 w-full items-center justify-start rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
                <LogOut className="mr-2 h-5 w-5" />
                {children || 'Sign out'}
            </button>
            <p className="mt-1 text-sm text-gray-500">&nbsp;</p>
        </div>
    );
};

export default LogoutButton;
