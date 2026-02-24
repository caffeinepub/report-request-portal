import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRole } from '../contexts/RoleContext';
import { useReviewRequest } from '../hooks/useQueries';
import { Status, UrgencyLevel, type ReportRequest } from '../backend';
import { Principal } from '@dfinity/principal';
import { format } from 'date-fns';
import { Loader2, CheckCircle2, XCircle, Calendar, User, Building2, Target, BarChart3, Database, Filter, FileText } from 'lucide-react';

interface RequestDetailModalProps {
  request: ReportRequest;
  open: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<Status, string> = {
  [Status.pending]: 'Pending',
  [Status.approved]: 'Approved',
  [Status.rejected]: 'Rejected',
  [Status.inDevelopment]: 'In Development',
  [Status.completed]: 'Completed',
};

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  [UrgencyLevel.low]: 'Low',
  [UrgencyLevel.medium]: 'Medium',
  [UrgencyLevel.high]: 'High',
};

export default function RequestDetailModal({ request, open, onClose }: RequestDetailModalProps) {
  const { role } = useRole();
  const reviewRequest = useReviewRequest();
  const [status, setStatus] = useState<Status>(request.status);
  const [reviewerComments, setReviewerComments] = useState(request.reviewerComments || '');
  const [assignedReviewer, setAssignedReviewer] = useState(
    request.assignedReviewer ? request.assignedReviewer.toString() : ''
  );

  const handleSubmitReview = async () => {
    try {
      const userPrincipal = Principal.fromText('2vxsx-fae');

      await reviewRequest.mutateAsync({
        user: userPrincipal,
        input: {
          status,
          reviewerComments: reviewerComments || undefined,
          assignedReviewer: assignedReviewer ? Principal.fromText(assignedReviewer) : undefined,
        },
      });

      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="text-2xl">Report Request Details</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            Submitted on {format(new Date(Number(request.submissionDate) / 1000000), 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Requester Name
              </Label>
              <p className="font-semibold text-lg">{request.requesterName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                Department
              </Label>
              <p className="font-semibold text-lg">{request.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Urgency Level</Label>
              <div>
                <Badge 
                  variant={request.urgencyLevel === UrgencyLevel.high ? 'destructive' : request.urgencyLevel === UrgencyLevel.medium ? 'default' : 'secondary'} 
                  className="text-sm px-3 py-1.5 font-semibold shadow-sm"
                >
                  {URGENCY_LABELS[request.urgencyLevel]}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                Data Source
              </Label>
              <p className="font-semibold text-lg">{request.dataSource}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3 p-5 rounded-xl bg-accent/10 border border-accent/30">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
              <Target className="w-3.5 h-3.5" />
              Business Objective
            </Label>
            <p className="text-sm leading-relaxed">{request.businessObjective}</p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-accent/10 border border-accent/30">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Required KPIs
            </Label>
            <p className="text-sm leading-relaxed">{request.requiredKPIs}</p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-accent/10 border border-accent/30">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              Required Filters
            </Label>
            <p className="text-sm leading-relaxed">{request.requiredFilters}</p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-accent/10 border border-accent/30">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Justification
            </Label>
            <p className="text-sm leading-relaxed">{request.justification}</p>
          </div>

          {request.reviewerComments && role === 'Requester' && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3 p-5 rounded-xl bg-primary/5 border border-primary/20">
                <Label className="text-xs uppercase tracking-wide text-primary font-semibold">Reviewer Comments</Label>
                <p className="text-sm leading-relaxed">{request.reviewerComments}</p>
              </div>
            </>
          )}

          {role === 'Admin' && (
            <>
              <Separator className="my-6" />
              <div className="space-y-5 bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl border border-primary/20 shadow-inner">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Review Actions
                </h3>

                <div className="space-y-2.5">
                  <Label htmlFor="status" className="text-sm font-semibold">Update Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                    <SelectTrigger id="status" className="h-11 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Status.pending}>Pending</SelectItem>
                      <SelectItem value={Status.approved}>Approved</SelectItem>
                      <SelectItem value={Status.rejected}>Rejected</SelectItem>
                      <SelectItem value={Status.inDevelopment}>In Development</SelectItem>
                      <SelectItem value={Status.completed}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="reviewerComments" className="text-sm font-semibold">Reviewer Comments</Label>
                  <Textarea
                    id="reviewerComments"
                    value={reviewerComments}
                    onChange={(e) => setReviewerComments(e.target.value)}
                    placeholder="Add comments about this request..."
                    rows={4}
                    className="shadow-sm resize-none"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="assignedReviewer" className="text-sm font-semibold">Assigned Reviewer (Principal ID)</Label>
                  <Input
                    id="assignedReviewer"
                    value={assignedReviewer}
                    onChange={(e) => setAssignedReviewer(e.target.value)}
                    placeholder="Enter principal ID"
                    className="h-11 shadow-sm font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Optional: Enter the principal ID of the assigned reviewer
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-3 pt-4">
          {role === 'Admin' ? (
            <>
              <Button variant="outline" onClick={onClose} className="shadow-sm">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview} 
                disabled={reviewRequest.isPending}
                className="shadow-md hover:shadow-lg transition-all min-w-[140px]"
              >
                {reviewRequest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!reviewRequest.isPending && status === Status.approved && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {!reviewRequest.isPending && status === Status.rejected && <XCircle className="mr-2 h-4 w-4" />}
                Save Review
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="shadow-md hover:shadow-lg transition-all">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
