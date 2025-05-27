
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Activity, User, Clock, MapPin } from 'lucide-react';
import { sampleAuditLogs } from '@/data/sampleData';

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [auditLogs] = useState(sampleAuditLogs);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE_RFQ': return 'bg-blue-100 text-blue-800';
      case 'APPROVE_BUDGET': return 'bg-green-100 text-green-800';
      case 'UPDATE_INVENTORY': return 'bg-yellow-100 text-yellow-800';
      case 'SUBMIT_BID': return 'bg-purple-100 text-purple-800';
      case 'CREATE_USER': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Audit Logs
          </CardTitle>
          <CardDescription>
            Track all system activities and user actions for security and compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE_RFQ">Create RFQ</SelectItem>
                <SelectItem value="APPROVE_BUDGET">Approve Budget</SelectItem>
                <SelectItem value="UPDATE_INVENTORY">Update Inventory</SelectItem>
                <SelectItem value="SUBMIT_BID">Submit Bid</SelectItem>
                <SelectItem value="CREATE_USER">Create User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600">{log.entity}</span>
                    </div>
                    <p className="font-medium">{log.details}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {log.ip_address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No audit logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
