import RequestsDashboard from '../components/RequestsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-2 shadow-lg shadow-primary/20">
          <Shield className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Review, approve, and manage all report requests
        </p>
      </div>

      <Alert className="max-w-2xl mx-auto border-primary/30 bg-primary/5 shadow-sm">
        <Info className="h-5 w-5 text-primary" strokeWidth={2.5} />
        <AlertDescription className="text-sm leading-relaxed ml-2">
          As an admin, you can review requests, update their status, add comments, and assign reviewers.
          Click on any request to open the review panel.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg border-border/60">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl">Pending Reviews</CardTitle>
          <CardDescription className="text-base">
            Manage and review all report requests
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <RequestsDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
