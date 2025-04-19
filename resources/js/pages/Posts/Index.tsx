import PostsList from '@/components/Dashboard/PostList';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Post {
    id: number;
    title: string;
    content: string;
    url?: string;
    userId?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    username?: string | any;
    community?: any;
    community_id?: number;
    votes?: any;
    comments_count?: number;
}

interface PostsPageProps {
    posts: Post[] | Post;
}

const PostsPage: React.FC<PostsPageProps> = ({ posts }) => {
    const postsArray = Array.isArray(posts) ? posts : [posts];

    return (
        <AppLayout>
            <Head title="Posts" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-semibold text-gray-900">All Posts</h1>
                    <PostsList posts={postsArray} />
                </div>
            </div>
        </AppLayout>
    );
};

export default PostsPage;
