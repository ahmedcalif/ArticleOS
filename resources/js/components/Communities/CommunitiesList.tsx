import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Globe, Lock, MessageSquare, Users } from 'lucide-react';
import React from 'react';

interface Community {
    id: number;
    name: string;
    description: string | null;
    is_private: boolean;
    posts_count: number;
    members_count: number;
    [key: string]: any;
}

interface CommunitiesListProps {
    communities: Community[];
}

const CommunitiesList: React.FC<CommunitiesListProps> = ({ communities }) => {
    if (communities.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 rounded-full bg-gray-100 p-3">
                        <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium">No communities found</h3>
                    <p className="mt-2 max-w-md text-center text-gray-500">
                        Be the first to create a community and start building your own network of people.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
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
    );
};

export default CommunitiesList;
