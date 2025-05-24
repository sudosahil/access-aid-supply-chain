
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const sampleCredentials = [
    { role: 'Admin', email: 'admin@ssepd.org', password: 'admin123' },
    { role: 'Staff', email: 'staff@ssepd.org', password: 'staff123' },
    { role: 'Contractor', email: 'contractor@mobility.com', password: 'contractor123' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">SSEPD Procurement</CardTitle>
            <CardDescription>Sign in to access the procurement and inventory management system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sample Login Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleCredentials.map((cred, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{cred.role}</p>
                  <p className="text-sm text-gray-600">Email: {cred.email}</p>
                  <p className="text-sm text-gray-600">Password: {cred.password}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
