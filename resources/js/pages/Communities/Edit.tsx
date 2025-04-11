import React from 'react';
import { useForm } from '@inertiajs/react';
import { PageProps } from '@/types/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Community</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{community.name}</CardTitle>
          <CardDescription>
            Update your community's information and settings
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className={errors.description ? "border-red-500" : ""}
                placeholder="Describe what your community is about"
                rows={3}
              />
              {errors.description && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.description}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="rules">Community Rules</Label>
              <Textarea
                id="rules"
                value={data.rules}
                onChange={(e) => setData('rules', e.target.value)}
                className={errors.rules ? "border-red-500" : ""}
                placeholder="Set guidelines for your community members"
                rows={5}
              />
              {errors.rules && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.rules}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <Separator />
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_private"
                checked={data.is_private}
                onCheckedChange={(checked) => setData('is_private', checked)}
              />
              <Label htmlFor="is_private">Make this community private</Label>
              {errors.is_private && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.is_private}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Update Community'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Edit;