import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const seedJobs = [
  {
    id: 'job_1',
    title: 'Industrial Electrician',
    company: 'Northern Smelter Operations',
    sector: 'Industrial',
    trade: 'Electrician',
    city: 'Sudbury',
    region: 'ON',
    country: 'Canada',
    wageBand: '$45-$55/hr',
    union: true,
    campLOA: false,
    shift: 'Days',
    description: 'Shutdown maintenance on smelter facility. 442A required. Experience with high-voltage systems essential.',
    postedBy: 'seed_employer',
    postedAt: new Date().toISOString(),
    status: 'open',
    views: 0,
    applicationsCount: 0,
  },
  {
    id: 'job_2',
    title: 'CWB Welder',
    company: 'Hamilton Steel Fabrication',
    sector: 'Commercial',
    trade: 'Welder',
    city: 'Hamilton',
    region: 'ON',
    country: 'Canada',
    wageBand: '$38-$48/hr',
    union: true,
    campLOA: false,
    shift: 'Days',
    description: 'Structural steel welding for commercial tower project. CWB Level 1 required.',
    postedBy: 'seed_employer',
    postedAt: new Date().toISOString(),
    status: 'open',
    views: 0,
    applicationsCount: 0,
  },
  {
    id: 'job_3',
    title: 'Pipefitter',
    company: 'Gulf Coast Refining',
    sector: 'Industrial',
    trade: 'Pipefitter',
    city: 'Houston',
    region: 'TX',
    country: 'USA',
    wageBand: '$42-$50/hr',
    union: false,
    campLOA: true,
    shift: 'Rotating',
    description: 'Refinery expansion project. Red Seal preferred. Camp accommodation provided.',
    postedBy: 'seed_employer',
    postedAt: new Date().toISOString(),
    status: 'open',
    views: 0,
    applicationsCount: 0,
  },
];

export function DataProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sessionViews, setSessionViews] = useState(new Set());

  useEffect(() => {
    // Initialize data
    const storedJobs = localStorage.getItem('ct_jobs');
    if (!storedJobs) {
      localStorage.setItem('ct_jobs', JSON.stringify(seedJobs));
      setJobs(seedJobs);
    } else {
      setJobs(JSON.parse(storedJobs));
    }

    setApplications(JSON.parse(localStorage.getItem('ct_applications') || '[]'));
    setEmployers(JSON.parse(localStorage.getItem('ct_employers') || '[]'));
    setBlogs(JSON.parse(localStorage.getItem('ct_blogs') || '[]'));
  }, []);

  const saveJobs = (newJobs) => {
    localStorage.setItem('ct_jobs', JSON.stringify(newJobs));
    setJobs(newJobs);
  };

  const createJob = (jobData, employerId) => {
    const employers = JSON.parse(localStorage.getItem('ct_employers') || '[]');
    const employer = employers.find(e => e.id === employerId);
    
    if (employer && employer.plan && employer.planPostsRemaining !== null && employer.planPostsRemaining <= 0) {
      return { success: false, error: 'Post limit reached' };
    }

    const newJob = {
      id: `job_${Date.now()}`,
      ...jobData,
      postedBy: employerId,
      postedAt: new Date().toISOString(),
      status: 'open',
      views: 0,
      applicationsCount: 0,
    };

    const newJobs = [...jobs, newJob];
    saveJobs(newJobs);

    // Decrement posts remaining
    if (employer && employer.plan && employer.planPostsRemaining !== null) {
      const updatedEmployers = employers.map(e =>
        e.id === employerId
          ? { ...e, planPostsRemaining: e.planPostsRemaining - 1 }
          : e
      );
      localStorage.setItem('ct_employers', JSON.stringify(updatedEmployers));
      setEmployers(updatedEmployers);
    }

    return { success: true, job: newJob };
  };

  const updateJob = (jobId, updates) => {
    const newJobs = jobs.map(j => j.id === jobId ? { ...j, ...updates } : j);
    saveJobs(newJobs);
  };

  const incrementJobViews = (jobId, employerId) => {
    const viewKey = `${jobId}`;
    if (sessionViews.has(viewKey)) return;

    setSessionViews(new Set([...sessionViews, viewKey]));

    const newJobs = jobs.map(j =>
      j.id === jobId ? { ...j, views: j.views + 1 } : j
    );
    saveJobs(newJobs);

    // Decrement employer views
    const employers = JSON.parse(localStorage.getItem('ct_employers') || '[]');
    const employer = employers.find(e => e.id === employerId);
    if (employer && employer.planViewsRemaining !== null && employer.planViewsRemaining > 0) {
      const updatedEmployers = employers.map(e =>
        e.id === employerId
          ? { ...e, planViewsRemaining: e.planViewsRemaining - 1 }
          : e
      );
      localStorage.setItem('ct_employers', JSON.stringify(updatedEmployers));
      setEmployers(updatedEmployers);
    }
  };

  const createApplication = (jobId, candidateId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return { success: false };

    const newApplication = {
      id: `app_${Date.now()}`,
      jobId,
      candidateId,
      employerId: job.postedBy,
      createdAt: new Date().toISOString(),
      status: 'new',
      note: '',
    };

    const newApplications = [...applications, newApplication];
    localStorage.setItem('ct_applications', JSON.stringify(newApplications));
    setApplications(newApplications);

    // Increment job applications count
    const newJobs = jobs.map(j =>
      j.id === jobId ? { ...j, applicationsCount: j.applicationsCount + 1 } : j
    );
    saveJobs(newJobs);

    return { success: true, application: newApplication };
  };

  const updateApplication = (appId, updates) => {
    const newApplications = applications.map(a =>
      a.id === appId ? { ...a, ...updates } : a
    );
    localStorage.setItem('ct_applications', JSON.stringify(newApplications));
    setApplications(newApplications);
  };

  const updateEmployer = (employerId, updates) => {
    const newEmployers = employers.map(e =>
      e.id === employerId ? { ...e, ...updates } : e
    );
    localStorage.setItem('ct_employers', JSON.stringify(newEmployers));
    setEmployers(newEmployers);
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        applications,
        employers,
        blogs,
        createJob,
        updateJob,
        incrementJobViews,
        createApplication,
        updateApplication,
        updateEmployer,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}