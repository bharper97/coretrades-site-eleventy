
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, DollarSign, Clock, Briefcase, Search, Loader2, CheckCircle, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Hero from '@/components/Hero';

export default function JobBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const [userSavedJobs, setUserSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  
  const [filters, setFilters] = useState({
    keyword: searchParams.get('q') || '',
    location: searchParams.get('loc') || '',
    sector: searchParams.get('sector') || '',
    minWage: searchParams.get('min') || '',
  });

  useEffect(() => {
    async function loadUserAndProfile() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const profiles = await base44.entities.Profile.filter({ created_by: currentUser.email });
        if (profiles.length > 0) {
          setProfile(profiles[0]);

          const apps = await base44.entities.Application.filter({ candidateId: profiles[0].id });
          setUserApplications(apps.map(a => a.jobId));

          const saved = await base44.entities.SavedJob.filter({ userId: profiles[0].id });
          setUserSavedJobs(saved.map(s => s.jobId));
        } else {
          setProfile(null);
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
        setUserApplications([]);
        setUserSavedJobs([]);
      }
    }
    loadUserAndProfile();
  }, []);

  useEffect(() => {
    document.title = 'Job Board - Browse ICI Trades Jobs | CoreTrades';
    
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    setMetaTag('description', 'Browse real ICI trades jobs from verified employers across North America. Find electrician, welder, pipefitter, millwright, and other skilled trades opportunities.');
    setMetaTag('keywords', 'ICI jobs board, trades job search, electrician jobs Canada USA, welder jobs North America, pipefitter jobs, millwright jobs, industrial construction jobs, commercial trades jobs');
    
    setMetaTag('og:title', 'Job Board - Browse ICI Trades Jobs | CoreTrades', true);
    setMetaTag('og:description', 'Find your next ICI trades opportunity. Browse verified jobs from real employers across North America.', true);
    setMetaTag('og:url', 'https://coretrades.co/job-board', true);
    setMetaTag('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/b784e5965_coretrades4.jpg', true);
    
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'Job Board - Browse ICI Trades Jobs | CoreTrades');
    setMetaTag('twitter:description', 'Real trades jobs from verified employers. Start your search today.');
    setMetaTag('twitter:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/b784e5965_coretrades4.jpg');

    return () => {
      document.title = 'Core Trades Inc.';
    };
  }, []);

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let allJobs = await base44.entities.Job.list('-postedAt');
      
      allJobs = allJobs.filter(job => job.status === 'open' && !job.archived);
      
      return allJobs.filter(job => {
        if (filters.keyword) {
          const kw = filters.keyword.toLowerCase();
          const searchText = `${job.title} ${job.trade} ${job.company} ${job.description}`.toLowerCase();
          if (!searchText.includes(kw)) return false;
        }
        
        if (filters.location) {
          const loc = filters.location.toLowerCase();
          const locText = `${job.city} ${job.region} ${job.country}`.toLowerCase();
          if (!locText.includes(loc)) return false;
        }
        
        if (filters.sector && job.sector !== filters.sector) return false;
        
        if (filters.minWage) {
          const min = parseFloat(filters.minWage);
          const match = job.wageBand?.match(/\$?(\d+)/);
          if (match) {
            const wageLower = parseFloat(match[1]);
            if (wageLower < min) return false;
          }
        }
        
        return true;
      });
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const handleSearch = () => {
    const params = {};
    if (filters.keyword) params.q = filters.keyword;
    if (filters.location) params.loc = filters.location;
    if (filters.sector) params.sector = filters.sector;
    if (filters.minWage) params.min = filters.minWage;
    setSearchParams(params);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (job) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }

      if (!profile) throw new Error('Profile not found');
      
      const isSaved = userSavedJobs.includes(job.id);
      
      if (isSaved) {
        const savedJobs = await base44.entities.SavedJob.filter({
          jobId: job.id,
          userId: profile.id
        });
        if (savedJobs.length > 0) {
          await base44.entities.SavedJob.delete(savedJobs[0].id);
        }
      } else {
        await base44.entities.SavedJob.create({
          jobId: job.id,
          userId: profile.id
        });
      }
      
      return { job, wasSaved: isSaved };
    },
    onSuccess: ({ job, wasSaved }) => {
      if (wasSaved) {
        setUserSavedJobs(prev => prev.filter(id => id !== job.id));
      } else {
        setUserSavedJobs(prev => [...prev, job.id]);
      }
      
      toast({
        title: wasSaved ? "Job Unsaved" : "Job Saved",
        description: wasSaved ? "Removed from your saved jobs" : "Added to your saved jobs",
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (job) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }

      if (!profile || profile.role !== 'tradesperson') {
        throw new Error('Only tradespeople can apply');
      }

      await base44.entities.Application.create({
        jobId: job.id,
        candidateId: profile.id,
        employerId: job.postedBy,
        status: 'new'
      });

      await base44.entities.Job.update(job.id, {
        applicationsCount: (job.applicationsCount || 0) + 1
      });
      
      return job;
    },
    onSuccess: (job) => {
      setUserApplications(prev => [...prev, job.id]);
      queryClient.invalidateQueries(['jobs']);
      
      toast({
        title: "Application Sent!",
        description: "Your application has been submitted successfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <Hero pageKey="jobBoard" imageSrc="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/b784e5965_coretrades4.jpg">
        <h1 className="text-4xl md:text-6xl font-black mb-3 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
          Explore Industrial, Commercial & Institutional Jobs Across North America
        </h1>
        <p className="text-lg md:text-xl mb-4 text-zinc-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] max-w-3xl mx-auto">
          Real trades jobs from verified employers.
        </p>
        
        <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 mt-8 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-4">
            <Input
              placeholder="Keyword (e.g., Welder)"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
            />
            <Select value={filters.sector} onValueChange={(value) => setFilters({ ...filters, sector: value === 'all' ? '' : value })}>
              <SelectTrigger className="bg-black/40 border-white/20 text-white">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Institutional">Institutional</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Min Wage"
              value={filters.minWage}
              onChange={(e) => setFilters({ ...filters, minWage: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleSearch} className="bg-[#f57c00] hover:bg-[#e65100] text-white">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Hero>

      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-[#f57c00] mx-auto mb-4 animate-spin" />
              <div className="text-gray-400 text-lg">Loading jobs...</div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-400">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => {
                  const hasApplied = userApplications.includes(job.id);
                  const isSaved = userSavedJobs.includes(job.id);
                  const isTradesperson = profile?.role === 'tradesperson';

                  return (
                    <div
                      key={job.id}
                      className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00] transition-all duration-300 relative flex flex-col justify-between"
                    >
                      {isTradesperson && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          {hasApplied && (
                            <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Applied
                            </Badge>
                          )}
                          {isSaved && (
                            <Badge className="bg-blue-500/20 text-blue-400 flex items-center gap-1">
                              <Bookmark className="w-3 h-3" />
                              Saved
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div className="pr-24">
                          <h3 className="text-2xl font-bold mb-2 text-white">{job.title}</h3>
                          <p className="text-gray-300">{job.company}</p>
                        </div>
                        <span className="bg-[#f57c00]/20 text-[#f57c00] px-3 py-1 rounded-full text-sm font-medium">
                          {job.sector}
                        </span>
                      </div>

                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-[#f57c00]" />
                          <span>{job.city}, {job.region}</span>
                        </div>
                        {job.wageBand && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="w-4 h-4 text-[#f57c00]" />
                            <span>{job.wageBand}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-[#f57c00]" />
                          <span>Posted {new Date(job.postedAt || job.created_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleViewDetails(job)}
                        className="w-full bg-[#f57c00] hover:bg-[#e65100] text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  );
                })}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No jobs found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Job Detail Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="bg-[#0a0a0a] border-[#424242] text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedJob && (
            <>
              <DialogHeader className="flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-8">
                    <DialogTitle className="text-3xl font-black text-white mb-2">
                      {selectedJob.title}
                    </DialogTitle>
                    <p className="text-xl text-gray-300">{selectedJob.company}</p>
                  </div>
                  <Badge className="bg-[#f57c00]/20 text-[#f57c00] text-sm px-3 py-1">
                    {selectedJob.sector}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto space-y-6 mt-6 pr-2">
                {/* Job Info Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#424242]">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-[#f57c00]" />
                      <span className="text-sm text-gray-400">Location</span>
                    </div>
                    <p className="text-white font-medium">{selectedJob.city}, {selectedJob.region}, {selectedJob.country}</p>
                  </div>

                  {selectedJob.wageBand && (
                    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#424242]">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-[#f57c00]" />
                        <span className="text-sm text-gray-400">Wage Band</span>
                      </div>
                      <p className="text-white font-medium">{selectedJob.wageBand}</p>
                    </div>
                  )}

                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#424242]">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="w-5 h-5 text-[#f57c00]" />
                      <span className="text-sm text-gray-400">Trade</span>
                    </div>
                    <p className="text-white font-medium">{selectedJob.trade}</p>
                  </div>

                  {selectedJob.shift && (
                    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#424242]">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-[#f57c00]" />
                        <span className="text-sm text-gray-400">Shift</span>
                      </div>
                      <p className="text-white font-medium">{selectedJob.shift}</p>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                {(selectedJob.union || selectedJob.campLOA) && (
                  <div className="flex flex-wrap gap-3">
                    {selectedJob.union && (
                      <Badge className="bg-blue-500/20 text-blue-400">Union</Badge>
                    )}
                    {selectedJob.campLOA && (
                      <Badge className="bg-purple-500/20 text-purple-400">Camp/LOA</Badge>
                    )}
                  </div>
                )}

                {/* Job Description */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#424242]">
                  <h3 className="text-xl font-bold text-white mb-4">Job Description</h3>
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedJob.description}
                  </div>
                </div>
              </div>

              {/* Fixed Action Buttons at Bottom */}
              <div className="flex-shrink-0 pt-6 border-t border-[#424242] mt-6">
                {profile?.role === 'tradesperson' ? (
                  <div className="flex gap-4">
                    <Button
                      onClick={() => saveMutation.mutate(selectedJob)}
                      disabled={saveMutation.isPending}
                      variant="outline"
                      size="lg"
                      className="flex-1 border-[#424242] hover:border-[#f57c00] hover:bg-[#f57c00]/10 text-white h-14 text-lg"
                    >
                      {saveMutation.isPending ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : userSavedJobs.includes(selectedJob.id) ? (
                        <>
                          <BookmarkCheck className="w-5 h-5 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-5 h-5 mr-2" />
                          Save Job
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => applyMutation.mutate(selectedJob)}
                      disabled={applyMutation.isPending || userApplications.includes(selectedJob.id)}
                      size="lg"
                      className="flex-1 bg-[#f57c00] hover:bg-[#e65100] text-white disabled:opacity-50 h-14 text-lg font-bold"
                    >
                      {applyMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : userApplications.includes(selectedJob.id) ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Applied
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                  </div>
                ) : !user ? (
                  <div className="bg-[#f57c00]/10 border border-[#f57c00]/30 p-6 rounded-lg text-center">
                    <p className="text-white mb-4 text-lg">Sign in to save or apply to this job</p>
                    <Button
                      onClick={() => {
                        setShowJobModal(false);
                        base44.auth.redirectToLogin();
                      }}
                      size="lg"
                      className="bg-[#f57c00] hover:bg-[#e65100] text-white w-full h-14 text-lg font-bold"
                    >
                      Login / Register
                    </Button>
                  </div>
                ) : (
                  <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg text-center">
                    <p className="text-white text-lg">
                      Only tradespeople can apply to jobs. Switch to a tradesperson account to apply.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
