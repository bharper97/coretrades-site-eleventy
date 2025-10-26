import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useStore } from '@/components/StoreProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react'; // Added ArrowLeft import
import ProtectedRoute from '@/components/ProtectedRoute';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import Quill styles
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

// Utility to create a URL-friendly slug
const createSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

function AdminBlogNewContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    excerpt: '',
    body: '',
    categories: '',
    heroImg: '', // Changed image to heroImg for consistency with BlogPost entity
    status: 'draft',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData(prev => ({ ...prev, author: currentUser?.full_name || '' }));
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      }
    }
    loadUser();
  }, []);

  // Update slug when title changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      slug: createSlug(prev.title),
    }));
  }, [formData.title]);

  const createBlogPostMutation = useMutation({
    mutationFn: async (newBlog) => {
      // Ensure slug uniqueness
      let uniqueSlug = newBlog.slug;
      let counter = 0;
      while (true) {
        const existingBlogs = await base44.entities.BlogPost.filter({ slug: uniqueSlug });
        if (existingBlogs.length === 0) {
          break;
        }
        counter++;
        uniqueSlug = `${newBlog.slug}-${counter}`;
      }
      return await base44.entities.BlogPost.create({ ...newBlog, slug: uniqueSlug });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-blogs'] });
      toast({
        title: "Success!",
        description: "Blog post created successfully.",
      });
      navigate(createPageUrl('AdminBlogs'));
    },
    onError: (error) => {
      console.error('Error creating blog post:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
      publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
    };
    createBlogPostMutation.mutate(blogData);
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('AdminBlogs'))}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog Posts
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Blog Post</h1>
          <p className="text-gray-400">Add new content to CoreTrades Daily</p>
        </div>

        <Card className="bg-[#0a0a0a] border-[#424242]">
          <CardHeader>
            <CardTitle className="text-white">Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-white">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })} // Allow manual slug override
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-gray-400"
                  readOnly // Suggest making it read-only by default for automatic slugs, or provide toggle
                  title="Slug is automatically generated from the title, but can be edited manually."
                />
              </div>

              <div>
                <Label className="text-white">Author *</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Excerpt *</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white h-20"
                  placeholder="Brief summary of the post..."
                  required
                />
              </div>

              <div>
                <Label className="text-white">Body *</Label>
                <ReactQuill
                  theme="snow"
                  value={formData.body}
                  onChange={(content) => setFormData({ ...formData, body: content })}
                  modules={modules}
                  formats={formats}
                  className="mt-2 bg-[#1a1a1a] text-white quill-custom-toolbar"
                />
              </div>

              <div>
                <Label className="text-white">Categories</Label>
                <Input
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                  placeholder="Industrial, Best Practices, Technology (comma-separated)"
                />
              </div>

              <div>
                <Label className="text-white">Hero Image URL</Label>
                <Input
                  value={formData.heroImg}
                  onChange={(e) => setFormData({ ...formData, heroImg: e.target.value })}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <Label className="text-white">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#424242] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] text-white border-[#424242]">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl('AdminBlogs'))}
                  className="border-[#424242] text-white hover:bg-[#616161]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#f57c00] hover:bg-[#e65100] text-white"
                  disabled={createBlogPostMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminBlogNew() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminBlogNewContent />
    </ProtectedRoute>
  );
}