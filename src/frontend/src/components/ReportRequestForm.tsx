import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitRequest } from '../hooks/useQueries';
import { UrgencyLevel } from '../backend';
import { CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface FormData {
  requesterName: string;
  department: string;
  businessObjective: string;
  requiredKPIs: string;
  dataSource: string;
  requiredFilters: string;
  urgencyLevel: UrgencyLevel;
  justification: string;
  confirmedReview: boolean;
}

const DATA_SOURCES = [
  'SQL Server',
  'Azure SQL Database',
  'Excel',
  'SharePoint',
  'Dynamics 365',
  'Salesforce',
  'Oracle Database',
  'SAP',
  'Web API',
  'Other'
];

export default function ReportRequestForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>();
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel | ''>('');
  const [dataSource, setDataSource] = useState('');
  const [confirmedReview, setConfirmedReview] = useState(false);
  const submitRequest = useSubmitRequest();

  const onSubmit = async (data: FormData) => {
    if (!confirmedReview) {
      return;
    }

    if (!urgencyLevel || !dataSource) {
      return;
    }

    try {
      await submitRequest.mutateAsync({
        requesterName: data.requesterName,
        department: data.department,
        businessObjective: data.businessObjective,
        requiredKPIs: data.requiredKPIs,
        dataSource: dataSource,
        requiredFilters: data.requiredFilters,
        urgencyLevel: urgencyLevel as UrgencyLevel,
        justification: data.justification,
      });

      reset();
      setUrgencyLevel('');
      setDataSource('');
      setConfirmedReview(false);
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {submitRequest.isSuccess && (
        <Alert className="mb-8 border-success/30 bg-success/5 shadow-sm animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={2.5} />
          <AlertDescription className="text-success-foreground font-medium ml-2">
            Your report request has been submitted successfully! We'll review it shortly.
          </AlertDescription>
        </Alert>
      )}

      {submitRequest.isError && (
        <Alert variant="destructive" className="mb-8 shadow-sm animate-slide-up">
          <AlertCircle className="h-5 w-5" strokeWidth={2.5} />
          <AlertDescription className="font-medium ml-2">
            Failed to submit request. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <Label htmlFor="requesterName" className="text-sm font-semibold text-foreground">
              Requester Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="requesterName"
              {...register('requesterName', { required: 'Requester name is required' })}
              placeholder="Enter your full name"
              className="h-11 shadow-sm focus:shadow-md transition-shadow"
            />
            {errors.requesterName && (
              <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.requesterName.message}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="department" className="text-sm font-semibold text-foreground">
              Department <span className="text-destructive">*</span>
            </Label>
            <Input
              id="department"
              {...register('department', { required: 'Department is required' })}
              placeholder="e.g., Finance, Sales, Marketing"
              className="h-11 shadow-sm focus:shadow-md transition-shadow"
            />
            {errors.department && (
              <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.department.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="businessObjective" className="text-sm font-semibold text-foreground">
            Business Objective <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="businessObjective"
            {...register('businessObjective', { required: 'Business objective is required' })}
            placeholder="Describe the business problem or opportunity this report will address"
            rows={3}
            className="shadow-sm focus:shadow-md transition-shadow resize-none"
          />
          {errors.businessObjective && (
            <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.businessObjective.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="requiredKPIs" className="text-sm font-semibold text-foreground">
            Required KPIs <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="requiredKPIs"
            {...register('requiredKPIs', { required: 'Required KPIs are required' })}
            placeholder="List the key performance indicators needed (e.g., Revenue, Customer Count, Conversion Rate)"
            rows={3}
            className="shadow-sm focus:shadow-md transition-shadow resize-none"
          />
          {errors.requiredKPIs && (
            <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.requiredKPIs.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <Label htmlFor="dataSource" className="text-sm font-semibold text-foreground">
              Data Source <span className="text-destructive">*</span>
            </Label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger id="dataSource" className="h-11 shadow-sm focus:shadow-md transition-shadow">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                {DATA_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!dataSource && errors.dataSource && (
              <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Data source is required
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="urgencyLevel" className="text-sm font-semibold text-foreground">
              Urgency Level <span className="text-destructive">*</span>
            </Label>
            <Select value={urgencyLevel} onValueChange={(value) => setUrgencyLevel(value as UrgencyLevel)}>
              <SelectTrigger id="urgencyLevel" className="h-11 shadow-sm focus:shadow-md transition-shadow">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UrgencyLevel.low}>Low</SelectItem>
                <SelectItem value={UrgencyLevel.medium}>Medium</SelectItem>
                <SelectItem value={UrgencyLevel.high}>High</SelectItem>
              </SelectContent>
            </Select>
            {!urgencyLevel && errors.urgencyLevel && (
              <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Urgency level is required
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="requiredFilters" className="text-sm font-semibold text-foreground">
            Required Filters <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="requiredFilters"
            {...register('requiredFilters', { required: 'Required filters are required' })}
            placeholder="Specify filters needed (e.g., Date Range, Region, Product Category)"
            rows={3}
            className="shadow-sm focus:shadow-md transition-shadow resize-none"
          />
          {errors.requiredFilters && (
            <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.requiredFilters.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="justification" className="text-sm font-semibold text-foreground">
            Justification for New Report <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="justification"
            {...register('justification', { required: 'Justification is required' })}
            placeholder="Explain why existing reports don't meet your needs"
            rows={4}
            className="shadow-sm focus:shadow-md transition-shadow resize-none"
          />
          {errors.justification && (
            <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.justification.message}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-3 p-5 rounded-xl bg-accent/30 border border-accent/50">
          <Checkbox
            id="confirmedReview"
            checked={confirmedReview}
            onCheckedChange={(checked) => setConfirmedReview(checked as boolean)}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label
              htmlFor="confirmedReview"
              className="text-sm font-semibold text-foreground cursor-pointer leading-relaxed"
            >
              I confirm that I have reviewed existing reports <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please verify that no existing report meets your requirements before submitting this request.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={submitRequest.isPending || !confirmedReview}
            size="lg"
            className="min-w-[200px] h-12 shadow-md hover:shadow-lg transition-all font-semibold"
          >
            {submitRequest.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
