
import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const StoreContext = createContext();

const STORAGE_KEYS = {
  JOBS: 'ct_jobs',
  BLOGS: 'ct_blogs',
  EMPLOYERS: 'ct_employers',
};

const seedData = {
  jobs: [
    {
      id: '1',
      title: 'Industrial Electrician',
      company: 'Northern Smelter Operations',
      sector: 'Industrial',
      trade: 'Electrician',
      city: 'Sudbury',
      province_state: 'ON',
      country: 'Canada',
      wage_band: '$45-$55/hr',
      union: 'Yes',
      camp_loa: 'No',
      shift: 'Days',
      description: 'Shutdown maintenance on smelter facility. 442A required.',
      posted_at: new Date().toISOString(),
      status: 'open',
      employer_id: 'seed_employer',
    },
    {
      id: '2',
      title: 'Pipefitter',
      company: 'Gulf Coast Refining',
      sector: 'Industrial',
      trade: 'Pipefitter',
      city: 'Houston',
      province_state: 'TX',
      country: 'USA',
      wage_band: '$42-$50/hr',
      union: 'No',
      camp_loa: 'Yes',
      shift: 'Rotating',
      description: 'Refinery expansion project. Red Seal preferred.',
      posted_at: new Date().toISOString(),
      status: 'open',
      employer_id: 'seed_employer',
    },
    {
      id: '3',
      title: 'CWB Welder',
      company: 'Hamilton Steel Fabrication',
      sector: 'Commercial',
      trade: 'Welder',
      city: 'Hamilton',
      province_state: 'ON',
      country: 'Canada',
      wage_band: '$38-$48/hr',
      union: 'Yes',
      camp_loa: 'No',
      shift: 'Days',
      description: 'Structural steel welding for commercial tower project.',
      posted_at: new Date().toISOString(),
      status: 'open',
      employer_id: 'seed_employer',
    },
    {
      id: '4',
      title: 'Millwright',
      company: 'Northern Pulp & Paper',
      sector: 'Industrial',
      trade: 'Millwright',
      city: 'Thunder Bay',
      province_state: 'ON',
      country: 'Canada',
      wage_band: '$44-$50/hr',
      union: 'Yes',
      camp_loa: 'No',
      shift: 'Rotating',
      description: 'Mill maintenance and equipment installation.',
      posted_at: new Date().toISOString(),
      status: 'open',
      employer_id: 'seed_employer',
    },
  ],
  blogs: [
    {
      id: '1',
      title: 'How hospitals procure ICI crews: lessons from P3 builds',
      author: 'Michael Chen',
      date: '2025-03-15',
      excerpt: 'Public-private partnerships are changing how institutional projects secure skilled trades.',
      body: 'Full article content here...',
      categories: ['Institutional', 'Procurement'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      status: 'published',
    },
    {
      id: '2',
      title: 'Shutdown staffing: best practices for mill & smelter turnarounds',
      author: 'Sarah Martinez',
      date: '2025-03-12',
      excerpt: 'Planning a major industrial shutdown requires precision staffing.',
      body: 'Full article content here...',
      categories: ['Industrial', 'Best Practices'],
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
      status: 'published',
    },
    {
      id: '3',
      title: 'Union vs non-union in heavy civil: cost, safety, and schedule',
      author: 'David Thompson',
      date: '2025-03-08',
      excerpt: 'A comprehensive analysis of union and non-union labor models in heavy civil construction.',
      body: 'Full article content here...',
      categories: ['Civil', 'Analysis'],
      image: 'https://images.unsplash.com/photo-1590496793907-4d5c6c8ea3fd?w=800&q=80',
      status: 'published',
    },
    {
      id: '4',
      title: 'Digital document control in construction: the new normal',
      author: 'Emily Rodriguez',
      date: '2025-03-05',
      excerpt: 'Digital document management is revolutionizing ICI projects.',
      body: 'Full article content here...',
      categories: ['Technology', 'Commercial'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      status: 'published',
    },
  ],
  employers: [],
};

export function StoreProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
        const storedBlogs = localStorage.getItem(STORAGE_KEYS.BLOGS);
        const storedEmployers = localStorage.getItem(STORAGE_KEYS.EMPLOYERS);

        if (storedJobs) setJobs(JSON.parse(storedJobs));
        else {
          setJobs(seedData.jobs);
          localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(seedData.jobs));
        }

        if (storedBlogs) setBlogs(JSON.parse(storedBlogs));
        else {
          setBlogs(seedData.blogs);
          localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(seedData.blogs));
        }

        if (storedEmployers) setEmployers(JSON.parse(storedEmployers));
        else {
          setEmployers(seedData.employers);
          localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(seedData.employers));
        }
      } catch (error) {
        console.error('Error loading store data:', error);
      }
    };

    loadData();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (jobs.length > 0) localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    if (blogs.length > 0) localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(employers));
  }, [employers]);

  // Employer helpers (moved above createJob to ensure it's defined when called)
  const updateEmployer = (id, updates) => {
    setEmployers(prevEmployers => prevEmployers.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  };


  // Job helpers
  const createJob = (jobData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    // Find employer record
    const employer = employers.find(e => e.id === user.id);
    
    // Check if employer has plan and posts remaining
    if (!employer) {
      return { success: false, error: 'Employer record not found' };
    }
    
    if (employer.planPostsRemaining === null) {
      return { success: false, error: 'No plan selected' };
    }
    
    if (employer.planPostsRemaining !== null && employer.planPostsRemaining <= 0) {
      return { success: false, error: 'Post limit reached' };
    }
    
    // Create job
    const newJob = {
      id: `job_${Date.now()}`,
      ...jobData,
      posted_at: new Date().toISOString(),
      status: 'open',
      employer_id: user?.id || 'unknown',
    };
    setJobs([...jobs, newJob]);
    
    // Decrement posts remaining (if not unlimited)
    if (employer.planPostsRemaining !== null) {
      updateEmployer(user.id, { 
        planPostsRemaining: employer.planPostsRemaining - 1 
      });
    }
    
    return { success: true, job: newJob };
  };

  const updateJob = (id, updates) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  // Blog helpers
  const createBlog = (blogData) => {
    const newBlog = {
      id: `blog_${Date.now()}`,
      ...blogData,
      date: new Date().toISOString().split('T')[0],
    };
    setBlogs([...blogs, newBlog]);
    return newBlog;
  };

  const updateBlog = (id, updates) => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, ...updates } : blog));
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  const value = {
    jobs,
    blogs,
    employers,
    user,
    loading,
    createJob,
    updateJob,
    deleteJob,
    createBlog,
    updateBlog,
    deleteBlog,
    updateEmployer,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
