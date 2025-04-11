import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { PageProps } from '@/types/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_private: checked,
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
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Create a Community</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>New Community</CardTitle>
          <CardDescription>
            Create a new community to connect with people who share your interests
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.description}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rules">Community Rules</Label>
              <Textarea
                id="rules"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                className={errors.rules ? "border-red-500" : ""}
                rows={5}
              />
              {errors.rules && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.rules}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={handleSwitchChange}
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
          
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              disabled={processing}
              className="w-full sm:w-auto"
            >
              {processing ? 'Creating...' : 'Create Community'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Create;