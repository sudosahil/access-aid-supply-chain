
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const TransferTrackingDashboard = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTransfers();
    setupRealtimeSubscriptions();
  }, []);

  const loadTransfers = async () => {
    try {
      const { data, error } = await supabase
        .from('transfer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransfers(data || []);
    } catch (error) {
      console.error('Error loading transfers:', error);
      toast({
        title: "Error",
        description: "Failed to load transfer data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('transfer-tracking')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transfer_requests'
      }, () => {
        loadTransfers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusBadge = (transfer: any) => {
    if (transfer.received_at) {
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    }
    if (transfer.approved_at) {
      return <Badge variant="default" className="bg-blue-600"><Truck className="h-3 w-3 mr-1" />In Transit</Badge>;
    }
    if (transfer.status === 'approved') {
      return <Badge variant="default" className="bg-blue-600"><Truck className="h-3 w-3 mr-1" />Approved</Badge>;
    }
    if (transfer.status === 'rejected') {
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Rejected</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  const calculateTransitTime = (transfer: any) => {
    if (!transfer.approved_at) return null;
    
    const start = new Date(transfer.approved_at);
    const end = transfer.received_at ? new Date(transfer.received_at) : new Date();
    const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    return hours;
  };

  const handleExportReport = () => {
    const csvContent = [
      'Transfer ID,Item,From,To,Status,Requested Date,Approved Date,Received Date,Transit Time (hours)',
      ...transfers.map(transfer => [
        transfer.id,
        transfer.item_name,
        transfer.from_warehouse,
        transfer.to_warehouse,
        transfer.status,
        transfer.request_date,
        transfer.approved_at || '',
        transfer.received_at || '',
        calculateTransitTime(transfer) || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfer-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Transfer tracking report has been downloaded"
    });
  };

  if (loading) {
    return <div className="p-6">Loading transfer data...</div>;
  }

  const stats = {
    total: transfers.length,
    pending: transfers.filter(t => t.status === 'pending').length,
    inTransit: transfers.filter(t => t.approved_at && !t.received_at).length,
    completed: transfers.filter(t => t.received_at).length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold">{stats.inTransit}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transfer Tracking Dashboard</CardTitle>
              <CardDescription>
                Monitor transfer timing and confirmation status across all warehouses
              </CardDescription>
            </div>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <Card key={transfer.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{transfer.item_name}</h3>
                        {getStatusBadge(transfer)}
                      </div>
                      <p className="text-sm text-gray-600">Transfer ID: {transfer.id}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">From:</span> {transfer.from_warehouse}
                        </div>
                        <div>
                          <span className="font-medium">To:</span> {transfer.to_warehouse}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {transfer.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Priority:</span> {transfer.priority}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Requested:</span> {new Date(transfer.request_date).toLocaleDateString()}
                        </div>
                        {transfer.approved_at && (
                          <div>
                            <span className="font-medium">Approved:</span> {new Date(transfer.approved_at).toLocaleString()}
                          </div>
                        )}
                        {transfer.received_at && (
                          <div>
                            <span className="font-medium">Received:</span> {new Date(transfer.received_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                      {calculateTransitTime(transfer) && (
                        <div className="text-sm">
                          <span className="font-medium">Transit Time:</span> {calculateTransitTime(transfer)} hours
                        </div>
                      )}
                      {transfer.confirmation_notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span> {transfer.confirmation_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
