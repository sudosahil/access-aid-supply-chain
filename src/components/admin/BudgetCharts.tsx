
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Budget {
  id: string;
  title: string;
  amount: number;
  source: string;
  status: string;
  created_at: string;
}

interface BudgetChartsProps {
  budgets: Budget[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const BudgetCharts = ({ budgets }: BudgetChartsProps) => {
  // Data for source distribution pie chart
  const sourceData = budgets.reduce((acc, budget) => {
    const existing = acc.find(item => item.source === budget.source);
    if (existing) {
      existing.amount += budget.amount;
      existing.count += 1;
    } else {
      acc.push({
        source: budget.source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        amount: budget.amount,
        count: 1
      });
    }
    return acc;
  }, [] as any[]);

  // Data for status distribution
  const statusData = budgets.reduce((acc, budget) => {
    const existing = acc.find(item => item.status === budget.status);
    if (existing) {
      existing.amount += budget.amount;
      existing.count += 1;
    } else {
      acc.push({
        status: budget.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        amount: budget.amount,
        count: 1
      });
    }
    return acc;
  }, [] as any[]);

  // Data for monthly budget creation trend
  const monthlyData = budgets.reduce((acc, budget) => {
    const month = new Date(budget.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += budget.amount;
      existing.count += 1;
    } else {
      acc.push({
        month,
        amount: budget.amount,
        count: 1
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Budget Sources Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Sources</CardTitle>
          <CardDescription>Distribution by funding source</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="amount"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Status Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
          <CardDescription>Distribution by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Budget Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Trend</CardTitle>
          <CardDescription>Monthly budget creation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
