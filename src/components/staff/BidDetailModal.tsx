
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

// Stage 1: Pre-Qualification (Eligibility Checklist)
const preQualificationCriteria = [
  { id: 'psu_org', label: 'Vendor is a Public Sector Undertaking (PSU) or Central/State Govt. organization/PSU notified for IT activities (no consortiums)', required: true },
  { id: 'annual_turnover', label: 'Average annual financial turnover in IT/ICT/ITES is at least ₹200 crore for the last 3 consecutive financial years', required: true },
  { id: 'net_worth', label: 'Positive net worth in the last 3 financial years ending March 31, 2024', required: true },
  { id: 'turnkey_project', label: 'At least one turnkey project (software + hardware) worth at least ₹8 crore for Central/State Govt. in India in the last 7 years', required: true },
  { id: 'certifications', label: 'Valid ISO 9001, ISO 20001, ISO 27001, and CMMI Level 3 or above certifications', required: true },
  { id: 'not_blacklisted', label: 'Not blacklisted or declared ineligible by any Government or PSU in India', required: true },
  { id: 'manufacturer_auth', label: 'Manufacturer\'s Authorization Certificate and OEM support letters attached, or vendor is an authorized partner', required: true },
  { id: 'odisha_office', label: 'Registered office in Odisha or an undertaking to establish one within a month of contract award', required: true },
  { id: 'bid_fee', label: 'RFP Bid Processing Fee of ₹5,000 paid', required: true },
  { id: 'emd', label: 'Earnest Money Deposit (EMD) of ₹10 lakh submitted, valid for at least 150 days', required: true }
];

// Stage 2: Technical Evaluation (Scoring, 100 Marks Total)
const technicalEvaluationCriteria = [
  { id: 'avg_turnover', label: 'Average Annual Turnover (last 3 years)', maxMarks: 10 },
  { id: 'profit_making', label: 'Profit-making in last 3 years', maxMarks: 5 },
  { id: 'completed_projects', label: 'Completed turnkey projects (software + hardware, ≥ ₹8 Cr, preferably in education domain, last 7 years)', maxMarks: 20 },
  { id: 'required_certs', label: 'Required certifications (ISO 9001, ISO 20001, ISO 27001, CMMI Level 3+)', maxMarks: 15 },
  { id: 'payroll_engineers', label: 'Payroll engineers with specific qualifications/certifications', maxMarks: 10 },
  { id: 'presentation', label: 'Presentation on proposed solution (demo, understanding, work plan, deployment, O&M)', maxMarks: 40 }
];

// Internal Bid/Supplier Evaluation Criteria (for Goods/Services Procurement)
const internalEvaluationCriteria = [
  { id: 'price_competitive', label: 'Price competitiveness and value for money', required: true },
  { id: 'quality_offered', label: 'Quality of goods/services offered', required: true },
  { id: 'delivery_timelines', label: 'Delivery timelines and commitment', required: true },
  { id: 'vendor_experience', label: 'Vendor/supplier experience and track record', required: true },
  { id: 'compliance_docs', label: 'Compliance with all required documentation and statutory requirements', required: true },
  { id: 'technical_specs', label: 'Ability to meet technical specifications', required: true },
  { id: 'past_performance', label: 'Past performance and references (if applicable)', required: false },
  { id: 'terms_conditions', label: 'Agreement to all terms and conditions', required: true }
];

