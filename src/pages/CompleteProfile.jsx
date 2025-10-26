import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, HardHat, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const profiles = await base44.entities.Profile.filter({ created_by: currentUser.email });
        
        if (profiles.length > 0 && profiles[0].role && profiles[0].role !== 'user') {
          redirectToDashboard(profiles[0].role);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        base44.auth.redirectToLogin(createPageUrl('CompleteProfile'));
      }
    };
    checkUser();
  }, [navigate]);

  const redirectToDashboard = (role) => {
    if (role === 'admin') {
      navigate(createPageUrl('AdminDashboard'));
    } else if (role === 'employer') {
      navigate(createPageUrl('EmployerDashboard'));
    } else if (role === 'tradesperson') {
      navigate(createPageUrl('TradespersonDashboard'));
    } else {
      navigate(createPageUrl('Home'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Selection Required",
        description: "Please select your account type",
        variant: "destructive",
      });
      return;
    }

    if (selectedRole === 'employer' && !companyName.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter your company name",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User information not available. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Update or create profile
      const profiles = await base44.entities.Profile.filter({ created_by: user.email });
      
      if (profiles.length === 0) {
        await base44.entities.Profile.create({
          displayName: user.full_name,
          role: selectedRole,
          company: selectedRole === 'employer' ? companyName.trim() : ''
        });
      } else {
        await base44.entities.Profile.update(profiles[0].id, {
          role: selectedRole,
          company: selectedRole === 'employer' ? companyName.trim() : ''
        });
      }

      // Update user app_role
      await base44.auth.updateMe({ app_role: selectedRole });

      // Handle employer-specific logic
      if (selectedRole === 'employer') {
        const employers = await base44.entities.Employer.list();
        
        // Check if user is already part of an organization
        const existingOrg = employers.find(emp => 
          emp.ownerEmail === user.email || 
          (emp.memberEmails && emp.memberEmails.includes(user.email))
        );

        if (existingOrg) {
          // User already has an organization
          toast({
            title: "Organization Found",
            description: `You're already part of ${existingOrg.companyName}`,
          });
        } else {
          // Create new organization with user as primary owner
          await base44.entities.Employer.create({
            ownerEmail: user.email,
            memberEmails: [user.email],
            companyName: companyName.trim(),
            plan: null,
            planSeats: null,
            planPostsRemaining: null,
            planViewsRemaining: null,
            verified: false,
          });
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      redirectToDashboard(selectedRole);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center py-12 px-6">
      <Card className="bg-[#0a0a0a] border-[#424242] max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-white text-3xl text-center">Complete Your Profile</CardTitle>
          <p className="text-gray-400 text-center mt-2">
            Welcome! Please select your account type to get started.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-white text-lg mb-4 block">I am a...</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  disabled={submitting}
                  className={`p-8 rounded-xl border-2 transition-all duration-300 ${
                    selectedRole === 'employer'
                      ? 'border-[#f57c00] bg-[#f57c00]/10'
                      : 'border-[#424242] bg-[#1a1a1a] hover:border-[#616161]'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Briefcase className={`w-16 h-16 mx-auto mb-4 ${
                    selectedRole === 'employer' ? 'text-[#f57c00]' : 'text-gray-400'
                  }`} />
                  <h3 className="text-xl font-bold text-white mb-2">Employer</h3>
                  <p className="text-gray-400 text-sm">
                    Post jobs, search resumes, and hire ICI tradespeople
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('tradesperson')}
                  disabled={submitting}
                  className={`p-8 rounded-xl border-2 transition-all duration-300 ${
                    selectedRole === 'tradesperson'
                      ? 'border-[#f57c00] bg-[#f57c00]/10'
                      : 'border-[#424242] bg-[#1a1a1a] hover:border-[#616161]'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <HardHat className={`w-16 h-16 mx-auto mb-4 ${
                    selectedRole === 'tradesperson' ? 'text-[#f57c00]' : 'text-gray-400'
                  }`} />
                  <h3 className="text-xl font-bold text-white mb-2">Tradesperson</h3>
                  <p className="text-gray-400 text-sm">
                    Browse jobs, create resumes, and find opportunities
                  </p>
                </button>
              </div>
            </div>

            {selectedRole === 'employer' && (
              <div>
                <Label className="text-white">Company Name *</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  disabled={submitting}
                  className="mt-2 bg-[#1a1a1a] border-[#424242] text-white"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={!selectedRole || submitting}
              className="w-full bg-[#f57c00] hover:bg-[#e65100] text-white py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Setting up your account...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}