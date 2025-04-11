import React from 'react';
import { useForm } from '@inertiajs/react';
import { PageProps } from '@/types/types';

interface Community {
  id: number;
  name: string;
  description: string | null;
  rules: string | null;
  is_private: boolean;
}

interface EditProps extends PageProps {
  community: Community;
}

const Edit: React.FC<EditProps> = ({ community }) => {
  const { data, setData, put, processing, errors } = useForm({
    description: community.description || '',
    rules: community.rules || '',
    is_private: community.is_private,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('communities.update', community.id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Community: {community.name}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : ''
            }`}
            rows={3}
          />
          {errors.description && (
            <div className="text-red-500 text-sm mt-1">{errors.description}</div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="rules" className="block text-gray-700 mb-2">
            Community Rules
          </label>
          <textarea
            id="rules"
            value={data.rules}
            onChange={(e) => setData('rules', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rules ? 'border-red-500' : ''
            }`}
            rows={5}
          />
          {errors.rules && (
            <div className="text-red-500 text-sm mt-1">{errors.rules}</div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_private}
              onChange={(e) => setData('is_private', e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-700">Make this community private</span>
          </label>
          {errors.is_private && (
            <div className="text-red-500 text-sm mt-1">{errors.is_private}</div>
          )}
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {processing ? 'Saving...' : 'Update Community'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;