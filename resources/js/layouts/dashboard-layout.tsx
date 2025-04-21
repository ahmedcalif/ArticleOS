import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
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
                                <Link href="/dashboard" className="text-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/communities" className="text-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium">
                                    Communities
                                </Link>
                                <Link href="/settings/profile" className="text-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium">
                                    Settings
                                </Link>
                            </nav>
                        </div>
                        <div>
                            <Button asChild className="flex items-center">
                                <Link href={route('posts.create')}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Create Post
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
};

export default DashboardLayout;
