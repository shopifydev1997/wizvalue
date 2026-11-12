import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Check, Send } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const ContactPage: React.FC = () => {
  useSEO({
    title: 'Contact Us | WiZ Home Hygiene & Personal Care',
    description: 'Get in touch with WiZ (Gulshan Cosmetics Pvt Ltd). Corporate office in Santacruz, Mumbai and factory in Palghar, Maharashtra. Phone: +91 93213 87229.'
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Product Enquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner */}
        <div className="bg-[#f0f9f8] border border-teal-200 p-8 sm:p-12 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
            We are here to help
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Contact WiZ Hygiene Care
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl leading-relaxed">
            Reach out for customer support, distributor opportunities, bulk institutional supplies, or technical product questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* =========================================================================
              LEFT: OFFICE & FACTORY LOCATIONS (Matches Reference Exactly)
              ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Corporate Office */}
            <div className="bg-[#fafafa] border border-gray-300 p-6 space-y-2">
              <div className="flex items-center space-x-2 text-[#7a49a6] mb-1">
                <MapPin className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                  Corporate Office
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Office No. 3rd Floor, Hi Life Mall, Sir P. M Road, Santacruz (West), Next to Santacruz Station, Mumbai - 400054, Maharashtra, India.
              </p>
            </div>

            {/* Factory Address */}
            <div className="bg-[#fafafa] border border-gray-300 p-6 space-y-2">
              <div className="flex items-center space-x-2 text-[#7a49a6] mb-1">
                <MapPin className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                  Manufacturing Plant
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Plot No. 15, Survey No. 34, Waliv, Vasai (East), Palghar, Maharashtra - 401208, India.
              </p>
            </div>

            {/* Direct Lines */}
            <div className="bg-[#fafafa] border border-gray-300 p-6 space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">General Enquiries / WhatsApp</span>
                <a href="tel:+919321387229" className="text-gray-900 font-bold hover:text-[#7a49a6] text-sm font-mono">
                  +91 93213 87229
                </a>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Institutional / Bulk Desk</span>
                <a href="tel:+919136193717" className="text-gray-900 font-bold hover:text-[#7a49a6] text-sm font-mono">
                  +91 91361 93717
                </a>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Official Support Email</span>
                <a href="mailto:wizvalue@cossmic.com" className="text-gray-900 font-semibold hover:text-[#7a49a6]">
                  wizvalue@cossmic.com
                </a>
              </div>
            </div>

            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/919321387229?text=Hello%20WiZ%20Support%20Team%2C%20I%20have%20an%20enquiry%20regarding%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Connect on WhatsApp Now</span>
            </a>
          </div>

          {/* =========================================================================
              RIGHT: INTERACTIVE CONTACT FORM
              ========================================================================= */}
          <div className="lg:col-span-7 bg-white border border-gray-300 p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200 mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank you for contacting WiZ!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your message has been received by our customer desk. We will respond within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#7a49a6] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Meera Nair"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. meera@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                    Enquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  >
                    <option>Product Information</option>
                    <option>Order Enquiry Status</option>
                    <option>Institutional / B2B Supply</option>
                    <option>Distribution Partnership</option>
                    <option>Feedback / Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your query or question here..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-[#7a49a6] text-white py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
