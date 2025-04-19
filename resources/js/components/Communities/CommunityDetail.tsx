import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react';
import { Calendar, Edit, Globe, Lock, MessageSquare, Settings, Users } from 'lucide-react';
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

interface User {
    id: number;
    name: string;
    email?: string;
}

interface Auth {
    user: User | null;
}

interface CommunityDetailProps {
    community: Community;
    auth: Auth;
}

const CommunityDetail: React.FC<CommunityDetailProps> = ({ community, auth }) => {
    const formattedDate = new Date(community.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex-1">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{community.name}</h1>
                                <Badge variant={community.is_private ? 'secondary' : 'outline'}>
                                    {community.is_private ? (
                                        <>
                                            <Lock className="mr-1 h-3 w-3" /> Private
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="mr-1 h-3 w-3" /> Public
                                        </>
                                    )}
                                </Badge>
                            </div>
                            <p className="flex items-center gap-1 text-gray-500">
                                <Calendar className="h-4 w-4" /> Created {formattedDate}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {!community.is_member && auth.user && <Button>Join Community</Button>}

                            {community.is_admin && (
                                <Button variant="outline" asChild>
                                    <Link href={route('communities.edit', community.id)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList>
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="members">Members</TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="mt-6">
                            {!community.posts || community.posts.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <div className="mb-4 rounded-full bg-gray-100 p-3">
                                            <MessageSquare className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <h3 className="text-lg font-medium">No posts yet</h3>
                                        <p className="mt-2 max-w-md text-center text-gray-500">
                                            Be the first to start a conversation in this community.
                                        </p>
                                        {community.is_member && (
                                            <Button className="mt-6" asChild>
                                                <Link href={route('posts.create', { community_id: community.id })}>Create Post</Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {community.posts.map((post) => (
                                        <Card key={post.id}>
                                            <CardHeader className="pb-3">
                                                <Link href={route('posts.show', post.id)}>
                                                    <CardTitle className="text-xl transition-colors hover:text-blue-600">{post.title}</CardTitle>
                                                </Link>
                                                <CardDescription>
                                                    Posted by {post.user.name} • {new Date(post.created_at).toLocaleDateString()}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600">{post.excerpt}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="about" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About this community</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-medium">Description</h3>
                                        <p className="text-gray-600">{community.description || 'No description provided.'}</p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="mb-2 font-medium">Rules</h3>
                                        {community.rules ? (
                                            <div className="prose max-w-none text-gray-600">
                                                {community.rules.split('\n').map((rule, index) => rule.trim() !== '' && <p key={index}>{rule}</p>)}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">No rules have been set for this community.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="members" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Members</CardTitle>
                                    <CardDescription>{community.members_count} people in this community</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!community.members || community.members.length === 0 ? (
                                        <div className="py-6 text-center">
                                            <p className="text-gray-500">Member information is not available.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {community.members.map((member) => (
                                                <div key={member.id} className="flex items-center justify-between py-3">
                                                    <div className="flex items-center">
                                                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{member.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Joined {new Date(member.joined_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {member.is_admin && <Badge variant="secondary">Admin</Badge>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="w-full space-y-6 md:w-80">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-gray-500" />
                                    <span>Members</span>
                                </div>
                                <span className="font-medium">{community.members_count || 0}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
                                    <span>Posts</span>
                                </div>
                                <span className="font-medium">{community.posts_count || 0}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                                    <span>Created</span>
                                </div>
                                <span className="font-medium">{formattedDate}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {community.is_member && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" asChild>
                                    <Link href={route('posts.create', { community_id: community.id })}>Create Post</Link>
                                </Button>

                                {community.is_admin && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={route('communities.edit', community.id)}>
                                            <Settings className="mr-2 h-4 w-4" /> Manage Community
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityDetail;
