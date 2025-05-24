
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Eye, FileText } from 'lucide-react';
import { mockContracts, mockUsers, Contract } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const ContractManagement = () => {
  const [contracts, setContracts] = useState(mockContracts);
  const { toast } = useToast();

  const handleActivateContract = (contractId: string) => {
    setContracts(contracts.map(contract =>
      contract.id === contractId ? { ...contract, status: 'active' } : contract
    ));
    toast({
      title: "Contract Activated",
      description: "Contract has been activated and is now in effect.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractorName = (contractorId: string) => {
    const contractor = mockUsers.find(u => u.id === contractorId);
    return contractor ? contractor.name : 'Unknown Contractor';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Manage contracts and agreements</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Contract
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title}</TableCell>
                  <TableCell>{getContractorName(contract.contractorId)}</TableCell>
                  <TableCell>${contract.value.toLocaleString()}</TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status.charAt(0).toUpper() + contract.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Contract Details</DialogTitle>
                            <DialogDescription>Review contract information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">Title</h4>
                                <p className="text-sm text-gray-600">{contract.title}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Contractor</h4>
                                <p className="text-sm text-gray-600">{getContractorName(contract.contractorId)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Value</h4>
                                <p className="text-sm text-gray-600">${contract.value.toLocaleString()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Duration</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">Documents</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {contract.documents.map((doc, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {doc}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {contract.status === 'draft' && (
                        <Button size="sm" onClick={() => handleActivateContract(contract.id)}>
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
