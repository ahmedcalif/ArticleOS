import PostCreateForm from '@/components/Posts/PostCreateForm';
import { useFlash } from '@/hooks/use-flash';
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
    selectedCommunityId?: string;
}

const Create: React.FC<CreateProps> = ({ communities = [], selectedCommunityId = '', auth }) => {
    const flash = useFlash();

    return (
        <AppLayout createButtonText="Create Community" createButtonLink={route('communities.create')}>
            <Head title="Create Post" />

            <PostCreateForm communities={communities} selectedCommunityId={selectedCommunityId} flash={flash} />
        </AppLayout>
    );
};

export default Create;
