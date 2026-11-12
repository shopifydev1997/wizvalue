import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Gift, Sparkles } from 'lucide-react';
import { Coupon, Freebie } from '../types';
import { getCoupons, getFreebies } from '../lib/storeService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';

export const OffersPage: React.FC = () => {
  useSEO({
    title: 'Offers & Promotions | WiZ Home Hygiene & Personal Care',
    description: 'Save big with WiZ discount coupons, complimentary gifts, and bulk refill promotions. Free shipping above ₹599.'
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    getCoupons().then(setCoupons);
    getFreebies().then(setFreebies);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Offers & Promotions' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner */}
        <div className="bg-[#f0f9f8] border border-teal-200 p-8 sm:p-12 mb-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
            Exclusive Deals
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Coupons &amp; Promotional Offers
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Apply these verified coupon codes during checkout or WhatsApp enquiry to enjoy exclusive savings.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-6 flex items-center space-x-2">
            <Tag className="w-5 h-5 text-[#7a49a6]" />
            <span>Active Discount Coupons</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="border-2 border-dashed border-gray-300 bg-[#fafafa] p-6 flex flex-col justify-between relative shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">Valid in India</span>
                  </div>

                  <h3 className="font-mono text-xl font-black text-gray-900 tracking-wider">
                    {c.code}
                  </h3>

                  <p className="text-xs text-gray-600 mt-2">
                    Min cart value: <strong>₹{c.minCartValue}</strong>
                    {c.maxDiscount ? ` (Max discount ₹${c.maxDiscount})` : ''}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Tap to copy code</span>
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="bg-[#7a49a6] hover:bg-[#5f3786] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Freebies */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-6 flex items-center space-x-2">
            <Gift className="w-5 h-5 text-amber-600" />
            <span>Complimentary Free Gift Offers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freebies.map((f) => (
              <div key={f.id} className="border border-amber-200 bg-amber-50/50 p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{f.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{f.description}</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5">
                      Qualifies on cart ₹{f.minCartValue}+
                    </span>
                    <Link to="/shop" className="text-xs font-bold text-[#7a49a6] hover:underline">
                      Shop Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
