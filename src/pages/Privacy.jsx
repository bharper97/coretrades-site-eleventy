
import React, { useEffect } from "react";
import { Shield } from "lucide-react";

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy - CoreTrades';
    
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

    setMetaTag('description', 'CoreTrades Privacy Policy. Learn how we protect your data and respect your privacy on our ICI trades hiring platform.');
    setMetaTag('robots', 'noindex, follow');

    return () => {
      document.title = 'Core Trades Inc.'; // Resetting to a generic title or previous title
      // Optional: Remove the dynamically added meta tags if desired, though usually not strictly necessary for single-page apps
      // const metaDescription = document.querySelector('meta[name="description"]');
      // if (metaDescription) metaDescription.remove();
      // const metaRobots = document.querySelector('meta[name="robots"]');
      // if (metaRobots) metaRobots.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-20 px-6">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6">
          <Shield className="w-16 h-16 text-[#f57c00] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-center">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-400 text-lg">
            Last updated: March 2025
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#0a0a0a] p-12 rounded-2xl border border-[#424242] space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Core Trades Inc. ("we," "our," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">2. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Account registration data (name, email, company information)</li>
                <li>Resume and certification data for tradespeople</li>
                <li>Job posting information for employers</li>
                <li>Payment and billing information</li>
                <li>Communications with our support team</li>
                <li>Usage data and analytics</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the collected information for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Providing and maintaining our services</li>
                <li>Matching employers with qualified tradespeople</li>
                <li>Processing payments and subscriptions</li>
                <li>Sending service updates and notifications</li>
                <li>Improving our platform and user experience</li>
                <li>Ensuring platform security and preventing fraud</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">4. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this Privacy Policy, unless a longer
                retention period is required by law. Account data is retained for the
                duration of your active subscription plus 90 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">5. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to certain data processing</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">6. Security Practices</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement industry-standard security measures including encryption,
                secure servers, regular security audits, and strict access controls.
                However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">7. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                For privacy-related questions or requests, contact us at:
              </p>
              <p className="text-[#f57c00] font-medium mt-2">
                privacy@coretrades.co
              </p>
            </div>

            <div className="pt-8 border-t border-[#424242]">
              <p className="text-sm text-gray-500 text-center">
                This Privacy Policy is governed by the laws of Ontario, Canada and
                applicable U.S. federal and state laws.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
