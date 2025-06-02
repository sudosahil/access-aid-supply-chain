
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, MessageSquare, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { BudgetButton } from '@/components/common/BudgetButton';
import { LiveBidViewing } from '@/components/contractor/LiveBidViewing';

interface ContractorDashboardProps {
  user: any;
  onTabChange: (tab: string) => void;
}

export const ContractorDashboard = ({ user, onTabChange }: ContractorDashboardProps) => {
  const [activeView, setActiveView] = useState('overview');

  // Mock contractor stats
  const contractorStats = {
    availableRfqs: 8,
    submittedBids: 12,
    wonBids: 3,
    pendingBids: 4,
    totalEarnings: 1450000,
    successRate: 25
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'live-bids':
        return <LiveBidViewing />;
      default:
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Essential contractor functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={() => onTabChange('rfqs')} className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Available RFQs
                    <Badge variant="default" className="mt-1">
                      {contractorStats.availableRfqs}
                    </Badge>
                  </Button>
                  <Button onClick={() => onTabChange('bids')} variant="outline" className="h-20 flex-col">
                    <Eye className="h-6 w-6 mb-2" />
                    My Bids
                    {contractorStats.pendingBids > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        {contractorStats.pendingBids} pending
                      </Badge>
                    )}
                  </Button>
                  <Button onClick={() => setActiveView('live-bids')} variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Live Bid Status
                  </Button>
                  <Button onClick={() => onTabChange('messaging')} variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contractor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Available RFQs</p>
                      <p className="text-3xl font-bold">{contractorStats.availableRfqs}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Submitted Bids</p>
                      <p className="text-3xl font-bold">{contractorStats.submittedBids}</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Won Bids</p>
                      <p className="text-3xl font-bold text-green-600">{contractorStats.wonBids}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold">{contractorStats.successRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Bids */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pending Bids</CardTitle>
                    <CardDescription>Bids awaiting review or decision</CardDescription>
                  </div>
                  <Button onClick={() => onTabChange('bids')}>
                    View All Bids
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Electric Wheelchairs Procurement</p>
                      <p className="text-sm text-gray-600">Submitted 2 days ago - ₹4,50,000</p>
                    </div>
                    <Badge variant="secondary">Under Review</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Prosthetic Limbs Supply</p>
                      <p className="text-sm text-gray-600">Submitted 1 day ago - ₹7,25,000</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest bidding activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">Bid won</p>
                      <p className="text-sm text-gray-600">Medical Equipment Maintenance - ₹2,80,000</p>
                    </div>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Bid submitted</p>
                      <p className="text-sm text-gray-600">Hearing Aids Procurement - ₹1,20,000</p>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium">Message received</p>
                      <p className="text-sm text-gray-600">Query about wheelchair specifications</p>
                    </div>
                    <span className="text-sm text-gray-500">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeView === 'live-bids' ? 'default' : 'outline'}
            onClick={() => setActiveView('live-bids')}
          >
            Live Bids
          </Button>
        </div>
      </div>

      {renderActiveView()}
    </div>
  );
};
