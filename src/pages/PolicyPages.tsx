import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const PrivacyPolicyPage: React.FC = () => {
  useSEO({
    title: 'Privacy Policy | WiZ Home Hygiene & Personal Care',
    description: 'Privacy Policy of WiZ (Gulshan Cosmetics Pvt Ltd). How we protect customer order enquiry data and personal information.'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
          Privacy Policy
        </h1>
        <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed">
          <p className="text-gray-500 font-medium">Last updated: October 2026</p>
          <p>
            Welcome to WiZ (Gulshan Cosmetics Pvt Ltd). We value your trust and are committed to protecting the privacy of our visitors and customers across India.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">1. Information We Collect</h2>
          <p>
            When you create an order enquiry or submit a contact or bulk supply form, we collect the necessary contact details you voluntarily provide: your name, mobile phone number, email address, delivery city, state, and PIN code.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">2. How We Use Your Information</h2>
          <p>
            Your information is used solely to generate your requested order enquiry, confirm stock and shipping logistics via WhatsApp or phone call, dispatch your products from our factory, and provide customer assistance.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">3. No Online Payment Gateway / Financial Data Stored</h2>
          <p>
            This website does not store, request, or process credit card numbers, debit card details, or net banking passwords. Any voluntary payments are settled directly between you and our verified accounts upon WhatsApp confirmation.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">4. Third-Party Marketplace Links</h2>
          <p>
            Our website provides convenience links to external marketplaces including Amazon India, Zepto, and Blinkit. We do not control or assume responsibility for the privacy practices of external platforms.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">5. Contact Regarding Privacy</h2>
          <p>
            For any queries or data deletion requests, contact our privacy officer at info@wizcare.in or write to: Gulshan Cosmetics Pvt Ltd, Office No. 3rd Floor, Hi Life Mall, Sir P. M Road, Santacruz (West), Mumbai - 400054.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  useSEO({
    title: 'Terms & Conditions | WiZ Home Hygiene & Personal Care',
    description: 'Terms and Conditions governing the use of the WiZ website and product enquiry service.'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
          Terms &amp; Conditions
        </h1>
        <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed">
          <p className="text-gray-500 font-medium">Last updated: October 2026</p>
          <p>
            By accessing or using the WiZ website, you agree to be bound by these terms. WiZ is a registered brand of Gulshan Cosmetics Pvt Ltd.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">1. Nature of Orders &amp; Enquiries</h2>
          <p>
            Placing an item in the cart or clicking “Send All Products via WhatsApp” constitutes an order enquiry and purchase request, not an automated binding financial contract. Orders are accepted and confirmed only after verification by our sales team.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">2. Pricing &amp; Currency</h2>
          <p>
            All prices displayed on this website are in Indian Rupees (INR ₹) and are inclusive of applicable GST unless stated otherwise for institutional bulk quotations.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">3. Intellectual Property</h2>
          <p>
            The WiZ trademark, logo, bottle graphics, formulation descriptions, and website design are proprietary assets of Gulshan Cosmetics Pvt Ltd. Unauthorized copying, scraping, or commercial misuse is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicyPage: React.FC = () => {
  useSEO({
    title: 'Shipping & Delivery Policy | WiZ Care',
    description: 'Pan-India delivery timelines, courier partners, and free shipping policy on orders above ₹599.'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Shipping & Delivery Policy' }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
          Shipping &amp; Delivery Policy
        </h1>
        <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900 pt-2">1. Pan-India Shipping</h2>
          <p>
            We ship to serviceable PIN codes across all Indian states and union territories. Orders above ₹599 qualify for Free Shipping. Orders under ₹599 incur a nominal delivery fee of ₹60.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">2. Dispatch &amp; Delivery Timelines</h2>
          <p>
            Orders confirmed with our dispatch team are dispatched within 24 to 48 business hours from our factory warehouse in Vasai/Palghar. Delivery typically takes 2–4 business days within Maharashtra and Gujarat, and 4–7 business days for other states.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">3. Bulk / 5L Cans Pallet Transport</h2>
          <p>
            Bulk orders and 5L commercial cans are shipped via specialized logistics carriers (V-Trans, TCI, Rivigo) with full transit tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage: React.FC = () => {
  useSEO({
    title: 'Cancellation & Refund Policy | WiZ Care',
    description: 'Learn about our 7-day replacement and refund policy for damaged or defective hygiene items.'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Returns & Refund Policy' }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
          Cancellation &amp; Refund Policy
        </h1>
        <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900 pt-2">1. Replacement for Transit Damage</h2>
          <p>
            Due to the hygienic nature of personal care and disinfectant products, opened items cannot be returned. However, if any product arrives damaged, leaked, or with a broken seal, we provide immediate free replacement within 7 days of delivery.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">2. How to Report an Issue</h2>
          <p>
            Simply share a photo or video of the damaged package on WhatsApp at +91 93213 87229 or email wizvalue@cossmic.com with your Order Enquiry number.
          </p>
          <h2 className="text-base font-bold text-gray-900 pt-2">3. Refunds</h2>
          <p>
            Approved refunds are credited to the customer’s original UPI or bank account within 3–5 business days.
          </p>
        </div>
      </div>
    </div>
  );
};
