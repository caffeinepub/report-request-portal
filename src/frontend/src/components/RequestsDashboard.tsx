import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetRequests } from '../hooks/useQueries';
import { Status, UrgencyLevel, type ReportRequest } from '../backend';
import RequestDetailModal from './RequestDetailModal';
import { Loader2, RefreshCw, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_LABELS: Record<Status, string> = {
  [Status.pending]: 'Pending',
  [Status.approved]: 'Approved',
  [Status.rejected]: 'Rejected',
  [Status.inDevelopment]: 'In Development',
  [Status.completed]: 'Completed',
};

const STATUS_VARIANTS: Record<Status, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [Status.pending]: 'secondary',
  [Status.approved]: 'default',
  [Status.rejected]: 'destructive',
  [Status.inDevelopment]: 'outline',
  [Status.completed]: 'default',
};

const URGENCY_VARIANTS: Record<UrgencyLevel, 'default' | 'secondary' | 'destructive'> = {
  [UrgencyLevel.low]: 'secondary',
  [UrgencyLevel.medium]: 'default',
  [UrgencyLevel.high]: 'destructive',
};

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  [UrgencyLevel.low]: 'Low',
  [UrgencyLevel.medium]: 'Medium',
  [UrgencyLevel.high]: 'High',
};

export default function RequestsDashboard() {
  const { data: requests, isLoading, refetch, isFetching } = useGetRequests();
  const [selectedRequest, setSelectedRequest] = useState<ReportRequest | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-5">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Requests Found</h3>
        <p className="text-muted-foreground">There are no report requests to display.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{requests.length}</span> request{requests.length !== 1 ? 's' : ''}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="shadow-sm hover:shadow-md transition-all"
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-foreground">Requester</TableHead>
                <TableHead className="font-semibold text-foreground">Department</TableHead>
                <TableHead className="font-semibold text-foreground">Business Objective</TableHead>
                <TableHead className="font-semibold text-foreground">Urgency</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Submitted</TableHead>
                <TableHead className="font-semibold text-foreground">Assigned To</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow 
                  key={index} 
                  className="cursor-pointer hover:bg-accent/20 transition-colors border-border/40" 
                  onClick={() => setSelectedRequest(request)}
                >
                  <TableCell className="font-semibold">{request.requesterName}</TableCell>
                  <TableCell className="text-muted-foreground font-medium">{request.department}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{request.businessObjective}</TableCell>
                  <TableCell>
                    <Badge variant={URGENCY_VARIANTS[request.urgencyLevel]} className="font-medium shadow-sm">
                      {URGENCY_LABELS[request.urgencyLevel]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[request.status]} className="font-medium shadow-sm">
                      {STATUS_LABELS[request.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">
                    {format(new Date(Number(request.submissionDate) / 1000000), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {request.assignedReviewer ? (
                      <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        {request.assignedReviewer.toString().slice(0, 8)}...
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
}
