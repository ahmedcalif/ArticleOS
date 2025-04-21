import Flash from '@/components/Flash';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Moon, Plus, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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

    // State to track dark mode
    const [darkMode, setDarkMode] = useState(false);

    // Initialize dark mode on component mount
    useEffect(() => {
        // Check if user has previously set a preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set dark mode based on saved preference or system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setDarkMode(true);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <header className="border-border bg-card sticky top-0 z-10 border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link href="/dashboard" className="text-foreground text-xl font-bold">
                                    ArticleOS
                                </Link>
                            </div>
                            <nav className="ml-8 flex space-x-4">
                                <Link
                                    href="/dashboard"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/communities"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium"
                                >
                                    Communities
                                </Link>
                                <Link
                                    href="/settings/profile"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium"
                                >
                                    Settings
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleDarkMode}
                                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-2"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            {!shouldHideButton && (
                                <Button asChild>
                                    <Link href={createButtonLink}>
                                        <Plus className="mr-1 h-4 w-4" />
                                        {createButtonText}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <Flash />
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
};

export default AppLayout;
