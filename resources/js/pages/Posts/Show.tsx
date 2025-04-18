import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Post, Vote } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Award, Bookmark, MessageSquare, MoreHorizontal, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface Comment {
    id: number;
    post_id: number;
    user_id?: number;
    username?: string;
    content: string;
    created_at?: string;
    updated_at?: string;
}

interface ShowProps {
    post: Post;
    comments?: Comment[];
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

export default function Show({ post, comments = [] }: ShowProps) {
    const username = getUsernameString(post);
    const voteCount = Array.isArray(post.votes) ? countVotes(post.votes) : post.votes || 0;
    const timePosted = formatRelativeTime(post.created_at);
    const [commentText, setCommentText] = useState('');

    return (
        <>
            <Head title={post.title} />

            <div className="px-4 pt-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.visit(document.referrer || '/dashboard')}
                    className="text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="min-h-screen">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="pt-4 pb-2">
                        <div className="mb-1 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">r/</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">r/{post.community_id || 'general'}</span>
                            <span>•</span>
                            <span>{timePosted}</span>
                            <span>•</span>
                            <span>Posted by u/{username}</span>
                        </div>

                        <h1 className="mb-3 text-xl font-medium text-gray-900 dark:text-gray-100">{post.title}</h1>

                        {post.content && <div className="mb-4 whitespace-pre-line text-gray-700 dark:text-gray-300">{post.content}</div>}

                        <div className="border-b border-gray-200 pb-2 dark:border-gray-800">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                    <span>{voteCount}</span>
                                    <ThumbsDown className="ml-1 h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <MessageSquare className="mr-1 h-4 w-4" />
                                    <span>{post.comments_count || comments.length || 0} Comments</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Award className="mr-1 h-4 w-4" />
                                    <span>Award</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Share2 className="mr-1 h-4 w-4" />
                                    <span>Share</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Bookmark className="mr-1 h-4 w-4" />
                                    <span>Save</span>
                                </Button>

                                <Button variant="ghost" size="sm" className="flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="my-4">
                        <div className="rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
                            <textarea
                                className="min-h-[100px] w-full resize-none rounded-t-md border-none bg-white p-3 text-sm text-gray-700 placeholder-gray-500 focus:outline-none dark:bg-gray-900 dark:text-gray-300"
                                placeholder="What are your thoughts?"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            ></textarea>

                            <div className="flex justify-end rounded-b-md bg-gray-100 p-2 dark:bg-gray-800">
                                <Button
                                    className="rounded-md bg-gray-200 px-4 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    disabled={!commentText.trim()}
                                >
                                    Comment
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="mr-1">Sort by:</span>
                            <span className="font-medium">Best</span>
                        </div>

                        <div className="relative ml-auto">
                            <div className="flex items-center rounded-full border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-40 border-none bg-transparent px-3 py-1.5 text-xs text-gray-700 placeholder-gray-500 focus:outline-none dark:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {comments.length > 0 ? (
                        <div className="space-y-4 pb-12">
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-200 pb-3 dark:border-gray-800">
                                    <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">{comment.username || 'anonymous'}</span>
                                        <span className="mx-1">•</span>
                                        <span>{formatRelativeTime(comment.created_at)}</span>
                                    </div>
                                    <div className="mb-2 text-gray-700 dark:text-gray-300">{comment.content}</div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <ThumbsUp className="mr-1 h-3 w-3" />
                                            <span>0</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="mr-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <ThumbsDown className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            Reply
                                        </Button>
                                        <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            Award
                                        </Button>
                                        <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            Share
                                        </Button>
                                        <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
