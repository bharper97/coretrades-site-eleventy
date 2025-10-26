
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search, MessageSquare, Bell, Briefcase } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ForEmployers() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handlePostJob = async () => {
    if (!user) {
      base44.auth.redirectToLogin(createPageUrl('ForEmployers'));
      return;
    }

    // Check if user is employer and has a plan
    if (user.app_role === 'employer') {
      try {
        const employers = await base44.entities.Employer.filter({ 
          memberEmails: [user.email] 
        });
        
        if (employers.length > 0 && employers[0].plan) {
          // Has a plan - go directly to post job
          navigate(createPageUrl('EmployerJobNew'));
          return;
        }
      } catch (error) {
        console.error('Error checking employer plan:', error);
      }
    }

    // No plan or not employer - go to hiring services
    navigate(createPageUrl('HiringServices'));
  };

  useEffect(() => {
    document.title = 'For Employers - CoreTrades | Hire Skilled ICI Tradespeople';
    
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    setMetaTag('description', 'Join the Founding 50 and lock in lifetime hiring access for $34.99/month. Post ICI trades jobs and access thousands of verified tradespeople across North America.');
    setMetaTag('keywords', 'founding 50, hire tradespeople, post trades jobs, ICI recruitment, industrial trades hiring, commercial construction staffing, institutional trades recruitment, trades job board employers, CoreTrades hiring');
    
    setMetaTag('og:title', 'For Employers - CoreTrades | Hire Skilled ICI Tradespeople', true);
    setMetaTag('og:description', 'Access verified trades professionals and post jobs. Join the Founding 50 for lifetime pricing at $34.99/mo.', true);
    setMetaTag('og:url', 'https://coretrades.co/for-employers', true);
    setMetaTag('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/5efc99758_coretrades2.jpg', true);
    
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'For Employers - CoreTrades | Hire Skilled ICI Tradespeople');
    setMetaTag('twitter:description', 'Post jobs and find verified tradespeople faster with CoreTrades.');
    setMetaTag('twitter:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/5efc99758_coretrades2.jpg');

    return () => {
      document.title = 'Core Trades Inc.';
    };
  }, []);

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <div className="relative min-h-screen">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/5efc99758_coretrades2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "50% 25%",
            backgroundAttachment: "fixed",
          }}
        />
        
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/20 to-black/10" />

        <section className="relative z-[2] min-h-[78vh] md:min-h-[68vh] flex items-center justify-center">
          <div className="text-center max-w-7xl mx-auto px-6 py-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              Find skilled tradespeople, today.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-200 mb-12 max-w-3xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
              Access thousands of verified trades professionals and post jobs across North America.
            </p>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#f57c00] to-[#e65100] p-12 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
                <Briefcase className="w-16 h-16 text-white mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-white">Post Jobs</h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  List roles and reach verified tradespeople across the continent.
                </p>
                <Button 
                  onClick={handlePostJob}
                  disabled={loading}
                  className="bg-white text-[#f57c00] hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-xl w-full"
                >
                  View Hiring Services
                </Button>
              </div>

              <div className="bg-black/60 backdrop-blur-md border-2 border-[#f57c00] p-12 rounded-2xl hover:scale-105 transition-all duration-300">
                <Search className="w-16 h-16 text-[#f57c00] mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-white">CoreRecruit™</h2>
                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                  Search and manage trades resumes with our employer dashboard.
                </p>
                <Link to={createPageUrl("CoreRecruit")}>
                  <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white font-bold px-8 py-6 text-lg rounded-xl w-full">
                    Explore CoreRecruit™
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">
              Employer Platform Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <CheckCircle2 className="w-12 h-12 text-[#f57c00] mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">Verified Candidate Database</h3>
                <p className="text-gray-200">
                  Access pre-screened ICI tradespeople with verified certifications.
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <h3 className="text-xl font-bold mb-3 text-white">Advanced Filters</h3>
                <p className="text-gray-200">
                  Search by trade, ticket, province/state, and availability.
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <MessageSquare className="w-12 h-12 text-[#f57c00] mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">Secure Candidate Messaging</h3>
                <p className="text-gray-200">
                  Communicate directly with candidates through the platform.
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <Bell className="w-12 h-12 text-[#f57c00] mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">Saved Searches & Alerts</h3>
                <p className="text-gray-200">
                  Get notified when new candidates match your criteria.
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <Search className="w-12 h-12 text-[#f57c00] mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">Smart Candidate Search</h3>
                <p className="text-gray-200">
                  Find exactly who you need with intelligent search algorithms.
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <h3 className="text-xl font-bold mb-3 text-white">Job Management Dashboard</h3>
                <p className="text-gray-200">
                  Track all your open positions and applications in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
