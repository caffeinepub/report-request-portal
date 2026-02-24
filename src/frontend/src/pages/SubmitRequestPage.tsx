import ReportRequestForm from '../components/ReportRequestForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function SubmitRequestPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-2 shadow-lg shadow-primary/20">
          <Sparkles className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Submit New Report Request</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Complete the form below to request a new Power BI report. Please ensure all fields are filled accurately.
        </p>
      </div>

      <Card className="shadow-lg border-border/60">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl">Report Request Form</CardTitle>
          <CardDescription className="text-base">
            All fields marked with <span className="text-destructive font-semibold">*</span> are required
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ReportRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
