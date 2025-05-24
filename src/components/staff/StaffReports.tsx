
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const StaffReports = () => {
  const { toast } = useToast();

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated and exported.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>Generate and export various reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Procurement Report</h3>
                <p className="text-sm text-gray-600 mb-4">Summary of procurement activities and spending</p>
                <Button className="w-full" onClick={() => handleExportReport('Procurement')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Inventory Report</h3>
                <p className="text-sm text-gray-600 mb-4">Current inventory levels and stock movements</p>
                <Button className="w-full" onClick={() => handleExportReport('Inventory')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Supplier Performance</h3>
                <p className="text-sm text-gray-600 mb-4">Supplier delivery and quality metrics</p>
                <Button className="w-full" onClick={() => handleExportReport('Supplier Performance')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
