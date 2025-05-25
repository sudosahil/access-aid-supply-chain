
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    action: 'CREATE',
    entityType: 'RFQ',
    entityId: 'RFQ-001',
    userId: 'user-001',
    userName: 'John Smith',
    userRole: 'Staff',
    timestamp: '2024-01-20 14:30:00',
    details: 'Created new RFQ for Electric Wheelchairs',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'log-002',
    action: 'UPDATE',
    entityType: 'Supplier',
    entityId: 'SUP-001',
    userId: 'user-002',
    userName: 'Jane Doe',
    userRole: 'Staff',
    timestamp: '2024-01-20 13:15:00',
    details: 'Updated supplier status to approved',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'log-003',
    action: 'SUBMIT',
    entityType: 'Bid',
    entityId: 'BID-001',
    userId: 'user-003',
    userName: 'ABC Medical Supplies',
    userRole: 'Contractor',
    timestamp: '2024-01-20 12:00:00',
    details: 'Submitted bid for RFQ-001',
    ipAddress: '203.0.113.5'
  },
  {
    id: 'log-004',
    action: 'TRANSFER',
    entityType: 'Inventory',
    entityId: 'INV-001',
    userId: 'user-004',
    userName: 'Mike Johnson',
    userRole: 'Warehouse',
    timestamp: '2024-01-20 11:30:00',
    details: 'Transferred 10 units from Warehouse A to Warehouse B',
    ipAddress: '192.168.1.102'
  }
];

export const AuditLogs = () => {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const { toast } = useToast();

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'SUBMIT': return 'bg-purple-100 text-purple-800';
      case 'APPROVE': return 'bg-emerald-100 text-emerald-800';
      case 'REJECT': return 'bg-red-100 text-red-800';
      case 'TRANSFER': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    const matchesRole = userRoleFilter === 'all' || log.userRole.toLowerCase() === userRoleFilter;

    return matchesSearch && matchesAction && matchesEntity && matchesRole;
  });

  const handleExportLogs = () => {
    toast({
      title: "Logs Exported",
      description: "Audit logs have been exported successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Track all system activities and changes</CardDescription>
            </div>
            <Button onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="SUBMIT">Submit</SelectItem>
                <SelectItem value="APPROVE">Approve</SelectItem>
                <SelectItem value="REJECT">Reject</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="RFQ">RFQ</SelectItem>
                <SelectItem value="Bid">Bid</SelectItem>
                <SelectItem value="Supplier">Supplier</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.entityType}</div>
                      <div className="text-sm text-gray-500">{log.entityId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {log.userRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
