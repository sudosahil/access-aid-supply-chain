
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { sampleContracts } from '@/data/sampleData';

interface MyContractsProps {
  contractorId: string;
}

export const MyContracts = ({ contractorId }: MyContractsProps) => {
  const [contracts] = useState(sampleContracts);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateProgress = (milestones: any[]) => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    return (completed / milestones.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Contracts
          </CardTitle>
          <CardDescription>
            Manage your active contracts and track milestone progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {contracts.map((contract) => (
              <Card key={contract.id} className="border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{contract.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {contract.start_date} - {contract.end_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ₹{(contract.amount / 100000).toFixed(1)}L
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Deliverables */}
                    <div>
                      <h4 className="font-medium mb-2">Deliverables</h4>
                      <ul className="space-y-1">
                        {contract.deliverables.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Overall Progress</h4>
                        <span className="text-sm text-gray-600">
                          {calculateProgress(contract.milestones).toFixed(0)}% Complete
                        </span>
                      </div>
                      <Progress value={calculateProgress(contract.milestones)} className="h-2" />
                    </div>

                    {/* Milestones */}
                    <div>
                      <h4 className="font-medium mb-3">Milestones</h4>
                      <div className="space-y-3">
                        {contract.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            {getMilestoneIcon(milestone.status)}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{milestone.description}</p>
                              <p className="text-xs text-gray-600">Due: {milestone.due_date}</p>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Submit Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {contracts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No contracts found.</p>
              <p className="text-sm">Awarded contracts will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
