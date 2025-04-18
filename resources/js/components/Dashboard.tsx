import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Post, Vote } from '@/types/types';
import { Bookmark, MessageSquare, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';

// Interface that matches your Post interface with additional display properties
interface RedditCardProps {
    id: number;
    title: string;
    content: string;
    url?: string;
    userId?: number;
    username?: string;
    subreddit?: string;
    votes?: number | Vote[];
    commentCount?: number;
    userAvatar?: string;
    created_at?: string;
    updated_at?: string;
}

// Format relative time (e.g., "5 hours ago")
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

export const RedditCard: React.FC<RedditCardProps> = ({
    id,
    title,
    content,
    subreddit = 'general',
    username = 'anonymous',
    votes = 0,
    commentCount = 0,
    userAvatar,
    created_at,
}) => {
    const timePosted = formatRelativeTime(created_at);

    const voteCount = Array.isArray(votes) ? votes.reduce((count, vote) => count + (vote.is_upvote ? 1 : -1), 0) : votes;

    return (
        <Card className="w-full max-w-2xl cursor-pointer transition-colors hover:border-gray-400">
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
                                {userAvatar ? <AvatarImage src={userAvatar} alt={subreddit} /> : <AvatarFallback>r/</AvatarFallback>}
                            </Avatar>
                            <span className="font-medium">r/{subreddit}</span>
                            <span>•</span>
                            <span>Posted by u/{username}</span>
                            <span>•</span>
                            <span>{timePosted}</span>
                        </div>
                        <h3 className="pt-1 text-lg font-medium">{title}</h3>
                    </CardHeader>

                    <CardContent className="pb-2">
                        <p className="text-sm text-gray-700">{content}</p>
                    </CardContent>

                    <CardFooter className="border-t border-gray-100 pt-2 pb-2">
                        <div className="flex items-center space-x-4 text-gray-500">
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
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
};
interface DashboardProps {
    posts: Post[];
}

// Helper function to get username string from User object or username property
const getUsernameString = (post: Post): string => {
    if (typeof post.username === 'string') {
        return post.username;
    } else if (post.username && 'name' in post.username) {
        return post.username.name;
    }
    return 'anonymous';
};

// Helper function to count upvotes
const countVotes = (votes: Vote[] | undefined): number => {
    if (!votes || votes.length === 0) return 0;

    return votes.reduce((count, vote) => {
        return count + (vote.is_upvote ? 1 : -1);
    }, 0);
};

export function DashboardComponent({ posts }: DashboardProps) {
    console.log('Dashboard posts:', posts);

    if (!posts || posts.length === 0) {
        return <div className="p-4 text-center">No posts found. Be the first to create one!</div>;
    }

    return (
        <div className="space-y-4 p-4">
            {posts.map((post) => (
                <RedditCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    username={getUsernameString(post)}
                    subreddit="general" // You can replace this with community name if available
                    votes={post.votes ? countVotes(post.votes) : 0}
                    commentCount={post.comments_count || 0}
                    created_at={post.created_at}
                    updated_at={post.updated_at}
                />
            ))}
        </div>
    );
}
