import CommunityEditForm from '@/components/Communities/CommunityEditForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Community {
    id: number;
    name: string;
    description: string | null;
    rules: string | null;
    is_private: boolean;
}

interface EditProps {
    community: Community;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

const Edit: React.FC<EditProps> = ({ community, auth }) => {
    return (
        <AppLayout createButtonText="Create Post" createButtonLink={route('posts.create')}>
            <Head title={`Edit Community: ${community.name}`} />
            <CommunityEditForm community={community} />
        </AppLayout>
    );
};

export default Edit;
