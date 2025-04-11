import React from 'react';
import { Link, router } from '@inertiajs/react';
import { PageProps } from '@/types/types';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  comments_count: number;
  votes: any[]; // You might want to type this more specifically
}

interface User {
  id: number;
  name: string;
}

interface Community {
  id: number;
  name: string;
  description: string | null;
  rules: string | null;
  is_private: boolean;
  user_id: number;
  posts: Post[];
  moderators: User[];
}

interface ShowProps extends PageProps {
  community: Community;
  isMember: boolean;
  isModerator: boolean;
}

const Show: React.FC<ShowProps> = ({ auth, community, isMember, isModerator }) => {
  const handleJoin = () => {
    router.post(route('communities.join', community.id));
  };

  const handleLeave = () => {
    router.delete(route('communities.leave', community.id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <p className="text-gray-600 mt-2">{community.description || 'No description provided'}</p>
          </div>
          <div className="flex space-x-2">
            {isModerator && (
              <Link
                href={route('communities.edit', community.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Edit
              </Link>
            )}
            {auth.user && (
              <>
                {isMember ? (
                  <button
                    onClick={handleLeave}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Join
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Posts</h2>
            </div>
            
            {community.posts.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">No posts in this community yet.</p>
                {isMember && (
                  <Link
                    href={route('posts.create', { community_id: community.id })}
                    className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Create First Post
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {community.posts.map((post) => (
                  <div key={post.id} className="p-6">
                    <Link
                      href={route('posts.show', post.id)}
                      className="text-xl font-bold hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                    <div className="text-gray-500 text-sm mt-1">
                      Posted by {post.user.name} on {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-gray-700 mt-2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <span>{post.comments_count} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {isMember && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <Link
                href={route('posts.create', { community_id: community.id })}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full block text-center"
              >
                Create Post
              </Link>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">About</h2>
            </div>
            <div className="p-4">
              <p className="text-gray-600">
                {community.description || 'No description provided'}
              </p>
            </div>
          </div>
          
          {community.rules && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Rules</h2>
              </div>
              <div className="p-4">
                <p className="text-gray-600 whitespace-pre-line">{community.rules}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Moderators</h2>
            </div>
            <div className="p-4">
              {community.moderators.length === 0 ? (
                <p className="text-gray-600">No moderators assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {community.moderators.map((mod) => (
                    <li key={mod.id} className="flex items-center">
                      <span className="text-gray-700">{mod.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;