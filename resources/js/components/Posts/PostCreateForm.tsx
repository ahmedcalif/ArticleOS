import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

interface Community {
    id: number;
    name: string;
}

interface FormErrors {
    title?: string;
    content?: string;
    community_id?: string;
}

interface FlashMessage {
    hasMessage: boolean;
    message: string | null;
    type: 'success' | 'error';
}

interface PostCreateFormProps {
    communities: Community[];
    selectedCommunityId?: number;
    flash?: FlashMessage;
}

const PostCreateForm: React.FC<PostCreateFormProps> = ({
    communities = [],
    selectedCommunityId,
    flash = { hasMessage: false, message: null, type: 'success' },
}) => {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        community_id: selectedCommunityId || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'community_id' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('posts.store'), formData, {
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
        <div className="mx-auto max-w-3xl px-4 md:px-0">
            <h1 className="mb-6 text-3xl font-bold">Create Post</h1>

            {flash.hasMessage && (
                <Alert className={`mb-6 ${flash.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {flash.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>New Post</CardTitle>
                    <CardDescription>Share your thoughts with the community</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={errors.title ? 'border-red-500' : ''}
                                required
                            />
                            {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className={errors.content ? 'border-red-500' : ''}
                                rows={8}
                            />
                            {errors.content && <div className="text-sm text-red-500">{errors.content}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="community_id">Community *</Label>
                            <select
                                id="community_id"
                                name="community_id"
                                value={formData.community_id}
                                onChange={handleChange}
                                className={`w-full rounded-md border p-2 ${errors.community_id ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            >
                                <option value="">Select a community</option>
                                {communities.map((community) => (
                                    <option key={community.id} value={community.id}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                            {errors.community_id && <div className="text-sm text-red-500">{errors.community_id}</div>}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button type="button" variant="outline" onClick={() => router.visit(route('posts.index'))} className="mr-2">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Post'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default PostCreateForm;
