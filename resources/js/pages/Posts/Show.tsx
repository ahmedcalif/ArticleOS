import PostDetail from '@/components/Posts/PostDetails';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Comment {
    id: number;
    post_id: number;
    user_id?: number;
    username?: string;
    content: string;
    created_at?: string;
    updated_at?: string;
}

interface Community {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    votes?: any;
    username?: any;
    community?: Community;
    community_id?: number;
    comments_count?: number;
    [key: string]: any;
}

interface ShowProps {
    post: Post;
    comments?: Comment[];
}

const Show: React.FC<ShowProps> = ({ post, comments = [] }) => {
    return (
        <AppLayout>
            <Head title={post.title} />
            <PostDetail post={post} comments={comments} />
        </AppLayout>
    );
};

export default Show;
