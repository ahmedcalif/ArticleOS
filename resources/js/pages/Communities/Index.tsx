import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Lock, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Community {
  id: number;
  name: string;
  description: string | null;
  is_private: boolean;
  posts_count: number;
  members_count: number;
}

interface IndexProps extends PageProps {
  communities: Community[];
}

const Index: React.FC<IndexProps> = ({ auth, communities }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-gray-500 mt-1">Discover and join communities that match your interests</p>
        </div>
        
        {auth.user && (
          <Button asChild className="shrink-0">
            <Link href={route('communities.create')}>
              Create Community
            </Link>
          </Button>
        )}
      </div>
      
      {communities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Users className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium">No communities found</h3>
            <p className="text-gray-500 text-center max-w-md mt-2">
              Be the first to create a community and start building your own network of people.
            </p>
            {auth.user && (
              <Button asChild className="mt-6">
                <Link href={route('communities.create')}>
                  Create Community
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={route('communities.show', community.id)}>
                      <CardTitle className="hover:text-blue-600 transition-colors">
                        {community.name}
                      </CardTitle>
                    </Link>
                  </div>
                  <Badge variant={community.is_private ? "secondary" : "outline"} className="ml-2">
                    {community.is_private ? (
                      <><Lock className="h-3 w-3 mr-1" /> Private</>
                    ) : (
                      <><Globe className="h-3 w-3 mr-1" /> Public</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 line-clamp-3 h-18 mb-4">
                  {community.description || 'No description provided'}
                </p>
              </CardContent>
              
              <CardFooter className="pt-2 border-t">
                <div className="flex justify-between w-full text-sm text-gray-500">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{community.posts_count} posts</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
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

export default Index;