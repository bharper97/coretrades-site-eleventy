
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useStore } from '@/components/StoreProvider'; // Removed useStore as it's no longer used for blogs data
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { base44 } from '@/api/base44Client';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

function AdminBlogsContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [blogToDelete, setBlogToDelete] = React.useState(null);

  // Fetch blogs using react-query
  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      // Fetch blogs sorted by publishedAt or created_date
      return await base44.entities.BlogPost.list('-publishedAt');
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId) => {
      return await base44.entities.BlogPost.delete(blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-blogs'] });
      setBlogToDelete(null);
      toast({
        title: "Blog Deleted",
        description: "The blog post has been permanently deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDeleteBlog = (blog) => {
    setBlogToDelete(blog);
  };

  const confirmDeleteBlog = () => {
    if (blogToDelete) {
      deleteBlogMutation.mutate(blogToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12 px-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="ml-2 text-white">Loading blog posts...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12 px-6 flex items-center justify-center">
        <p className="text-red-400">Error loading blog posts.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Added "Back to Dashboard" button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('AdminDashboard'))}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Blog Posts</h1>
            <p className="text-gray-400">Total posts: {blogs.length}</p>
          </div>
          <Link to={createPageUrl('AdminBlogNew')}>
            <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white">
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>

        <Card className="bg-[#0a0a0a] border-[#424242]">
          <CardHeader>
            <CardTitle className="text-white">All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[#424242]">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Author</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-[#424242] hover:bg-[#1a1a1a] transition-colors">
                      <td className="py-4 px-4 text-white font-medium">{blog.title}</td>
                      <td className="py-4 px-4 text-gray-300">{blog.author}</td>
                      <td className="py-4 px-4 text-gray-400">{new Date(blog.publishedAt || blog.created_date).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          blog.status === 'published' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Link to={createPageUrl('AdminBlogEdit') + `?id=${blog.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog)}
                            className="text-red-400 hover:text-red-300"
                            disabled={deleteBlogMutation.isPending}
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
      <AlertDialog open={!!blogToDelete} onOpenChange={() => setBlogToDelete(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-[#424242] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#424242] hover:bg-[#616161] text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBlog}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminBlogs() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminBlogsContent />
    </ProtectedRoute>
  );
}
