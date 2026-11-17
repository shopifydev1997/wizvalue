import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Cookie,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  FileText,
  Scale,
  Building2,
  CreditCard,
  Truck,
  Globe,
  Clock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

const PRIVACY_SECTIONS = [
  { id: 'information-collected', num: '01', label: 'Information Collected' },
  { id: 'use-of-information', num: '02', label: 'Use of the Information' },
  { id: 'information-protection', num: '03', label: 'How We Protect Information' },
  { id: 'cookies-policy', num: '04', label: 'Cookies' },
  { id: 'questions-changes', num: '05', label: 'Questions & Policy Changes' },
  { id: 'billing-support', num: '06', label: 'Billing & Customer Support' }
];

export const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('information-collected');

  useSEO({
    title: 'Privacy Policy | WiZ Home Hygiene & Personal Care',
    description:
      'Privacy Policy of COSSMIC PRODUCTS PVT LTD (WiZ). Learn what personal information we collect, how we use and protect your data with SSL encryption and PCI-compliant payment partners, and how to reach support.'
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -104;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-['Poppins',sans-serif] text-gray-800">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      {/* Editorial Header Band */}
      <header className="w-full bg-[#faf7fd] border-b border-[#ecdcf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-3">
              <span>COSSMIC PRODUCTS PVT LTD</span>
              <span aria-hidden="true">·</span>
              <span>Privacy Statement</span>
              <span aria-hidden="true">·</span>
              <span>Last Updated May 2, 2020</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-[1.15] text-balance">
              Privacy Policy
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-gray-700 leading-[1.75]">
              We respect your privacy and are committed to protecting your personal information. Our website is designed to be used without the need to identify yourself and / or provide personal information. There are specific sections of the website where we may ask you for your personal information and this Privacy policy describes the information we collect from you and how we may use it.
            </p>

            <div className="mt-6 pt-5 border-t border-[#e8d9f5] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <span>
                Privacy Inquiries:{' '}
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                >
                  wizvalue@cossmic.com
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <span>
                Customer Care:{' '}
                <a
                  href="tel:+917308400400"
                  className="font-semibold text-gray-900 hover:text-[#7a49a6] tabular-nums"
                >
                  +91 7308400400
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/terms"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Terms &amp; Conditions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Document Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Navigation & Quick Support Index */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <nav
              aria-label="Privacy Policy Sections"
              className="border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 tracking-wide pb-3 mb-3 border-b border-gray-100">
                <FileText className="w-4 h-4 text-[#7a49a6]" />
                <span>Policy Contents</span>
              </div>

              <ul className="space-y-1">
                {PRIVACY_SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-[#faf7fd] text-[#7a49a6] font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-[#7a49a6]/80">
                          {sec.num}
                        </span>
                        <span className="truncate">{sec.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border border-gray-200 bg-[#fafafa] p-6 space-y-3 text-xs">
              <h2 className="text-sm font-semibold text-gray-900">
                Direct Privacy Desk
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Want to access, update, or review identifiable information shared with us? Reach our Santacruz West office directly.
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
                  href="tel:+917308400400"
                  className="flex items-center gap-2 font-medium text-gray-800 hover:text-[#7a49a6] transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#7a49a6]" />
                  <span>+91 7308400400</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Policy Content */}
          <main className="lg:col-span-8 space-y-10 sm:space-y-12">
            {/* 01. Information Collected */}
            <section id="information-collected" className="scroll-mt-28">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  01.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Information Collected
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  Personal Information means any information that may be used to identify an individual. This includes but is not limited to: first and last name, email address, mailing and residential address, telephone number, title, birth date, gender, occupation, company you work, company details such as company name, company GST number, etc. for and other information needed to provide a service you have requested.
                </p>
                <p>
                  Our website does log your IP address to give us an idea of which part of our website you visit and how long you spend there. However, we do not link your IP address to any personal information unless you have registered and logged in to our website.
                </p>
                <p>
                  No personal information will be shared with any third parties except those used to fulfill our services such as the courier without the customer&apos;s permission.
                </p>
              </div>
            </section>

            {/* 02. Use of the Information */}
            <section
              id="use-of-information"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  02.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Use of the Information
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  When we collect personal information from you such information will only be used for business purposes, such as, to respond to requests for products, documentation, and services, to process an order, to conduct a transaction, to correspond, to enable a subscription or event registration or send direct marketing information and perform market research. We will also use your information to personalize the content you view and to better understand how you use the website in order to improve the services this website provides.
                </p>
                <p>
                  In general, it is assumed that you have given permission to collect and use your personal information in accordance with your acceptance of the Terms of Use, of which this Privacy Statement is a part. You have the right to request that we do not contact you for the purposes of sending you newsletters, customer surveys, direct marketing, or market research information.
                </p>
              </div>
            </section>

            {/* 03. How We Protect the Information We Collect */}
            <section
              id="information-protection"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  03.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  How We Protect the Information We Collect
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information when you place an order. These security measures include but is not limited to: password protected databases, SSL (Secure Sockets Layered) Encryption of the information transmitted between your device and our servers, Encryption of sensitive information such as passwords.
                </p>
                <p>
                  We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential.
                </p>
                <p>
                  Your private information especially of financial nature (credit cards, social security numbers, etc.) is not stored on our servers but in fact stored on partner payment gateways which have specialised storage, are PCI compliant and securing this information is a part of their core business. The choice of not storing your financial information on our servers and in fact storing it on a payment gateway provider&apos;s servers is a conscious decision and made with your best interests in mind.
                </p>
              </div>

              {/* Clean 3-column security safeguard summary */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 bg-[#fafafa] p-4">
                  <Lock className="w-4 h-4 text-[#7a49a6] mb-2" />
                  <h3 className="text-xs font-semibold text-gray-900">SSL Encrypted Transit</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Sensitive data is encrypted between your device and secure servers.
                  </p>
                </div>
                <div className="border border-gray-200 bg-[#fafafa] p-4">
                  <ShieldCheck className="w-4 h-4 text-[#7a49a6] mb-2" />
                  <h3 className="text-xs font-semibold text-gray-900">PCI-Compliant Partners</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Payment data is handled exclusively by certified payment gateway systems.
                  </p>
                </div>
                <div className="border border-gray-200 bg-[#fafafa] p-4">
                  <ShieldCheck className="w-4 h-4 text-[#7a49a6] mb-2" />
                  <h3 className="text-xs font-semibold text-gray-900">Zero Card Storage</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Credit cards and private financial credentials are never stored on our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* 04. Cookies */}
            <section
              id="cookies-policy"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  04.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Cookies
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-[#faf7fd]/60 p-5 sm:p-6">
                <Cookie className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  This website uses cookies. A cookie is a small data file that is placed on your hard drive when you visit certain web pages. It is used to identify yourself to a website when you revisit it, to load your preferences and to track the pages you have visited. The only personal information held in such a cookie is information you have provided to us. You have the choice of whether or not to accept cookies by means of your browser settings, although you may not be able to use certain features and functionalities of the website if you do disable them.
                </p>
              </div>
            </section>

            {/* 05. Questions and Notification of Changes */}
            <section
              id="questions-changes"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  05.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Questions and Notification of Changes
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  If you have any questions about the Privacy Statement or would like to access or modify your identifiable information, please contact:{' '}
                  <a
                    href="mailto:wizvalue@cossmic.com"
                    className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                  >
                    wizvalue@cossmic.com
                  </a>
                </p>
                <p>
                  This Privacy Statement was last updated on May 2, 2020. We reserve the right to change this Privacy Statement at any time. Modifications to this Privacy Statement can be made without prior notification. Continued use of the website, signifies your acceptance of any changes to the Privacy Statement.
                </p>
              </div>
            </section>

            {/* 06. Billing & Customer Support */}
            <section
              id="billing-support"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  06.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Billing &amp; Customer Support
                </h2>
              </div>
              <p className="text-[14.5px] sm:text-[15px] text-gray-600 mb-6">
                We welcome all support inquiries by the following methods:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 bg-white p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>Postal Mail</span>
                    </div>
                    <p className="text-xs sm:text-[13px] font-semibold text-gray-900 mb-1">
                      COSSMIC PRODUCTS PVT LTD
                    </p>
                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                      Vrindavan, Meera Baugh Road Santacruz West, Mumbai - 400054 India
                    </p>
                  </div>
                </div>

                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="border border-gray-200 hover:border-[#7a49a6] bg-white p-5 flex flex-col justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors break-all">
                      wizvalue@cossmic.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Privacy requests, billing &amp; support
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+917308400400"
                  className="border border-gray-200 hover:border-[#7a49a6] bg-white p-5 flex flex-col justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors tabular-nums">
                      +91 7308400400
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Direct customer support line
                    </p>
                  </div>
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

const TERMS_SECTIONS = [
  { id: 'terms-definitions', num: '01', label: 'Definitions & Scope' },
  { id: 'terms-accuracy', num: '02', label: 'Content & Accuracy' },
  { id: 'terms-risk', num: '03', label: 'User Responsibility' },
  { id: 'terms-ip', num: '04', label: 'Intellectual Property' },
  { id: 'terms-links', num: '05', label: 'External & Inbound Links' },
  { id: 'terms-law', num: '06', label: 'Governing Law (India)' },
  { id: 'terms-authorization', num: '07', label: 'Transaction Authorization' }
];

export const TermsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('terms-definitions');

  useSEO({
    title: 'Terms & Conditions | WiZ Home Hygiene & Personal Care',
    description:
      'Terms and Conditions of COSSMIC PRODUCTS PRIVATE LIMITED governing your use of the WiZ website and product purchases.'
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -104;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-['Poppins',sans-serif] text-gray-800">
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

      {/* Editorial Header Band */}
      <header className="w-full bg-[#faf7fd] border-b border-[#ecdcf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-3">
              <span>COSSMIC PRODUCTS PRIVATE LIMITED</span>
              <span aria-hidden="true">·</span>
              <span>Website &amp; Purchase Terms</span>
              <span aria-hidden="true">·</span>
              <span>Laws of India</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-[1.15] text-balance">
              Terms &amp; Conditions
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-gray-700 leading-[1.75]">
              For the purpose of these Terms and Conditions, The term &quot;we&quot;, &quot;us&quot;, &quot;our&quot; used anywhere on this page shall mean COSSMIC PRODUCTS PRIVATE LIMITED, whose registered/operational office is Vrindavan Meera Baugh Road Santacruz West Mumbai MAHARASHTRA 400054 . &quot;you&quot;, “your”, &quot;user&quot;, “visitor” shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
            </p>

            <div className="mt-6 pt-5 border-t border-[#e8d9f5] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <span>
                Legal Inquiries:{' '}
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                >
                  wizvalue@cossmic.com
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Privacy Policy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/shipping-policy"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Shipping Policy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Document Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Navigation & Entity Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <nav
              aria-label="Terms and Conditions Sections"
              className="border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 tracking-wide pb-3 mb-3 border-b border-gray-100">
                <Scale className="w-4 h-4 text-[#7a49a6]" />
                <span>Clause Directory</span>
              </div>

              <ul className="space-y-1">
                {TERMS_SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-[#faf7fd] text-[#7a49a6] font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-[#7a49a6]/80">
                          {sec.num}
                        </span>
                        <span className="truncate">{sec.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border border-gray-200 bg-[#fafafa] p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Building2 className="w-4 h-4 text-[#7a49a6]" />
                <span>Registered Office</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs">
                COSSMIC PRODUCTS PRIVATE LIMITED
              </p>
              <p className="text-gray-600 leading-relaxed">
                Vrindavan, Meera Baugh Road, Santacruz West, Mumbai, MAHARASHTRA 400054
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
                  href="tel:+917308400400"
                  className="flex items-center gap-2 font-medium text-gray-800 hover:text-[#7a49a6] transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#7a49a6]" />
                  <span>+91 7308400400</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Terms Document */}
          <main className="lg:col-span-8 space-y-10 sm:space-y-12">
            {/* 01. Definitions & Scope */}
            <section id="terms-definitions" className="scroll-mt-28">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  01.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Definitions &amp; Scope of Governance
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  Your use of the website and/or purchase from us are governed by following Terms and Conditions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="border border-gray-200 bg-[#fafafa] p-4">
                    <h3 className="text-xs font-semibold text-[#7a49a6] mb-1">
                      &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
                      COSSMIC PRODUCTS PRIVATE LIMITED, Vrindavan Meera Baugh Road Santacruz West Mumbai MAHARASHTRA 400054.
                    </p>
                  </div>
                  <div className="border border-gray-200 bg-[#fafafa] p-4">
                    <h3 className="text-xs font-semibold text-[#7a49a6] mb-1">
                      &quot;You&quot;, “Your”, &quot;User&quot;, “Visitor”
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
                      Any natural or legal person visiting our website and/or agreed to purchase from us.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 02. Website Content & Accuracy Disclaimer */}
            <section
              id="terms-accuracy"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  02.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Website Content &amp; Warranty Disclaimer
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  The content of the pages of this website is subject to change without notice.
                </p>
                <p>
                  Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                </p>
              </div>
            </section>

            {/* 03. User Responsibility */}
            <section
              id="terms-risk"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  03.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Use of Materials &amp; User Responsibility
                </h2>
              </div>

              <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
              </p>
            </section>

            {/* 04. Intellectual Property, Copyright & Trademarks */}
            <section
              id="terms-ip"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  04.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Intellectual Property, Copyright &amp; Trademarks
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                </p>
                <p>
                  All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
                </p>
                <p>
                  Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                </p>
              </div>
            </section>

            {/* 05. External Links & Prior Written Consent */}
            <section
              id="terms-links"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  05.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Third-Party Websites &amp; Linking Restrictions
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
                </p>
                <p>
                  You may not create a link to our website from another website or document without COSSMIC PRODUCTS PRIVATE LIMITED’s prior written consent.
                </p>
              </div>
            </section>

            {/* 06. Governing Law */}
            <section
              id="terms-law"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  06.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Governing Law &amp; Disputes
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-[#faf7fd]/60 p-5 sm:p-6">
                <Scale className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .
                </p>
              </div>
            </section>

            {/* 07. Transaction Authorization Liability */}
            <section
              id="terms-authorization"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  07.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Transaction Authorization &amp; Payment Liability
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-[#fafafa] p-5 sm:p-6">
                <CreditCard className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

const SHIPPING_SECTIONS = [
  { id: 'shipping-channels', num: '01', label: 'Courier Channels' },
  { id: 'dispatch-liability', num: '02', label: 'Dispatch & Liability' },
  { id: 'delivery-confirmation', num: '03', label: 'Address & Confirmation' },
  { id: 'shipping-helpdesk', num: '04', label: 'Service Helpdesk' }
];

export const ShippingPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('shipping-channels');

  useSEO({
    title: 'Shipping Policy | WiZ Home Hygiene & Personal Care',
    description:
      'Shipping Policy of COSSMIC PRODUCTS PRIVATE LIMITED covering registered domestic and international courier fulfillment, 0-7 day dispatch guarantees, and customer helpdesk support.'
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -104;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-['Poppins',sans-serif] text-gray-800">
      <Breadcrumbs items={[{ label: 'Shipping Policy' }]} />

      {/* Editorial Header Band */}
      <header className="w-full bg-[#faf7fd] border-b border-[#ecdcf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-3">
              <span>COSSMIC PRODUCTS PRIVATE LIMITED</span>
              <span aria-hidden="true">·</span>
              <span>Dispatch &amp; Delivery Terms</span>
              <span aria-hidden="true">·</span>
              <span>0–7 Days Consignment Handover</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-[1.15] text-balance">
              Shipping Policy
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-gray-700 leading-[1.75]">
              Orders across domestic and international destinations are dispatched through registered courier partners and speed post services within 0–7 days from the date of order and payment, or as agreed at order confirmation.
            </p>

            <div className="mt-6 pt-5 border-t border-[#e8d9f5] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <span>
                Helpdesk Phone:{' '}
                <a
                  href="tel:7308400400"
                  className="font-semibold text-gray-900 hover:text-[#7a49a6] tabular-nums"
                >
                  7308400400
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <span>
                Support Email:{' '}
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                >
                  wizvalue@cossmic.com
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/terms"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Terms &amp; Conditions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Document Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Directory & Dispatch Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <nav
              aria-label="Shipping Policy Sections"
              className="border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 tracking-wide pb-3 mb-3 border-b border-gray-100">
                <Truck className="w-4 h-4 text-[#7a49a6]" />
                <span>Policy Contents</span>
              </div>

              <ul className="space-y-1">
                {SHIPPING_SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-[#faf7fd] text-[#7a49a6] font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-[#7a49a6]/80">
                          {sec.num}
                        </span>
                        <span className="truncate">{sec.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border border-gray-200 bg-[#fafafa] p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="w-4 h-4 text-[#7a49a6]" />
                <span>Dispatch Guarantee</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Consignments are handed over to registered courier or postal authorities within <strong className="font-semibold text-gray-900 tabular-nums">0–7 days</strong> of order and payment.
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

          {/* Right Main Policy Content */}
          <main className="lg:col-span-8 space-y-10 sm:space-y-12">
            {/* 01. Courier Channels */}
            <section id="shipping-channels" className="scroll-mt-28">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  01.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Domestic &amp; International Shipping Channels
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.
                </p>
                <p>
                  For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 bg-[#fafafa] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-1.5">
                    <Globe className="w-4 h-4" />
                    <span>International Buyers</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
                    Shipped and delivered exclusively via registered international courier companies and/or International Speed Post.
                  </p>
                </div>

                <div className="border border-gray-200 bg-[#fafafa] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Domestic Buyers</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
                    Shipped exclusively via registered domestic courier companies and/or Speed Post across serviceable locations.
                  </p>
                </div>
              </div>
            </section>

            {/* 02. Dispatch Timeline & Delivery Liability */}
            <section
              id="dispatch-liability"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  02.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Dispatch Timeline &amp; Carrier Liability
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>
                  Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
                </p>
                <p>
                  COSSMIC PRODUCTS PRIVATE LIMITED is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
                </p>
              </div>
            </section>

            {/* 03. Delivery Address & Confirmation */}
            <section
              id="delivery-confirmation"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  03.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Delivery Address &amp; Service Confirmation
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-[#faf7fd]/60 p-5 sm:p-6">
                <MapPin className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <div className="space-y-3 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  <p>
                    Delivery of all orders will be to the address provided by the buyer.
                  </p>
                  <p>
                    Delivery of our services will be confirmed on your mail ID as specified during registration.
                  </p>
                </div>
              </div>
            </section>

            {/* 04. Service Helpdesk */}
            <section
              id="shipping-helpdesk"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  04.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Shipping Helpdesk &amp; Support
                </h2>
              </div>
              <p className="text-[14.5px] sm:text-[15px] text-gray-700 mb-6 leading-[1.8]">
                For any issues in utilizing our services you may contact our helpdesk on{' '}
                <a
                  href="tel:7308400400"
                  className="font-semibold text-gray-900 hover:text-[#7a49a6] tabular-nums underline underline-offset-2"
                >
                  7308400400
                </a>{' '}
                or{' '}
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                >
                  wizvalue@cossmic.com
                </a>
                .
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:7308400400"
                  className="border border-gray-200 hover:border-[#7a49a6] bg-white p-5 flex flex-col justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Helpdesk Phone</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors tabular-nums">
                      7308400400
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order dispatch &amp; service assistance
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="border border-gray-200 hover:border-[#7a49a6] bg-white p-5 flex flex-col justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <Mail className="w-4 h-4" />
                      <span>Helpdesk Email</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors break-all">
                      wizvalue@cossmic.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Shipment tracking &amp; buyer queries
                    </p>
                  </div>
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

const REFUND_SECTIONS = [
  { id: 'cancellation-window', num: '01', label: 'Cancellation Window' },
  { id: 'quality-exceptions', num: '02', label: 'Quality Exceptions' },
  { id: 'damaged-defective', num: '03', label: 'Damaged or Defective Items' },
  { id: 'site-expectations', num: '04', label: 'Expectations & Review' },
  { id: 'manufacturer-warranty', num: '05', label: 'Manufacturer Warranty' },
  { id: 'refund-timeline', num: '06', label: 'Approved Refund Timeline' }
];

export const ReturnsPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('cancellation-window');

  useSEO({
    title: 'Cancellation & Refund | WiZ Home Hygiene & Personal Care',
    description:
      'WiZ Cancellation & Refund policy detailing the 7-day cancellation and issue reporting window, damaged or defective item assessment, manufacturer warranty claims, and 6-8 day refund processing.'
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -104;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-['Poppins',sans-serif] text-gray-800">
      <Breadcrumbs items={[{ label: 'Cancellation & Refund' }]} />

      {/* Editorial Header Band */}
      <header className="w-full bg-[#faf7fd] border-b border-[#ecdcf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-3">
              <span>WiZ · COSSMIC PRODUCTS PRIVATE LIMITED</span>
              <span aria-hidden="true">·</span>
              <span>Customer Care Policy</span>
              <span aria-hidden="true">·</span>
              <span>7-Day Reporting Window</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-[1.15] text-balance">
              Cancellation &amp; Refund
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-gray-700 leading-[1.75]">
              WiZ believes in helping its customers as far as possible, and has therefore a liberal cancellation policy.
            </p>

            <div className="mt-6 pt-5 border-t border-[#e8d9f5] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <span>
                Customer Service:{' '}
                <a
                  href="tel:7308400400"
                  className="font-semibold text-gray-900 hover:text-[#7a49a6] tabular-nums"
                >
                  7308400400
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <span>
                Support Email:{' '}
                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="font-semibold text-[#7a49a6] hover:text-[#5f3786] underline underline-offset-2"
                >
                  wizvalue@cossmic.com
                </a>
              </span>
              <span aria-hidden="true" className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/shipping-policy"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-[#7a49a6] transition-colors"
              >
                <span>Shipping Policy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Document Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Directory & Key Timelines */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <nav
              aria-label="Cancellation and Refund Sections"
              className="border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 tracking-wide pb-3 mb-3 border-b border-gray-100">
                <RotateCcw className="w-4 h-4 text-[#7a49a6]" />
                <span>Policy Contents</span>
              </div>

              <ul className="space-y-1">
                {REFUND_SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-[#faf7fd] text-[#7a49a6] font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-[#7a49a6]/80">
                          {sec.num}
                        </span>
                        <span className="truncate">{sec.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border border-gray-200 bg-[#fafafa] p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="w-4 h-4 text-[#7a49a6]" />
                <span>Key Timelines</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="border border-gray-200 bg-white p-3">
                  <p className="font-mono text-base font-semibold text-[#7a49a6] tabular-nums">
                    7 Days
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Request &amp; reporting window
                  </p>
                </div>
                <div className="border border-gray-200 bg-white p-3">
                  <p className="font-mono text-base font-semibold text-[#7a49a6] tabular-nums">
                    6–8 Days
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Approved refund processing
                  </p>
                </div>
              </div>

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

          {/* Right Main Policy Content */}
          <main className="lg:col-span-8 space-y-10 sm:space-y-12">
            {/* 01. Order Cancellation Window */}
            <section id="cancellation-window" className="scroll-mt-28">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  01.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Order Cancellation Window
                </h2>
              </div>

              <div className="space-y-4 text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                <p>Under this policy:</p>
                <p>
                  Cancellations will be considered only if the request is made within 7 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                </p>
              </div>
            </section>

            {/* 02. Quality Exceptions */}
            <section
              id="quality-exceptions"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  02.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Product Cancellation &amp; Quality Exceptions
                </h2>
              </div>

              <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                WiZ does not accept cancellation requests for its items. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
              </p>
            </section>

            {/* 03. Damaged or Defective Items */}
            <section
              id="damaged-defective"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  03.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Damaged or Defective Items
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-[#fafafa] p-5 sm:p-6">
                <AlertCircle className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 7 days of receipt of the products.
                </p>
              </div>
            </section>

            {/* 04. Product Expectations & Customer Service Review */}
            <section
              id="site-expectations"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  04.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Product Expectations &amp; Service Review
                </h2>
              </div>

              <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
              </p>
            </section>

            {/* 05. Manufacturer Warranty */}
            <section
              id="manufacturer-warranty"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  05.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Manufacturer Warranty Complaints
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-white p-5 sm:p-6">
                <ShieldCheck className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                </p>
              </div>
            </section>

            {/* 06. Approved Refund Timeline & Support */}
            <section
              id="refund-timeline"
              className="scroll-mt-28 pt-8 sm:pt-10 border-t border-gray-200"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xs font-mono font-semibold text-[#7a49a6] tabular-nums">
                  06.
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                  Approved Refund Processing Timeline
                </h2>
              </div>

              <div className="flex items-start gap-4 border border-gray-200 bg-[#faf7fd]/60 p-5 sm:p-6 mb-6">
                <Clock className="w-5 h-5 text-[#7a49a6] shrink-0 mt-0.5" />
                <p className="text-[14.5px] sm:text-[15px] text-gray-700 leading-[1.8]">
                  In case of any Refunds approved by the WiZ, it’ll take 6-8 days for the refund to be processed to the end customer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:7308400400"
                  className="border border-gray-200 hover:border-[#7a49a6] bg-white p-5 flex flex-col justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Customer Service Phone</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors tabular-nums">
                      7308400400
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Report damaged or defective orders within 7 days
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:wizvalue@cossmic.com"
                  className="border border-gray-200 hover:border-[#7a49a6] bg-white p-5 flex flex-col justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a49a6] mb-2">
                      <Mail className="w-4 h-4" />
                      <span>Customer Service Email</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors break-all">
                      wizvalue@cossmic.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submit order details for cancellation &amp; refund queries
                    </p>
                  </div>
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
