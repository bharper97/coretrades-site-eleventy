

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { StoreProvider } from "@/components/StoreProvider";

// Lazy load dashboard pages for performance optimization
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const AdminJobs = React.lazy(() => import("@/pages/AdminJobs"));
const AdminBlogs = React.lazy(() => import("@/pages/AdminBlogs"));
const AdminBlogNew = React.lazy(() => import("@/pages/AdminBlogNew"));
const AdminUsers = React.lazy(() => import("@/pages/AdminUsers"));
const AdminEmployers = React.lazy(() => import("@/pages/AdminEmployers"));
const AdminJobNew = React.lazy(() => import("@/pages/AdminJobNew"));
const EmployerDashboard = React.lazy(() => import("@/pages/EmployerDashboard"));
const EmployerJobNew = React.lazy(() => import("@/pages/EmployerJobNew"));
const TradespersonDashboard = React.lazy(() => import("@/pages/TradespersonDashboard"));

function LayoutContent({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await base44.auth.me();
        
        if (currentUser.email === 'bretton.harper@gmail.com' && currentUser.app_role !== 'admin') {
          await base44.auth.updateMe({ app_role: 'admin' });
          const updatedUser = await base44.auth.me();
          setUser(updatedUser);
        } else {
          setUser(currentUser);
        }
        
        const completeProfilePath = createPageUrl('CompleteProfile').replace(window.location.origin, '');
        if (location.pathname !== completeProfilePath && currentUser.email !== 'bretton.harper@gmail.com') {
          if (!currentUser.app_role || currentUser.app_role === 'user') {
            navigate(createPageUrl('CompleteProfile'));
          }
        }
      } catch (error) {
        setUser(null);
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [location.pathname, navigate]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const publicNavItems = [
    { title: "Home", url: createPageUrl("Home") },
    { title: "For Employers", url: createPageUrl("ForEmployers") },
    { title: "For Tradespeople", url: createPageUrl("ForTradespeople") },
    { title: "CoreRecruit™", url: createPageUrl("CoreRecruit") },
    { title: "Job Board", url: createPageUrl("JobBoard") },
    { title: "Resume Creator", url: createPageUrl("ResumeCreator") },
    { title: "CoreTrades Daily™", url: createPageUrl("CoreTradesDaily") },
    { title: "Contact Us", url: createPageUrl("Contact") },
  ];

  const getDashboardUrl = () => {
    if (!user) return null;
    
    if (user.email === 'bretton.harper@gmail.com') {
      return createPageUrl('AdminDashboard');
    }
    
    if (user.app_role === 'admin') return createPageUrl('AdminDashboard');
    if (user.app_role === 'employer') return createPageUrl('EmployerDashboard');
    if (user.app_role === 'tradesperson') return createPageUrl('TradespersonDashboard');
    
    return null;
  };

  const dashboardUrl = getDashboardUrl();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#f57c00] focus:text-white focus:rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70"
      >
        Skip to main content
      </a>

      <Button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-6 left-6 z-40 w-14 h-14 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 shadow-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70 transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed top-0 left-0 h-full w-80 bg-[#1a1a1a] border-r border-[#424242] z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#424242] hover:bg-[#616161]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </Button>

              <Link
                to={createPageUrl("Home")}
                className="block mb-12 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <h2 className="text-2xl font-bold text-white hover:text-[#f57c00] transition-colors">
                  Core Trades Inc.
                </h2>
              </Link>

              {user && (
                <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#424242]">
                  <p className="text-sm text-gray-400">Logged in as</p>
                  <p className="font-medium text-white">{user.full_name}</p>
                  <p className="text-xs text-[#f57c00] mt-1 capitalize">{user.app_role || user.role}</p>
                </div>
              )}

              <nav className="space-y-2">
                {dashboardUrl && (
                  <Link
                    to={dashboardUrl}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium bg-[#f57c00] text-white mb-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                )}

                {publicNavItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70 ${
                      location.pathname === item.url
                        ? "bg-[#f57c00] text-white"
                        : "text-gray-300 hover:bg-[#424242] hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}

                {!user ? (
                  <button
                    onClick={() => base44.auth.redirectToLogin()}
                    className="block w-full px-4 py-3 rounded-lg text-lg font-medium bg-[#f57c00] text-white text-center mt-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70"
                  >
                    Login / Register
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-lg font-medium text-gray-300 hover:bg-[#424242] hover:text-white transition-all duration-200 mt-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                )}
              </nav>
            </div>
          </div>
        </>
      )}

      <main id="main-content" className="relative">
        <React.Suspense fallback={
          <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        }>
          {children}
        </React.Suspense>
      </main>

      <footer className="bg-[#0a0a0a] border-t border-[#424242] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 Core Trades Inc. | Built for the ICI sector.
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                to={createPageUrl("Privacy")}
                className="text-gray-400 hover:text-[#f57c00] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70"
              >
                Privacy Policy
              </Link>
              <Link
                to={createPageUrl("Terms")}
                className="text-gray-400 hover:text-[#f57c00] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/70"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <StoreProvider>
      <LayoutContent>{children}</LayoutContent>
    </StoreProvider>
  );
}

