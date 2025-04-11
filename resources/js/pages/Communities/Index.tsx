import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types/types';

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Communities</h1>
      
      <div className="flex justify-between mb-6">
        <div className="text-gray-600">Discover and join communities</div>
        {auth.user && (
          <Link href={route('communities.create')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Create Community
          </Link>
        )}
      </div>
      
      {communities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No communities found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <Link href={route('communities.show', community.id)} className="text-xl font-bold hover:text-blue-600">
                  {community.name}
                </Link>
                <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                  {community.is_private ? 'Private' : 'Public'}
                </span>
              </div>
              
              <p className="text-gray-600 my-3 line-clamp-2">
                {community.description || 'No description provided'}
              </p>
              
              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>{community.posts_count} posts</span>
                <span>{community.members_count} members</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;