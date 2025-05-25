
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Download, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupplierDetailModalProps {
  supplier: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (supplierId: string, status: string, notes: string) => void;
}

const complianceCriteria = [
  { id: 'business_license', label: 'Valid Business License', required: true },
  { id: 'tax_compliance', label: 'Tax Compliance Certificate', required: true },
  { id: 'quality_certifications', label: 'Quality Management Certifications', required: true },
  { id: 'financial_stability', label: 'Financial Stability Documentation', required: true },
  { id: 'experience_proof', label: 'Relevant Experience Documentation', required: true },
  { id: 'insurance_coverage', label: 'Insurance Coverage Verification', required: false },
  { id: 'reference_checks', label: 'Reference Checks Completed', required: false },
  { id: 'facility_inspection', label: 'Facility Inspection Report', required: false }
];

const supplierDocuments = [
  'Business Registration Certificate',
  'Tax Clearance Certificate',
  'ISO Quality Certification',
  'Financial Statements (Last 3 Years)',
  'Experience Portfolio',
  'Insurance Policy Documents',
  'Reference Letters',
  'Facility Photos and Certificates'
];

export const SupplierDetailModal = ({ supplier, isOpen, onClose, onStatusUpdate }: SupplierDetailModalProps) => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [overallNotes, setOverallNotes] = useState('');
  const { toast } = useToast();

  const handleCriteriaChange = (criteriaId: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [criteriaId]: checked }));
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setComments(prev => ({ ...prev, [criteriaId]: comment }));
  };

  const handleApprove = () => {
    const requiredCriteria = complianceCriteria.filter(c => c.required);
    const unmetRequired = requiredCriteria.filter(c => !checklist[c.id]);
    
    if (unmetRequired.length > 0) {
      toast({
        title: "Cannot Approve",
        description: "All required criteria must be met before approval.",
        variant: "destructive"
      });
      return;
    }

    onStatusUpdate(supplier.id, 'approved', overallNotes);
    toast({
      title: "Supplier Approved",
      description: "Supplier has been approved successfully."
    });
    onClose();
  };

  const handleReject = () => {
    if (!overallNotes.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    onStatusUpdate(supplier.id, 'rejected', overallNotes);
    toast({
      title: "Supplier Rejected",
      description: "Supplier has been rejected."
    });
    onClose();
  };

  const handleDownload = (document: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document}...`
    });
  };

  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supplier Review - {supplier.name}</DialogTitle>
          <DialogDescription>Review supplier documents and complete approval checklist</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Supplier ID:</Label>
                  <p>{supplier.id}</p>
                </div>
                <div>
                  <Label className="font-medium">Company Name:</Label>
                  <p>{supplier.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Email:</Label>
                  <p>{supplier.email}</p>
                </div>
                <div>
                  <Label className="font-medium">Phone:</Label>
                  <p>{supplier.phone}</p>
                </div>
                <div>
                  <Label className="font-medium">Category:</Label>
                  <p>{supplier.category}</p>
                </div>
                <div>
                  <Label className="font-medium">Registration Date:</Label>
                  <p>{supplier.registrationDate}</p>
                </div>
                <div>
                  <Label className="font-medium">Status:</Label>
                  <Badge variant={supplier.status === 'approved' ? 'default' : supplier.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {supplier.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Documents Count:</Label>
                  <p>{supplier.documentsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {supplierDocuments.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">{doc}</span>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceCriteria.map((criteria) => (
                  <div key={criteria.id} className="border p-4 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={criteria.id}
                        checked={checklist[criteria.id] || false}
                        onCheckedChange={(checked) => handleCriteriaChange(criteria.id, checked as boolean)}
                      />
                      <Label htmlFor={criteria.id} className="font-medium">
                        {criteria.label}
                        {criteria.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    </div>
                    <Textarea
                      placeholder="Add verification notes for this criteria..."
                      value={comments[criteria.id] || ''}
                      onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Provide overall assessment and decision rationale..."
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {supplier.status === 'pending' && (
            <div className="flex justify-end space-x-4">
              <Button variant="destructive" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                Reject Supplier
              </Button>
              <Button onClick={handleApprove} className="bg-green-600">
                <Check className="h-4 w-4 mr-2" />
                Approve Supplier
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
