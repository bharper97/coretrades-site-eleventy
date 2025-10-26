
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, Save, Loader2, AlertCircle, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

const sectors = ['Industrial', 'Commercial', 'Institutional', 'Civil'];
const shifts = ['Days', 'Nights', 'Rotating', 'Flexible'];

const tradeCategories = [
  {
    label: "Red Seal Trades",
    trades: [
      "Boilermaker", "Bricklayer", "Carpenter", "Concrete Finisher", "Drywaller", "Electrician",
      "Glazier", "Heavy-Duty Equipment Technician", "HVAC Technician", "Industrial Mechanic (Millwright)",
      "Insulator", "Ironworker", "Mason", "Painter and Decorator", "Pipefitter", "Plumber",
      "Refrigeration Mechanic", "Roofer", "Sheet Metal Worker", "Steamfitter", "Tiler", "Welder"
    ].sort()
  },
  {
    label: "Construction & Civil",
    trades: [
      "Asphalt Paver", "Blueprint Reader", "CAD Technician", "Civil Designer", "Civil Engineer",
      "Civil Technologist", "Concrete Labourer", "Concrete Pump Operator", "Construction Foreman",
      "Construction Labourer", "Construction Manager", "Construction Safety Officer", "Construction Scheduler",
      "Crane Operator", "Drafting Technician", "Estimator", "Field Engineer", "Finishing Carpenter",
      "Form Setter", "Framer", "Project Coordinator", "Rebar Installer", "Rodman", "Scaffold Builder",
      "Scaffolder", "Site Superintendent", "Survey Crew Chief", "Survey Technician"
    ].sort()
  },
  {
    label: "Mining & Underground",
    trades: [
      "Blaster", "Development Miner", "Diamond Driller", "Driller", "Geotechnical Engineer",
      "Hoist Operator", "Jumbo Operator", "Maintenance Superintendent", "Metallurgical Engineer",
      "Mine Captain", "Mine Electrician", "Mine Engineer", "Mine Mechanic", "Mine Supervisor",
      "Miner Helper", "Production Miner", "Raise Miner", "Service Crew Member", "Shaft Sinker",
      "Shaft Technician", "Shift Boss", "Shotcrete Operator", "Underground Heavy Equipment Operator",
      "Underground Mechanic", "Underground Supervisor", "Underground Surveyor", "Underground Welder",
      "Ventilation Technician"
    ].sort()
  },
  {
    label: "Oil & Gas / Energy",
    trades: [
      "Derrickhand", "Drilling Engineer", "Drilling Supervisor", "Electrical Engineer",
      "Floorhand", "Generator Technician", "Instrumentation Engineer", "Instrumentation Fitter",
      "Instrumentation Technician", "Instrumentation Technologist", "Instrument Mechanic",
      "Marine Engineer", "Mechanical Engineer", "Offshore Technician", "Oilfield Operator",
      "Pipeline Labourer", "Power Engineer", "Power Plant Operator", "Power Systems Electrician",
      "Process Engineer", "Process Operator", "Pumpjack Technician", "Renewable Energy Technician",
      "Rig Manager", "Rigging Foreman", "Roughneck", "Solar Installer", "Utility Worker",
      "Wind Turbine Technician"
    ].sort()
  },
  {
    label: "Forestry & Environmental",
    trades: [
      "Arborist", "Chainsaw Operator", "Environmental Engineer", "Environmental Monitor",
      "Environmental Technician", "Environmental Technologist", "Faller", "Forestry Worker",
      "Geologist", "Logging Equipment Operator", "Sawmill Operator", "Tree Climber",
      "Utility Locator", "Utility Operator", "Wastewater Operator", "Water Treatment Operator"
    ].sort()
  },
  {
    label: "Manufacturing & Industrial",
    trades: [
      "Assembler", "Automation Engineer", "Automation Specialist", "CNC Machinist",
      "Controls Engineer", "Fabricator", "Industrial Automation Technician", "Industrial Electrician",
      "Industrial Engineer", "Industrial Mechanic", "Industrial Painter", "Lathe Operator",
      "Machinist", "Maintenance Coordinator", "Maintenance Electrician", "Maintenance Engineer",
      "Maintenance Fitter", "Maintenance Planner", "Maintenance Supervisor", "Maintenance Technician",
      "Manufacturing Engineer", "Mill Operator", "Milling Machine Operator", "PLC Programmer",
      "Production Assembler", "Production Supervisor", "Production Technician", "Quality Control Inspector",
      "Quality Engineer", "Reliability Engineer", "Robotics Engineer", "Robotics Technician",
      "Sandblaster", "Tool & Die Maker", "Toolmaker", "Welding Inspector", "Welding Supervisor"
    ].sort()
  },
  {
    label: "Transportation & Logistics",
    trades: [
      "Bus Driver", "Dock Worker", "Fleet Mechanic", "Forklift Operator", "Heavy Haul Driver",
      "Inventory Clerk", "Logistics Coordinator", "Logistics Manager", "Marine Mechanic",
      "Parts Technician", "Pilot", "Service Advisor", "Shipping and Receiving Clerk",
      "Truck Driver", "Vehicle Inspector", "Warehouse Supervisor", "Warehouse Worker", "Yard Labourer"
    ].sort()
  },
  {
    label: "Facility & Camp Operations",
    trades: [
      "Building Operator", "Camp Maintenance Worker", "Chef", "Cleaner", "Cook",
      "Facilities Technician", "Field Service Technician", "General Labourer", "Housekeeper",
      "Janitorial Worker", "Labourer", "Laundry Attendant", "Maintenance Coordinator",
      "Maintenance Custodian", "Maintenance Technician", "Security Officer", "Utility Foreman"
    ].sort()
  },
  {
    label: "Supervisory & Management",
    trades: [
      "Civil Engineer", "Compliance Coordinator", "Construction Engineer", "Construction Manager",
      "Contract Administrator", "EHS Specialist", "Electrical Project Manager", "Fabrication Supervisor",
      "Field Engineer", "Foreman", "Industrial Construction Manager", "Industrial Project Coordinator",
      "Maintenance Superintendent", "Maintenance Supervisor", "Mechanical Project Manager",
      "Operations Manager", "Plant Manager", "Procurement Officer", "Procurement Specialist",
      "Project Engineer", "Project Manager", "Project Supervisor", "Safety Coordinator",
      "Safety Lead", "Shop Foreman", "Site Manager", "Superintendent"
    ].sort()
  },
  {
    label: "Apprenticeships & Students",
    trades: [
      "Apprentice Carpenter", "Apprentice Electrician", "Apprentice Heavy Equipment Technician",
      "Apprentice HVAC Technician", "Apprentice Mechanic", "Apprentice Millwright",
      "Apprentice Pipefitter", "Apprentice Plumber", "Apprentice Welder", "Co-op Student",
      "Engineering Student", "Journeyperson", "Trade Instructor"
    ].sort()
  }
];

