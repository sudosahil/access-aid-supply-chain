
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Clock, Users, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const LiveBidViewing = () => {
  const [liveBids, setLiveBids] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    setupRealtimeSubscriptions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // Load bids with related RFQ data
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .order('created_at', { ascending: false });

      if (bidError) throw bidError;

      // Load RFQs
      const { data: rfqData, error: rfqError } = await supabase
        .from('rfqs')
        .select('*')
        .eq('status', 'published');

      if (rfqError) throw rfqError;

      setLiveBids(bidData || []);
      setRfqs(rfqData || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading live bids:', error);
      toast({
        title: "Error",
        description: "Failed to load live bid data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('live-bids')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids'
      }, (payload) => {
        console.log('New bid received:', payload);
        loadData();
        toast({
          title: "New Bid Received",
          description: `New bid from ${payload.new.supplier_name}`,
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bids'
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getRfqTitle = (rfqId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    return rfq ? rfq.title : 'Unknown RFQ';
  };

  const getBidStats = (rfqId: string) => {
    const bidsForRfq = liveBids.filter(bid => bid.rfq_id === rfqId);
    return {
      count: bidsForRfq.length,
      lowestAmount: bidsForRfq.length > 0 ? Math.min(...bidsForRfq.map(b => b.amount)) : 0,
      latestBid: bidsForRfq.length > 0 ? bidsForRfq[0].created_at : null
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Submitted</Badge>;
      case 'under_review':
        return <Badge variant="default" className="bg-blue-600">Under Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return <div className="p-6">Loading live bid data...</div>;
  }

  const groupedByRfq = rfqs.map(rfq => ({
    rfq,
    bids: liveBids.filter(bid => bid.rfq_id === rfq.id),
    stats: getBidStats(rfq.id)
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Bid Viewing Dashboard
              </CardTitle>
              <CardDescription>
                Real-time monitoring of contractor bid submissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bids</p>
                    <p className="text-2xl font-bold">{liveBids.length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active RFQs</p>
                    <p className="text-2xl font-bold">{rfqs.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recent Bids (24h)</p>
                    <p className="text-2xl font-bold">
                      {liveBids.filter(bid => 
                        new Date(bid.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                      ).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {groupedByRfq.map(({ rfq, bids, stats }) => (
              <Card key={rfq.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{rfq.title}</CardTitle>
                      <CardDescription>RFQ ID: {rfq.id}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{stats.count} bids</Badge>
                      {stats.lowestAmount > 0 && (
                        <Badge variant="default" className="bg-green-600">
                          Lowest: ₹{stats.lowestAmount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {bids.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No bids submitted yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bids.map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="space-y-1">
                            <h4 className="font-medium">{bid.supplier_name}</h4>
                            <p className="text-sm text-gray-600">
                              Submitted: {new Date(bid.created_at).toLocaleString()}
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                              ₹{bid.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(bid.status)}
                            {bid.documents > 0 && (
                              <Badge variant="outline">
                                {bid.documents} docs
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
