import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Building2, Users, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

function AdminDashboardContent() {
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['admin-dashboard-jobs'],
    queryFn: async () => {
      return await base44.entities.Job.list();
    },
  });

  const { data: blogs = [], isLoading: blogsLoading } = useQuery({
    queryKey: ['admin-dashboard-blogs'],
    queryFn: async () => {
      return await base44.entities.BlogPost.list();
    },
  });

  const { data: employers = [], isLoading: employersLoading } = useQuery({
    queryKey: ['admin-dashboard-employers'],
    queryFn: async () => {
      return await base44.entities.Employer.list();
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-dashboard-users'],
    queryFn: async () => {
      return await base44.entities.User.list();
    },
  });

  const stats = [
    { 
      title: 'Total Jobs', 
      value: jobsLoading ? '...' : jobs.length, 
      icon: Briefcase, 
      link: createPageUrl('AdminJobs'),
      loading: jobsLoading
    },
    { 
      title: 'Blog Posts', 
      value: blogsLoading ? '...' : blogs.length, 
      icon: FileText, 
      link: createPageUrl('AdminBlogs'),
      loading: blogsLoading
    },
    { 
      title: 'Employers', 
      value: employersLoading ? '...' : employers.length, 
      icon: Building2, 
      link: createPageUrl('AdminEmployers'),
      loading: employersLoading
    },
    { 
      title: 'Users', 
      value: usersLoading ? '...' : users.length, 
      icon: Users, 
      link: createPageUrl('AdminUsers'),
      loading: usersLoading
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage CoreTrades platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="bg-[#0a0a0a] border-[#424242] hover:border-[#f57c00] transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                    <stat.icon className="w-5 h-5 text-[#f57c00]" />
                  </div>
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#f57c00] animate-spin" />
                      <span className="text-2xl font-bold text-white">Loading...</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-[#0a0a0a] border-[#424242]">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={createPageUrl('AdminJobNew')} className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#424242] hover:border-[#f57c00] transition-all">
                <p className="font-medium text-white">Create New Job</p>
                <p className="text-sm text-gray-400 mt-1">Post a job to the board</p>
              </Link>
              <Link to={createPageUrl('AdminBlogNew')} className="block p-4 bg-[#1a1a1a] rounded-lg border border-[#424242] hover:border-[#f57c00] transition-all">
                <p className="font-medium text-white">Write Blog Post</p>
                <p className="text-sm text-gray-400 mt-1">Add content to CoreTrades Daily</p>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border-[#424242]">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Activity log coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}