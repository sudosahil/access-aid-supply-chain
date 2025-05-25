
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BidDetailModalProps {
  bid: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (bidId: string, status: string, notes: string) => void;
}

const evaluationCriteria = [
  { id: 'technical_spec', label: 'Technical Specifications Met', required: true },
  { id: 'quality_cert', label: 'Quality Certifications Valid', required: true },
  { id: 'delivery_timeline', label: 'Delivery Timeline Acceptable', required: true },
  { id: 'price_reasonable', label: 'Price Within Budget Range', required: true },
  { id: 'supplier_credentials', label: 'Supplier Credentials Verified', required: true },
  { id: 'warranty_terms', label: 'Warranty Terms Adequate', required: false },
  { id: 'maintenance_support', label: 'Maintenance Support Available', required: false },
  { id: 'compliance_docs', label: 'Compliance Documents Complete', required: true }
];

export const BidDetailModal = ({ bid, isOpen, onClose, onStatusUpdate }: BidDetailModalProps) => {
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
    const requiredCriteria = evaluationCriteria.filter(c => c.required);
    const unmetRequired = requiredCriteria.filter(c => !checklist[c.id]);
    
    if (unmetRequired.length > 0) {
      toast({
        title: "Cannot Approve",
        description: "All required criteria must be met before approval.",
        variant: "destructive"
      });
      return;
    }

    onStatusUpdate(bid.id, 'approved', overallNotes);
    toast({
      title: "Bid Approved",
      description: "Bid has been approved successfully."
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

    onStatusUpdate(bid.id, 'rejected', overallNotes);
    toast({
      title: "Bid Rejected",
      description: "Bid has been rejected."
    });
    onClose();
  };

  const handleDownload = (document: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document}...`
    });
  };

  if (!bid) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bid Evaluation - {bid.rfqTitle}</DialogTitle>
          <DialogDescription>Review bid details and complete evaluation checklist</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bid Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bid Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Bid ID:</Label>
                  <p>{bid.id}</p>
                </div>
                <div>
                  <Label className="font-medium">Supplier:</Label>
                  <p>{bid.supplierName}</p>
                </div>
                <div>
                  <Label className="font-medium">Amount:</Label>
                  <p className="text-lg font-semibold text-green-600">{bid.amount}</p>
                </div>
                <div>
                  <Label className="font-medium">Submitted:</Label>
                  <p>{bid.submittedDate}</p>
                </div>
                <div>
                  <Label className="font-medium">Status:</Label>
                  <Badge variant={bid.status === 'approved' ? 'default' : bid.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {bid.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Documents:</Label>
                  <p>{bid.documents} attached</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Technical Specification Sheet', 'Quality Certificate', 'Compliance Declaration', 'Warranty Document'].map((doc, index) => (
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

          {/* Evaluation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluationCriteria.map((criteria) => (
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
                      placeholder="Add comments for this criteria..."
                      value={comments[criteria.id] || ''}
                      onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Evaluation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Provide overall evaluation summary and decision rationale..."
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {bid.status === 'under_review' && (
            <div className="flex justify-end space-x-4">
              <Button variant="destructive" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                Reject Bid
              </Button>
              <Button onClick={handleApprove} className="bg-green-600">
                <Check className="h-4 w-4 mr-2" />
                Approve Bid
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
