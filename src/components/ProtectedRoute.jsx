import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

export default function ProtectedRoute({ children, requiredRole }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    base44.auth.redirectToLogin(window.location.pathname);
    return null;
  }

  // Special admin access for bretton.harper@gmail.com
  if (requiredRole === 'admin' && user.email !== 'bretton.harper@gmail.com' && user.app_role !== 'admin') {
    return <Navigate to={createPageUrl('Home')} replace />;
  }

  if (requiredRole && user.app_role !== requiredRole && user.email !== 'bretton.harper@gmail.com') {
    return <Navigate to={createPageUrl('Home')} replace />;
  }

  return children;
}