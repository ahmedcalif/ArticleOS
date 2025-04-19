import CommunitiesList from '@/components/Communities/CommunitiesList';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Community {
    id: number;
    name: string;
    description: string | null;
    is_private: boolean;
    posts_count: number;
    members_count: number;
    [key: string]: any;
}

interface IndexProps {
    communities: Community[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

const CommunitiesIndex: React.FC<IndexProps> = ({ auth, communities }) => {
    return (
        <AppLayout createButtonText="Create Community" createButtonLink={route('communities.create')}>
            <Head title="Communities" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Communities</h1>
                        <p className="mt-1 text-gray-500">Discover and join communities that match your interests</p>
                    </div>
                </div>

                <CommunitiesList communities={communities} />
            </div>
        </AppLayout>
    );
};

export default CommunitiesIndex;
