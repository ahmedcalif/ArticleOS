import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Bookmark, ChevronDown, MessageSquare, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';

interface Community {
    id: number;
    name: string;
    description?: string | null;
    is_private?: boolean;
    [key: string]: any;
}

interface User {
    id: number;
    name: string;
}

interface Vote {
    is_upvote: boolean;
    [key: string]: any;
}

interface Post {
    id: number;
    title: string;
    content: string;
    url?: string;
    user_id?: number;
    username?: string | User;
    community?: Community | null;
    community_id?: number;
    votes?: Vote[] | number;
    comments_count?: number;
    created_at?: string;
    updated_at?: string;
}

interface PostCardProps {
    id: number;
    title: string;
    content: string;
    username?: string;
    community?: Community | null;
    community_id?: number;
    votes?: number | Vote[];
    commentCount?: number;
    userAvatar?: string;
    created_at?: string;
    updated_at?: string;
    onShowMore?: (id: number) => void;
}

const formatRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return 'recently';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
};

export const PostCard: React.FC<PostCardProps> = ({
    id,
    title,
    content,
    community,
    community_id,
    username = 'anonymous',
    votes = 0,
    commentCount = 0,
    userAvatar,
    created_at,
    onShowMore = () => {},
}) => {
    const timePosted = formatRelativeTime(created_at);
    const [truncateContent, setTruncateContent] = useState(true);
    const contentPreviewLength = 150;
    const shouldTruncate = content.length > contentPreviewLength;

    // Get community name
    let communityName = 'general';
    if (community && typeof community === 'object' && 'name' in community) {
        communityName = community.name;
    }

    const voteCount = Array.isArray(votes) ? votes.reduce((count, vote) => count + (vote.is_upvote ? 1 : -1), 0) : votes;

    const handleShowMoreClick = () => {
        onShowMore(id);
    };

    return (
        <div className="flex w-full justify-center px-4">
            <Card className="w-full max-w-xl cursor-pointer transition-colors hover:border-gray-400">
                <div className="flex">
                    <div className="flex w-10 flex-col items-center rounded-l-lg bg-gray-50 py-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{voteCount}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1">
                        <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Avatar className="h-5 w-5">
                                    {userAvatar ? <AvatarImage src={userAvatar} alt={communityName} /> : <AvatarFallback>r/</AvatarFallback>}
                                </Avatar>
                                <span className="font-medium">r/{communityName}</span>
                                <span>•</span>
                                <span>Posted by u/{username}</span>
                                <span>•</span>
                                <span>{timePosted}</span>
                            </div>
                            <h3 className="pt-1 text-lg font-medium">{title}</h3>
                        </CardHeader>

                        <CardContent className="pb-2">
                            <p className="text-sm text-gray-700">
                                {truncateContent && shouldTruncate ? `${content.substring(0, contentPreviewLength)}...` : content}
                            </p>
                        </CardContent>

                        <CardFooter className="flex flex-wrap border-t border-gray-100 pt-2 pb-2">
                            <div className="flex flex-grow items-center space-x-4 text-gray-500">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{commentCount} Comments</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                    <Bookmark className="h-4 w-4" />
                                    <span>Save</span>
                                </Button>
                            </div>

                            <Button variant="outline" size="sm" className="mt-2 ml-auto text-xs sm:mt-0" asChild>
                                <Link href={route('posts.show', id)}>
                                    <span>Show More</span>
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </div>
                </div>
            </Card>
        </div>
    );
};

interface PostsListProps {
    posts: Post[];
    onShowPost?: (id: number) => void;
}

const getUsernameString = (post: Post): string => {
    if (typeof post.username === 'string') {
        return post.username;
    } else if (post.username && typeof post.username === 'object' && 'name' in post.username) {
        return post.username.name;
    }
    return 'anonymous';
};

const countVotes = (votes: Vote[] | undefined): number => {
    if (!votes || votes.length === 0) return 0;

    return votes.reduce((count, vote) => {
        return count + (vote.is_upvote ? 1 : -1);
    }, 0);
};

const PostsList: React.FC<PostsListProps> = ({ posts, onShowPost = () => {} }) => {
    if (!posts || posts.length === 0) {
        return <div className="p-4 text-center">No posts found. Be the first to create one!</div>;
    }

    return (
        <div className="space-y-4 p-4">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    username={getUsernameString(post)}
                    community={post.community}
                    community_id={post.community_id}
                    votes={post.votes ? (Array.isArray(post.votes) ? countVotes(post.votes) : post.votes) : 0}
                    commentCount={post.comments_count || 0}
                    created_at={post.created_at}
                    updated_at={post.updated_at}
                    onShowMore={onShowPost}
                />
            ))}
        </div>
    );
};

export default PostsList;
