
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Lock, Mail, User, Copy, CheckCircle, DollarSign, Users, Shield } from 'lucide-react';
import { testUsers, testScenarios, getRoleDisplayName, getRoleIcon, TestUser } from '@/data/testUsers';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export const EnhancedLoginForm = ({ onLogin }: EnhancedLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

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

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setLoading(true);
    setError('');
    
    const success = await onLogin(userEmail, userPassword);
    
    if (!success) {
      setError('Login failed');
    }
    
    setLoading(false);
  };

  const copyCredentials = (user: TestUser) => {
    const credentials = `Email: ${user.email}\nPassword: ${user.password}`;
    navigator.clipboard.writeText(credentials);
    toast({
      title: "Credentials Copied",
      description: `${user.name}'s login credentials copied to clipboard`,
    });
  };

  const formatBudgetLimit = (limit?: number) => {
    if (!limit) return 'No limit';
    return `$${(limit / 1000).toFixed(0)}k`;
  };

  const groupedTestUsers = testUsers.reduce((groups, user) => {
    const key = user.role;
    if (!groups[key]) groups[key] = [];
    groups[key].push(user);
    return groups;
  }, {} as Record<string, TestUser[]>);

  const productionUsers = testUsers.filter(user => 
    user.email.includes('@ssepd.org') || user.email.includes('@mobility.com')
  );

  const testEnvironmentUsers = testUsers.filter(user => 
    user.email.includes('@test.com') || user.email.includes('@co.com')
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">SSEPD Procurement System</CardTitle>
          <CardDescription className="text-center">
            Multi-tier approval workflow system with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="production" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="production">Production Login</TabsTrigger>
              <TabsTrigger value="test-roles">Test Environment</TabsTrigger>
              <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="production" className="space-y-4">
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
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <Separator />

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 text-center">
                  Production Quick Login:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {productionUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col hover:bg-gray-50"
                      onClick={() => handleQuickLogin(user.email, user.password)}
                      disabled={loading}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getRoleIcon(user.role)}</span>
                        <span className="font-medium">{getRoleDisplayName(user.role)}</span>
                      </div>
                      <span className="text-xs text-gray-500">{user.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test-roles" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Test Environment Users</h3>
                <p className="text-sm text-gray-600">Pre-configured users for testing approval workflows</p>
              </div>

              {/* Approval Chain 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Approval Chain 1 - Complete Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testEnvironmentUsers.filter(user => user.email.includes('@test.com')).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getRoleIcon(user.role)}</div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{getRoleDisplayName(user.role)}</div>
                          <div className="text-xs text-gray-500">
                            Email: {user.email}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {user.permissions.canApprove && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Approve up to {formatBudgetLimit(user.permissions.approvalLimit)}
                              </Badge>
                            )}
                            {user.permissions.canSubmitRequests && (
                              <Badge variant="outline" className="text-xs">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Request up to {formatBudgetLimit(user.permissions.requestLimit)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCredentials(user)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickLogin(user.email, user.password)}
                          disabled={loading}
                        >
                          <User className="h-4 w-4 mr-1" />
                          Login
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Additional Test Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Test Users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testEnvironmentUsers.filter(user => user.email.includes('@co.com')).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getRoleIcon(user.role)}</div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{getRoleDisplayName(user.role)} - {user.department}</div>
                          <div className="text-xs text-gray-500">
                            Email: {user.email}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {user.permissions.canApprove && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Approve up to {formatBudgetLimit(user.permissions.approvalLimit)}
                              </Badge>
                            )}
                            {user.permissions.canSubmitRequests && (
                              <Badge variant="outline" className="text-xs">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Request up to {formatBudgetLimit(user.permissions.requestLimit)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCredentials(user)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickLogin(user.email, user.password)}
                          disabled={loading}
                        >
                          <User className="h-4 w-4 mr-1" />
                          Login
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Preconfigured Test Scenarios</h3>
                <p className="text-sm text-gray-600">Test complete approval workflows with these scenarios</p>
              </div>

              {testScenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <CardTitle>{scenario.name}</CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Test Users:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scenario.users.map((userId) => {
                          const user = testUsers.find(u => u.id === userId);
                          return user ? (
                            <Badge key={userId} variant="outline">
                              {getRoleIcon(user.role)} {user.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Test Cases:</h4>
                      <ul className="space-y-1">
                        {scenario.testCases.map((testCase, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {testCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
