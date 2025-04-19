import CommunityDetail from '@/components/Communities/CommunityDetail';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Post {
    id: number;
    title: string;
    excerpt: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface Member {
    id: number;
    name: string;
    joined_at: string;
    is_admin: boolean;
}

interface Community {
    id: number;
    name: string;
    description: string | null;
    rules: string | null;
    is_private: boolean;
    posts_count: number;
    members_count: number;
    created_at: string;
    is_member?: boolean;
    is_admin?: boolean;
    posts?: Post[];
    members?: Member[];
}

interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface ShowProps {
    community: Community;
    auth: Auth;
}

const Show: React.FC<ShowProps> = ({ community, auth }) => {
    return (
        <AppLayout createButtonText="Create Post" createButtonLink={route('posts.create', { community_id: community.id })}>
            <Head title={community.name} />
            <CommunityDetail community={community} auth={auth} />
        </AppLayout>
    );
};

export default Show;
