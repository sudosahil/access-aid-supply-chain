import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Shield } from 'lucide-react';
interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean;
}
export const LoginForm = ({
  onLogin
}: LoginFormProps) => {
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
  const sampleCredentials = [{
    role: 'Admin',
    email: 'admin@ssepd.org',
    password: 'admin123'
  }, {
    role: 'Staff',
    email: 'staff@ssepd.org',
    password: 'staff123'
  }, {
    role: 'Contractor',
    email: 'contractor@mobility.com',
    password: 'contractor123'
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Government Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-12 w-12 text-blue-800" />
            <Shield className="h-10 w-10 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Government of Odisha</h1>
          <p className="text-sm text-slate-600 mt-1">Social Security & Empowerment of Persons with Disabilities</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-800 to-slate-600 mx-auto mt-3 rounded-full"></div>
        </div>

        <Card className="gov-card shadow-lg">
          <CardHeader className="text-center pb-4 bg-[#6b9bae]">
            <CardTitle className="text-xl font-semibold text-slate-800">Secure Login</CardTitle>
            <CardDescription className="text-slate-600">
              Access the Procurement & Inventory Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-700 font-medium">Official Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@odisha.gov.in" required className="mt-1 border-slate-300 focus:border-blue-800 focus:ring-blue-800 bg-slate-300" />
              </div>
              <div className="bg-slate-100">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="mt-1 border-slate-300 focus:border-blue-800 focus:ring-blue-800 bg-slate-300" />
              </div>
              {error && <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>}
              <Button type="submit" className="w-full gov-button-primary h-11 text-base font-medium text-gray-950">
                Sign In to System
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="gov-card">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg text-slate-800">Demo Credentials</CardTitle>
            <CardDescription className="text-slate-600">
              Use these credentials for testing different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-50">
            <div className="space-y-3">
              {sampleCredentials.map((cred, index) => <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-slate-800">{cred.role}</p>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${cred.role === 'Admin' ? 'bg-slate-200 text-slate-800' : cred.role === 'Staff' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                      {cred.role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Email: <span className="font-mono">{cred.email}</span></p>
                  <p className="text-sm text-slate-600">Password: <span className="font-mono">{cred.password}</span></p>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-slate-500">
          <p>© 2024 Government of Odisha. All rights reserved.</p>
          <p className="mt-1">This is a secure government system. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>;
};