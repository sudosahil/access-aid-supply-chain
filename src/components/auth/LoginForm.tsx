
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Lock, Mail, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await onLogin(email, password);
    
    if (!success) {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">SSEPD Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the procurement system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full hover:bg-gray-100 active:bg-gray-200" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-sm font-medium text-gray-700 text-center">
              Sample Credentials:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col hover:bg-gray-50 active:bg-gray-100"
                onClick={() => handleQuickLogin('admin1@ssepd.org', 'demo123')}
              >
                <User className="h-3 w-3 mb-1" />
                <span className="font-medium">Admin</span>
                <span className="text-gray-500">admin1 / demo123</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col hover:bg-gray-50 active:bg-gray-100"
                onClick={() => handleQuickLogin('staff1@ssepd.org', 'demo123')}
              >
                <User className="h-3 w-3 mb-1" />
                <span className="font-medium">Staff</span>
                <span className="text-gray-500">staff1 / demo123</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col hover:bg-gray-50 active:bg-gray-100"
                onClick={() => handleQuickLogin('contractor1@mobility.com', 'demo123')}
              >
                <User className="h-3 w-3 mb-1" />
                <span className="font-medium">Contractor</span>
                <span className="text-gray-500">contractor1 / demo123</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col hover:bg-gray-50 active:bg-gray-100"
                onClick={() => handleQuickLogin('warehouse1@ssepd.org', 'demo123')}
              >
                <User className="h-3 w-3 mb-1" />
                <span className="font-medium">Warehouse</span>
                <span className="text-gray-500">warehouse1 / demo123</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
