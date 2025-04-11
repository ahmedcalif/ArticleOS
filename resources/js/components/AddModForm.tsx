import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface AddModeratorFormProps {
  communityId: number;
}

const AddModeratorForm: React.FC<AddModeratorFormProps> = ({ communityId }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    user_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('communities.moderators.add', communityId), {
      onSuccess: () => {
        reset();
        setIsFormVisible(false);
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add Moderator</h2>
        <button
          type="button"
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isFormVisible ? 'Cancel' : 'Add'}
        </button>
      </div>
      
      {isFormVisible && (
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="user_id" className="block text-gray-700 mb-2">
                User ID
              </label>
              <input
                id="user_id"
                type="text"
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.user_id ? 'border-red-500' : ''
                }`}
                placeholder="Enter user ID"
                required
              />
              {errors.user_id && (
                <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {processing ? 'Adding...' : 'Add Moderator'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Note: The user must be a member of the community before they can be added as a moderator.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddModeratorForm;