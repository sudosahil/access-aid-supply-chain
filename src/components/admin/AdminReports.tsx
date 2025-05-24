import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerDemo as DatePicker } from '@/components/ui/date-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { mockPurchaseOrders, mockRFQs, mockInventoryItems } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const AdminReports = () => {
  const {
    toast
  } = useToast();

  // Sample data for charts
  const procurementData = [{
    month: 'Jan',
    amount: 25000
  }, {
    month: 'Feb',
    amount: 32000
  }, {
    month: 'Mar',
    amount: 28000
  }, {
    month: 'Apr',
    amount: 41000
  }, {
    month: 'May',
    amount: 35000
  }];
  const categoryData = [{
    name: 'Mobility Equipment',
    value: 45,
    color: '#8884d8'
  }, {
    name: 'Hearing Assistance',
    value: 25,
    color: '#82ca9d'
  }, {
    name: 'Vision Aids',
    value: 15,
    color: '#ffc658'
  }, {
    name: 'Prosthetic & Orthotic',
    value: 15,
    color: '#ff7c7c'
  }];
  const handleExportReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated and will be downloaded shortly.`
    });
  };
  const totalSpending = mockPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const averageOrderValue = totalSpending / mockPurchaseOrders.length;
  const totalRFQs = mockRFQs.length;
  const lowStockItems = mockInventoryItems.filter(item => item.currentStock <= item.reorderLevel).length;
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>Generate and export various system reports</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <Select defaultValue="procurement">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procurement">Procurement Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="supplier">Supplier Performance</SelectItem>
                  <SelectItem value="audit">Audit Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <DatePicker />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => handleExportReport('Procurement')}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('Summary')}>
              <FileText className="h-4 w-4 mr-2" />
              Quick Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 bg-slate-300">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spending</p>
                <p className="text-2xl font-bold">${totalSpending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 bg-slate-300">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total RFQs</p>
                <p className="text-2xl font-bold">{totalRFQs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">${Math.round(averageOrderValue).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 bg-slate-300">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-slate-300">
            <CardTitle>Procurement Spending Trends</CardTitle>
            <CardDescription className="text-slate-950">Monthly procurement spending over time</CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-300">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={procurementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={value => [`$${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-slate-100">
            <CardTitle>Procurement by Category</CardTitle>
            <CardDescription className="text-slate-950">Distribution of spending across categories</CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-50">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                value
              }) => `${name}: ${value}%`}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>;
};