// Utility function to create kebab-case slug
const kebabCase = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Sanitize description to prevent XSS
const sanitizeDescription = (text) => {
  const temp = document.createElement('div');
  temp.textContent = text;
  return temp.innerHTML;
};

function EmployerJobNewContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [employerProfile, setEmployerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [tradeOpen, setTradeOpen] = useState(false);
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

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Verify user is an employer
        if (currentUser.app_role !== 'employer' && currentUser.email !== 'bretton.harper@gmail.com') {
          toast({
            title: "Access Denied",
            description: "Only employers can post jobs.",
            variant: "destructive",
          });
          navigate(createPageUrl('Home'));
          return;
        }

        // Fetch employer profile to check plan status and associate job
        const employers = await base44.entities.Employer.list();
        const userEmployer = employers.find(emp => 
          emp.ownerEmail === currentUser.email || 
          (emp.memberEmails && emp.memberEmails.includes(currentUser.email))
        );

        if (userEmployer) {
          setEmployerProfile(userEmployer);
          setFormData(prev => ({ ...prev, company: userEmployer.companyName }));
          
          if (!userEmployer.plan && currentUser.email !== 'bretton.harper@gmail.com') {
            toast({
              title: "No Plan Selected",
              description: "Please join the Founding 50 to post jobs.",
              variant: "destructive",
            });
            navigate(createPageUrl('HiringServices'));
            return;
          }

          if (userEmployer.planPostsRemaining !== null && userEmployer.planPostsRemaining <= 0 && currentUser.email !== 'bretton.harper@gmail.com') {
            toast({
              title: "Post Limit Reached",
              description: "You've used all your job posts. Upgrade your plan to post more.",
              variant: "destructive",
            });
            navigate(createPageUrl('EmployerDashboard'));
            return;
          }
        } else if (currentUser.email !== 'bretton.harper@gmail.com') {
          // No employer record found, redirect to complete profile
          toast({
            title: "Profile Incomplete",
            description: "Please complete your employer profile first.",
            variant: "destructive",
          });
          navigate(createPageUrl('CompleteProfile'));
          return;
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [navigate, toast]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.sector) newErrors.sector = 'Sector is required';
    // Trade is now optional, no validation needed
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

  // Generate unique slug
  const generateUniqueSlug = async (title) => {
    let slug = `${kebabCase(title)}-${Date.now()}`;
    
    try {
      const existing = await base44.entities.Job.filter({ slug });
      if (existing.length > 0) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
    }

    return slug;
  };

  const createJobMutation = useMutation({
    mutationFn: async (jobData) => {
      // Generate unique slug
      const slug = await generateUniqueSlug(jobData.title);

      // Create job payload
      const jobPayload = {
        ...jobData,
        slug,
        postedBy: user.id, // The user ID of the individual who posted it
        employerId: employerProfile.id, // The organization ID this job belongs to
        postedAt: new Date().toISOString(),
        status: 'open',
        archived: false,
        views: 0,
        applicationsCount: 0,
        description: sanitizeDescription(jobData.description),
      };

      const createdJob = await base44.entities.Job.create(jobPayload);

      // Decrement posts remaining if not unlimited
      if (employerProfile && employerProfile.planPostsRemaining !== null) {
        await base44.entities.Employer.update(employerProfile.id, {
          planPostsRemaining: employerProfile.planPostsRemaining - 1
        });
      }

      // Fire analytics event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'job_posted', {
          job_title: jobPayload.title,
          company: jobPayload.company,
          sector: jobPayload.sector,
          region: jobPayload.region,
        });
      }

      return createdJob;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] }); // Invalidate employer profile to refresh post count
      
      toast({
        title: "Success!",
        description: "Job posted successfully.",
      });

      navigate(createPageUrl('EmployerDashboard') + '?posted=1');
    },
    onError: (error) => {
      console.error('Failed to create job:', error);
      toast({
        title: "Error",
        description: "Could not publish job. Please try again.",
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
    
    createJobMutation.mutate(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
            <h1 className="text-4xl font-bold mb-2">Post a Job</h1>
            <p className="text-gray-400">Fill out the details below to post your ICI job</p>
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
                    disabled // Company name is now pre-filled from employer profile
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
                  <Label className="text-white">Trade / Position</Label>
                  <Popover open={tradeOpen} onOpenChange={setTradeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={tradeOpen}
                        className="mt-2 w-full justify-between bg-[#1a1a1a] border-[#424242] text-white hover:bg-[#1a1a1a] hover:text-white"
                      >
                        {formData.trade || "Select trade or position..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-[#0a0a0a] border-[#424242]" align="start">
                      <Command className="bg-[#0a0a0a]">
                        <CommandInput 
                          placeholder="Search trades..." 
                          className="bg-[#1a1a1a] text-white border-[#424242]"
                        />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          <CommandEmpty className="text-gray-400 p-4 text-center">No trade found.</CommandEmpty>
                          {tradeCategories.map((category) => (
                            <CommandGroup key={category.label} heading={category.label} className="text-[#f57c00]">
                              {category.trades.map((trade) => (
                                <CommandItem
                                  key={trade}
                                  value={trade}
                                  onSelect={(currentValue) => {
                                    setFormData({ ...formData, trade: currentValue });
                                    setTradeOpen(false);
                                  }}
                                  className="text-white hover:bg-[#1a1a1a] cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.trade === trade ? "opacity-100 text-[#f57c00]" : "opacity-0"
                                    )}
                                  />
                                  {trade}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                  variant="outline"
                  onClick={() => navigate(createPageUrl('EmployerDashboard'))}
                  className="bg-[#424242] hover:bg-[#616161] text-white border-[#424242] hover:border-[#616161]"
                  disabled={createJobMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#f57c00] hover:bg-[#e65100] text-white"
                  disabled={createJobMutation.isPending}
                >
                  {createJobMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Post Job
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

export default function EmployerJobNew() {
  return (
    <ProtectedRoute requiredRole="employer">
      <EmployerJobNewContent />
    </ProtectedRoute>
  );
}
