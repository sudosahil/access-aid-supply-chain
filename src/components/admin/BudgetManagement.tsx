
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, User } from '@/data/mockData';
import { Plus, DollarSign, TrendingUp, Filter, Download } from 'lucide-react';
import { BudgetCharts } from './BudgetCharts';

interface Budget {
  id: string;
  title: string;
  amount: number;
  source: string;
  purpose: string;
  assigned_to: string | null;
  approved_by: string | null;
  status: string;
  notes: string | null;
  attachments: any[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface BudgetManagementProps {
  user: User;
}

export const BudgetManagement = ({ user }: BudgetManagementProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: 'government_grant',
    purpose: '',
    assigned_to: '',
    notes: ''
  });

  const BUDGET_SOURCES = [
    { value: 'government_grant', label: 'Government Grant' },
    { value: 'internal_allocation', label: 'Internal Allocation' },
    { value: 'donor_funding', label: 'Donor Funding' },
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'project_specific', label: 'Project Specific' },
    { value: 'other', label: 'Other' }
  ];

  const BUDGET_STATUSES = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const loadBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast({
        title: "Error",
        description: "Failed to load budgets.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();

    // Set up real-time subscription
    const channel = supabase
      .channel('budget-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'budgets' },
        () => loadBudgets()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateBudget = async () => {
    if (!formData.title || !formData.amount || !formData.purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('budgets').insert({
        title: formData.title,
        amount: parseFloat(formData.amount),
        source: formData.source,
        purpose: formData.purpose,
        assigned_to: formData.assigned_to || null,
        notes: formData.notes || null,
        created_by: user.id,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Budget Created",
        description: "New budget has been successfully created."
      });

      setFormData({
        title: '',
        amount: '',
        source: 'government_grant',
        purpose: '',
        assigned_to: '',
        notes: ''
      });
      setIsCreateModalOpen(false);
      loadBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const filteredBudgets = budgets.filter(budget => {
    if (filterStatus !== 'all' && budget.status !== filterStatus) return false;
    if (filterSource !== 'all' && budget.source !== filterSource) return false;
    return true;
  });

  const totalBudget = filteredBudgets.reduce((sum, budget) => sum + budget.amount, 0);

  if (loading) return <div>Loading budgets...</div>;

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Budgets</p>
                <p className="text-2xl font-bold">{budgets.filter(b => b.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{budgets.filter(b => b.status === 'pending_approval').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Charts */}
      <BudgetCharts budgets={budgets} />

      {/* Budget Management Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Create and manage organizational budgets</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Budget
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>Enter budget details and allocation information</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Budget Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter budget title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount (₹) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="source">Source of Funds</Label>
                        <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BUDGET_SOURCES.map(source => (
                              <SelectItem key={source.value} value={source.value}>
                                {source.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="assigned_to">Assigned To</Label>
                        <Select value={formData.assigned_to} onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Unassigned</SelectItem>
                            {mockUsers.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="purpose">Purpose/Specific Use *</Label>
                      <Textarea
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Describe the purpose and intended use of this budget"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes or comments"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateBudget}>
                        Create Budget
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {BUDGET_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {BUDGET_SOURCES.map(source => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.title}</TableCell>
                  <TableCell>₹{budget.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {BUDGET_SOURCES.find(s => s.value === budget.source)?.label || budget.source}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{budget.purpose}</TableCell>
                  <TableCell>{getUserName(budget.assigned_to)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(budget.status)}>
                      {BUDGET_STATUSES.find(s => s.value === budget.status)?.label || budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(budget.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
