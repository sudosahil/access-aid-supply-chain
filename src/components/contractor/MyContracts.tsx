import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download } from 'lucide-react';
import { mockContracts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
interface MyContractsProps {
  contractorId: string;
}
export const MyContracts = ({
  contractorId
}: MyContractsProps) => {
  const myContracts = mockContracts.filter(contract => contract.contractorId === contractorId);
  const {
    toast
  } = useToast();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleDownloadContract = (contractTitle: string) => {
    toast({
      title: "Download Started",
      description: `${contractTitle} contract document is being downloaded.`
    });
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <CardTitle>My Contracts</CardTitle>
          <CardDescription className="text-slate-950">View and manage your awarded contracts</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-950">Title</TableHead>
                <TableHead className="bg-slate-950">Value</TableHead>
                <TableHead className="bg-slate-950">Start Date</TableHead>
                <TableHead className="bg-slate-950">End Date</TableHead>
                <TableHead className="bg-slate-950">Status</TableHead>
                <TableHead className="bg-slate-950">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myContracts.map(contract => <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title}</TableCell>
                  <TableCell>${contract.value.toLocaleString()}</TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
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
                            <DialogDescription>View contract information and documents</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">Title</h4>
                                <p className="text-sm text-gray-600">{contract.title}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Value</h4>
                                <p className="text-sm text-gray-600">${contract.value.toLocaleString()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Start Date</h4>
                                <p className="text-sm text-gray-600">{new Date(contract.startDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">End Date</h4>
                                <p className="text-sm text-gray-600">{new Date(contract.endDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">Documents</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {contract.documents.map((doc, index) => <Button key={index} variant="outline" size="sm" onClick={() => handleDownloadContract(doc)}>
                                    <Download className="h-3 w-3 mr-1" />
                                    {doc}
                                  </Button>)}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadContract(contract.title)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};