import PostCreateForm from '@/components/Posts/PostCreateForm';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types/types';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Community {
    id: number;
    name: string;
}

interface CreateProps extends PageProps {
    communities: Community[];
    selectedCommunityId?: number;
}

const Create: React.FC<CreateProps> = ({ communities, selectedCommunityId, auth }) => {
    return (
        <AppLayout>
            <Head title="Create Post" />
            <PostCreateForm communities={communities} selectedCommunityId={selectedCommunityId} />
        </AppLayout>
    );
};

export default Create;
