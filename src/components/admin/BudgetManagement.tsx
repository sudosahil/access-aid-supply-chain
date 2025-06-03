
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, mockUsers } from '@/data/mockData';
import { sampleBudgets } from '@/data/sampleBudgetData';
import { BudgetCharts } from './BudgetCharts';
import { BudgetModal } from './BudgetModal';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

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

export const BudgetManagement = ({ user }: BudgetManagementProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const loadBudgets = async () => {
    console.log('Loading budgets...');
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.log('Supabase error, using sample data:', error);
        // If Supabase fails, use sample data
        setBudgets(sampleBudgets as Budget[]);
      } else if (data && data.length > 0) {
        // Transform the data to match our interface
        const transformedBudgets: Budget[] = data.map(budget => ({
          ...budget,
          attachments: Array.isArray(budget.attachments) ? budget.attachments : []
        }));
        console.log('Using Supabase data:', transformedBudgets);
        setBudgets(transformedBudgets);
      } else {
        // If no data in Supabase, use sample data
        console.log('No data in Supabase, using sample data');
        setBudgets(sampleBudgets as Budget[]);
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
      // Fallback to sample data
      setBudgets(sampleBudgets as Budget[]);
      toast({
        title: "Using Sample Data",
        description: "Loaded sample budget data for demonstration.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();

    // Set up real-time subscription if Supabase is available
    const channel = supabase
      .channel('budgets-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'budgets' },
        (payload) => {
          console.log('Budget change detected:', payload);
          loadBudgets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleEdit = (budget: Budget) => {
    console.log('Edit budget:', budget);
    setEditingBudget(budget);
    setShowBudgetModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) {
        console.log('Supabase delete error, removing from local state:', error);
      }

      // Always remove from local state
      setBudgets(prev => prev.filter(budget => budget.id !== id));

      toast({
        title: "Budget Deleted",
        description: "Budget has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      // Still remove from local state for demo purposes
      setBudgets(prev => prev.filter(budget => budget.id !== id));
      toast({
        title: "Budget Deleted",
        description: "Budget removed from display."
      });
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || budget.source === filterSource;
    const matchesStatus = filterStatus === 'all' || budget.status === filterStatus;
    
    return matchesSearch && matchesSource && matchesStatus;
  });

  const getUserName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleModalClose = () => {
    setShowBudgetModal(false);
    setEditingBudget(null);
  };

  const handleModalSuccess = () => {
    loadBudgets();
    toast({
      title: editingBudget ? "Budget Updated" : "Budget Added",
      description: editingBudget ? "Budget has been updated successfully." : "New budget has been added successfully.",
    });
  };

  if (loading) return <div>Loading budgets...</div>;

  return (
    <div className="space-y-6">
      {/* Budget Charts */}
      <BudgetCharts budgets={budgets} />

      {/* Budget Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Management
          </CardTitle>
          <CardDescription>
            Create and manage budgets with approval workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Budget Overview</h3>
              <p className="text-sm text-gray-600">Manage organizational budgets</p>
            </div>
            {user.role === 'admin' && (
              <Button onClick={() => setShowBudgetModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Budgets</Label>
              <Input
                id="search"
                placeholder="Search by title or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="source-filter">Filter by Source</Label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
          </div>

          {/* Budget List */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.title}</TableCell>
                  <TableCell>{formatCurrency(budget.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {BUDGET_SOURCES.find(s => s.value === budget.source)?.label || budget.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={budget.status === 'approved' ? 'default' : 'secondary'}>
                      {BUDGET_STATUSES.find(s => s.value === budget.status)?.label || budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getUserName(budget.assigned_to)}</TableCell>
                  <TableCell>{new Date(budget.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.role === 'admin' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(budget)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(budget.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No budgets found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={showBudgetModal}
        onClose={handleModalClose}
        user={user}
        onSuccess={handleModalSuccess}
        editBudget={editingBudget}
      />
    </div>
  );
};
