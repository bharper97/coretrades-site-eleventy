
import React, { useEffect } from "react";
import { FileText } from "lucide-react";

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service - CoreTrades';
    
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

    setMetaTag('description', 'CoreTrades Terms of Service. Review the terms and conditions for using our ICI trades hiring platform.');
    setMetaTag('robots', 'noindex, follow');

    // Cleanup function to reset title and potentially remove meta tags if needed.
    // For meta tags, it's often fine to leave them, but title should be reset.
    return () => {
      document.title = 'Core Trades Inc.'; // Or a more generic default for your application
      // Optionally remove meta tags if they are very specific to this page and could conflict
      // with other pages. For 'robots' and 'description', it's usually fine to overwrite.
      // let descriptionMeta = document.querySelector('meta[name="description"]');
      // if (descriptionMeta) descriptionMeta.remove();
      // let robotsMeta = document.querySelector('meta[name="robots"]');
      // if (robotsMeta) robotsMeta.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-20 px-6">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6">
          <FileText className="w-16 h-16 text-[#f57c00] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-center">
            Terms of Service
          </h1>
          <p className="text-center text-gray-400 text-lg">
            Last updated: March 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#0a0a0a] p-12 rounded-2xl border border-[#424242] space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using the CoreTrades platform, you agree to be bound
                by these Terms of Service. If you do not agree with any part of these
                terms, you may not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">2. Acceptable Use</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to use CoreTrades only for lawful purposes and in accordance
                with these Terms. Prohibited activities include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Posting false or misleading job opportunities</li>
                <li>Submitting fraudulent resumes or certifications</li>
                <li>Harassing or discriminating against other users</li>
                <li>Attempting to bypass security measures</li>
                <li>Using automated tools to scrape data</li>
                <li>Sharing account credentials</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">3. Employer Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Employers using CoreTrades agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Post only legitimate ICI job opportunities</li>
                <li>Provide accurate compensation and project details</li>
                <li>Comply with all applicable employment laws</li>
                <li>Maintain confidentiality of candidate information</li>
                <li>Pay subscription fees on time</li>
                <li>Not misrepresent company information or credentials</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">4. Candidate Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Tradespeople using CoreTrades agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide truthful and accurate resume information</li>
                <li>Submit only valid certifications and credentials</li>
                <li>Update availability status promptly</li>
                <li>Respond professionally to employer inquiries</li>
                <li>Not create duplicate accounts</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">5. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                All content, trademarks, and intellectual property on CoreTrades are
                owned by Core Trades Inc. Users retain ownership of their submitted
                content (resumes, job postings) but grant CoreTrades a license to use
                this content to provide the services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">6. Payment Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                Subscription fees are billed monthly or annually as selected. All fees
                are in Canadian dollars (CAD). Refunds are provided only in accordance
                with our refund policy. We reserve the right to modify pricing with
                30 days notice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">7. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                CoreTrades provides a platform connecting employers and tradespeople.
                We do not guarantee employment outcomes, candidate qualifications, or
                project success. Users engage with each other at their own risk.
                CoreTrades is not liable for indirect, incidental, or consequential
                damages.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">8. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate
                these Terms. Users may cancel their subscription at any time through
                their account settings. Upon termination, access to paid features will
                cease immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">9. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms are governed by the laws of Ontario, Canada, and applicable
                U.S. federal and state laws. Any disputes shall be resolved through
                binding arbitration in Toronto, Ontario, or applicable U.S. jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#f57c00]">10. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We may modify these Terms at any time. Continued use of CoreTrades
                after changes constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div className="pt-8 border-t border-[#424242]">
              <p className="text-sm text-gray-500 text-center">
                For questions about these Terms, contact us at support@coretrades.co
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
