
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Save, Loader2, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
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

function AdminJobNewContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    async function loadUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const createJobMutation = useMutation({
    mutationFn: async (jobData) => {
      return await base44.entities.Job.create(jobData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate(createPageUrl('AdminJobs'));
    },
    onError: (error) => {
      console.error('Failed to create job:', error);
      alert('Failed to create job. Please try again.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const jobData = {
      ...formData,
      postedBy: user.id,
      postedAt: new Date().toISOString(),
      status: 'open',
      views: 0,
      applicationsCount: 0,
    };
    
    createJobMutation.mutate(jobData);
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
        <Button
          variant="ghost"
          onClick={() => window.location.href = createPageUrl('AdminDashboard')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Job (Admin)</h1>
          <p className="text-gray-400">Post a job as administrator</p>
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Company Name *</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Sector *</Label>
                  <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                    <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#424242] text-white">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map(sector => <SelectItem key={sector} value={sector}>{sector}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  {/* Made 'Trade / Position' field optional by removing the asterisk */}
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
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Province/State *</Label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                    placeholder="ON, TX, etc."
                    required
                  />
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
                  <Label className="text-white">Wage Band *</Label>
                  <Input
                    value={formData.wageBand}
                    onChange={(e) => setFormData({ ...formData, wageBand: e.target.value })}
                    className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                    placeholder="$45-$55/hr"
                    required
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
                <Label className="text-white">Shift *</Label>
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
                <Label className="text-white">Job Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white h-32"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl('AdminJobs'))}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Job
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

export default function AdminJobNew() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminJobNewContent />
    </ProtectedRoute>
  );
}
