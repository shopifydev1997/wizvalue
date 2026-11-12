import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';

interface FAQ {
  q: string;
  a: string;
}

export const FaqPage: React.FC = () => {
  useSEO({
    title: 'Frequently Asked Questions (FAQ) | WiZ Care',
    description: 'Find answers about ordering WiZ hygiene products via WhatsApp, marketplace purchases, 1L & 5L value packs, shipping, and returns.'
  });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQ[] = [
    {
      q: 'How does ordering work on the WiZ website without a payment gateway?',
      a: 'We operate an enquiry-first direct order model designed to offer you the best factory-direct rates! You can assemble your cart with customized size variants (500ml, 1L pouches, or 5L cans) and submit your delivery details. The site generates an itemized summary that opens directly in WhatsApp with our official customer desk. We confirm stock and dispatch schedule before you pay via UPI / Bank transfer.'
    },
    {
      q: 'Can I purchase WiZ products on Amazon, Zepto, or Blinkit instead?',
      a: 'Yes! Every WiZ product page features direct links to Amazon, Zepto, and Blinkit where available. Clicking those buttons takes you directly to the respective marketplace app or website for standard same-day or 10-minute quick commerce delivery.'
    },
    {
      q: 'What are the benefits of 1L Refill Pouches and 5L Heavy Cans?',
      a: 'Our 1L spout pouches and 5L commercial cans are designed for maximum economy and sustainability. They save up to 40% on product cost compared to buying repeated 250ml or 500ml pump bottles, and cut household plastic waste significantly.'
    },
    {
      q: 'What is the minimum order value for Pan-India Free Shipping?',
      a: 'Orders with a subtotal of ₹599 or above qualify for Pan-India Free Shipping! For orders below ₹599, a nominal delivery charge of ₹60 is applied.'
    },
    {
      q: 'Are WiZ hygiene formulations safe for children, pets, and marble floors?',
      a: 'Absolutely. WiZ Floor Cleaners are non-corrosive and free from harsh hydrochloric acid, making them 100% safe for expensive Italian marble, granite, and tiles. Our Wet Wipes and Handwashes are dermatologically tested, paraben-free, and alcohol-safe.'
    },
    {
      q: 'How do I place an institutional or B2B bulk order for my facility?',
      a: 'Please visit our Bulk Order page or message us directly on WhatsApp at +91 93213 87229. We provide customized GST invoices, volume tier discounts, and pallet transport for corporate offices, hospitals, hotels, and schools.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        {/* Banner */}
        <div className="bg-[#f4f7f5] border border-gray-200 p-8 sm:p-12 mb-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Everything you need to know about our products, WhatsApp ordering, bulk supplies, and shipping.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-gray-900 hover:text-[#7a49a6] flex items-center justify-between cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-teal-50 border border-teal-200 p-8 text-center">
          <HelpCircle className="w-8 h-8 text-[#7a49a6] mx-auto mb-2" />
          <h3 className="font-bold text-sm text-gray-900">Still have a question?</h3>
          <p className="text-xs text-gray-600 mt-1 mb-4">
            Our hygiene support team is happy to answer any query.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/contact"
              className="bg-black hover:bg-[#7a49a6] text-white py-2 px-5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/advisor"
              className="bg-white hover:bg-gray-100 text-[#7a49a6] border border-[#7a49a6] py-2 px-5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Ask AI Hygiene Advisor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
