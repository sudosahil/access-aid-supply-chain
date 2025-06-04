
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { useRealtimeApprovals } from '@/hooks/useRealtimeApprovals';
import { approvalService } from '@/services/approvalService';

export const ApprovalDashboard = () => {
  const { workflowInstances, loading, refetch } = useRealtimeApprovals();
  const { toast } = useToast();

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
    </div>
  );
};
