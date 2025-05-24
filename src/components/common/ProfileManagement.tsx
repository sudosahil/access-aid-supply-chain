import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
interface ProfileManagementProps {
  user: User;
}
export const ProfileManagement = ({
  user
}: ProfileManagementProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    organization: user.organization || ''
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user data
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated."
    });
  };
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="bg-slate-500">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal and contact information</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-500">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profilePhoto} />
              <AvatarFallback className="text-lg text-slate-50">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              <Button variant="outline" size="sm" className="mt-2 font-normal text-slate-500">
                Change Photo
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="bg-slate-400">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email" className="bg-slate-300">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="phone" className="bg-slate-400">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} required />
              </div>
              {user.role === 'contractor' && <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" value={formData.organization} onChange={e => handleChange('organization', e.target.value)} />
                </div>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address} onChange={e => handleChange('address', e.target.value)} rows={3} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};