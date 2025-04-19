import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ArrowLeft, Award, Bookmark, Edit, MessageSquare, MoreHorizontal, Reply, Share2, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Vote {
    is_upvote: boolean;
    [key: string]: any;
}

interface Comment {
    id: number;
    post_id: number;
    parent_id?: number | null;
    user_id?: number;
    username?: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    replies?: Comment[];
}

interface Community {
    id: number;
    name: string;
}

interface PostDetailProps {
    post: Post;
    comments?: Comment[];
    auth?: {
        logged_in: boolean;
        user_id: number | null;
        user: {
            id: number;
            name: string;
            username: string;
            email: string;
            email_verified_at: string | null;
            created_at: string;
            updated_at: string;
        } | null;
    };
}

interface Post {
    id: number;
    title: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    votes?: Vote[] | number;
    username?: string | { name: string };
    current_user_id?: number | null;
    user_id?: number;
    is_creator?: boolean;
    community?: Community;
    community_id?: number;
    comments_count?: number;
    [key: string]: any;
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

const nestComments = (flatComments: Comment[] | undefined): Comment[] => {
    if (!flatComments || !Array.isArray(flatComments)) return [];

    const nested: Comment[] = [];
    const commentMap: Record<number, Comment & { replies: Comment[] }> = {};

    flatComments.forEach((comment) => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    flatComments.forEach((comment) => {
        if (comment.parent_id && commentMap[comment.parent_id]) {
            commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
        } else if (!comment.parent_id) {
            nested.push(commentMap[comment.id]);
        }
    });

    return nested;
};

const CommentComponent: React.FC<{
    comment: Comment;
    auth: { logged_in: boolean; user_id: number | null; user: any };
    postId: number;
    onReply: (parentId: number) => void;
}> = ({ comment, auth, postId, onReply }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(comment.content);
    };

    const handleUpdateComment = () => {
        router.patch(
            `/comments/${comment.id}`,
            { content: editedContent },
            {
                onSuccess: () => setIsEditing(false),
                onError: (errors) => {
                    console.error('Error updating comment:', errors);
                    alert('Error updating comment: ' + JSON.stringify(errors));
                },
            },
        );
    };

    const handleDeleteComment = () => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/comments/${comment.id}`);
        }
    };

    const handleReplyClick = () => {
        onReply(comment.id);
        setShowReplyForm(!showReplyForm);
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!replyContent.trim()) return;

        if (!auth.logged_in) {
            alert('You must be logged in to reply.');
            return;
        }

        router.post(
            '/comments',
            {
                content: replyContent,
                post_id: postId,
                parent_id: comment.id,
            },
            {
                onSuccess: () => {
                    setReplyContent('');
                    setShowReplyForm(false);
                },
                onError: (errors) => {
                    console.error('Error posting reply:', errors);
                    alert('Error posting reply: ' + JSON.stringify(errors));
                },
            },
        );
    };

    const canModifyComment = auth.logged_in && auth.user_id === comment.user_id;

    const renderCommentActions = () => {
        if (!canModifyComment) return null;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                        <MoreHorizontal className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-3 w-3" />
                        <span className="text-xs">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDeleteComment}
                        className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    >
                        <Trash2 className="mr-2 h-3 w-3" />
                        <span className="text-xs">Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
            <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{comment.username || 'anonymous'}</span>
                <span className="mx-1">•</span>
                <span>{formatRelativeTime(comment.created_at)}</span>
            </div>

            {isEditing ? (
                <div className="mb-2 space-y-2">
                    <textarea
                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit} className="px-2 py-1 text-xs">
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleUpdateComment} className="px-2 py-1 text-xs">
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mb-2 text-gray-700 dark:text-gray-300">{comment.content}</div>
            )}

            <div className="mb-2 flex items-center text-xs text-gray-500">
                <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    <span>0</span>
                </Button>
                <Button variant="ghost" size="sm" className="mr-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ThumbsDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleReplyClick}>
                    <Reply className="mr-1 h-3 w-3" />
                    Reply
                </Button>
                {renderCommentActions()}
            </div>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mb-4">
                    <textarea
                        className="min-h-[80px] w-full resize-none rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 placeholder-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    ></textarea>
                    <div className="mt-2 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setShowReplyForm(false)} className="text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="text-xs" disabled={!replyContent.trim()}>
                            Reply
                        </Button>
                    </div>
                </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentComponent key={reply.id} comment={reply} auth={auth} postId={postId} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

const PostDetail: React.FC<PostDetailProps> = (props) => {
    const { post, comments = [] } = props;

    const isLoggedIn = props.auth?.logged_in || post.is_logged_in || false;
    const currentUserId = props.auth?.user_id || post.current_user_id || null;
    const currentUser = props.auth?.user || null;

    const auth = {
        logged_in: isLoggedIn,
        user_id: currentUserId,
        user: currentUser,
    };

    const isCreator = auth.logged_in && auth.user_id === post.user_id;
    const username = getUsernameString(post);
    const voteCount = Array.isArray(post.votes) ? countVotes(post.votes) : post.votes || 0;
    const timePosted = formatRelativeTime(post.created_at);
    const [commentText, setCommentText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [replyingToId, setReplyingToId] = useState<number | null>(null);

    const communityName = post.community?.name || 'general';
    const nestedComments = nestComments(comments);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/posts/${post.id}`);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        router.patch(
            `/posts/${post.id}`,
            {
                title: editedTitle,
                content: editedContent,
            },
            {
                onSuccess: () => setIsEditing(false),
            },
        );
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(post.content);
        setEditedTitle(post.title);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) return;

        if (!auth.logged_in) {
            alert('You must be logged in to comment.');
            return;
        }

        router.post(
            '/comments',
            {
                content: commentText,
                post_id: post.id,
            },
            {
                onSuccess: () => setCommentText(''),
                onError: (errors) => {
                    console.error('Error posting comment:', errors);
                    alert('Error posting comment: ' + JSON.stringify(errors));
                },
            },
        );
    };

    const handleReplyClick = (parentId: number) => {
        setReplyingToId(replyingToId === parentId ? null : parentId);
    };

    const renderPostActions = () => {
        if (!isCreator) return null;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="min-h-screen">
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

            <div className="mx-auto max-w-3xl px-4">
                <div className="pt-4 pb-2">
                    <div className="mb-1 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">r/</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">r/{communityName}</span>
                        <span>•</span>
                        <span>{timePosted}</span>
                        <span>•</span>
                        <span>Posted by u/{username}</span>
                    </div>

                    {isEditing ? (
                        <div className="mb-4 space-y-3">
                            <input
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                rows={6}
                            />
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleSave}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="mb-3 text-xl font-medium text-gray-900 dark:text-gray-100">{post.title}</h1>
                            {post.content && <div className="mb-4 whitespace-pre-line text-gray-700 dark:text-gray-300">{post.content}</div>}
                        </>
                    )}

                    <div className="border-b border-gray-200 pb-2 dark:border-gray-800">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Button variant="ghost" size="sm" className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                <span>{voteCount}</span>
                                <ThumbsDown className="ml-1 h-4 w-4" />
                            </Button>

                            <Button variant="ghost" size="sm" className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                <span>
                                    {post.comments_count || nestedComments.length} {post.comments_count === 1 ? 'Comment' : 'Comments'}
                                </span>
                            </Button>

                            <Button variant="ghost" size="sm" className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Award className="mr-1 h-4 w-4" />
                                <span>Award</span>
                            </Button>

                            <Button variant="ghost" size="sm" className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Share2 className="mr-1 h-4 w-4" />
                                <span>Share</span>
                            </Button>

                            <Button variant="ghost" size="sm" className="mr-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Bookmark className="mr-1 h-4 w-4" />
                                <span>Save</span>
                            </Button>

                            {renderPostActions()}
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    <form onSubmit={handleCommentSubmit}>
                        <div className="rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
                            <textarea
                                className="min-h-[100px] w-full resize-none rounded-t-md border-none bg-white p-3 text-sm text-gray-700 placeholder-gray-500 focus:outline-none dark:bg-gray-900 dark:text-gray-300"
                                placeholder="What are your thoughts?"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            ></textarea>

                            <div className="flex justify-end rounded-b-md bg-gray-100 p-2 dark:bg-gray-800">
                                <Button
                                    type="submit"
                                    className="rounded-md bg-gray-200 px-4 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    disabled={!commentText.trim()}
                                >
                                    Comment
                                </Button>
                            </div>
                        </div>
                    </form>
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

                {nestedComments.length > 0 ? (
                    <div className="space-y-6 pb-12">
                        {nestedComments.map((comment) => (
                            <div key={comment.id} className="border-b border-gray-200 pb-4 dark:border-gray-800">
                                <CommentComponent comment={comment} auth={auth} postId={post.id} onReply={handleReplyClick} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        {post.comments_count === 0 ? <p>No comments yet. Be the first to comment!</p> : <p>Loading comments...</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;
