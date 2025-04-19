import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Post, Vote } from '@/types/types';
import { Link } from '@inertiajs/react';
import { Bookmark, MessageSquare, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Community {
    id: number;
    name: string;
    description?: string | null;
    is_private?: boolean;
    [key: string]: any;
}

interface ExtendedPost extends Post {
    community: Community | null;
}

interface RedditCardProps {
    id: number;
    title: string;
    content: string;
    url?: string;
    userId?: number;
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

export const RedditCard: React.FC<RedditCardProps> = ({
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

    // Enhanced debugging
    useEffect(() => {
        console.group(`Post ${id} Debug Data`);
        console.log('Complete post props:', {
            id,
            title,
            content,
            community,
            community_id,
            username,
            votes,
            commentCount,
            created_at,
        });

        // Type checking for community
        console.log('Community type:', community ? typeof community : 'undefined/null');
        if (community) {
            console.log('Community is array?', Array.isArray(community));
            console.log('Community keys:', Object.keys(community));
            console.log('Community values:', Object.values(community));
            console.log('Community prototype:', Object.getPrototypeOf(community));
            console.log('Community JSON string:', JSON.stringify(community));
        }

        // Community ID check
        console.log('Community ID type:', typeof community_id);
        console.log('Community ID value:', community_id);

        console.groupEnd();
    }, [id, title, community, community_id]);

    // More robust community name determination
    let communityName = 'general';

    if (community) {
        if (typeof community === 'object') {
            if ('name' in community && community.name) {
                communityName = community.name;
                console.log(`Using community name from object: ${communityName}`);
            } else {
                console.log('Community object exists but has no name property!', community);
            }
        } else if (typeof community === 'string') {
            communityName = community;
            console.log(`Using community as string: ${communityName}`);
        } else {
            console.log(`Unknown community type: ${typeof community}`);
        }
    } else {
        console.log(`No community object, using default: ${communityName}`);
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
                        <Link href={`/posts/${id}`}>
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
                            </CardFooter>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

interface DashboardProps {
    posts: ExtendedPost[];
    onShowPost?: (id: number) => void;
}

const getUsernameString = (post: Post): string => {
    if (typeof post.username === 'string') {
        return post.username;
    } else if (post.username && 'name' in post.username) {
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

export function DashboardComponent({ posts, onShowPost = () => {} }: DashboardProps) {
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
                    community={post.community}
                    community_id={post.community_id}
                    votes={post.votes ? countVotes(post.votes) : 0}
                    commentCount={post.comments_count || 0}
                    created_at={post.created_at}
                    updated_at={post.updated_at}
                    onShowMore={onShowPost}
                />
            ))}
        </div>
    );
}
