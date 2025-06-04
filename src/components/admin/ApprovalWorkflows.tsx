
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/data/mockData';
import { Plus, Edit, Trash2, ArrowRight, Settings } from 'lucide-react';
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
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'contractor', label: 'Contractor' }
];

export const ApprovalWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWorkflowForm, setShowWorkflowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [showStepForm, setShowStepForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const { toast } = useToast();

  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    description: '',
    workflow_type: 'budget_approval'
  });

  const [stepForm, setStepForm] = useState({
    approver_type: 'role' as 'role' | 'user',
    approver_role: '',
    approver_user_id: ''
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

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
        const { error } = await supabase
          .from('approval_workflows')
          .insert({
            name: workflowForm.name,
            description: workflowForm.description,
            workflow_type: workflowForm.workflow_type,
            is_default: false,
            is_active: true
          });

        if (error) throw error;

        toast({
          title: "Workflow Created",
          description: "Workflow has been successfully created."
        });
      }

      setWorkflowForm({ name: '', description: '', workflow_type: 'budget_approval' });
      setEditingWorkflow(null);
      setShowWorkflowForm(false);
      loadWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow.",
        variant: "destructive"
      });
    }
  };

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWorkflow) {
      toast({
        title: "Error",
        description: "Please select a workflow first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const workflow = workflows.find(w => w.id === selectedWorkflow);
      if (!workflow) return;

      const { error } = await supabase
        .from('workflow_steps')
        .insert({
          workflow_id: selectedWorkflow,
          step_order: (workflow.workflow_steps?.length || 0) + 1,
          approver_type: stepForm.approver_type,
          approver_role: stepForm.approver_type === 'role' ? stepForm.approver_role : null,
          approver_user_id: stepForm.approver_type === 'user' ? stepForm.approver_user_id : null
        });

      if (error) throw error;

      setStepForm({ approver_type: 'role', approver_role: '', approver_user_id: '' });
      setShowStepForm(false);
      loadWorkflows();
      
      toast({
        title: "Step Added",
        description: "Workflow step has been successfully added."
      });
    } catch (error) {
      console.error('Error adding step:', error);
      toast({
        title: "Error",
        description: "Failed to add workflow step.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        const { error } = await supabase
          .from('approval_workflows')
          .update({ is_active: false })
          .eq('id', id);

        if (error) throw error;

        loadWorkflows();
        toast({
          title: "Workflow Deleted",
          description: "Workflow has been successfully deleted."
        });
      } catch (error) {
        console.error('Error deleting workflow:', error);
        toast({
          title: "Error",
          description: "Failed to delete workflow.",
          variant: "destructive"
        });
      }
    }
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  if (loading) return <div>Loading approval workflows...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Approval Workflows
              </CardTitle>
              <CardDescription>
                Create and manage approval workflows for different processes
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
                <TableHead>Description</TableHead>
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
                  <TableCell>{workflow.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {workflow.workflow_steps?.map((step: any, index: number) => (
                        <div key={step.id} className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {step.approver_type === 'role' 
                              ? ROLES.find(r => r.value === step.approver_role)?.label || step.approver_role
                              : getUserName(step.approver_user_id || '')}
                          </Badge>
                          {index < (workflow.workflow_steps?.length || 0) - 1 && (
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedWorkflow(workflow.id);
                          setShowStepForm(true);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={workflow.is_default ? "default" : "secondary"}>
                      {workflow.is_default ? 'Default' : 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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
                      {!workflow.is_default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {workflows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No workflows found. Default workflows should be created automatically.
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

      {/* Step Form Dialog */}
      <Dialog open={showStepForm} onOpenChange={setShowStepForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Workflow Step</DialogTitle>
            <DialogDescription>
              Add a new step to the workflow approval process
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStepSubmit} className="space-y-4">
            <div>
              <Label htmlFor="approver-type">Approver Type*</Label>
              <Select 
                value={stepForm.approver_type} 
                onValueChange={(value: 'role' | 'user') => {
                  setStepForm({
                    approver_type: value,
                    approver_role: '',
                    approver_user_id: ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="user">Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {stepForm.approver_type === 'role' ? (
              <div>
                <Label htmlFor="approver-role">Role*</Label>
                <Select 
                  value={stepForm.approver_role} 
                  onValueChange={(value) => setStepForm({...stepForm, approver_role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="approver-user">User*</Label>
                <Select 
                  value={stepForm.approver_user_id} 
                  onValueChange={(value) => setStepForm({...stepForm, approver_user_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowStepForm(false);
                setStepForm({ approver_type: 'role', approver_role: '', approver_user_id: '' });
              }}>
                Cancel
              </Button>
              <Button type="submit">
                Add Step
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
