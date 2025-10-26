import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowLeft, Trash2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

function AdminEmployersContent() {
  const queryClient = useQueryClient();
  const [employerToDelete, setEmployerToDelete] = useState(null);
  const { toast } = useToast();

  const { data: employers = [] } = useQuery({
    queryKey: ['admin-employers'],
    queryFn: async () => {
      return await base44.entities.Employer.list('-created_date');
    },
  });

  const deleteEmployerMutation = useMutation({
    mutationFn: async (employerId) => {
      return await base44.entities.Employer.delete(employerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employers'] });
      setEmployerToDelete(null);
      toast({
        title: "Employer Deleted",
        description: "The employer organization has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete employer. They may have active jobs or an unexpected error occurred.",
        variant: "destructive",
      });
    }
  });

  const updateEmployerMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      return await base44.entities.Employer.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employers'] });
      toast({
        title: "Employer Updated",
        description: "Employer status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employer status. Please try again.",
        variant: "destructive",
      });
    }
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

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Manage Employers</h1>
          <p className="text-gray-400">Total employers: {employers.length}</p>
        </div>

        <Card className="bg-[#0a0a0a] border-[#424242]">
          <CardHeader>
            <CardTitle className="text-white">All Employers</CardTitle>
          </CardHeader>
          <CardContent>
            {employers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No employers registered yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#424242]">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Owner</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Plan</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Seats</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employers.map((employer) => (
                      <tr key={employer.id} className="border-b border-[#424242] hover:bg-[#1a1a1a] transition-colors">
                        <td className="py-4 px-4 text-white font-medium">{employer.companyName}</td>
                        <td className="py-4 px-4 text-gray-300">{employer.ownerEmail}</td>
                        <td className="py-4 px-4 text-gray-300 capitalize">{employer.plan || 'None'}</td>
                        <td className="py-4 px-4 text-gray-300">
                          {employer.memberEmails?.length || 0}/{employer.planSeats || 0}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            employer.verified 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {employer.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            {!employer.verified && (
                              <Button
                                size="sm"
                                onClick={() => updateEmployerMutation.mutate({ 
                                  id: employer.id, 
                                  updates: { verified: true } 
                                })}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                                disabled={updateEmployerMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEmployerToDelete(employer)}
                              className="text-red-400 hover:text-red-300"
                              disabled={deleteEmployerMutation.isPending}
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
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!employerToDelete} onOpenChange={() => setEmployerToDelete(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-[#424242] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employer Organization?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-white">{employerToDelete?.companyName}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-[#424242] hover:bg-[#616161] text-white border-none"
              disabled={deleteEmployerMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEmployerMutation.mutate(employerToDelete.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteEmployerMutation.isPending}
            >
              {deleteEmployerMutation.isPending ? 'Deleting...' : 'Delete Employer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminEmployers() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminEmployersContent />
    </ProtectedRoute>
  );
}