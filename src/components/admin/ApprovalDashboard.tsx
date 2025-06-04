
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Users, TrendingUp } from 'lucide-react';

interface ApprovalStep {
  id: string;
  step_number: number;
  approver_role: string;
  approver_name: string;
  approver_email: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  comments: string | null;
}

interface ApprovalWorkflow {
  id: string;
  budget_id: string;
  workflow_name: string;
  current_step: number;
  status: 'pending' | 'approved' | 'rejected';
  budget: {
    title: string;
    amount: number;
  };
  steps: ApprovalStep[];
}

export const ApprovalDashboard = () => {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadWorkflows = async () => {
    try {
      const { data: workflowData, error } = await supabase
        .from('approval_workflows')
        .select(`
          *,
          budget:budgets(title, amount),
          approval_steps(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading workflows:', error);
        // Create sample data if no workflows exist
        await createSampleWorkflow();
        return;
      }

      const transformedWorkflows = workflowData.map(workflow => ({
        ...workflow,
        steps: workflow.approval_steps || []
      }));

      setWorkflows(transformedWorkflows);
    } catch (error) {
      console.error('Error loading approval workflows:', error);
      await createSampleWorkflow();
    } finally {
      setLoading(false);
    }
  };

  const createSampleWorkflow = async () => {
    try {
      // First create a sample budget
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          title: 'Q3 Marketing Campaign',
          amount: 45000,
          source: 'internal_allocation',
          purpose: 'Marketing campaign for Q3 product launch',
          created_by: 'approver-1',
          status: 'pending_approval'
        })
        .select()
        .single();

      if (budgetError) {
        console.error('Error creating sample budget:', budgetError);
        return;
      }

      // Create approval workflow
      const { data: workflow, error: workflowError } = await supabase
        .from('approval_workflows')
        .insert({
          budget_id: budget.id,
          workflow_name: '3-Tier Approval Process',
          current_step: 1,
          status: 'pending'
        })
        .select()
        .single();

      if (workflowError) {
        console.error('Error creating workflow:', workflowError);
        return;
      }

      // Create approval steps
      const steps = [
        { step_number: 1, approver_role: 'manager', approver_name: 'Priya Rao', approver_email: 'priya@company.com' },
        { step_number: 2, approver_role: 'finance_lead', approver_name: 'Jordan Smith', approver_email: 'jordan@company.com' },
        { step_number: 3, approver_role: 'admin', approver_name: 'Alex Chen', approver_email: 'alex@company.com' }
      ];

      for (const step of steps) {
        await supabase
          .from('approval_steps')
          .insert({
            workflow_id: workflow.id,
            ...step,
            status: 'pending'
          });
      }

      toast({
        title: "Sample Data Created",
        description: "Created sample budget with 3-tier approval workflow",
      });

      // Reload workflows
      loadWorkflows();
    } catch (error) {
      console.error('Error creating sample workflow:', error);
    }
  };

  const handleApproval = async (stepId: string, action: 'approved' | 'rejected', comments?: string) => {
    try {
      const { error } = await supabase
        .from('approval_steps')
        .update({
          status: action,
          approved_at: action === 'approved' ? new Date().toISOString() : null,
          comments: comments || null
        })
        .eq('id', stepId);

      if (error) {
        console.error('Error updating approval step:', error);
        return;
      }

      toast({
        title: `Step ${action}`,
        description: `Approval step has been ${action}`,
      });

      loadWorkflows();
    } catch (error) {
      console.error('Error handling approval:', error);
    }
  };

  useEffect(() => {
    loadWorkflows();

    // Set up real-time subscription
    const channel = supabase
      .channel('approval-dashboard')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'approval_workflows' },
        () => loadWorkflows()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'approval_steps' },
        () => loadWorkflows()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getApprovalProgress = (steps: ApprovalStep[]) => {
    const approved = steps.filter(step => step.status === 'approved').length;
    return `${approved}/${steps.length}`;
  };

  if (loading) return <div>Loading approval dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Budget Approval Workflows
          </CardTitle>
          <CardDescription>
            Monitor and manage budget approval processes with real-time status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.map((workflow) => (
            <div key={workflow.id} className="mb-8 p-6 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{workflow.budget?.title}</h3>
                  <p className="text-gray-600">
                    Amount: ₹{workflow.budget?.amount?.toLocaleString()} | 
                    Progress: {getApprovalProgress(workflow.steps)}
                  </p>
                </div>
                <Badge className={getStatusColor(workflow.status)}>
                  {workflow.status.toUpperCase()}
                </Badge>
              </div>

              {/* Approver Status Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflow.steps
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((step) => (
                      <TableRow 
                        key={step.id}
                        className={step.status === 'approved' ? 'bg-green-50' : 
                                  step.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'}
                      >
                        <TableCell>{step.step_number}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <span className={
                              step.status === 'approved' ? 'text-green-800' :
                              step.status === 'rejected' ? 'text-red-800' : 'text-yellow-800'
                            }>
                              {step.approver_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {step.approver_role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(step.status)}>
                            {step.status === 'approved' ? '✅ Approved' :
                             step.status === 'rejected' ? '❌ Rejected' : '❌ Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {step.approved_at ? 
                            new Date(step.approved_at).toLocaleDateString() : 
                            step.status === 'pending' ? '(Overdue)' : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {step.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproval(step.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(step.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {workflow.steps.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No approval steps defined for this workflow.
                </div>
              )}
            </div>
          ))}

          {workflows.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No approval workflows found.</p>
              <Button onClick={createSampleWorkflow}>
                Create Sample Workflow
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
