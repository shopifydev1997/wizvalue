import React, { useState } from 'react';
import { Building2, MessageSquare, Check, ShieldCheck, Factory, Truck, Award } from 'lucide-react';
import { createBulkEnquiry } from '../lib/storeService';
import { BulkEnquiry } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const BulkOrderPage: React.FC = () => {
  useSEO({
    title: 'Bulk & Institutional Orders | WiZ Home Hygiene & Personal Care',
    description: 'Direct factory outlet pricing for hospitals, corporate facilities, educational institutions, and housekeeping contractors. Enquire for 5L cans and bulk pouches.'
  });

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    pincode: '',
    productCategory: 'Floor Cleaner 5L & Disinfectants',
    variantPackaging: '5 Litre Heavy Can',
    requiredQuantity: '50 - 200 Units',
    frequency: 'Monthly Recurring Order',
    specialRequirements: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactPerson.trim() || !formData.phone.trim()) {
      setErrorMsg('Please fill in Company Name, Contact Person, and Mobile Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const enquiry: BulkEnquiry = {
        id: `bulk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        productCategory: formData.productCategory,
        variantPackaging: formData.variantPackaging,
        requiredQuantity: formData.requiredQuantity,
        frequency: formData.frequency,
        specialRequirements: formData.specialRequirements.trim(),
        status: 'New',
        createdAt: new Date().toISOString()
      };

      await createBulkEnquiry(enquiry);
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving bulk enquiry:', err);
      setErrorMsg('Failed to submit enquiry. Please contact us via WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/919321387229?text=${encodeURIComponent(
    `🏢 *WiZ B2B / INSTITUTIONAL BULK ORDER ENQUIRY*\nCompany: ${formData.companyName}\nContact: ${formData.contactPerson}\nPhone: ${formData.phone}\nCity: ${formData.city}\nProducts: ${formData.productCategory} (${formData.variantPackaging})\nQuantity: ${formData.requiredQuantity}\nFrequency: ${formData.frequency}\nNotes: ${formData.specialRequirements}`
  )}`;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'B2B & Bulk Order' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner */}
        <div className="bg-[#eaf1ec] border border-gray-200 p-8 sm:p-12 mb-10">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
              Direct From Manufacturer • Gulshan Cosmetics Pvt Ltd
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Institutional &amp; Bulk Supply
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Serving hospitals, hotels, schools, IT parks, housekeeping agencies, and distribution partners across India with customized 1L pouches, 5L commercial cans, and drum packaging.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <Factory className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-1">State-of-the-Art Factory</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Modern GMP manufacturing plant in Waliv, Vasai (East), Palghar ensuring strict batch quality control and FDA compliance.
            </p>
          </div>

          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <Award className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-1">Maximum Volume Margins</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Transparent tier-based B2B discounts directly from the brand owner without middleman markups.
            </p>
          </div>

          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <Truck className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-1">Pan-India Dispatch</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Reliable surface transport and pallet delivery to all industrial zones, warehouses, and commercial establishments.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 bg-white border border-gray-300 p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Bulk Enquiry Submitted Successfully!
                </h2>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Our institutional sales manager will review your quantity requirements and get in touch with formal quotation and GST tax invoice details.
                </p>
                <div className="pt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#1ebd59] text-white py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
                  Submit Institutional / B2B Request
                </h2>

                {errorMsg && (
                  <p className="text-xs text-[#ff675d] font-semibold bg-[#ff675d]/5 p-3 border border-[#ff675d]/30">
                    {errorMsg}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Healthcare Ltd / Star Hotel"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Mr. Amit Verma (Purchase Head)"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. purchase@company.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      City &amp; State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="e.g. 400001"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Product Category of Interest
                    </label>
                    <select
                      value={formData.productCategory}
                      onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    >
                      <option>Floor Cleaner 5L &amp; Disinfectants</option>
                      <option>Handwash &amp; Hand Sanitizers (5L / Pouches)</option>
                      <option>Wet Wipes (Multi-Packs &amp; Cartons)</option>
                      <option>Liquid Matic Laundry Detergent (5L Cans)</option>
                      <option>Dishwash Gel (5L Cans)</option>
                      <option>Glass Cleaner &amp; Toilet Cleaner 5L</option>
                      <option>Mixed Full Housekeeping Combo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Packaging Size Preference
                    </label>
                    <select
                      value={formData.variantPackaging}
                      onChange={(e) => setFormData({ ...formData, variantPackaging: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    >
                      <option>5 Litre Heavy Can</option>
                      <option>1 Litre Refill Pouches (Cartons)</option>
                      <option>Retail Ready Bottles (500ml / 750ml)</option>
                      <option>Industrial 20L / 50L Carboys</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Required Quantity
                    </label>
                    <select
                      value={formData.requiredQuantity}
                      onChange={(e) => setFormData({ ...formData, requiredQuantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    >
                      <option>20 - 50 Units / Cans</option>
                      <option>50 - 200 Units / Cans</option>
                      <option>200 - 500 Units / Cans</option>
                      <option>500+ Units (Full Truckload)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      Purchase Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    >
                      <option>Monthly Recurring Order</option>
                      <option>Quarterly Supply Contract</option>
                      <option>One-Time Bulk Purchase</option>
                      <option>Annual Rate Contract (ARC)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                    Special Specifications / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="Provide details about delivery timelines, GST requirements, or specific fragrance preferences..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-[#7a49a6] text-white py-3.5 px-6 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting Enquiry...' : 'Submit Bulk Order Enquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Right Help Box */}
          <div className="lg:col-span-4 bg-[#fafafa] border border-gray-300 p-6 space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
              Need Instant B2B Quote?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Speak directly with our Institutional Supply Desk for urgent dispatch quotes or tender inquiries.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Direct Call / WhatsApp</span>
                <strong className="text-gray-900 font-mono text-sm">+91 93213 87229</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Alternate B2B Line</span>
                <strong className="text-gray-900 font-mono text-sm">+91 91361 93717</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Inquiries</span>
                <strong className="text-gray-900">wizvalue@cossmic.com</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <a
                href="https://wa.me/919321387229?text=Hello%20WiZ%20B2B%20Desk%2C%20I%20would%20like%20to%20request%20an%20institutional%20quotation%20for%20bulk%20supplies."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
