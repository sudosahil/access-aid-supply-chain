
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { approvalService, WorkflowInstance } from '@/services/approvalService';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/mockData';

interface PendingApprovalsProps {
  user: User;
}

export const PendingApprovals = ({ user }: PendingApprovalsProps) => {
  const [pendingApprovals, setPendingApprovals] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const loadPendingApprovals = async () => {
    try {
      const allWorkflows = await approvalService.getWorkflowInstances();
      
      // Filter workflows that are pending and require approval from current user
      const userPendingApprovals = allWorkflows.filter(workflow => {
        if (workflow.status !== 'pending') return false;
        
        // Find the current step that needs approval
        const currentStep = workflow.approval_steps?.find(step => 
          step.step_number === workflow.current_step && 
          step.status === 'pending' &&
          (step.approver_role === user.role || step.approver_user_id === user.id)
        );
        
        return !!currentStep;
      });
      
      setPendingApprovals(userPendingApprovals);
    } catch (error) {
      console.error('Error loading pending approvals:', error);
      toast({
        title: "Error",
        description: "Failed to load pending approvals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingApprovals();

    // Set up real-time subscription for workflow changes
    const channel = supabase
      .channel('pending-approvals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'approval_steps' },
        () => {
          console.log('Approval step changed, reloading pending approvals...');
          loadPendingApprovals();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workflow_instances' },
        () => {
          console.log('Workflow instance changed, reloading pending approvals...');
          loadPendingApprovals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, user.role]);

  const handleApproval = async (stepId: string, action: 'approved' | 'rejected') => {
    try {
      const comment = comments[stepId] || '';
      await approvalService.updateApprovalStep(stepId, action, comment);
      
      toast({
        title: `Request ${action}`,
        description: `The approval request has been ${action}`,
        variant: action === 'approved' ? 'default' : 'destructive'
      });
      
      // Clear comment and reload
      setComments(prev => ({ ...prev, [stepId]: '' }));
      loadPendingApprovals();
    } catch (error) {
      console.error('Error handling approval:', error);
      toast({
        title: "Error",
        description: "Failed to process approval",
        variant: "destructive"
      });
    }
  };

  const getCurrentStep = (workflow: WorkflowInstance) => {
    return workflow.approval_steps?.find(step => 
      step.step_number === workflow.current_step && 
      step.status === 'pending'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Pending Approval Requests
          </CardTitle>
          <CardDescription>
            Review and approve or reject requests that require your approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending approval requests at this time.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((workflow) => {
                  const currentStep = getCurrentStep(workflow);
                  if (!currentStep) return null;

                  return (
                    <TableRow key={workflow.id} className="bg-yellow-50">
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {workflow.document_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {workflow.document_id}
                      </TableCell>
                      <TableCell>{workflow.workflow?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor('pending')}>
                            Step {currentStep.step_number}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            ({currentStep.approver_role?.replace('_', ' ') || 'Specific User'})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(workflow.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Textarea
                          placeholder="Add comments (optional)"
                          value={comments[currentStep.id] || ''}
                          onChange={(e) => setComments(prev => ({
                            ...prev,
                            [currentStep.id]: e.target.value
                          }))}
                          className="min-h-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproval(currentStep.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproval(currentStep.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
