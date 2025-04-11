import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { PageProps } from '@/types/types';

interface CreateProps extends PageProps {}

interface FormErrors {
  name?: string;
  description?: string;
  rules?: string;
  is_private?: string;
  [key: string]: string | undefined;
}

const Create: React.FC<CreateProps> = () => {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    is_private: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    router.post(route('communities.store'), formData, {
      onError: (errors) => {
        setErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create a Community</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Community Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.name && (
            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
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
            name="rules"
            value={formData.rules}
            onChange={handleChange}
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
              name="is_private"
              checked={formData.is_private}
              onChange={handleCheckboxChange}
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            style={{ opacity: processing ? 0.5 : 1 }}
          >
            {processing ? 'Creating...' : 'Create Community'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;