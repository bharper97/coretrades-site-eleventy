
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, User, Award, Briefcase, Download } from "lucide-react";

export default function ResumeCreator() {
  useEffect(() => {
    document.title = 'Resume Creator - Build Professional Trades Resumes | CoreTrades';
    
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

    setMetaTag('description', 'Create professional resumes designed specifically for ICI tradespeople. Showcase your certifications, experience, and skills with our easy-to-use resume builder.');
    setMetaTag('keywords', 'trades resume builder, professional trades resume, electrician resume, welder resume, ICI resume template, Red Seal resume, CWB resume, trades CV builder');
    
    setMetaTag('og:title', 'Resume Creator - Build Professional Trades Resumes | CoreTrades', true);
    setMetaTag('og:description', 'Build standout resumes designed for ICI tradespeople in just 4 simple steps.', true);
    setMetaTag('og:url', 'https://coretrades.co/resume-creator', true);
    setMetaTag('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/1df85dbdb_coretrades5.jpg', true);
    
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'Resume Creator - Build Professional Trades Resumes | CoreTrades');
    setMetaTag('twitter:description', 'Create professional resumes for ICI trades in minutes.');
    setMetaTag('twitter:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/1df85dbdb_coretrades5.jpg');

    return () => {
      // Cleanup: Reset title. For meta tags, in a typical SPA, they might be overwritten by the next page's useEffect or left if navigating away.
      // Explicitly removing them is more robust if this component is frequently mounted/unmounted within the same page context.
      // For this outline, we only reset the title.
      document.title = 'Core Trades Inc.'; 
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount


  const steps = [
    {
      icon: User,
      title: "Choose Trade",
      description: "Select your primary trade from our comprehensive list.",
    },
    {
      icon: Award,
      title: "Add Certifications",
      description: "Include Red Seal, CWB, WHMIS, and other credentials.",
    },
    {
      icon: Briefcase,
      title: "Add Work Experience",
      description: "Detail your project history and achievements.",
    },
    {
      icon: Download,
      title: "Export Resume",
      description: "Download in PDF or Word format, ready to send.",
    },
  ];

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <div className="relative min-h-screen">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/1df85dbdb_coretrades5.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "52% 44%",
            backgroundAttachment: "fixed",
          }}
        />
        
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/20 to-black/10" />

        <section className="relative z-[2] min-h-[75vh] flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 text-center py-20">
            <FileText className="w-24 h-24 text-[#f57c00] mx-auto mb-8" />
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
              Professional resumes for skilled trades.
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto drop-shadow-lg">
              Build a standout resume designed specifically for ICI tradespeople in
              just 4 simple steps.
            </p>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-white/10 text-center hover:border-[#f57c00] transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-[#f57c00]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-[#f57c00]" />
                  </div>
                  <div className="text-sm font-bold text-[#f57c00] mb-2">
                    STEP {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-200">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
              Resume Preview
            </h2>
            <div className="bg-white text-black p-12 rounded-xl shadow-2xl">
              <div className="border-l-4 border-[#f57c00] pl-6 mb-8">
                <h3 className="text-3xl font-bold mb-2">JOHN SMITH</h3>
                <p className="text-lg text-gray-600">Certified Welder (CWB, Red Seal)</p>
                <p className="text-gray-500">Toronto, ON | (416) 555-0100 | john.smith@email.com</p>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-bold mb-3 text-[#f57c00]">CERTIFICATIONS</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• CWB Level 1 - GMAW, FCAW, SMAW</li>
                  <li>• Red Seal Endorsement - Welder</li>
                  <li>• WHMIS 2015</li>
                  <li>• Fall Arrest & Working at Heights</li>
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-bold mb-3 text-[#f57c00]">EXPERIENCE</h4>
                <div className="mb-4">
                  <p className="font-bold">Structural Welder</p>
                  <p className="text-gray-600">ABC Steel Fabrication | 2020 - Present</p>
                  <p className="text-gray-700 mt-2">
                    Specialized in structural steel welding for commercial and institutional projects
                    across Ontario.
                  </p>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-500">Generated with CoreTrades Resume Creator</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
              Launch Your Career with a Professional Resume
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Be first to know when Resume Creator launches.
            </p>
            <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white text-lg px-12 py-6 rounded-xl">
              Notify Me When Resume Creator Launches
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
