
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, XCircle, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
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

function AdminJobsContent() {
  const queryClient = useQueryClient();
  const [jobToDelete, setJobToDelete] = React.useState(null);

  const { data: jobs = [] } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      return await base44.entities.Job.list('-postedAt');
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId) => {
      return await base44.entities.Job.delete(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setJobToDelete(null);
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: async (jobId) => {
      return await base44.entities.Job.update(jobId, { status: 'closed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => window.location.href = createPageUrl('AdminDashboard')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Jobs</h1>
            <p className="text-gray-400">Total jobs: {jobs.length}</p>
          </div>
          <Link to={createPageUrl('AdminJobNew')}>
            <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white">
              <Plus className="w-5 h-5 mr-2" />
              Create Job
            </Button>
          </Link>
        </div>

        <Card className="bg-[#0a0a0a] border-[#424242]">
          <CardHeader>
            <CardTitle className="text-white">All Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[#424242]">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Posted</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-[#424242] hover:bg-[#1a1a1a] transition-colors">
                      <td className="py-4 px-4 text-white font-medium">{job.title}</td>
                      <td className="py-4 px-4 text-gray-300">{job.company}</td>
                      <td className="py-4 px-4 text-gray-300">{job.city}, {job.region}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          job.status === 'open'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {new Date(job.postedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          {job.status === 'open' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => closeJobMutation.mutate(job.id)}
                              className="text-yellow-400 hover:text-yellow-300"
                              disabled={closeJobMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setJobToDelete(job)}
                            className="text-red-400 hover:text-red-300"
                            disabled={deleteJobMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-[#424242] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#424242] hover:bg-[#616161] text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteJobMutation.mutate(jobToDelete.id)}
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

export default function AdminJobs() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminJobsContent />
    </ProtectedRoute>
  );
}
