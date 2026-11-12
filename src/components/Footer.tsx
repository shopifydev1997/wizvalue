import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check } from 'lucide-react';
import { getGeneralSettings, resolveAssetUrl } from '../lib/storeService';

const DEFAULT_FOOTER_THUMBNAIL = '/assets/products/lemon-handwash-footer.jpg';
const STORAGE_KEY = 'wiz_footer_customer_thumbnail_v2';

const DEFAULT_FOOTER_LOGO = '/assets/WiZ-Logo-NEW-1.png';
const LOGO_STORAGE_KEY = 'wiz_footer_logo_v3';

export const Footer: React.FC = () => {
  // WiZ Footer Logo state
  const [footerLogo, setFooterLogo] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(LOGO_STORAGE_KEY) || localStorage.getItem('wiz_footer_logo_v2');
      if (saved === 'DELETED') return null;
      if (saved && saved !== '/assets/wiz-footer-logo-extracted.png') return saved;
    } catch {
      // fallback
    }
    return DEFAULT_FOOTER_LOGO;
  });

  // Customer footer thumbnail state
  const [footerThumbnail, setFooterThumbnail] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'DELETED') return null;
      if (saved && !saved.includes('footer-skincare-thumbnail.jpg')) return saved;
    } catch {
      // fallback
    }
    return DEFAULT_FOOTER_THUMBNAIL;
  });

  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    getGeneralSettings().then((settings) => {
      if (settings) {
        if (settings.footerLogo !== undefined) {
          setFooterLogo(settings.showFooterLogo === false ? null : settings.footerLogo || DEFAULT_FOOTER_LOGO);
        }
        if (settings.footerImage !== undefined && settings.footerImage.includes('lemon-handwash-footer')) {
          setFooterThumbnail(settings.showFooterImage === false ? null : settings.footerImage);
        } else {
          setFooterThumbnail(settings.showFooterImage === false ? null : DEFAULT_FOOTER_THUMBNAIL);
        }
      }
    });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput('');
    }
  };

  return (
    <footer className="w-full bg-[#f8f0fc] text-gray-800 border-t border-[#ecdcf8] font-['Poppins',sans-serif]">
      {/* Upper Footer Container */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[100px] pt-12 sm:pt-16 pb-8 text-left">
        {/* Newsletter Signup Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-gray-900 tracking-tight leading-snug max-w-xl">
            Be the First to Know About Our New Launches and Special Offers!
          </h2>

          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="relative flex items-center max-w-md w-full">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#7a49a6] pr-12 shadow-2xs"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-0 top-0 bottom-0 px-4 bg-black text-white hover:bg-[#7a49a6] transition-colors flex items-center justify-center cursor-pointer"
              >
                {subscribed ? <Check className="w-4 h-4 text-green-400" /> : <Mail className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-700 font-medium mt-1.5">
                Thank you for subscribing to WiZ Care!
              </p>
            )}
          </div>
        </div>

        {/* Brand Kicker Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-gray-900 tracking-tight">
            Elevate Your Hygiene Routine
          </h2>

          <div>
            <Link
              to="/contact"
              className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-gray-900 border-b-2 border-gray-900 pb-0.5 inline-block hover:text-[#7a49a6] hover:border-[#7a49a6] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="h-[1px] w-full bg-[#ecdcf8] mb-10 sm:mb-12" />

        {/* Four Navigation Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-14 pb-12 sm:pb-16 text-sm">
          {/* Column 1: Why WiZ? */}
          <div>
            <h3 className="font-semibold text-gray-900 text-[15px] mb-4">
              Why WiZ?
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-700">
              <li>Direct Order from Factory Outlet</li>
              <li>Maximum Discounts</li>
              <li>State of Art Factory</li>
              <li>Made in India</li>
              <li>FDA Approved</li>
            </ul>
          </div>

          {/* Column 2: About */}
          <div>
            <h3 className="font-semibold text-gray-900 text-[15px] mb-4">
              About
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-700">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#7a49a6] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#7a49a6] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-[#7a49a6] transition-colors">
                  Cancellation &amp; Refund
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#7a49a6] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#7a49a6] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#7a49a6] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-[#7a49a6] transition-colors">
                  FAQ's
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 text-[15px] mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-700">
              <li>
                <Link to="/category/bodywash" className="hover:text-[#7a49a6] transition-colors">
                  Bodywash
                </Link>
              </li>
              <li>
                <Link to="/category/wet-wipes" className="hover:text-[#7a49a6] transition-colors">
                  Wet Wipes
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#7a49a6] transition-colors">
                  Shampoo
                </Link>
              </li>
              <li>
                <Link to="/category/paper-products" className="hover:text-[#7a49a6] transition-colors">
                  Paper Products
                </Link>
              </li>
              <li>
                <Link to="/category/1l-5l-bulk" className="hover:text-[#7a49a6] transition-colors">
                  5L Cans
                </Link>
              </li>
              <li>
                <Link to="/category/floor-cleaner" className="hover:text-[#7a49a6] transition-colors">
                  Household Cleaners
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-[15px] mb-4">
              Quick links
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-700">
              <li>
                <Link to="/admin" className="hover:text-[#7a49a6] transition-colors" title="WiZ Administrator Portal">
                  Admin
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#7a49a6] transition-colors">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#7a49a6] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/bulk-order" className="hover:text-[#7a49a6] transition-colors">
                  B2B
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Content Row (Logo, Address, Customer Skincare Thumbnail) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 pb-10">
          {/* Left Block: WiZ Logo */}
          <div className="md:col-span-4 flex items-center">
            {footerLogo ? (
              <Link to="/" className="inline-block" title="WiZ">
                <img
                  src={resolveAssetUrl(footerLogo)}
                  alt="WiZ"
                  className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fb = document.getElementById('wiz-logo-fallback');
                    if (fb) fb.style.display = 'block';
                  }}
                />
                <div id="wiz-logo-fallback" style={{ display: 'none' }}>
                  <span className="text-5xl lg:text-6xl font-black text-[#7a49a6] tracking-tight">
                    wiz<span className="text-xl align-super ml-0.5 font-bold">®</span>
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/" className="inline-block">
                <div className="h-24 sm:h-28 w-56 flex items-center justify-start p-2">
                  <span className="text-5xl font-black text-[#5f3786] tracking-tight">
                    wiz<span className="text-xl align-super ml-0.5 font-bold">®</span>
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Center Block: Address */}
          <div className="md:col-span-5 text-gray-700">
            <h4 className="text-[15px] font-semibold text-gray-900 mb-2.5">Address</h4>
            <div className="space-y-3 text-[13px] leading-relaxed max-w-md">
              <div>
                <p className="font-bold text-[11px] text-gray-900 uppercase tracking-wider mb-0.5">
                  CORPORATE OFFICE
                </p>
                <p className="text-gray-700">
                  Office No.1, 3rd Floor, Hi Life Mall, Sir P M Road, Santacruz (West), Next to Santacruz Station, Mumbai - 400054.
                </p>
              </div>
              <div>
                <p className="font-bold text-[11px] text-gray-900 tracking-wider mb-0.5">
                  Factory Address
                </p>
                <p className="text-gray-700">
                  Plot No. 10, Survey No. 34, Vevoor, Palghar East, Thane - 401404.
                </p>
              </div>
            </div>
          </div>

          {/* Right Block: Customer Footer Thumbnail */}
          {footerThumbnail && (
            <div className="md:col-span-3 flex justify-start md:justify-end">
              <div className="rounded-sm overflow-hidden shadow-xs bg-white border border-[#ecdcf8]">
                <img
                  src={resolveAssetUrl(footerThumbnail)}
                  alt="WiZ Customer Care"
                  className="w-64 sm:w-72 md:w-64 lg:w-72 h-44 sm:h-48 md:h-44 lg:h-48 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Philosophical Full-Width Strip Banner */}
      <div className="relative w-full overflow-hidden bg-[#241334]">
        <img
          src={resolveAssetUrl('/assets/footer-bottom-image.jpg')}
          alt="WiZ Hygiene Philosophy"
          className="w-full h-24 sm:h-28 object-cover object-center opacity-85"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 sm:px-8 text-center">
          <p className="text-white text-xs sm:text-[13px] md:text-sm font-light max-w-4xl tracking-wide leading-relaxed drop-shadow-xs">
            Advanced hygiene &amp; personal care solutions thoughtfully created to protect, cleanse, and enhance your lifestyle, delivering lasting freshness, reliable disinfection, and trusted quality every day.
          </p>
        </div>
      </div>
    </footer>
  );
};
