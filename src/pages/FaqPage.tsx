import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  Phone,
  ArrowUpRight,
  Truck,
  PackageCheck
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

interface FAQ {
  id: string;
  num: string;
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    id: 'shipping-duration',
    num: '01',
    q: 'How long does shipping take?',
    a: 'Shipping typically takes 5-7 business days within the United States. For international orders, shipping can take 10-15 business days, depending on the destination and customs processing times. You will receive a tracking number once your order has shipped so you can monitor its progress.'
  },
  {
    id: 'order-status-update',
    num: '02',
    q: 'Can I get an update on my order status?',
    a: 'Yes, for that we need your registered mobile number or order ID.'
  },
  {
    id: 'bulk-order-delivery',
    num: '03',
    q: 'For bulk orders when do we get the delivery?',
    a: '7 to 8 working days, depending on your location.'
  },
  {
    id: 'product-shelf-life',
    num: '04',
    q: 'What is the shelf life of the products?',
    a: '2 years'
  },
  {
    id: 'tracking-details-process',
    num: '05',
    q: 'What is the process to get shipping and tracking details?',
    a: 'You will receive a message when your order gets dispatched'
  }
];

export const FaqPage: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2, 3, 4]);

  useSEO({
    title: "FAQ's | WiZ Home Hygiene & Personal Care",
    description:
      'Answers to frequently asked questions on WiZ shipping timelines, international delivery, order status tracking, bulk order delivery, and 2-year product shelf life.'
  });

  const allExpanded = openIndices.length === FAQS.length;

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const toggleAll = () => {
    setOpenIndices(allExpanded ? [] : FAQS.map((_, i) => i));
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-['Poppins',sans-serif] text-gray-800">
      <Breadcrumbs items={[{ label: "FAQ's" }]} />

      {/* Editorial Header Band */}
      <header className="w-full bg-[#faf7fd] border-b border-[#ecdcf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-3">
              <span>WiZ Help Center</span>
              <span aria-hidden="true">·</span>
              <span>Shipping &amp; Tracking</span>
              <span aria-hidden="true">·</span>
              <span>Bulk &amp; Product Care</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-[1.15] text-balance">
              FAQ&apos;s
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-gray-700 leading-[1.75]">
              Clear answers regarding domestic and international shipping timelines, order status updates, bulk deliveries, product shelf life, and dispatch tracking notifications.
            </p>

            <div className="mt-6 pt-5 border-t border-[#e8d9f5] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <Link
                to="/shipping-policy"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Shipping Policy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/returns-policy"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Cancellation &amp; Refund</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <span>
                Helpdesk:{' '}
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                >
                  wizvalue@cossmic.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Quick Reference Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 tracking-wide pb-3 border-b border-gray-100">
                <Truck className="w-4 h-4 text-[#7a49a6]" />
                <span>At a Glance</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-gray-200 bg-[#fafafa] p-3">
                  <p className="font-mono text-sm font-semibold text-[#7a49a6] tabular-nums">
                    5–7 Days
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Standard shipping
                  </p>
                </div>
                <div className="border border-gray-200 bg-[#fafafa] p-3">
                  <p className="font-mono text-sm font-semibold text-[#7a49a6] tabular-nums">
                    10–15 Days
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    International orders
                  </p>
                </div>
                <div className="border border-gray-200 bg-[#fafafa] p-3">
                  <p className="font-mono text-sm font-semibold text-[#7a49a6] tabular-nums">
                    7–8 Days
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Bulk order delivery
                  </p>
                </div>
                <div className="border border-gray-200 bg-[#fafafa] p-3">
                  <p className="font-mono text-sm font-semibold text-[#7a49a6] tabular-nums">
                    2 Years
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Product shelf life
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 bg-[#fafafa] p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <HelpCircle className="w-4 h-4 text-[#7a49a6]" />
                <span>Need Order Assistance?</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Keep your registered mobile number or order ID ready when requesting an order status update.
              </p>
              <div className="pt-2 space-y-2 text-gray-700 border-t border-gray-200/80">
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="flex items-center gap-2 font-medium text-[#7a49a6] hover:text-[#5f3786] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>wizvalue@cossmic.com</span>
                </a>
                <a
                  href="tel:7308400400"
                  className="flex items-center gap-2 font-medium text-gray-800 hover:text-[#7a49a6] transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#7a49a6]" />
                  <span>7308400400</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right FAQ List */}
          <main className="lg:col-span-8">
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <PackageCheck className="w-4 h-4 text-[#7a49a6]" />
                <span className="font-medium text-gray-900 tabular-nums">
                  {FAQS.length} Frequently Asked Questions
                </span>
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-semibold text-[#7a49a6] hover:text-[#5f3786] px-3 py-1.5 border border-[#e3d2f1] bg-[#faf7fd] hover:bg-[#f2eafb] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            <div className="border border-gray-200 bg-white divide-y divide-gray-200">
              {FAQS.map((faq, idx) => {
                const isOpen = openIndices.includes(idx);
                return (
                  <article
                    key={faq.id}
                    className={`transition-colors ${isOpen ? 'bg-[#faf7fd]/35' : 'bg-white'}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleIndex(idx)}
                      aria-expanded={isOpen}
                      className="w-full px-5 sm:px-7 py-5 sm:py-6 text-left flex items-start justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                        <span className="font-mono text-xs sm:text-[13px] font-semibold text-[#7a49a6] tabular-nums shrink-0">
                          {faq.num}.
                        </span>
                        <h2 className="text-[15px] sm:text-base font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors leading-snug">
                          Q. {faq.q}
                        </h2>
                      </div>
                      <span className="mt-0.5 text-gray-500 group-hover:text-[#7a49a6] shrink-0 transition-colors">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-7 pb-6 pt-0 pl-12 sm:pl-16">
                        <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Direct Support CTA Strip */}
            <div className="mt-10 border border-gray-200 bg-[#fafafa] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Still have a question?
                </h2>
                <p className="text-xs sm:text-[13px] text-gray-600 mt-1 leading-relaxed">
                  Reach our customer support team for order tracking, bulk quotes, or product assistance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to="/contact"
                  className="bg-gray-900 hover:bg-[#7a49a6] text-white py-2.5 px-5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0"
                >
                  Contact Us
                </Link>
                <Link
                  to="/bulk-order"
                  className="bg-white hover:bg-[#faf7fd] text-[#7a49a6] border border-[#d6bce9] py-2.5 px-5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0"
                >
                  Bulk Enquiry
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
