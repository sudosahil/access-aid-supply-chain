
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

// Enhanced compliance criteria with the new requirements
const complianceCriteria = [
  { id: 'business_license', label: 'Valid Business License', required: true },
  { id: 'tax_compliance', label: 'Tax Compliance Certificate', required: true },
  { id: 'quality_certifications', label: 'Quality Management Certifications (ISO 9001, ISO 20001, ISO 27001)', required: true },
  { id: 'cmmi_certification', label: 'CMMI Level 3 or above certification', required: true },
  { id: 'financial_stability', label: 'Positive net worth in the last 3 financial years', required: true },
  { id: 'annual_turnover', label: 'Average annual financial turnover in IT/ICT/ITES ≥ ₹200 crore (last 3 years)', required: true },
  { id: 'experience_proof', label: 'At least one turnkey project ≥ ₹8 crore for Central/State Govt. (last 7 years)', required: true },
  { id: 'psu_status', label: 'PSU or Central/State Govt. organization/PSU notified for IT activities', required: true },
  { id: 'not_blacklisted', label: 'Not blacklisted by any Government or PSU in India', required: true },
  { id: 'manufacturer_auth', label: 'Manufacturer\'s Authorization Certificate/OEM support letters', required: true },
  { id: 'odisha_presence', label: 'Registered office in Odisha or undertaking to establish within a month', required: true },
  { id: 'insurance_coverage', label: 'Insurance Coverage Verification', required: false },
  { id: 'reference_checks', label: 'Reference Checks Completed', required: false },
  { id: 'facility_inspection', label: 'Facility Inspection Report', required: false }
];

const supplierDocuments = [
  'Business Registration Certificate',
  'Tax Clearance Certificate',
  'ISO 9001 Certification',
  'ISO 20001 Certification', 
  'ISO 27001 Certification',
  'CMMI Level 3+ Certificate',
  'Financial Statements (Last 3 Years)',
  'Net Worth Certificates',
  'Annual Turnover Proof (IT/ICT/ITES)',
  'Turnkey Project Portfolio (₹8+ Crore)',
  'PSU/Government Organization Certificate',
  'Non-Blacklisting Declaration',
  'Manufacturer Authorization Letters',
  'OEM Support Documents',
  'Odisha Office Registration/Undertaking',
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-teal-50">
        <DialogHeader className="border-b border-teal-200 pb-4">
          <DialogTitle className="text-2xl text-teal-900 flex items-center">
            <Building className="h-6 w-6 mr-2" />
            Supplier Review - {supplier.name}
          </DialogTitle>
          <DialogDescription className="text-teal-700">Complete supplier compliance verification and approval process</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Information */}
          <Card className="border-teal-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-teal-900">Supplier ID:</Label>
                  <p className="text-teal-700">{supplier.id}</p>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Company Name:</Label>
                  <p className="text-teal-700">{supplier.name}</p>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Email:</Label>
                  <p className="text-teal-700">{supplier.email}</p>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Phone:</Label>
                  <p className="text-teal-700">{supplier.phone}</p>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Category:</Label>
                  <p className="text-teal-700">{supplier.category}</p>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Registration Date:</Label>
                  <p className="text-teal-700">{supplier.registrationDate}</p>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Status:</Label>
                  <Badge variant={supplier.status === 'approved' ? 'default' : supplier.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {supplier.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium text-teal-900">Documents Count:</Label>
                  <p className="text-teal-700">{supplier.documentsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Documents */}
          <Card className="border-teal-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent className="bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {supplierDocuments.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-blue-200 rounded bg-white">
                    <span className="text-sm text-blue-900">{doc}</span>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Compliance Checklist */}
          <Card className="border-teal-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <CardTitle>Enhanced Compliance Checklist</CardTitle>
              <p className="text-emerald-100">All required criteria must be verified and approved</p>
            </CardHeader>
            <CardContent className="bg-emerald-50">
              <div className="space-y-4">
                {complianceCriteria.map((criteria) => (
                  <div key={criteria.id} className="border border-emerald-200 p-4 rounded-lg bg-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <Checkbox
                        id={criteria.id}
                        checked={checklist[criteria.id] || false}
                        onCheckedChange={(checked) => handleCriteriaChange(criteria.id, checked as boolean)}
                      />
                      <Label htmlFor={criteria.id} className="font-medium text-emerald-900">
                        {criteria.label}
                        {criteria.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    </div>
                    <Textarea
                      placeholder="Add verification notes for this criteria..."
                      value={comments[criteria.id] || ''}
                      onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                      rows={2}
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Assessment */}
          <Card className="border-teal-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white">
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent className="bg-slate-50">
              <Textarea
                placeholder="Provide overall assessment and decision rationale..."
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                rows={4}
                className="border-slate-300 focus:border-slate-500"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {supplier.status === 'pending' && (
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="destructive" onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                <X className="h-4 w-4 mr-2" />
                Reject Supplier
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
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
