import { DashboardComponent } from '@/components/Dashboard/Dashboard';
import DashboardLayout from '@/layouts/dashboard-layout';
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
        <>
            <Head title="Dashboard" />
            <DashboardLayout>
                <DashboardComponent posts={posts} />
            </DashboardLayout>
        </>
    );
}
