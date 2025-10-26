import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useProfileInitializer() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initProfile() {
      try {
        const user = await base44.auth.me();
        
        // Check if profile exists
        const profiles = await base44.entities.Profile.filter({ created_by: user.email });
        
        if (profiles.length === 0) {
          // Create initial profile
          const newProfile = await base44.entities.Profile.create({
            displayName: user.full_name,
            role: 'tradesperson'
          });
          setProfile(newProfile);
        } else {
          setProfile(profiles[0]);
          
          // If role is employer and no Employer record exists, create one
          if (profiles[0].role === 'employer') {
            const employers = await base44.entities.Employer.filter({ created_by: user.email });
            if (employers.length === 0) {
              await base44.entities.Employer.create({
                plan: null,
                maxPosts: null,
                maxViews: null,
                maxSeats: null,
                postsUsed: 0,
                viewsUsed: 0,
                seatsUsed: 1,
                verified: false
              });
            }
          }
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
      } finally {
        setLoading(false);
      }
    }

    initProfile();
  }, []);

  return { profile, loading };
}