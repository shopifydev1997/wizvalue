import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Printer, Mail } from 'lucide-react';
import { OrderEnquiry } from '../types';
import { getOrders } from '../lib/storeService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

import { useAuth } from '../context/AuthContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState<OrderEnquiry | null>(null);

  useSEO({
    title: `Order Enquiry #${orderNumber || ''} | WiZ Care`,
    noIndex: true
  });

  useEffect(() => {
    if (!orderNumber) return;

    // 1. Check local session storage from enquiry placement
    try {
      const cached = sessionStorage.getItem(`wiz_recent_order_${orderNumber}`);
      if (cached) {
        setOrder(JSON.parse(cached));
        return;
      }
    } catch {}

    // 2. Only fetch from Firestore if logged in as an authorized admin
    if (isAdmin) {
      getOrders()
        .then((allOrders) => {
          const found = allOrders.find((o) => o.orderNumber === orderNumber);
          if (found) setOrder(found);
        })
        .catch((err) => console.warn('Could not read order from Firestore:', err));
    }
  }, [orderNumber, isAdmin]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: 'Cart', path: '/cart' },
          { label: `Order Enquiry #${orderNumber || ''}` }
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {/* Success Header */}
        <div className="bg-teal-50 border border-teal-200 p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-[#7a49a6] text-white flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
            Enquiry Received
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Enquiry Submitted!
          </h1>
          <p className="text-xs text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
            Your enquiry has been successfully logged with reference number{' '}
            <strong className="text-gray-900 font-mono font-bold text-sm">#{orderNumber}</strong>.
            All details have been submitted to WhatsApp (<strong>+91 93213 87229</strong>) and official email (<strong>wizvalue@cossmic.com</strong>).
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/919321387229?text=${encodeURIComponent(
                `Hello WiZ Team, I am following up on Order Enquiry #${orderNumber}. Please confirm availability and delivery dispatch.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebd59] text-white py-2.5 px-6 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Message on WhatsApp</span>
            </a>

            <a
              href={`mailto:wizvalue@cossmic.com?subject=${encodeURIComponent(
                `WiZ Order Enquiry #${orderNumber}`
              )}&body=${encodeURIComponent(
                `Hello WiZ Team,\n\nI have placed an order enquiry with reference #${orderNumber}.\nCustomer: ${order?.customerName || ''}\nPhone: ${order?.customerPhone || ''}\nEstimated Total: ₹${order?.finalTotal || ''}\n\nPlease confirm availability and dispatch schedule.`
              )}`}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2.5 px-5 text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5"
            >
              <Mail className="w-4 h-4 text-[#7a49a6]" />
              <span>Email Sales Desk</span>
            </a>

            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2.5 px-5 text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>

        {/* Snapshot review if available */}
        {order && (
          <div className="mt-8 bg-[#fafafa] border border-gray-300 p-6 space-y-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
              Enquiry Summary Details
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block">Customer Name</span>
                <strong className="text-gray-900">{order.customerName}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Mobile Number</span>
                <strong className="text-gray-900 font-mono">{order.customerPhone}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">City, State</span>
                <strong className="text-gray-900">{order.city}, {order.state} - {order.pincode}</strong>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase mb-3">Enquiry Items:</h3>
              <div className="divide-y divide-gray-200 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{item.productName}</span>
                      <span className="text-gray-500 text-[11px] block">
                        {item.variantName} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs">
              {order.coinDiscount && order.coinDiscount > 0 ? (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coins Pocket Redeemed</span>
                  <span>-₹{order.coinDiscount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Estimated Total</span>
                <span className="text-xl font-black text-gray-900">₹{order.finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#7a49a6] hover:underline"
          >
            <span>Return to Product Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
