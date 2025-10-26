
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Factory, Building2, HardHat, Mountain, Hammer, Fuel, TreePine } from "lucide-react";

export default function ForTradespeople() {
  useEffect(() => {
    document.title = 'For Tradespeople - CoreTrades | Find ICI Jobs Across North America';

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

    setMetaTag('description', 'Browse ICI trades jobs, create professional resumes, and connect with verified employers. Find your next opportunity in industrial, commercial, or institutional construction.');
    setMetaTag('keywords', 'ICI trades jobs, electrician jobs, welder jobs, pipefitter jobs, millwright jobs, industrial construction jobs, commercial trades jobs, trades resume builder, CoreTrades jobs');

    setMetaTag('og:title', 'For Tradespeople - CoreTrades | Find ICI Jobs', true);
    setMetaTag('og:description', 'Discover real ICI jobs from verified employers. Build professional resumes and advance your trades career.', true);
    setMetaTag('og:url', 'https://coretrades.co/for-tradespeople', true);
    setMetaTag('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/91a93ca00_coretrades3.jpg', true);

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'For Tradespeople - CoreTrades | Find ICI Jobs');
    setMetaTag('twitter:description', 'Browse verified ICI trades jobs and build your professional resume.');
    setMetaTag('twitter:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/91a93ca00_coretrades3.jpg');

    return () => {
      // Clean up meta tags if necessary, or revert to a default title.
      // For simplicity, we just reset the title here.
      document.title = 'Core Trades Inc.';

      // Optionally, you could remove the dynamically added meta tags here
      // For this specific use case, leaving them might be acceptable for SPA transitions,
      // but a more robust solution would remove them or reset their content.
    };
  }, []);

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <div className="relative min-h-screen">
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/91a93ca00_coretrades3.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "48% 42%",
            backgroundAttachment: "fixed"
          }} />

        
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/20 to-black/10" />

        <section className="relative z-[2] min-h-[78vh] md:min-h-[68vh] flex items-center justify-center">
          <div className="text-center max-w-7xl mx-auto px-6 py-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">Find your next opportunity.

            </h1>
            <p className="text-xl md:text-2xl text-zinc-200 mb-12 max-w-3xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
              Discover real jobs from verified employers and build a professional resume for your trade.
            </p>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#f57c00] to-[#e65100] p-12 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
                <Briefcase className="w-16 h-16 text-white mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-white">Job Board</h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Browse ICI jobs across North America.
                </p>
                <Link to={createPageUrl("JobBoard")}>
                  <Button className="bg-white text-[#f57c00] hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-xl w-full">
                    Browse Jobs
                  </Button>
                </Link>
              </div>

              <div className="bg-black/60 backdrop-blur-md border-2 border-[#f57c00] p-12 rounded-2xl hover:scale-105 transition-all duration-300">
                <FileText className="w-16 h-16 text-[#f57c00] mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-white">Resume Creator</h2>
                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                  Generate a clean, professional resume designed for trades.
                </p>
                <Link to={createPageUrl("ResumeCreator")}>
                  <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white font-bold px-8 py-6 text-lg rounded-xl w-full">
                    Create Resume
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">
              ICI Sectors We Serve
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <Factory className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Industrial</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <Building2 className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Commercial</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <HardHat className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Institutional</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <Hammer className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Civil</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <Mountain className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Mining</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <Fuel className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Oil & Gas</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center mb-4 hover:border-[#f57c00] transition-colors">
                  <TreePine className="w-10 h-10 text-[#f57c00]" />
                </div>
                <p className="text-lg font-medium text-white">Forestry</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>);

}