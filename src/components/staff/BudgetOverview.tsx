
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { mockUsers } from '@/data/mockData';
import { sampleBudgets } from '@/data/sampleBudgetData';
import { DollarSign, TrendingUp, Filter, Eye } from 'lucide-react';
import { BudgetCharts } from '../admin/BudgetCharts';

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
  created_by: string;
  created_at: string;
}

export const BudgetOverview = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

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
    console.log('BudgetOverview: Loading budgets...');
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('BudgetOverview: Supabase response:', { data, error });

      if (error) {
        console.log('BudgetOverview: Supabase error, using sample data:', error);
        setBudgets(sampleBudgets as Budget[]);
      } else if (data && data.length > 0) {
        // Transform the data to match our interface
        const transformedBudgets: Budget[] = data.map(budget => ({
          ...budget,
          attachments: Array.isArray(budget.attachments) ? budget.attachments : []
        }));
        console.log('BudgetOverview: Using Supabase data:', transformedBudgets);
        setBudgets(transformedBudgets);
      } else {
        // If no data in Supabase, use sample data
        console.log('BudgetOverview: No data in Supabase, using sample data');
        setBudgets(sampleBudgets as Budget[]);
      }
    } catch (error) {
      console.error('BudgetOverview: Error loading budgets:', error);
      setBudgets(sampleBudgets as Budget[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();

    // Set up real-time subscription
    const channel = supabase
      .channel('budget-overview-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'budgets' },
        (payload) => {
          console.log('BudgetOverview: Budget change detected:', payload);
          loadBudgets(); // Reload data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
  const approvedBudgets = filteredBudgets.filter(b => b.status === 'approved' || b.status === 'active');
  const approvedAmount = approvedBudgets.reduce((sum, budget) => sum + budget.amount, 0);

  if (loading) return <div>Loading budget overview...</div>;

  return (
    <div className="space-y-6">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold">₹{approvedAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-purple-600" />
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
              <Eye className="h-8 w-8 text-orange-600" />
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

      {/* Budget List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>View all organizational budgets and their details</CardDescription>
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
                <TableHead>Approved By</TableHead>
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
                  <TableCell>{getUserName(budget.approved_by)}</TableCell>
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

          {filteredBudgets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No budgets found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