export const BidDetailModal = ({ bid, isOpen, onClose, onStatusUpdate }: BidDetailModalProps) => {
  const [preQualChecklist, setPreQualChecklist] = useState<Record<string, boolean>>({});
  const [technicalScores, setTechnicalScores] = useState<Record<string, number>>({});
  const [internalChecklist, setInternalChecklist] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [overallNotes, setOverallNotes] = useState('');
  const { toast } = useToast();

  const handlePreQualChange = (criteriaId: string, checked: boolean) => {
    setPreQualChecklist(prev => ({ ...prev, [criteriaId]: checked }));
  };

  const handleTechnicalScoreChange = (criteriaId: string, score: number) => {
    setTechnicalScores(prev => ({ ...prev, [criteriaId]: score }));
  };

  const handleInternalChange = (criteriaId: string, checked: boolean) => {
    setInternalChecklist(prev => ({ ...prev, [criteriaId]: checked }));
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setComments(prev => ({ ...prev, [criteriaId]: comment }));
  };

  const calculateTechnicalTotal = () => {
    return Object.values(technicalScores).reduce((sum, score) => sum + (score || 0), 0);
  };

  const handleApprove = () => {
    // Check Pre-Qualification - all must be YES
    const unmetPreQual = preQualificationCriteria.filter(c => !preQualChecklist[c.id]);
    if (unmetPreQual.length > 0) {
      toast({
        title: "Pre-Qualification Failed",
        description: "All pre-qualification criteria must be met (YES). Bid automatically rejected.",
        variant: "destructive"
      });
      return;
    }

    // Check Technical Evaluation - minimum 80/100 marks
    const technicalTotal = calculateTechnicalTotal();
    if (technicalTotal < 80) {
      toast({
        title: "Technical Evaluation Failed",
        description: `Technical score (${technicalTotal}/100) is below minimum requirement of 80 marks.`,
        variant: "destructive"
      });
      return;
    }

    // Check Internal Evaluation - all required criteria must be YES
    const requiredInternal = internalEvaluationCriteria.filter(c => c.required);
    const unmetInternal = requiredInternal.filter(c => !internalChecklist[c.id]);
    if (unmetInternal.length > 0) {
      toast({
        title: "Internal Evaluation Failed",
        description: "All required internal evaluation criteria must be met.",
        variant: "destructive"
      });
      return;
    }

    onStatusUpdate(bid.id, 'approved', overallNotes);
    toast({
      title: "Bid Approved",
      description: `Bid passed all evaluations. Technical Score: ${technicalTotal}/100`
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader className="border-b border-blue-200 pb-4">
          <DialogTitle className="text-2xl text-blue-900">Comprehensive Bid Evaluation - {bid.rfqTitle}</DialogTitle>
          <DialogDescription className="text-blue-700">Complete multi-stage evaluation process</DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Bid Information */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <CardTitle>Bid Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-blue-900">Bid ID:</Label>
                  <p className="text-blue-700">{bid.id}</p>
                </div>
                <div>
                  <Label className="font-medium text-blue-900">Supplier:</Label>
                  <p className="text-blue-700">{bid.supplierName}</p>
                </div>
                <div>
                  <Label className="font-medium text-blue-900">Amount:</Label>
                  <p className="text-lg font-semibold text-green-600">{bid.amount}</p>
                </div>
                <div>
                  <Label className="font-medium text-blue-900">Submitted:</Label>
                  <p className="text-blue-700">{bid.submittedDate}</p>
                </div>
                <div>
                  <Label className="font-medium text-blue-900">Status:</Label>
                  <Badge variant={bid.status === 'approved' ? 'default' : bid.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {bid.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium text-blue-900">Documents:</Label>
                  <p className="text-blue-700">{bid.documents} attached</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage 1: Pre-Qualification Checklist */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <CardTitle>Stage 1: Pre-Qualification (Eligibility Checklist)</CardTitle>
              <p className="text-red-100">All criteria must be YES to proceed. Any NO automatically rejects the bid.</p>
            </CardHeader>
            <CardContent className="bg-red-50">
              <div className="space-y-4">
                {preQualificationCriteria.map((criteria) => (
                  <div key={criteria.id} className="border border-red-200 p-4 rounded-lg bg-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <Checkbox
                        id={criteria.id}
                        checked={preQualChecklist[criteria.id] || false}
                        onCheckedChange={(checked) => handlePreQualChange(criteria.id, checked as boolean)}
                      />
                      <Label htmlFor={criteria.id} className="font-medium text-red-900">
                        {criteria.label}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                    </div>
                    <Textarea
                      placeholder="Add verification notes..."
                      value={comments[criteria.id] || ''}
                      onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                      rows={2}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage 2: Technical Evaluation */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle>Stage 2: Technical Evaluation (100 Marks Total)</CardTitle>
              <p className="text-green-100">Minimum 80/100 marks required to qualify. Current Total: {calculateTechnicalTotal()}/100</p>
            </CardHeader>
            <CardContent className="bg-green-50">
              <div className="space-y-4">
                {technicalEvaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="border border-green-200 p-4 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium text-green-900">
                        {criteria.label}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max={criteria.maxMarks}
                          value={technicalScores[criteria.id] || ''}
                          onChange={(e) => handleTechnicalScoreChange(criteria.id, parseInt(e.target.value) || 0)}
                          className="w-20 border-green-300"
                          placeholder="0"
                        />
                        <span className="text-green-700">/ {criteria.maxMarks}</span>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Add scoring justification..."
                      value={comments[criteria.id] || ''}
                      onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                      rows={2}
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Internal Evaluation Criteria */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
              <CardTitle>Internal Bid/Supplier Evaluation Criteria</CardTitle>
              <p className="text-purple-100">For Goods/Services Procurement</p>
            </CardHeader>
            <CardContent className="bg-purple-50">
              <div className="space-y-4">
                {internalEvaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="border border-purple-200 p-4 rounded-lg bg-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <Checkbox
                        id={criteria.id}
                        checked={internalChecklist[criteria.id] || false}
                        onCheckedChange={(checked) => handleInternalChange(criteria.id, checked as boolean)}
                      />
                      <Label htmlFor={criteria.id} className="font-medium text-purple-900">
                        {criteria.label}
                        {criteria.required && <span className="text-purple-500 ml-1">*</span>}
                      </Label>
                    </div>
                    <Textarea
                      placeholder="Add evaluation notes..."
                      value={comments[criteria.id] || ''}
                      onChange={(e) => handleCommentChange(criteria.id, e.target.value)}
                      rows={2}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent className="bg-indigo-50">
              <div className="space-y-2">
                {['Technical Specification Sheet', 'Quality Certificate', 'Compliance Declaration', 'Warranty Document', 'Financial Statements', 'ISO Certifications', 'CMMI Certificate', 'Authorization Letters'].map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-indigo-200 rounded bg-white">
                    <span className="text-sm text-indigo-900">{doc}</span>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Assessment */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white">
              <CardTitle>Overall Evaluation Summary</CardTitle>
            </CardHeader>
            <CardContent className="bg-slate-50">
              <Textarea
                placeholder="Provide comprehensive evaluation summary and final decision rationale..."
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                rows={4}
                className="border-slate-300 focus:border-slate-500"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {bid.status === 'under_review' && (
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="destructive" onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                <X className="h-4 w-4 mr-2" />
                Reject Bid
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
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
