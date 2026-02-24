import RequestsDashboard from '../components/RequestsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileBarChart } from 'lucide-react';

export default function ViewRequestsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-2 shadow-lg shadow-primary/20">
          <FileBarChart className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Existing Report Requests</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          View all submitted report requests and their current status
        </p>
      </div>

      <Card className="shadow-lg border-border/60">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl">All Requests</CardTitle>
          <CardDescription className="text-base">
            Click on any request to view full details
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <RequestsDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
