
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Play, Eye, Users, Clock, CheckCircle } from 'lucide-react';
import { approvalService } from '@/services/approvalService';
import { budgetService } from '@/services/budgetService';
import { supabase } from '@/integrations/supabase/client';

export const WorkflowTestingDashboard = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);
  const { toast } = useToast();

  const [testForm, setTestForm] = useState({
    type: 'budget' as 'budget' | 'rfq',
    title: '',
    amount: '',
    description: '',
    workflow_id: ''
  });

  const loadData = async () => {
    try {
      const [workflowData, budgetData] = await Promise.all([
        approvalService.getWorkflowInstances(),
        budgetService.getBudgets()
      ]);
      
      setWorkflows(workflowData);
      setBudgets(budgetData);
    } catch (error) {
      console.error('Error loading workflow testing data:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Set up real-time subscriptions
    const workflowChannel = supabase
      .channel('workflow-testing-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_instances' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'approval_steps' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(workflowChannel);
    };
  }, []);

  const createTestWorkflow = async () => {
    try {
      if (testForm.type === 'budget') {
        // Create a test budget
        const budgetData = {
          title: testForm.title,
          amount: parseFloat(testForm.amount),
          source: 'government_grant' as const,
          purpose: testForm.description,
          notes: 'Test budget for workflow testing'
        };

        const budget = await budgetService.createBudget(budgetData, 'test-user');
        
        // Create workflow instance for the budget
        await approvalService.createWorkflowInstance('budget', budget.id, testForm.workflow_id);
        
        toast({
          title: "Test Workflow Created",
          description: `Budget workflow created successfully for ${testForm.title}`,
        });
      }

      setTestForm({ type: 'budget', title: '', amount: '', description: '', workflow_id: '' });
      setShowTestForm(false);
      loadData();
    } catch (error: any) {
      console.error('Error creating test workflow:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test workflow",
        variant: "destructive"
      });
    }
  };

  const getWorkflowProgress = (workflow: any) => {
    if (!workflow.approval_steps) return 0;
    const approvedSteps = workflow.approval_steps.filter((step: any) => step.status === 'approved').length;
    return (approvedSteps / workflow.approval_steps.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div>Loading workflow testing dashboard...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Workflow Testing Dashboard
              </CardTitle>
              <CardDescription>
                Create and monitor test approval workflows for system validation
              </CardDescription>
            </div>
            <Dialog open={showTestForm} onOpenChange={setShowTestForm}>
              <DialogTrigger asChild>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Create Test Workflow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Test Workflow</DialogTitle>
                  <DialogDescription>
                    Create a test approval workflow for validation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Workflow Type</Label>
                    <Select 
                      value={testForm.type} 
                      onValueChange={(value: 'budget' | 'rfq') => setTestForm({...testForm, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget Approval</SelectItem>
                        <SelectItem value="rfq">RFQ Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={testForm.title}
                      onChange={(e) => setTestForm({...testForm, title: e.target.value})}
                      placeholder="Enter workflow title"
                    />
                  </div>

                  {testForm.type === 'budget' && (
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={testForm.amount}
                        onChange={(e) => setTestForm({...testForm, amount: e.target.value})}
                        placeholder="Enter amount"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={testForm.description}
                      onChange={(e) => setTestForm({...testForm, description: e.target.value})}
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowTestForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createTestWorkflow}>
                      Create Workflow
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                    <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'pending').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'approved').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
                    <p className="text-2xl font-bold">2.5h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-mono text-sm">
                    {workflow.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {workflow.document_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{workflow.document_id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getWorkflowProgress(workflow)}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    Step {workflow.current_step} of {workflow.approval_steps?.length || 0}
                  </TableCell>
                  <TableCell>
                    {new Date(workflow.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {workflows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No test workflows found. Create one to start testing the approval process.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
