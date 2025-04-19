import CommunityCreateForm from '@/components/Communities/CreateCommunityForm';
import { useFlash } from '@/hooks/use-flash';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface CreateProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

const Create: React.FC<CreateProps> = ({ auth }) => {
    const flash = useFlash();

    return (
        <AppLayout createButtonText="Create Post" createButtonLink={route('posts.create')}>
            <Head title="Create Community" />
            <CommunityCreateForm flash={flash} />
        </AppLayout>
    );
};

export default Create;
