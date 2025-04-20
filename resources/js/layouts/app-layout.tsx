import Flash from '@/components/Flash';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
    createButtonText?: string;
    createButtonLink?: string;
    hideCreateButton?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    createButtonText = 'Create Post',
    createButtonLink = '/posts/create',
    hideCreateButton = false,
}) => {
    const isSettingsPage = window.location.pathname.startsWith('/settings');
    const shouldHideButton = hideCreateButton || isSettingsPage;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link href="/dashboard" className="text-xl font-bold">
                                    ArticleOS
                                </Link>
                            </div>
                            <nav className="ml-8 flex space-x-4">
                                <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                                    Dashboard
                                </Link>
                                <Link href="/communities" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                                    Communities
                                </Link>
                                <Link href="/settings/profile" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                                    Settings
                                </Link>
                            </nav>
                        </div>

                        {!shouldHideButton && (
                            <div>
                                <Button asChild className="flex items-center">
                                    <Link href={createButtonLink}>
                                        <Plus className="mr-1 h-4 w-4" />
                                        {createButtonText}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <Flash />
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
};

export default AppLayout;
