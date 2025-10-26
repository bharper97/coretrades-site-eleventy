
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Eye, Save, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const sectors = ['Industrial', 'Commercial', 'Institutional', 'Civil'];
const trades = ['Electrician', 'Welder', 'Pipefitter', 'Millwright', 'Crane Operator', 'Heavy Duty Mechanic', 'Plumber', 'HVAC Technician'];
const shifts = ['Days', 'Nights', 'Rotating', 'Flexible'];

function EmployerJobEditContent() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    sector: '',
    trade: '',
    city: '',
    region: '',
    country: 'Canada',
    wageBand: '',
    union: false,
    campLOA: false,
    shift: '',
    description: '',
  });

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const jobs = await base44.entities.Job.filter({ id: jobId });
      return jobs[0] || null;
    },
    enabled: !!jobId,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (currentUser.app_role !== 'employer' && currentUser.email !== 'bretton.harper@gmail.com') {
          toast({
            title: "Access Denied",
            description: "Only employers can edit jobs.",
            variant: "destructive",
          });
          navigate(createPageUrl('Home'));
          return;
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        sector: job.sector || '',
        trade: job.trade || '',
        city: job.city || '',
        region: job.region || '',
        country: job.country || 'Canada',
        wageBand: job.wageBand || '',
        union: job.union || false,
        campLOA: job.campLOA || false,
        shift: job.shift || '',
        description: job.description || '',
      });
    }
  }, [job]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.sector) newErrors.sector = 'Sector is required';
    if (!formData.trade) newErrors.trade = 'Trade is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.region.trim()) newErrors.region = 'Province/State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length > 10000) {
      newErrors.description = 'Description must be 10,000 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateJobMutation = useMutation({
    mutationFn: async (jobData) => {
      return await base44.entities.Job.update(jobId, jobData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      
      toast({
        title: "Success!",
        description: "Job updated successfully.",
      });

      navigate(createPageUrl('EmployerDashboard') + '?tab=jobs');
    },
    onError: (error) => {
      console.error('Failed to update job:', error);
      toast({
        title: "Error",
        description: "Could not update job. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    updateJobMutation.mutate(formData);
  };

  if (loading || jobLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl('EmployerDashboard'))}
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">Edit Job</h1>
            <p className="text-gray-400">Update your job posting details</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-[#424242] hover:bg-[#616161] text-white border-none">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#0a0a0a] border-l border-[#424242] text-white w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle className="text-white">Job Preview</SheetTitle>
              </SheetHeader>
              <div className="mt-6 bg-[#1a1a1a] p-6 rounded-xl border border-[#424242]">
                <h3 className="text-2xl font-bold mb-2">{formData.title || 'Job Title'}</h3>
                <p className="text-gray-400 mb-4">{formData.company || 'Company Name'}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Location:</span> {formData.city}, {formData.region}</p>
                  <p><span className="text-gray-400">Wage:</span> {formData.wageBand || 'Not specified'}</p>
                  <p><span className="text-gray-400">Shift:</span> {formData.shift || 'Not specified'}</p>
                  <p><span className="text-gray-400">Union:</span> {formData.union ? 'Yes' : 'No'}</p>
                </div>
                <p className="mt-4 text-gray-300 whitespace-pre-wrap">{formData.description || 'Job description...'}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Card className="bg-[#0a0a0a] border-[#424242]">
          <CardHeader>
            <CardTitle className="text-white">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: null });
                    }}
                    className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-white">Company Name *</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (errors.company) setErrors({ ...errors, company: null });
                    }}
                    className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white ${errors.company ? 'border-red-500' : ''}`}
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Sector *</Label>
                  <Select 
                    value={formData.sector} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, sector: value });
                      if (errors.sector) setErrors({ ...errors, sector: null });
                    }}
                  >
                    <SelectTrigger className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white ${errors.sector ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map(sector => <SelectItem key={sector} value={sector}>{sector}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.sector && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.sector}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-white">Trade *</Label>
                  <Select 
                    value={formData.trade} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, trade: value });
                      if (errors.trade) setErrors({ ...errors, trade: null });
                    }}
                  >
                    <SelectTrigger className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white ${errors.trade ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {trades.map(trade => <SelectItem key={trade} value={trade}>{trade}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.trade && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.trade}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-white">City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      if (errors.city) setErrors({ ...errors, city: null });
                    }}
                    className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-white">Province/State *</Label>
                  <Input
                    value={formData.region}
                    onChange={(e) => {
                      setFormData({ ...formData, region: e.target.value });
                      if (errors.region) setErrors({ ...errors, region: null });
                    }}
                    className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white ${errors.region ? 'border-red-500' : ''}`}
                    placeholder="ON, TX, etc."
                  />
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.region}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-white">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#424242] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-white">Wage Band</Label>
                  <Input
                    value={formData.wageBand}
                    onChange={(e) => setFormData({ ...formData, wageBand: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                    placeholder="$45-$55/hr"
                  />
                </div>
                <div>
                  <Label className="text-white">Union</Label>
                  <Select value={formData.union ? 'Yes' : 'No'} onValueChange={(value) => setFormData({ ...formData, union: value === 'Yes' })}>
                    <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#424242] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Camp/LOA</Label>
                  <Select value={formData.campLOA ? 'Yes' : 'No'} onValueChange={(value) => setFormData({ ...formData, campLOA: value === 'Yes' })}>
                    <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#424242] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#424242] text-white">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map(shift => <SelectItem key={shift} value={shift}>{shift}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Job Description * (max 10,000 characters)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: null });
                  }}
                  className={`mt-2 bg-[#1a1a1a] border-[#424242] text-white h-32 ${errors.description ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <p className={`text-sm ${formData.description.length > 10000 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.description.length} / 10,000
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => navigate(createPageUrl('EmployerDashboard'))}
                  className="bg-[#424242] hover:bg-[#616161] text-white border-[#424242] hover:border-[#616161]"
                  disabled={updateJobMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#f57c00] hover:bg-[#e65100] text-white"
                  disabled={updateJobMutation.isPending}
                >
                  {updateJobMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EmployerJobEdit() {
  return (
    <ProtectedRoute requiredRole="employer">
      <EmployerJobEditContent />
    </ProtectedRoute>
  );
}
