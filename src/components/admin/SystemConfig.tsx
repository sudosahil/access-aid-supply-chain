import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockInventoryCategories } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const SystemConfig = () => {
  const [categories, setCategories] = useState(mockInventoryCategories);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [approvalSettings, setApprovalSettings] = useState({
    autoApproveAmount: 1000,
    requireDualApproval: true,
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      lowStockAlerts: true,
      expiryAlerts: true
    }
  });
  const {
    toast
  } = useToast();
  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      const category = {
        id: `cat${categories.length + 1}`,
        name: newCategory.name,
        description: newCategory.description
      };
      setCategories([...categories, category]);
      setNewCategory({
        name: '',
        description: ''
      });
      toast({
        title: "Category Added",
        description: "New inventory category has been created."
      });
    }
  };
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System configuration has been updated."
    });
  };
  return <div className="space-y-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-300">
          <TabsTrigger value="categories">Inventory Categories</TabsTrigger>
          <TabsTrigger value="approval">Approval Workflows</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="bg-slate-300">
              <CardTitle>Inventory Categories</CardTitle>
              <CardDescription className="text-base text-slate-950">Manage inventory categories and their descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 bg-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" value={newCategory.name} onChange={e => setNewCategory({
                  ...newCategory,
                  name: e.target.value
                })} placeholder="e.g., Mobility Equipment" className="bg-slate-400" />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea id="categoryDescription" value={newCategory.description} onChange={e => setNewCategory({
                  ...newCategory,
                  description: e.target.value
                })} placeholder="Category description..." rows={3} className="bg-slate-400" />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={handleAddCategory} className="text-zinc-950">Add Category</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Existing Categories</h4>
                {categories.map(category => <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflows</CardTitle>
              <CardDescription>Configure approval thresholds and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="autoApprove">Auto-approval Amount Threshold</Label>
                <Input id="autoApprove" type="number" value={approvalSettings.autoApproveAmount} onChange={e => setApprovalSettings({
                ...approvalSettings,
                autoApproveAmount: parseInt(e.target.value)
              })} />
                <p className="text-sm text-gray-600 mt-1">
                  Purchase orders below this amount will be auto-approved
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={approvalSettings.requireDualApproval} onCheckedChange={checked => setApprovalSettings({
                ...approvalSettings,
                requireDualApproval: checked
              })} />
                <Label>Require dual approval for high-value purchases</Label>
              </div>

              <div>
                <Label>RFQ Approval Workflow</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Approval</SelectItem>
                    <SelectItem value="expedited">Expedited Approval</SelectItem>
                    <SelectItem value="committee">Committee Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveSettings}>Save Approval Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch checked={approvalSettings.notificationSettings.emailNotifications} onCheckedChange={checked => setApprovalSettings({
                  ...approvalSettings,
                  notificationSettings: {
                    ...approvalSettings.notificationSettings,
                    emailNotifications: checked
                  }
                })} />
                  <Label>Email Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={approvalSettings.notificationSettings.smsNotifications} onCheckedChange={checked => setApprovalSettings({
                  ...approvalSettings,
                  notificationSettings: {
                    ...approvalSettings.notificationSettings,
                    smsNotifications: checked
                  }
                })} />
                  <Label>SMS Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={approvalSettings.notificationSettings.lowStockAlerts} onCheckedChange={checked => setApprovalSettings({
                  ...approvalSettings,
                  notificationSettings: {
                    ...approvalSettings.notificationSettings,
                    lowStockAlerts: checked
                  }
                })} />
                  <Label>Low Stock Alerts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={approvalSettings.notificationSettings.expiryAlerts} onCheckedChange={checked => setApprovalSettings({
                  ...approvalSettings,
                  notificationSettings: {
                    ...approvalSettings.notificationSettings,
                    expiryAlerts: checked
                  }
                })} />
                  <Label>Expiry Date Alerts</Label>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};