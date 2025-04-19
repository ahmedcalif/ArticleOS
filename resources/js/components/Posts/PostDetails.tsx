import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ArrowLeft, Award, Bookmark, Edit, MessageSquare, MoreHorizontal, Share2, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Vote {
    is_upvote: boolean;
    [key: string]: any;
}

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

interface PostDetailProps {
    post: Post;
    comments?: Comment[];
    auth?: {
        // Keep as optional for compatibility
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

// Also update the Post interface to include the new properties
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
    console.log('Post UserName', post.username);
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

const PostDetail: React.FC<PostDetailProps> = (props) => {
    const { post, comments = [] } = props;

    const isLoggedIn = props.auth?.logged_in || post.is_logged_in || false;
    const currentUserId = props.auth?.user_id || post.current_user_id || null;
    const currentUser = props.auth?.user || null;

    // Create a consistent auth object
    const auth = {
        logged_in: isLoggedIn,
        user_id: currentUserId,
        user: currentUser,
    };

    // Add this line to define isCreator
    const isCreator = auth.logged_in && auth.user_id === post.user_id;

    console.log('Constructed auth object:', auth);
    console.log('Is creator?', isCreator);

    console.log('Constructed auth object:', auth);
    const username = getUsernameString(post);
    const voteCount = Array.isArray(post.votes) ? countVotes(post.votes) : post.votes || 0;
    const timePosted = formatRelativeTime(post.created_at);
    const [commentText, setCommentText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [editedTitle, setEditedTitle] = useState(post.title);

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    const communityName = post.community?.name || 'general';

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

        console.log('Submit clicked, auth state:', auth);

        if (!commentText.trim()) return;

        if (!auth.logged_in) {
            console.error('Not logged in');
            alert('You must be logged in to comment.');
            return;
        }

        console.log('Posting comment as user:', auth.user);

        router.post(
            '/comments',
            {
                content: commentText,
                post_id: post.id,
            },
            {
                onSuccess: (page) => {
                    setCommentText('');
                    console.log('Comment posted successfully', page);
                },
                onError: (errors) => {
                    console.error('Error posting comment:', errors);
                    alert('Error posting comment: ' + JSON.stringify(errors));
                },
            },
        );
    };
    const handleEditComment = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditedCommentContent(comment.content);
    };

    const handleUpdateComment = (id: number) => {
        router.patch(
            `/comments/${id}`,
            {
                content: editedCommentContent,
            },
            {
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditedCommentContent('');
                },
            },
        );
    };

    const handleDeleteComment = (id: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/comments/${id}`);
        }
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditedCommentContent('');
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

    const renderCommentActions = (comment: Comment) => {
        // Updated to use correct auth format
        if (!auth?.logged_in || auth.user_id !== comment.user_id) return null;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                        <MoreHorizontal className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                        <Edit className="mr-2 h-3 w-3" />
                        <span className="text-xs">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
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
                                <span>{post.comments_count || comments.length || 0} Comments</span>
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

                {comments.length > 0 ? (
                    <div className="space-y-4 pb-12">
                        {comments.map((comment) => (
                            <div key={comment.id} className="border-b border-gray-200 pb-3 dark:border-gray-800">
                                <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">{comment.username || 'anonymous'}</span>
                                    <span className="mx-1">•</span>
                                    <span>{formatRelativeTime(comment.created_at)}</span>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <div className="mb-2 space-y-2">
                                        <textarea
                                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            value={editedCommentContent}
                                            onChange={(e) => setEditedCommentContent(e.target.value)}
                                            rows={3}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCancelEditComment} className="px-2 py-1 text-xs">
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={() => handleUpdateComment(comment.id)} className="px-2 py-1 text-xs">
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-2 text-gray-700 dark:text-gray-300">{comment.content}</div>
                                )}

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
                                    {renderCommentActions(comment)}
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
    );
};

export default PostDetail;
