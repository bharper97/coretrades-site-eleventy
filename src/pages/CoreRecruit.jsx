
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Filter, MessageSquare, Bell } from "lucide-react";

export default function CoreRecruit() {
  useEffect(() => {
    document.title = 'CoreRecruit™ - Resume & Recruitment Software for ICI Employers | CoreTrades';
    
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

    setMetaTag('description', 'CoreRecruit™ is a powerful resume database and recruitment software for ICI employers. Search verified tradespeople, manage candidates, and streamline your hiring process.');
    setMetaTag('keywords', 'trades resume database, ICI recruitment software, candidate management, trades hiring platform, verified tradespeople database, CoreRecruit, skilled trades search');
    
    setMetaTag('og:title', 'CoreRecruit™ - Resume & Recruitment Software | CoreTrades', true);
    setMetaTag('og:description', 'Be your own recruiter. Access curated databases of skilled tradespeople with advanced search and management tools.', true);
    setMetaTag('og:url', 'https://coretrades.co/corerecruit', true);
    setMetaTag('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/bee2db4b0_coretrades.jpg', true);
    
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'CoreRecruit™ - Resume & Recruitment Software | CoreTrades');
    setMetaTag('twitter:description', 'Powerful resume database and candidate management for ICI employers.');
    setMetaTag('twitter:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/bee2db4b0_coretrades.jpg');

    return () => {
      document.title = 'Core Trades Inc.';
      // Optionally, you might want to remove the dynamically added meta tags
      // For simplicity in a single-page app, often just resetting the title is sufficient.
      // If truly needed, you'd iterate and remove meta tags added by setMetaTag.
    };
  }, []);

  return (
    <div className="bg-[#1a1a1a]">
      <div className="relative min-h-screen">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/bee2db4b0_coretrades.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

        <section className="relative z-[2] h-[30vh] overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
              CoreRecruit™
            </h1>
          </div>
        </section>

        <section className="relative z-[2] py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
              Resume & Recruitment Software for ICI Employers.
            </h2>
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto drop-shadow-lg">
              Empowering employers to be their own recruiters. Access a curated
              database of skilled tradespeople and manage candidates seamlessly.
            </p>
          </div>
        </section>

        <section className="relative z-[2] py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              CoreRecruit™ Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <Shield className="w-10 h-10 text-[#f57c00] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Verified Resumes</h3>
                <p className="text-gray-200 text-sm">
                  By trade and certification
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <Filter className="w-10 h-10 text-[#f57c00] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Advanced Filtering</h3>
                <p className="text-gray-200 text-sm">
                  CWB, Red Seal, WHMIS, CSTS, H2S
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <MessageSquare className="w-10 h-10 text-[#f57c00] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Secure Messaging</h3>
                <p className="text-gray-200 text-sm">
                  In-platform communication
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#f57c00]/50 transition-all">
                <Bell className="w-10 h-10 text-[#f57c00] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Saved Searches & Alerts</h3>
                <p className="text-gray-200 text-sm">
                  Real-time candidate notifications
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-[2] py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
              Employer Dashboard Preview
            </h2>
            <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Trade</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Certifications</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-black/50 transition-colors">
                      <td className="px-6 py-4 text-white">Mike Thompson</td>
                      <td className="px-6 py-4 text-white">Electrician</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-[#f57c00]/20 text-[#f57c00] px-2 py-1 rounded text-xs">
                          442A
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">Sudbury, ON</td>
                      <td className="px-6 py-4 text-white">Immediately</td>
                    </tr>
                    <tr className="hover:bg-black/50 transition-colors">
                      <td className="px-6 py-4 text-white">Sarah Martinez</td>
                      <td className="px-6 py-4 text-white">Welder</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-[#f57c00]/20 text-[#f57c00] px-2 py-1 rounded text-xs mr-1">
                          CWB
                        </span>
                        <span className="inline-block bg-[#f57c00]/20 text-[#f57c00] px-2 py-1 rounded text-xs">
                          Red Seal
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">Houston, TX</td>
                      <td className="px-6 py-4 text-white">2 weeks</td>
                    </tr>
                    <tr className="hover:bg-black/50 transition-colors">
                      <td className="px-6 py-4 text-white">David Chen</td>
                      <td className="px-6 py-4 text-white">Pipefitter</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-[#f57c00]/20 text-[#f57c00] px-2 py-1 rounded text-xs">
                          Red Seal
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">Hamilton, ON</td>
                      <td className="px-6 py-4 text-white">Immediately</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-[2] py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
              Request Beta Access
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join leading ICI employers already using CoreRecruit™
            </p>
            <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white text-lg px-12 py-6 rounded-xl">
              Request Beta Access
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
