
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Linkedin, Facebook, Twitter, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    ici: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    document.title = 'Contact Us - Get in Touch with CoreTrades';
    
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

    setMetaTag('description', 'Contact the CoreTrades team. Get support, request demos, or learn more about our ICI trades hiring platform. Built by tradespeople, for tradespeople.');
    setMetaTag('keywords', 'contact CoreTrades, trades platform support, CoreTrades demo, ICI hiring platform contact, trades recruitment support');
    
    setMetaTag('og:title', 'Contact Us - CoreTrades', true);
    setMetaTag('og:description', 'Reach out to the CoreTrades team. We\'re here to help you hire smarter and build better teams.', true);
    setMetaTag('og:url', 'https://coretrades.co/contact', true);
    
    setMetaTag('twitter:card', 'summary');
    setMetaTag('twitter:title', 'Contact Us - CoreTrades');
    setMetaTag('twitter:description', 'Get in touch with the CoreTrades team today.');

    return () => {
      document.title = 'Core Trades Inc.'; 
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const emailBody = `
New Contact Form Submission from CoreTrades

Name: ${formData.name}
Company: ${formData.company || 'Not provided'}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
I hire for ICI projects: ${formData.ici ? 'Yes' : 'No'}

Message:
${formData.message}
      `.trim();

      await base44.integrations.Core.SendEmail({
        from_name: 'CoreTrades Contact Form',
        to: 'support@coretrades.co',
        subject: `CoreTrades Contact: ${formData.name}${formData.company ? ' (' + formData.company + ')' : ''}`,
        body: emailBody,
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
        ici: false,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Let's Build Together.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Reach out to the CoreTrades team — built by tradespeople, for
            tradespeople.
          </p>
        </div>
      </section>

      {/* Contact Form and Details */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#424242]">
              <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Smith"
                      className="bg-[#1a1a1a] border-[#424242] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Your Company"
                      className="bg-[#1a1a1a] border-[#424242] text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@company.com"
                      className="bg-[#1a1a1a] border-[#424242] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="bg-[#1a1a1a] border-[#424242] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your project or question..."
                    rows={6}
                    className="bg-[#1a1a1a] border-[#424242] text-white"
                    required
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="ici"
                    checked={formData.ici}
                    onChange={(e) => setFormData({...formData, ici: e.target.checked})}
                    className="mt-1 w-4 h-4 bg-[#1a1a1a] border-[#424242] rounded"
                  />
                  <label htmlFor="ici" className="text-sm text-gray-400">
                    I hire for ICI projects
                  </label>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#f57c00] hover:bg-[#e65100] text-white py-6 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#424242]">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f57c00]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#f57c00]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a
                        href="mailto:support@coretrades.co"
                        className="text-lg font-medium hover:text-[#f57c00] transition-colors"
                      >
                        support@coretrades.co
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f57c00]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#f57c00]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a
                        href="tel:1-800-CORETRADES"
                        className="text-lg font-medium hover:text-[#f57c00] transition-colors"
                      >
                        1-800-CORETRADES
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#424242]">
                <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#1a1a1a] border border-[#424242] rounded-xl flex items-center justify-center hover:border-[#f57c00] hover:bg-[#f57c00]/10 transition-all"
                  >
                    <Linkedin className="w-6 h-6 text-[#f57c00]" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#1a1a1a] border border-[#424242] rounded-xl flex items-center justify-center hover:border-[#f57c00] hover:bg-[#f57c00]/10 transition-all"
                  >
                    <Facebook className="w-6 h-6 text-[#f57c00]" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#1a1a1a] border border-[#424242] rounded-xl flex items-center justify-center hover:border-[#f57c00] hover:bg-[#f57c00]/10 transition-all"
                  >
                    <Twitter className="w-6 h-6 text-[#f57c00]" />
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#f57c00] to-[#e65100] p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
                <p className="mb-6 text-white/90">
                  Join the leading ICI trades platform in North America.
                </p>
                <Button className="bg-white text-[#f57c00] hover:bg-gray-100 font-bold px-8 py-6 rounded-xl">
                  Request Beta Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
