import { RedditCard } from '@/components/Dashboard';

interface Post {
    id: number;
    title: string;
    content: string;
    url?: string;
    userId?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    username?: string;
    subreddit?: string;
}

interface PostsPageProps {
    posts: Post[] | Post;
}

export default function PostsPage({ posts }: PostsPageProps) {
    console.log('Received posts:', posts);

    if (!posts) {
        return <div className="p-4 text-center">No posts found</div>;
    }

    if (Array.isArray(posts)) {
        return (
            <div className="space-y-4 p-4">
                {posts.map((post) => (
                    <RedditCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        username={post.username || 'anonymous'}
                        subreddit={post.subreddit || 'general'}
                        votes={0}
                        commentCount={0}
                        created_at={post.createdAt?.toString()}
                        updated_at={post.updatedAt?.toString()}
                    />
                ))}
            </div>
        );
    } else {
        // Single post display
        return (
            <div className="p-4">
                <RedditCard
                    id={posts.id}
                    title={posts.title}
                    content={posts.content}
                    username={posts.username || 'anonymous'}
                    subreddit={posts.subreddit || 'general'}
                    votes={0}
                    commentCount={0}
                    created_at={posts.createdAt?.toString()}
                    updated_at={posts.updatedAt?.toString()}
                />
            </div>
        );
    }
}
