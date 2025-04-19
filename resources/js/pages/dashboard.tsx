import { DashboardComponent } from '@/components/Dashboard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { ExtendedPost } from '@/types/types';
import { Head } from '@inertiajs/react';

export const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ posts }: { posts: ExtendedPost[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <DashboardComponent posts={posts} />
        </AppLayout>
    );
}
