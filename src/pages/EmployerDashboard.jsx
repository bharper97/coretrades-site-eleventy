
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  DollarSign, 
  CreditCard, 
  Eye,
  FileText,
  Pencil,
  Trash2,
  XCircle,
  TrendingUp,
  RotateCcw, // For Reopen action
  Archive, // For Archive action
  Users, // For Team Seats
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/components/ui/use-toast'; // Import useToast

function EmployerDashboardContent() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isResumeDrawerOpen, setIsResumeDrawerOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast(); // Initialize useToast

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

  const { data: jobs = [] } = useQuery({
    queryKey: ['employer-jobs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const allJobs = await base44.entities.Job.list('-postedAt');
      return allJobs.filter(job => job.postedBy === user.id);
    },
    enabled: !!user?.id,
  });

  const { data: employer } = useQuery({
    queryKey: ['employer-profile', user?.email], // Changed queryKey to use user.email
    queryFn: async () => {
      if (!user?.email) return null;
      // First, try to find the employer where the user is a member
      const employers = await base44.entities.Employer.filter({ 
        memberEmails: [user.email] 
      });
      if (employers.length > 0) return employers[0];
      
      // Fallback: if not found as a member, check if they are an owner
      const ownerEmployers = await base44.entities.Employer.filter({ 
        ownerEmail: user.email 
      });
      return ownerEmployers[0] || null;
    },
    enabled: !!user?.email, // Enabled when user.email is available
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['employer-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const allApplications = await base44.entities.Application.list('-created_date');
      // Filter applications by employerId (which for base44 is usually the user.id of the employer who posted)
      // This assumes employerId in Application entity maps to the user.id of the employer.
      // If it maps to the Employer entity's ID, further logic would be needed.
      return allApplications.filter(app => app.employerId === user.id);
    },
    enabled: !!user?.id,
  });

  const closeJobMutation = useMutation({
    mutationFn: async (jobId) => {
      return await base44.entities.Job.update(jobId, { status: 'closed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Closed",
        description: "The job has been successfully closed.",
      });
    },
  });

  const reopenJobMutation = useMutation({
    mutationFn: async (jobId) => {
      return await base44.entities.Job.update(jobId, { status: 'open' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Reopened",
        description: "The job is now visible on the job board.",
      });
    },
  });

  const archiveJobMutation = useMutation({
    mutationFn: async (jobId) => {
      return await base44.entities.Job.update(jobId, { archived: true, status: 'closed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Archived",
        description: "The job has been archived and hidden from public view.",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId) => {
      return await base44.entities.Job.delete(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setJobToDelete(null);
      toast({
        title: "Job Deleted",
        description: "The job has been permanently deleted.",
      });
    },
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ appId, status }) => {
      return await base44.entities.Application.update(appId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
    },
  });

  const handleViewResume = async (candidateId) => {
    try {
      // Assuming Resume entities have a userId field corresponding to the candidate's user ID
      const resumes = await base44.entities.Resume.filter({ userId: candidateId });
      setSelectedResume(resumes[0] || null); // Take the first resume found for the candidate
      setIsResumeDrawerOpen(true);
    } catch (error) {
      console.error('Failed to load resume:', error);
      toast({
        title: "Error",
        description: "Failed to load candidate's resume.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
  };

  const confirmDeleteJob = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete.id);
    }
  };

  const archivedJobs = jobs.filter(j => j.archived);
  const activeJobsList = jobs.filter(j => !j.archived);
  const displayedJobs = showArchived ? archivedJobs : activeJobsList;

  const activeJobs = activeJobsList.filter(j => j.status === 'open').length;
  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);
  const totalApplications = applications.length;
  const planStatus = employer?.plan || 'No Plan';
  
  // Seat tracking - handle unlimited for founding50
  const seatsUsed = employer?.memberEmails?.length || 0;
  const seatsTotal = employer?.planSeats; // null for unlimited
  const postsRemaining = employer?.planPostsRemaining; // null for unlimited

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Employer Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.full_name}</p>
            {employer && (
              <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                <span className="text-[#f57c00] font-medium">
                  Seats: {seatsUsed}/{seatsTotal === null ? '∞' : seatsTotal}
                </span>
                <span className="text-gray-400">
                  Posts Remaining: {postsRemaining === null ? '∞' : postsRemaining}
                </span>
              </div>
            )}
          </div>
          <Link to={createPageUrl('EmployerJobNew')}>
            <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white">
              <Plus className="w-5 h-5 mr-2" />
              Post Job
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#0a0a0a] border border-[#424242]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applications">
              Applications
              {totalApplications > 0 && (
                <span className="ml-2 bg-[#f57c00] text-white text-xs px-2 py-0.5 rounded-full">
                  {totalApplications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            {employer?.ownerEmail === user?.email && ( // Only show organization tab to the owner
              <TabsTrigger value="organization">Organization</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"> {/* Adjusted grid for 5 cards */}
              <Card className="bg-[#0a0a0a] border-[#424242]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Jobs</CardTitle>
                    <Briefcase className="w-5 h-5 text-[#f57c00]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{activeJobs}</div>
                  <p className="text-xs text-gray-500 mt-1">Currently open positions</p>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a0a] border-[#424242]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
                    <Eye className="w-5 h-5 text-[#f57c00]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{totalViews}</div>
                  <p className="text-xs text-gray-500 mt-1">Job post views</p>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a0a] border-[#424242]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Applications</CardTitle>
                    <FileText className="w-5 h-5 text-[#f57c00]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{totalApplications}</div>
                  <p className="text-xs text-gray-500 mt-1">Total received</p>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a0a] border-[#424242]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Team Seats</CardTitle>
                    <Users className="w-5 h-5 text-[#f57c00]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {seatsUsed}/{seatsTotal === null ? '∞' : seatsTotal}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Seats in use</p>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a0a] border-[#424242]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Plan Status</CardTitle>
                    <CreditCard className="w-5 h-5 text-[#f57c00]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white capitalize">
                    {planStatus === 'founding50' ? 'Founding 50' : planStatus}
                  </div>
                  {planStatus === 'No Plan' && (
                    <Link to={createPageUrl('HiringServices')}>
                      <Button size="sm" className="mt-2 bg-[#f57c00] hover:bg-[#e65100] text-xs">
                        Choose Plan
                      </Button>
                    </Link>
                  )}
                  {planStatus === 'founding50' && (
                    <p className="text-xs text-[#f57c00] mt-1 font-medium">Lifetime Rate Locked</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#0a0a0a] border-[#424242]">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl('EmployerJobNew')} className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#424242] hover:border-[#f57c00] transition-all">
                  <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5 text-[#f57c00]" />
                    <div>
                      <p className="font-medium text-white">Post New Job</p>
                      <p className="text-sm text-gray-400 mt-1">Reach thousands of qualified tradespeople</p>
                    </div>
                  </div>
                </Link>
                <Link to={createPageUrl('JobBoard')} className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#424242] hover:border-[#f57c00] transition-all">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#f57c00]" />
                    <div>
                      <p className="font-medium text-white">View Job Board</p>
                      <p className="text-sm text-gray-400 mt-1">See how your posts appear to candidates</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Jobs Tab */}
          <TabsContent value="jobs">
            <Card className="bg-[#0a0a0a] border-[#424242]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Briefcase className="w-5 h-5 text-[#f57c00]" />
                    {showArchived ? `Archived Jobs (${archivedJobs.length})` : `Posted Jobs (${activeJobsList.length})`}
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowArchived(!showArchived)}
                    className="border-[#424242] text-white hover:border-[#f57c00]"
                  >
                    {showArchived ? 'View Active Jobs' : `View Archived (${archivedJobs.length})`}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {displayedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">
                      {showArchived ? 'No archived jobs yet.' : "You haven't posted any jobs yet."}
                    </p>
                    {!showArchived && (
                      <Link to={createPageUrl('EmployerJobNew')}>
                        <Button className="bg-[#f57c00] hover:bg-[#e65100]">
                          Post Your First Job
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedJobs.map(job => (
                      <div key={job.id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#424242] hover:border-[#f57c00] transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                            <p className="text-gray-400">{job.company}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            job.archived 
                              ? 'bg-gray-500/20 text-gray-400'
                              : job.status === 'open' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {job.archived ? 'archived' : job.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-[#f57c00]" />
                            {job.city}, {job.region}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="w-4 h-4 text-[#f57c00]" />
                            {job.wageBand}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Eye className="w-4 h-4 text-[#f57c00]" />
                            {job.views || 0} views
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <FileText className="w-4 h-4 text-[#f57c00]" />
                            {job.applicationsCount || 0} applications
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Link to={createPageUrl('EmployerJobEdit') + `?id=${job.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30 hover:border-blue-500 hover:text-blue-200"
                              disabled={job.archived}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          {job.status === 'open' && !job.archived && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => closeJobMutation.mutate(job.id)}
                              className="bg-yellow-600/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/30 hover:border-yellow-500 hover:text-yellow-200"
                              disabled={closeJobMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Close
                            </Button>
                          )}
                          {job.status === 'closed' && !job.archived && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reopenJobMutation.mutate(job.id)}
                              className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 hover:border-green-500 hover:text-green-200"
                              disabled={reopenJobMutation.isPending}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reopen
                            </Button>
                          )}
                          {!job.archived && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => archiveJobMutation.mutate(job.id)}
                              className="bg-orange-600/20 border-orange-500/50 text-orange-300 hover:bg-orange-600/30 hover:border-orange-500 hover:text-orange-200"
                              disabled={archiveJobMutation.isPending}
                            >
                              <Archive className="w-4 h-4 mr-1" />
                              Archive
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteJob(job)}
                            className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30 hover:border-red-500 hover:text-red-200"
                            disabled={deleteJobMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="bg-[#0a0a0a] border-[#424242]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-[#f57c00]" />
                  Applications Received ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No applications received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#424242]">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">
                                Application for: {job?.title || 'Unknown Job'}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Candidate ID: {app.candidateId}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Applied: {new Date(app.created_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Select
                              value={app.status}
                              onValueChange={(value) => 
                                updateApplicationMutation.mutate({ appId: app.id, status: value })
                              }
                            >
                              <SelectTrigger className="w-40 bg-[#0a0a0a] border-[#424242] text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1a1a1a] text-white border-[#424242]">
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleViewResume(app.candidateId)}
                            className="bg-[#f57c00] hover:bg-[#e65100]"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Resume
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="bg-[#0a0a0a] border-[#424242]">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#424242]">
                    <p className="text-sm text-gray-400">Logged in as</p>
                    <p className="font-medium text-white">{user.full_name}</p>
                    <p className="text-xs text-[#f57c00] mt-1 capitalize">{user.app_role || user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white font-medium">{user?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Type</p>
                    <p className="text-white font-medium capitalize">{user?.app_role || 'Employer'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <p className="text-white font-medium capitalize">
                      {planStatus === 'founding50' ? 'Founding 50 (Lifetime $34.99/mo)' : planStatus}
                    </p>
                    {planStatus === 'No Plan' && (
                      <Link to={createPageUrl('HiringServices')}>
                        <Button className="mt-2 bg-[#f57c00] hover:bg-[#e65100]">
                          Join the Founding 50
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Tab - Only visible to employer owner */}
          {employer?.ownerEmail === user?.email && (
            <TabsContent value="organization">
              <Card className="bg-[#0a0a0a] border-[#424242]">
                <CardHeader>
                  <CardTitle className="text-white">Organization Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-400">Organization Name</p>
                      <p className="text-white font-medium">{employer?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Owner Email</p>
                      <p className="text-white font-medium">{employer?.ownerEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Team Seats</p>
                      <p className="text-white font-medium">
                        {seatsUsed} / {seatsTotal === null ? 'Unlimited' : seatsTotal}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Currently {seatsUsed} team members are using seats.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Job Posts Remaining</p>
                      <p className="text-white font-medium">
                        {postsRemaining === null ? 'Unlimited' : postsRemaining}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Number of job posts you can create with your current plan.
                      </p>
                    </div>
                    {/* Add more organization specific settings here like managing members if needed */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Resume Viewer Drawer */}
      <Sheet open={isResumeDrawerOpen} onOpenChange={setIsResumeDrawerOpen}>
        <SheetContent className="bg-[#0a0a0a] border-l border-[#424242] text-white w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-white">Candidate Resume</SheetTitle>
          </SheetHeader>
          {selectedResume ? (
            <div className="mt-6 space-y-6">
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#424242]">
                <h3 className="text-xl font-bold mb-2">{selectedResume.headline || 'No headline provided'}</h3>
                <p className="text-gray-300 mt-4">{selectedResume.summary || 'No summary provided'}</p>
              </div>

              {selectedResume.tickets && selectedResume.tickets.length > 0 && (
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#424242]">
                  <h4 className="text-lg font-bold mb-3 text-[#f57c00]">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.tickets.map((ticket, idx) => (
                      <span key={idx} className="bg-[#f57c00]/20 text-[#f57c00] px-3 py-1 rounded-full text-sm">
                        {ticket}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedResume.experience && selectedResume.experience.length > 0 && (
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#424242]">
                  <h4 className="text-lg font-bold mb-4 text-[#f57c00]">Experience</h4>
                  <div className="space-y-4">
                    {selectedResume.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-[#f57c00] pl-4">
                        <h5 className="font-bold text-white">{exp.role}</h5>
                        <p className="text-gray-400 text-sm">{exp.employer} • {exp.siteType}</p>
                        <p className="text-gray-500 text-sm">{exp.from} - {exp.to}</p>
                        {exp.notes && <p className="text-gray-300 mt-2">{exp.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No resume found for this candidate.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-[#424242] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
              All applications for this job will remain but be orphaned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#424242] hover:bg-[#616161] text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function EmployerDashboard() {
  return (
    <ProtectedRoute requiredRole="employer">
      <EmployerDashboardContent />
    </ProtectedRoute>
  );
}
