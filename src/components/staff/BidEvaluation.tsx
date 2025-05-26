
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Award, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BidEvaluation = () => {
  const { toast } = useToast();

  const [evaluations, setEvaluations] = useState<Record<string, Record<string, boolean>>>({});

  const mockBids = [
    {
      id: 'bid1',
      rfqId: 'rfq1',
      rfqTitle: 'Electric Wheelchairs - Bulk Purchase',
      supplierName: 'MedEquip Solutions',
      amount: 225000,
      submittedDate: '2024-01-20',
      status: 'under_review'
    },
    {
      id: 'bid2',
      rfqId: 'rfq1',
      rfqTitle: 'Electric Wheelchairs - Bulk Purchase',
      supplierName: 'HealthTech Corp',
      amount: 235000,
      submittedDate: '2024-01-21',
      status: 'under_review'
    }
  ];

  const evaluationCriteria = [
    'Safety Compliance',
    'Quality Standards',
    'Price Competitiveness',
    'Delivery Timeline',
    'Warranty Terms',
    'Technical Specifications',
    'Supplier Experience',
    'Documentation Complete'
  ];

  const handleCriteriaChange = (bidId: string, criterion: string, checked: boolean) => {
    setEvaluations(prev => ({
      ...prev,
      [bidId]: {
        ...prev[bidId],
        [criterion]: checked
      }
    }));
  };

  const handleAwardBid = (bidId: string) => {
    const evaluation = evaluations[bidId] || {};
    const checkedCriteria = Object.values(evaluation).filter(Boolean).length;
    
    if (checkedCriteria < evaluationCriteria.length * 0.7) {
      toast({
        title: "Evaluation Incomplete",
        description: "Please complete at least 70% of evaluation criteria before awarding.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Bid Awarded",
      description: `Bid ${bidId} has been awarded successfully.`
    });
  };

  const handleRejectBid = (bidId: string) => {
    toast({
      title: "Bid Rejected",
      description: `Bid ${bidId} has been rejected.`,
      variant: "destructive"
    });
  };

  const getCompletionPercentage = (bidId: string) => {
    const evaluation = evaluations[bidId] || {};
    const checkedCount = Object.values(evaluation).filter(Boolean).length;
    return Math.round((checkedCount / evaluationCriteria.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bid Evaluation</h2>
        <Badge variant="outline">
          {mockBids.length} Bids Under Review
        </Badge>
      </div>

      <div className="grid gap-6">
        {mockBids.map((bid) => (
          <Card key={bid.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{bid.rfqTitle}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Supplier: <strong>{bid.supplierName}</strong> • 
                    Amount: <strong>₹{bid.amount.toLocaleString()}</strong> • 
                    Submitted: {bid.submittedDate}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    {getCompletionPercentage(bid.id)}% Complete
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Evaluation Criteria</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evaluationCriteria.map((criterion) => (
                      <div key={criterion} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${bid.id}-${criterion}`}
                          checked={evaluations[bid.id]?.[criterion] || false}
                          onCheckedChange={(checked) => 
                            handleCriteriaChange(bid.id, criterion, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`${bid.id}-${criterion}`}
                          className="text-sm cursor-pointer"
                        >
                          {criterion}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectBid(bid.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleAwardBid(bid.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Award Bid
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
