
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Users, TrendingUp, Plus, Edit, Settings } from 'lucide-react';
import { useRealtimeApprovals } from '@/hooks/useRealtimeApprovals';
import { approvalService } from '@/services/approvalService';
import { workflowService } from '@/services/workflowService';
import { supabase } from '@/integrations/supabase/client';

const WORKFLOW_TYPES = [
  { value: 'budget_approval', label: 'Budget Approval' },
  { value: 'rfq_approval', label: 'RFQ Approval' },
  { value: 'bid_approval', label: 'Bid Approval' }
];

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'manager', label: 'Manager' },
  { value: 'finance_director', label: 'Finance Director' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'contractor', label: 'Contractor' }
];

export const EnhancedApprovalDashboard = () => {
  const { workflowInstances, loading, refetch } = useRealtimeApprovals();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showWorkflowForm, setShowWorkflowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const { toast } = useToast();

  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    description: '',
    workflow_type: 'budget_approval'
  });

  const loadWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('approval_workflows')
        .select(`
          *,
          workflow_steps(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: "Error",
        description: "Failed to load workflows.",
        variant: "destructive"
      });
    }
  };

  const handleApproval = async (stepId: string, action: 'approved' | 'rejected', comments?: string) => {
    try {
      await approvalService.updateApprovalStep(stepId, action, comments);
      toast({
        title: `Step ${action}`,
        description: `Approval step has been ${action}`,
      });
      refetch();
    } catch (error) {
      console.error('Error handling approval:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status",
        variant: "destructive"
      });
    }
  };

  const handleWorkflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingWorkflow) {
        const { error } = await supabase
          .from('approval_workflows')
          .update({
            name: workflowForm.name,
            description: workflowForm.description,
            workflow_type: workflowForm.workflow_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingWorkflow.id);

        if (error) throw error;

        toast({
          title: "Workflow Updated",
          description: "Workflow has been successfully updated."
        });
      } else {
        await workflowService.createWorkflow(workflowForm);

        toast({
          title: "Workflow Created",
          description: "Workflow has been successfully created."
        });
      }

      setWorkflowForm({ name: '', description: '', workflow_type: 'budget_approval' });
      setEditingWorkflow(null);
      setShowWorkflowForm(false);
      loadWorkflows();
    } catch (error: any) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save workflow.",
        variant: "destructive"
      });
    }
  };

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

  const getApprovalProgress = (steps: any[]) => {
    const approved = steps?.filter(step => step.status === 'approved').length || 0;
    return `${approved}/${steps?.length || 0}`;
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
                <p className="text-2xl font-bold">{workflowInstances.length}</p>
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
                  {workflowInstances.filter(w => w.status === 'approved').length}
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
                  {workflowInstances.filter(w => w.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Management Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Workflow Management
              </CardTitle>
              <CardDescription>
                Create and manage approval workflows
              </CardDescription>
            </div>
            <Button onClick={() => setShowWorkflowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {WORKFLOW_TYPES.find(t => t.value === workflow.workflow_type)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{workflow.workflow_steps?.length || 0} steps</TableCell>
                  <TableCell>
                    <Badge variant={workflow.is_default ? "default" : "secondary"}>
                      {workflow.is_default ? 'Default' : 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingWorkflow(workflow);
                        setWorkflowForm({
                          name: workflow.name,
                          description: workflow.description,
                          workflow_type: workflow.workflow_type
                        });
                        setShowWorkflowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Approval Workflows
          </CardTitle>
          <CardDescription>
            Monitor and manage approval processes with real-time status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflowInstances.map((instance) => (
            <div key={instance.id} className="mb-8 p-6 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {instance.document_type.toUpperCase()} - {instance.document_id}
                  </h3>
                  <p className="text-gray-600">
                    Workflow: {instance.workflow?.name} | 
                    Progress: {getApprovalProgress(instance.approval_steps || [])}
                  </p>
                </div>
                <Badge className={getStatusColor(instance.status)}>
                  {instance.status.toUpperCase()}
                </Badge>
              </div>

              {/* Approver Status Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instance.approval_steps
                    ?.sort((a, b) => a.step_number - b.step_number)
                    .map((step) => (
                      <TableRow 
                        key={step.id}
                        className={step.status === 'approved' ? 'bg-green-50' : 
                                  step.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'}
                      >
                        <TableCell>{step.step_number}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {step.approver_role?.replace('_', ' ') || 'Specific User'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <Badge className={getStatusColor(step.status)}>
                              {step.status === 'approved' ? '✅ Approved' :
                               step.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {step.approved_at ? 
                            new Date(step.approved_at).toLocaleDateString() : 
                            step.status === 'pending' ? '(Pending)' : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {step.comments || '-'}
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

              {(!instance.approval_steps || instance.approval_steps.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No approval steps defined for this workflow.
                </div>
              )}
            </div>
          ))}

          {workflowInstances.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No approval workflows found.</p>
              <p className="text-sm text-gray-400">Create an RFQ or Bid to see approval workflows here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Form Dialog */}
      <Dialog open={showWorkflowForm} onOpenChange={setShowWorkflowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
            </DialogTitle>
            <DialogDescription>
              Configure a new approval workflow for your organization
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWorkflowSubmit} className="space-y-4">
            <div>
              <Label htmlFor="workflow-name">Workflow Name*</Label>
              <Input
                id="workflow-name"
                value={workflowForm.name}
                onChange={(e) => setWorkflowForm({...workflowForm, name: e.target.value})}
                placeholder="Enter workflow name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="workflow-type">Workflow Type*</Label>
              <Select value={workflowForm.workflow_type} onValueChange={(value) => setWorkflowForm({...workflowForm, workflow_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Input
                id="workflow-description"
                value={workflowForm.description}
                onChange={(e) => setWorkflowForm({...workflowForm, description: e.target.value})}
                placeholder="Enter workflow description"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowWorkflowForm(false);
                setEditingWorkflow(null);
                setWorkflowForm({ name: '', description: '', workflow_type: 'budget_approval' });
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingWorkflow ? 'Update Workflow' : 'Create Workflow'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
