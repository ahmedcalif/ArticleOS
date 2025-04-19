// resources/js/Pages/Communities/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Link } from '@inertiajs/react';
import { Globe, Lock, MessageSquare, Users } from 'lucide-react';
import React, { JSX } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    [key: string]: any;
}

interface Auth {
    user: User | null;
}

export interface Community {
    id: number;
    name: string;
    description: string | null;
    is_private: boolean;
    posts_count: number;
    members_count: number;
    [key: string]: any;
}

interface PageProps {
    auth: Auth;
    errors: Record<string, string[]>;
    [key: string]: any;
}

interface IndexProps extends PageProps {
    communities: Community[];
}

const Index: React.FC<IndexProps> & { layout?: (page: React.ReactNode) => JSX.Element } = ({ auth, communities }) => {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Communities</h1>
                    <p className="mt-1 text-gray-500">Discover and join communities that match your interests</p>
                </div>

                {auth.user && (
                    <Button asChild className="shrink-0">
                        <Link href={route('communities.create')}>Create Community</Link>
                    </Button>
                )}
            </div>

            {communities.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="mb-4 rounded-full bg-gray-100 p-3">
                            <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium">No communities found</h3>
                        <p className="mt-2 max-w-md text-center text-gray-500">
                            Be the first to create a community and start building your own network of people.
                        </p>
                        {auth.user && (
                            <Button asChild className="mt-6">
                                <Link href={route('communities.create')}>Create Community</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {communities.map((community) => (
                        <Card key={community.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link href={route('communities.show', community.id)}>
                                            <CardTitle className="transition-colors hover:text-blue-600">{community.name}</CardTitle>
                                        </Link>
                                    </div>
                                    <Badge variant={community.is_private ? 'secondary' : 'outline'} className="ml-2">
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
                            </CardHeader>

                            <CardContent>
                                <p className="mb-4 line-clamp-3 h-18 text-gray-600">{community.description || 'No description provided'}</p>
                            </CardContent>

                            <CardFooter className="border-t pt-2">
                                <div className="flex w-full justify-between text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <MessageSquare className="mr-1 h-4 w-4" />
                                        <span>{community.posts_count} posts</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-1 h-4 w-4" />
                                        <span>{community.members_count} members</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

Index.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;

export default Index;
