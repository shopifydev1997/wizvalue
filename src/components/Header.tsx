import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Percent,
  CheckCircle2,
  Coins,
  TrendingUp,
  Tag,
  Folder
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCoinWallet } from '../context/CoinWalletContext';
import { CoinWalletModal } from './CoinWalletModal';
import { getGeneralSettings, saveGeneralSettings, getProducts, getCategories, resolveAssetUrl } from '../lib/storeService';
import { GeneralSettings, MegaMenuHighlight, Product, Category } from '../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { coins } = useCoinWallet();
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);

  // Real-time search catalog data
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [catalogCategories, setCatalogCategories] = useState<Category[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const announcements = [
    '🪙 Earn 2 WiZ Coins for every ₹50 spent on orders! (1 Coin = ₹1 discount)',
    'Pan India Free Shipping Order Above ₹599/-',
    'Get 15% OFF On Your First Order • Use Code: WIZFIRST',
    'Free 100ml Pocket Sanitizer On Orders Above ₹799/-'
  ];

  useEffect(() => {
    getGeneralSettings().then(setSettings);
    getProducts().then(setCatalogProducts);
    getCategories().then(setCatalogCategories);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    }
  }, [searchOpen]);

  // Handle escape key to close search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Popular product categories for quick search suggestions
  const popularCategories = useMemo(
    () => [
      { name: 'Household Cleaners', slug: 'household-cleaners', count: 7 },
      { name: 'Handwash', slug: 'handwash', count: 3 },
      { name: 'Wet Wipes', slug: 'wet-wipes', count: 3 },
      { name: 'Dishwash', slug: 'dishwash', count: 3 },
      { name: 'Floor Cleaner', slug: 'floor-cleaner', count: 3 },
      { name: '1L & 5L Bulk Care', slug: '1l-5l-bulk', count: 8 },
      { name: 'Bodywash', slug: 'bodywash', count: 3 },
      { name: 'Laundry Detergent', slug: 'laundry-detergent', count: 3 },
      { name: 'Hand Sanitizer', slug: 'hand-sanitizer', count: 2 },
      { name: 'Paper Products', slug: 'paper-products', count: 2 }
    ],
    []
  );

  // Suggested matching categories based on current typed query
  const suggestedCategories = useMemo(() => {
    if (!trimmedQuery) return [];
    const words = trimmedQuery.split(/\s+/).filter(Boolean);

    const matches: Array<{ name: string; slug: string; count: number }> = [];

    popularCategories.forEach((cat) => {
      const lower = cat.name.toLowerCase();
      const slugLower = cat.slug.toLowerCase();
      if (words.some((w) => lower.includes(w) || slugLower.includes(w))) {
        matches.push(cat);
      }
    });

    catalogCategories.forEach((cat) => {
      const lower = cat.name.toLowerCase();
      const slugLower = cat.slug.toLowerCase();
      if (words.some((w) => lower.includes(w) || slugLower.includes(w))) {
        if (!matches.some((m) => m.slug === cat.slug)) {
          matches.push({ name: cat.name, slug: cat.slug, count: cat.itemsCount || 3 });
        }
      }
    });

    return matches.slice(0, 4);
  }, [trimmedQuery, catalogCategories, popularCategories]);

  // Suggested matching specific products based on current typed query
  const suggestedProducts = useMemo(() => {
    if (!trimmedQuery) return [];
    const words = trimmedQuery.split(/\s+/).filter(Boolean);

    return catalogProducts
      .filter((p) => {
        const title = p.name.toLowerCase();
        const cat = p.category.toLowerCase();
        const desc = (p.shortDescription || '').toLowerCase();
        const frag = (p.fragrance || '').toLowerCase();
        const pack = (p.packagingSize || '').toLowerCase();

        return words.every(
          (w) =>
            title.includes(w) ||
            cat.includes(w) ||
            desc.includes(w) ||
            frag.includes(w) ||
            pack.includes(w)
        );
      })
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(trimmedQuery);
        const bStarts = b.name.toLowerCase().startsWith(trimmedQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;

        return 0;
      })
      .slice(0, 6);
  }, [trimmedQuery, catalogProducts]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const words = query.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-[#7a49a6] font-bold bg-purple-50 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getLeftImage = (key: string) => {
    if (settings?.megaMenuLeftImages?.[key]) {
      return settings.megaMenuLeftImages[key];
    }
    const defaults: Record<
      string,
      { imageUrl: string; title: string; subtitle: string; link: string; badge: string; visible: boolean }
    > = {
      household: {
        imageUrl: '/assets/menu-dd-hhc.jpg',
        title: 'Household Cleaners',
        subtitle: 'Complete home disinfection & sparkling cleanliness',
        link: '/category/household-cleaners',
        badge: 'FDA APPROVED',
        visible: true
      },
      personal: {
        imageUrl: '/assets/aistudio/menu-dd-pc.jpg',
        title: 'Personal Care Essentials',
        subtitle: 'Gentle on skin, soothing aloe vera & botanical care',
        link: '/category/personal-care',
        badge: 'DERMA TESTED',
        visible: true
      },
      paper: {
        imageUrl: '/assets/aistudio/menu-dd-paper.jpg',
        title: 'Virgin Pulp Paper Care',
        subtitle: '100% virgin pulp soft facial & absorbent rolls',
        link: '/category/paper-products',
        badge: 'SUPER ABSORBENT',
        visible: true
      },
      bulk: {
        imageUrl: '/assets/aistudio/menu-dd-5l.jpg',
        title: 'Institutional 5L & 1L Bulk',
        subtitle: 'Heavy institutional hygiene for commercial supply',
        link: '/bulk-order',
        badge: 'INSTITUTIONAL',
        visible: true
      }
    };
    return defaults[key] || null;
  };

  const getHighlight = (key: string): MegaMenuHighlight => {
    if (settings?.megaMenuHighlights?.[key]) {
      return settings.megaMenuHighlights[key];
    }
    // Fallbacks
    const defaults: Record<string, MegaMenuHighlight> = {
      household: {
        title: 'WiZ Anti-Bacterial Handwash 500ml',
        subtitle: '99.9% germ kill with skin moisturizing glycerin.',
        imageUrl: 'https://images.unsplash.com/photo-1608248597359-00f735878484?w=500&auto=format&fit=crop&q=80',
        link: '/product/wiz-anti-bacterial-handwash-500ml',
        badge: 'BESTSELLER',
        price: '₹96.00'
      },
      personal: {
        title: 'WiZ Gentle Cleansing Wet Wipes',
        subtitle: 'Ultra-soft honeycomb fabric with natural aloe & chamomile.',
        imageUrl: '/assets/aistudio/menu-dd-pc.jpg',
        link: '/product/wiz-wet-wipes-80-pulls',
        badge: '25% OFF',
        price: '₹99.00'
      },
      bulk: {
        title: '5 Litre Heavy Institutional Cans',
        subtitle: 'Economical industrial supply for hospitals, hotels & housekeeping.',
        imageUrl: '/assets/aistudio/menu-dd-5l.jpg',
        link: '/bulk-order',
        badge: 'INSTITUTIONAL',
        price: 'From ₹420.00'
      },
      paper: {
        title: 'WiZ Ultra-Soft Facial Tissues (Pack of 3)',
        subtitle: '100% virgin pulp, 200 pulls 2-ply super absorbent softness.',
        imageUrl: '/assets/aistudio/menu-dd-paper.jpg',
        link: '/product/wiz-facial-tissues-3pack',
        badge: 'TOP CHOICE',
        price: '₹140.00'
      },
      offers: {
        title: 'Hygiene Mega Bundle & Combo Packs',
        subtitle: 'Get up to 40% OFF + Free 100ml Sanitizer on orders above ₹799.',
        imageUrl: '/assets/products/Orange Wet Wipes.jpg',
        link: '/offers',
        badge: '40% OFF',
        price: 'From ₹99.00'
      }
    };
    return defaults[key] || defaults.household;
  };

  const renderLeftImageCard = (
    key: 'household' | 'personal' | 'paper' | 'bulk',
    colSpanClass: string
  ) => {
    const leftImg = getLeftImage(key);
    const isImgVisible = Boolean(leftImg && leftImg.visible !== false && leftImg.imageUrl);

    if (isImgVisible && leftImg) {
      return (
        <div className={`${colSpanClass} relative group bg-gradient-to-b from-gray-50 to-white border border-gray-200 p-4 flex flex-col justify-between transition-all hover:border-[#7a49a6]`}>
          <div>
            <div className="relative aspect-4/3 w-full bg-white border border-gray-100 overflow-hidden mb-3">
              <img
                src={leftImg.imageUrl}
                alt={leftImg.title || 'WiZ Category'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {leftImg.badge && (
                <span className="absolute top-2 left-2 bg-[#7a49a6] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs">
                  {leftImg.badge}
                </span>
              )}
            </div>
            <h5 className="font-bold text-gray-900 text-sm leading-tight">
              {leftImg.title}
            </h5>
            {leftImg.subtitle && (
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                {leftImg.subtitle}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Link
              to={leftImg.link || '/shop'}
              onClick={() => setActiveMegaMenu(null)}
              className="w-full bg-black hover:bg-[#7a49a6] text-white py-2 px-3 text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* 1. Announcement Bar */}
      <div className="bg-[#7a49a6] text-white text-xs font-medium py-2 w-full px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[100px] flex items-center justify-between">
        <button
          onClick={() => setAnnouncementIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))}
          className="text-purple-200 hover:text-white transition-colors p-1"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="text-center truncate px-2 tracking-wide font-normal">
          {announcements[announcementIndex]}
        </div>

        <button
          onClick={() => setAnnouncementIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1))}
          className="text-purple-200 hover:text-white transition-colors p-1"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Main Navigation Bar - Full Width with 100px margins on left and right */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[100px]">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Provision to Add or Delete WiZ Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            {settings?.showHeaderLogo !== false ? (
              <Link to="/" className="flex items-center space-x-2 group">
                {(settings?.headerLogo || '/assets/WiZ-Logo-NEW-1.png') ? (
                  <img
                    src={resolveAssetUrl(settings?.headerLogo || '/assets/WiZ-Logo-NEW-1.png')}
                    alt={settings?.websiteName || 'WiZ'}
                    className="h-9 sm:h-10 max-w-[160px] object-contain transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-4xl font-extrabold tracking-tight text-[#7a49a6] transition-transform duration-150">
                    WiZ<span className="text-xs font-bold align-super ml-0.5 text-gray-500">®</span>
                  </span>
                )}
              </Link>
            ) : (
              /* Minimalist placeholder when header logo is explicitly turned off */
              <Link to="/" className="text-xl font-bold tracking-tight text-gray-800 hover:text-[#7a49a6]">
                WiZ Care
              </Link>
            )}
          </div>

          {/* Desktop Navigation - 1 Line Single Row */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-7 text-[13px] font-medium text-gray-800 whitespace-nowrap flex-nowrap shrink-0">
            <Link to="/" className="hover:text-[#7a49a6] transition-colors py-6">
              Home
            </Link>

            {/* Household Cleaners Dropdown */}
            <div
              className="py-6 static"
              onMouseEnter={() => setActiveMegaMenu('household')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                  activeMegaMenu === 'household' ? 'text-[#7a49a6]' : 'hover:text-[#7a49a6]'
                }`}
              >
                <span>Household Cleaners</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Personal Care Dropdown */}
            <div
              className="py-6 static"
              onMouseEnter={() => setActiveMegaMenu('personal')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                  activeMegaMenu === 'personal' ? 'text-[#7a49a6]' : 'hover:text-[#7a49a6]'
                }`}
              >
                <span>Personal Care</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1L & 5L Dropdown */}
            <div
              className="py-6 static"
              onMouseEnter={() => setActiveMegaMenu('bulk')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                  activeMegaMenu === 'bulk' ? 'text-[#7a49a6]' : 'hover:text-[#7a49a6]'
                }`}
              >
                <span>1L &amp; 5L</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Paper Products Dropdown */}
            <div
              className="py-6 static"
              onMouseEnter={() => setActiveMegaMenu('paper')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                  activeMegaMenu === 'paper' ? 'text-[#7a49a6]' : 'hover:text-[#7a49a6]'
                }`}
              >
                <span>Paper Products</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Offers Dropdown with #ff675d red accent */}
            <div
              className="py-6 static"
              onMouseEnter={() => setActiveMegaMenu('offers')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className="flex items-center space-x-1 text-[#ff675d] font-bold hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span>Offers</span>
                <Percent className="w-3 h-3 text-[#ff675d]" />
              </button>
            </div>

            <Link to="/bulk-order" className="hover:text-[#7a49a6] transition-colors py-6">
              Bulk Order
            </Link>

            {/* Hygiene Advisor Navigation Item */}
            <Link
              to="/advisor"
              className="flex items-center space-x-1.5 bg-purple-50 text-[#7a49a6] px-3 py-1.5 border border-[#7a49a6]/30 hover:bg-[#7a49a6] hover:text-white transition-all text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hygiene Advisor</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-gray-700 shrink-0">
            {/* Customer Reward Coins Button (Decent & minimal: Rupee coin icon beside count) */}
            <button
              type="button"
              onClick={() => setIsCoinModalOpen(true)}
              className="flex items-center space-x-1.5 bg-amber-50/70 hover:bg-amber-100/90 text-amber-950 border border-amber-200/90 px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs transition-all hover:scale-105 cursor-pointer group"
              title="Reward Coins Wallet"
              aria-label={`Reward Coins: ${coins}`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs ring-1 ring-amber-600/25 shrink-0 group-hover:rotate-12 transition-transform select-none">
                <span className="text-[11px] font-black leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] font-sans">
                  ₹
                </span>
              </div>
              <span className="font-bold text-gray-900 text-xs sm:text-[13px] tracking-tight">
                {coins}
              </span>
            </button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-[#7a49a6] transition-colors cursor-pointer p-1"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon with #ff675d badge */}
            <Link
              to="/cart"
              className="relative hover:text-[#7a49a6] transition-colors cursor-pointer p-1"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff675d] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-gray-700 hover:text-black"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FULL-WIDTH CREATIVE MEGA MENU (Stretches Left to Right across full viewport)
          With 1 Right Product Thumbnail Image
          ========================================================================= */}
      {activeMegaMenu && (
        <div
          className="hidden lg:block fixed left-0 right-0 w-full bg-white border-t border-b-2 border-gray-200 shadow-2xl z-50 transition-all duration-200"
          style={{ top: '112px' }}
          onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[100px] py-8">
            {/* HOUSEHOLD CLEANERS MEGA MENU */}
            {activeMegaMenu === 'household' && (() => {
              const hasLeftImg = Boolean(getLeftImage('household')?.visible !== false && getLeftImage('household')?.imageUrl);
              const colClass = hasLeftImg ? 'col-span-3' : 'col-span-4';

              return (
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* LEFT SIDE IMAGE WITH PROVISION TO ADD & DELETE */}
                  {renderLeftImageCard('household', 'col-span-3')}

                  {/* COLUMN 1: Hand Hygiene */}
                  <div className={colClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-3 pb-1 border-b border-gray-100 flex items-center space-x-1.5">
                      <span>Hand Hygiene</span>
                    </h4>

                    {/* Handwash Section */}
                    <div className="mb-4">
                      <Link
                        to="/category/handwash"
                        onClick={() => setActiveMegaMenu(null)}
                        className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                      >
                        <span>Handwash</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                      </Link>
                      <ul className="mt-1.5 pl-2 space-y-1 text-[11px] text-gray-600 border-l border-gray-200">
                        <li><Link to="/category/handwash?size=500ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 500ml Bottle</Link></li>
                        <li><Link to="/category/handwash?size=1+Liter+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 1 Liter Bottle</Link></li>
                        <li><Link to="/category/handwash?size=1+Liter+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 1 Liter Pouch</Link></li>
                        <li><Link to="/category/handwash?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter Can</Link></li>
                      </ul>
                    </div>

                    {/* Hand Sanitizer Section */}
                    <div>
                      <Link
                        to="/category/hand-sanitizer"
                        onClick={() => setActiveMegaMenu(null)}
                        className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                      >
                        <span>Hand Sanitizer</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                      </Link>
                      <ul className="mt-1.5 pl-2 space-y-1 text-[11px] text-gray-600 border-l border-gray-200">
                        <li><Link to="/category/hand-sanitizer?size=2ml+Pouch+pack+of+500" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block leading-tight">• 2ml Pouch pack of 500</Link></li>
                        <li><Link to="/category/hand-sanitizer?size=50ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 50ml Bottle</Link></li>
                        <li><Link to="/category/hand-sanitizer?size=200ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 200ml bottle</Link></li>
                        <li><Link to="/category/hand-sanitizer?size=500ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 500ml bottle</Link></li>
                        <li><Link to="/category/hand-sanitizer?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter Can</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* COLUMN 2: Surface & Floor Care */}
                  <div className={colClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-3 pb-1 border-b border-gray-100">
                      Surface &amp; Floor Care
                    </h4>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {/* Floor Cleaner */}
                      <div>
                        <Link
                          to="/category/floor-cleaner"
                          onClick={() => setActiveMegaMenu(null)}
                          className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                        >
                          <span>Floor Cleaner</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </Link>
                        <ul className="mt-1 pl-1.5 space-y-1 text-[11px] text-gray-600 border-l border-gray-200">
                          <li><Link to="/category/floor-cleaner?size=750ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 750ml Bottle</Link></li>
                          <li><Link to="/category/floor-cleaner?size=1+Liter+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 1 Liter Pouch</Link></li>
                          <li><Link to="/category/floor-cleaner?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter can</Link></li>
                        </ul>
                      </div>

                      {/* Dish Wash */}
                      <div>
                        <Link
                          to="/category/dishwash"
                          onClick={() => setActiveMegaMenu(null)}
                          className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                        >
                          <span>Dish Wash</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </Link>
                        <ul className="mt-1 pl-1.5 space-y-1 text-[11px] text-gray-600 border-l border-gray-200">
                          <li><Link to="/category/dishwash?size=750ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 750ml Bottle</Link></li>
                          <li><Link to="/category/dishwash?size=1+Liter+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 1 Liter Pouch</Link></li>
                          <li><Link to="/category/dishwash?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter can</Link></li>
                        </ul>
                      </div>

                      {/* Glass Cleaner */}
                      <div>
                        <Link
                          to="/category/glass-cleaner"
                          onClick={() => setActiveMegaMenu(null)}
                          className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                        >
                          <span>Glass Cleaner</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </Link>
                        <ul className="mt-1 pl-1.5 space-y-1 text-[11px] text-gray-600 border-l border-gray-200">
                          <li><Link to="/category/glass-cleaner?size=750ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 750ml Bottle</Link></li>
                          <li><Link to="/category/glass-cleaner?size=1+Liter+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 1 Liter Pouch</Link></li>
                          <li><Link to="/category/glass-cleaner?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter can</Link></li>
                        </ul>
                      </div>

                      {/* Toilet Cleaner */}
                      <div>
                        <Link
                          to="/category/toilet-cleaner"
                          onClick={() => setActiveMegaMenu(null)}
                          className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                        >
                          <span>Toilet Cleaner</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </Link>
                        <ul className="mt-1 pl-1.5 space-y-1 text-[11px] text-gray-600 border-l border-gray-200">
                          <li><Link to="/category/toilet-cleaner?size=750ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 750ml Bottle</Link></li>
                          <li><Link to="/category/toilet-cleaner?size=1+Liter+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 1 Liter Pouch</Link></li>
                          <li><Link to="/category/toilet-cleaner?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter can</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 3: Fabric & Laundry */}
                  <div className={colClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-3 pb-1 border-b border-gray-100">
                      Fabric &amp; Laundry
                    </h4>

                    <Link
                      to="/category/laundry-detergent"
                      onClick={() => setActiveMegaMenu(null)}
                      className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group"
                    >
                      <span>Laundry Detergent</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                    </Link>
                    <ul className="mt-1.5 pl-2 space-y-1.5 text-[11px] text-gray-600 border-l border-gray-200">
                      <li><Link to="/category/laundry-detergent?size=1+Liter+Top+Load+and+Front+Load+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block leading-tight">• 1 Liter Top Load &amp; Front Load Pouch</Link></li>
                      <li><Link to="/category/laundry-detergent?size=2+Liter+Top+Load+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block leading-tight">• 2 Liter Top Load Pouch</Link></li>
                      <li><Link to="/category/laundry-detergent?size=2+Liter+Front+Load+Pouch" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block leading-tight">• 2 Liter Front Load Pouch</Link></li>
                      <li><Link to="/category/laundry-detergent?size=5+Liter+Can+Top+Load" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter Can Top Load</Link></li>
                      <li><Link to="/category/laundry-detergent?size=5+Liter+Can+Front+Load" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter Can Front Load</Link></li>
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* PERSONAL CARE MEGA MENU */}
            {activeMegaMenu === 'personal' && (() => {
              const hasLeftImg = Boolean(getLeftImage('personal')?.visible !== false && getLeftImage('personal')?.imageUrl);
              const colClass = hasLeftImg ? 'col-span-4' : 'col-span-6';

              return (
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* LEFT SIDE IMAGE WITH PROVISION TO ADD & DELETE */}
                  {renderLeftImageCard('personal', 'col-span-4')}

                  {/* Wet Wipes */}
                  <div className={colClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-3 pb-1 border-b border-gray-100 flex items-center justify-between">
                      <span>Wet Wipes</span>
                      <span className="text-[10px] text-gray-400 font-normal">Aloe &amp; Chamomile</span>
                    </h4>

                    <Link
                      to="/category/wet-wipes"
                      onClick={() => setActiveMegaMenu(null)}
                      className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group mb-2"
                    >
                      <span>WiZ Gentle Cleansing Wet Wipes</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                    </Link>

                    <ul className="pl-2 space-y-2 text-xs text-gray-700 border-l border-gray-200">
                      <li><Link to="/category/wet-wipes?size=Single+Wet+Wipes" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• Single Wet Wipes</Link></li>
                      <li><Link to="/category/wet-wipes?size=5+Pull+Wet+Wipes" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Pull Wet Wipes</Link></li>
                      <li><Link to="/category/wet-wipes?size=10+Pull+Wet+Wipes" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 10 Pull Wet Wipes</Link></li>
                      <li><Link to="/category/wet-wipes?size=25+Pull+Wet+Wipes" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 25 Pull Wet Wipes</Link></li>
                      <li><Link to="/category/wet-wipes?size=80+Pulls" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block font-medium">• 80 Pulls Value Tub (Family Size)</Link></li>
                    </ul>
                  </div>

                  {/* Bodywash */}
                  <div className={colClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-3 pb-1 border-b border-gray-100 flex items-center justify-between">
                      <span>Bodywash</span>
                      <span className="text-[10px] text-gray-400 font-normal">Nourishing Formula</span>
                    </h4>

                    <Link
                      to="/category/bodywash"
                      onClick={() => setActiveMegaMenu(null)}
                      className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group mb-2"
                    >
                      <span>Bath &amp; Body Shower Gels</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                    </Link>

                    <ul className="pl-2 space-y-2 text-xs text-gray-700 border-l border-gray-200">
                      <li><Link to="/category/bodywash?size=200ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 200ml Bottle</Link></li>
                      <li><Link to="/category/bodywash?size=500ml+Bottle" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 500ml Bottle (Pump Dispenser)</Link></li>
                      <li><Link to="/category/bodywash?size=5+Liter+Can" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">• 5 Liter Can (Hotel &amp; Bulk Institutional)</Link></li>
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* 1L & 5L MEGA MENU */}
            {activeMegaMenu === 'bulk' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-4 pb-1 border-b border-gray-100">
                    1 Litre Refill Pouches
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-700">
                    <li><Link to="/category/handwash" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Handwash 1L Pouch</Link></li>
                    <li><Link to="/category/dishwash" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Dishwash Gel 1L Pouch</Link></li>
                    <li><Link to="/category/floor-cleaner" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Floor Cleaner 1L Pouch</Link></li>
                    <li><Link to="/category/laundry-detergent" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Liquid Detergent 1L Pouch</Link></li>
                    <li><Link to="/category/glass-cleaner" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Glass Cleaner 1L Pouch</Link></li>
                    <li><Link to="/category/toilet-cleaner" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Toilet Cleaner 1L Pouch</Link></li>
                  </ul>
                </div>

                <div className="col-span-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-4 pb-1 border-b border-gray-100">
                    5 Litre Heavy Institutional Cans
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-700">
                    <li><Link to="/category/floor-cleaner" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Floor Cleaner 5L Can</Link></li>
                    <li><Link to="/category/handwash" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Handwash 5L Can</Link></li>
                    <li><Link to="/category/dishwash" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Dishwash Gel 5L Can</Link></li>
                    <li><Link to="/category/bodywash" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Bodywash 5L Can</Link></li>
                    <li><Link to="/category/hand-sanitizer" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Hand Sanitizer 5L Can</Link></li>
                    <li><Link to="/category/toilet-cleaner" onClick={() => setActiveMegaMenu(null)} className="hover:text-[#7a49a6] block">Toilet Cleaner 5L Can</Link></li>
                  </ul>
                </div>

                {/* 1 RIGHT PRODUCT THUMBNAIL IMAGE CARD */}
                <div className="col-span-4 bg-gray-50 border border-gray-200 p-5 flex flex-col justify-between">
                  {(() => {
                    const h = getHighlight('bulk');
                    return (
                      <>
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-white border border-gray-200 p-2 shrink-0 flex items-center justify-center">
                            <img
                              src={h.imageUrl}
                              alt={h.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 tracking-wider inline-block">
                              {h.badge}
                            </span>
                            <h5 className="font-bold text-gray-900 mt-2 text-sm line-clamp-1">
                              {h.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {h.subtitle}
                            </p>
                            <span className="font-black text-gray-900 mt-2 block text-sm">
                              {h.price}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={h.link}
                          onClick={() => setActiveMegaMenu(null)}
                          className="mt-4 w-full bg-black hover:bg-[#7a49a6] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <span>Institutional Bulk Enquiry</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* PAPER PRODUCTS MEGA MENU */}
            {activeMegaMenu === 'paper' && (() => {
              const hasLeftImg = Boolean(getLeftImage('paper')?.visible !== false && getLeftImage('paper')?.imageUrl);
              const colClass = hasLeftImg ? 'col-span-8' : 'col-span-12';

              return (
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* LEFT SIDE IMAGE WITH PROVISION TO ADD & DELETE */}
                  {renderLeftImageCard('paper', 'col-span-4')}

                  <div className={colClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-4 pb-1 border-b border-gray-100 flex items-center justify-between">
                      <span>Paper Products</span>
                      <span className="text-[10px] text-gray-400 font-normal">100% Virgin Pulp Extra Soft</span>
                    </h4>

                    <Link
                      to="/category/paper-products"
                      onClick={() => setActiveMegaMenu(null)}
                      className="font-bold text-xs text-gray-900 hover:text-[#7a49a6] flex items-center justify-between group mb-3"
                    >
                      <span>Explore Entire Paper Products Range</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                    </Link>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                      <Link
                        to="/category/paper-products?size=Facial+Tissue+Box"
                        onClick={() => setActiveMegaMenu(null)}
                        className="p-3 bg-gray-50 border border-gray-200 hover:border-[#7a49a6] hover:bg-purple-50/50 transition-all block group"
                      >
                        <div className="font-bold text-gray-900 group-hover:text-[#7a49a6] flex items-center justify-between">
                          <span>Facial Tissue Box</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Ultra-soft 2-ply 100 pulls / 200 pulls pop-up box</div>
                      </Link>

                      <Link
                        to="/category/paper-products?size=Kitchen+Towel+Roll"
                        onClick={() => setActiveMegaMenu(null)}
                        className="p-3 bg-gray-50 border border-gray-200 hover:border-[#7a49a6] hover:bg-purple-50/50 transition-all block group"
                      >
                        <div className="font-bold text-gray-900 group-hover:text-[#7a49a6] flex items-center justify-between">
                          <span>Kitchen Towel Roll</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Heavy absorption oil &amp; water kitchen wiping towels</div>
                      </Link>

                      <Link
                        to="/category/paper-products?size=Toilet+Tissue+Roll"
                        onClick={() => setActiveMegaMenu(null)}
                        className="p-3 bg-gray-50 border border-gray-200 hover:border-[#7a49a6] hover:bg-purple-50/50 transition-all block group"
                      >
                        <div className="font-bold text-gray-900 group-hover:text-[#7a49a6] flex items-center justify-between">
                          <span>Toilet Tissue Roll</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Rapid-dissolve septic-safe 3-ply bathroom rolls</div>
                      </Link>

                      <Link
                        to="/category/paper-products?size=Paper+Napkin+Tissue"
                        onClick={() => setActiveMegaMenu(null)}
                        className="p-3 bg-gray-50 border border-gray-200 hover:border-[#7a49a6] hover:bg-purple-50/50 transition-all block group"
                      >
                        <div className="font-bold text-gray-900 group-hover:text-[#7a49a6] flex items-center justify-between">
                          <span>Paper Napkin Tissue</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7a49a6]" />
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Table dining &amp; party napkins in convenient dispenser pack</div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* OFFERS & PROMOTIONS MEGA MENU */}
            {activeMegaMenu === 'offers' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff675d] mb-4 pb-1 border-b border-gray-100 flex items-center space-x-1.5">
                    <span>Discount Coupons</span>
                  </h4>
                  <ul className="space-y-3 text-xs text-gray-700">
                    <li className="bg-red-50/50 p-2.5 border border-[#ff675d]/20">
                      <div className="flex items-center justify-between font-mono font-bold text-sm text-[#ff675d]">
                        <span>WIZFIRST</span>
                        <span>15% OFF</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">Valid on your first order above ₹399</p>
                    </li>
                    <li className="bg-gray-50 p-2.5 border border-gray-200">
                      <div className="flex items-center justify-between font-mono font-bold text-sm text-gray-900">
                        <span>WIZCLEAN</span>
                        <span>10% OFF</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">Flat discount on all household cleaning essentials</p>
                    </li>
                  </ul>
                </div>

                <div className="col-span-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff675d] mb-4 pb-1 border-b border-gray-100">
                    Free Gift Thresholds
                  </h4>
                  <div className="space-y-3 text-xs text-gray-700">
                    <div className="p-3 bg-purple-50 border border-teal-200">
                      <span className="text-[10px] font-bold uppercase bg-[#7a49a6] text-white px-1.5 py-0.5">
                        Free Gift
                      </span>
                      <h6 className="font-bold text-gray-900 text-xs mt-1.5">Free 100ml Sanitizer</h6>
                      <p className="text-[11px] text-gray-600 mt-0.5">Automatically added on all cart orders above ₹799.</p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200">
                      <span className="text-[10px] font-bold uppercase bg-orange-600 text-white px-1.5 py-0.5">
                        Free Shipping
                      </span>
                      <h6 className="font-bold text-gray-900 text-xs mt-1.5">Free Pan-India Delivery</h6>
                      <p className="text-[11px] text-gray-600 mt-0.5">Free doorstep delivery on orders above ₹599.</p>
                    </div>
                  </div>
                </div>

                {/* 1 RIGHT PRODUCT THUMBNAIL IMAGE CARD */}
                <div className="col-span-4 bg-gray-50 border border-gray-200 p-5 flex flex-col justify-between">
                  {(() => {
                    const h = getHighlight('offers');
                    return (
                      <>
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-white border border-gray-200 p-2 shrink-0 flex items-center justify-center">
                            <img
                              src={h.imageUrl}
                              alt={h.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold uppercase bg-[#ff675d] text-white px-2 py-0.5 tracking-wider inline-block">
                              {h.badge}
                            </span>
                            <h5 className="font-bold text-gray-900 mt-2 text-sm line-clamp-1">
                              {h.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {h.subtitle}
                            </p>
                            <span className="font-black text-gray-900 mt-2 block text-sm">
                              {h.price}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={h.link}
                          onClick={() => setActiveMegaMenu(null)}
                          className="mt-4 w-full bg-[#ff675d] hover:bg-black text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <span>Explore All Offers</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Search Modal Overlay with Real-Time Suggestions Dropdown */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 overflow-y-auto"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white w-full max-w-2xl shadow-2xl border border-gray-200 rounded-none overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Search Form */}
            <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/70">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#7a49a6]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Search WiZ Hygiene Store
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-3.5 text-gray-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for Handwash, Wet Wipes, 5L Can, Dishwash, Fragrance..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-11 pr-24 py-3 bg-white border-2 border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7a49a6] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-20 text-gray-400 hover:text-gray-600 p-1"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 bg-[#7a49a6] hover:bg-[#633a88] text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Real-time Suggestions Content Area */}
            <div className="max-h-[68vh] overflow-y-auto divide-y divide-gray-100">
              {searchQuery.trim().length > 0 ? (
                <>
                  {/* Matching Categories Section */}
                  {suggestedCategories.length > 0 && (
                    <div className="p-4 bg-purple-50/40">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#7a49a6] mb-2 flex items-center justify-between">
                        <span>Matching Categories ({suggestedCategories.length})</span>
                        <span className="text-[10px] text-gray-400 font-normal">Click category to browse all items</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestedCategories.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center space-x-3 p-2 bg-white border border-purple-100 hover:border-[#7a49a6] hover:shadow-xs transition-all group"
                          >
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7a49a6] flex items-center justify-center shrink-0 group-hover:bg-[#7a49a6] group-hover:text-white transition-colors">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 group-hover:text-[#7a49a6] truncate transition-colors">
                                {highlightMatch(cat.name, searchQuery)}
                              </p>
                              {cat.count !== undefined && (
                                <p className="text-[10px] text-gray-500">
                                  {cat.count} product{cat.count === 1 ? '' : 's'} available
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#7a49a6] transition-colors shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Specific Products Section */}
                  {suggestedProducts.length > 0 ? (
                    <div className="p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
                        <span>Specific Product Suggestions</span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          Showing top {suggestedProducts.length} items
                        </span>
                      </div>
                      <div className="space-y-2">
                        {suggestedProducts.map((p) => {
                          const displayPrice = p.sellingPrice;
                          const hasDiscount = Boolean(p.regularPrice && p.regularPrice > p.sellingPrice);
                          const isOutOfStock = Boolean(p.isSoldout || p.stock <= 0);
                          const thumbnailImg = (p.images && p.images[0]) || '';

                          return (
                            <Link
                              key={p.id}
                              to={`/product/${p.slug}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center space-x-3 p-2.5 rounded-none border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group"
                            >
                              {/* Product Thumbnail */}
                              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white border border-gray-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                                {thumbnailImg ? (
                                  <img
                                    src={thumbnailImg}
                                    alt={p.name}
                                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="text-[9px] text-gray-400 text-center font-bold">WiZ</div>
                                )}
                                {hasDiscount && (
                                  <span className="absolute top-0.5 right-0.5 bg-[#ff675d] text-white text-[8px] font-extrabold px-1 leading-tight">
                                    SALE
                                  </span>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {p.category && (
                                    <span className="text-[9px] font-bold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.2 tracking-wider">
                                      {p.category}
                                    </span>
                                  )}
                                  {p.packagingSize && (
                                    <span className="text-[9px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2">
                                      {p.packagingSize}
                                    </span>
                                  )}
                                  {p.fragrance && (
                                    <span className="text-[9px] text-gray-500">
                                      • {p.fragrance}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#7a49a6] truncate mt-0.5 transition-colors">
                                  {highlightMatch(p.name, searchQuery)}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs sm:text-sm font-black text-gray-900">
                                    ₹{displayPrice}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-[11px] text-gray-400 line-through">
                                      ₹{p.regularPrice}
                                    </span>
                                  )}
                                  {isOutOfStock ? (
                                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5">
                                      Out of Stock
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5">
                                      In Stock
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Arrow */}
                              <div className="text-gray-300 group-hover:text-[#7a49a6] transition-colors shrink-0">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Full Results Link */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <Link
                          to={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-center bg-[#7a49a6] hover:bg-[#633a88] text-white py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <span>View all search results for "{searchQuery}"</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    suggestedCategories.length === 0 && (
                      <div className="py-10 px-4 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                          <Search className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-800">
                          No matching products or categories found
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                          We couldn't find anything matching "{searchQuery}". Try searching for generic terms like "Handwash", "Wipes", "Floor Cleaner", or "5L".
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-xs">
                          {['Handwash', 'Wet Wipes', 'Floor Cleaner', '5 Litre Can'].map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                setSearchQuery(term);
                                searchInputRef.current?.focus();
                              }}
                              className="bg-gray-100 hover:bg-[#7a49a6] hover:text-white px-2.5 py-1 text-gray-700 transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </>
              ) : (
                /* Default View when query is empty: Popular Categories & Trending Searches */
                <div className="p-4 sm:p-5 space-y-5">
                  {/* Popular Product Categories */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center justify-between">
                      <span>Popular Product Categories</span>
                      <span className="text-[10px] text-gray-400">Quick links</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {popularCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/category/${cat.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-[#7a49a6] transition-all group"
                        >
                          <div className="w-7 h-7 rounded-full bg-white border border-gray-200 text-[#7a49a6] flex items-center justify-center shrink-0 group-hover:border-[#7a49a6]">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-gray-800 group-hover:text-[#7a49a6] truncate transition-colors">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Trending Search Chips */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {[
                        'Handwash 5L',
                        'Wet Wipes 80 Pulls',
                        'Floor Cleaner Citrus',
                        'Dishwash Gel 5 Litre',
                        'Lavender Handwash',
                        'Liquid Matic Detergent',
                        'Paper Napkins',
                        'Sanitizer 500ml'
                      ].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            searchInputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-[#7a49a6] hover:text-white text-gray-700 transition-colors cursor-pointer text-xs font-medium"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-white z-40 overflow-y-auto p-6 border-t border-gray-200">
          <nav className="flex flex-col space-y-4 text-base font-medium text-gray-900">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              All Products
            </Link>
            <Link
              to="/category/handwash"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              Household Cleaners
            </Link>
            <Link
              to="/category/wet-wipes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              Personal Care
            </Link>
            <Link
              to="/category/1l-5l-bulk"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              1L &amp; 5L Refills &amp; Cans
            </Link>
            <Link
              to="/category/paper-products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              Paper Products
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 text-[#ff675d] font-bold"
            >
              Offers &amp; Promotions
            </Link>
            <Link
              to="/bulk-order"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100"
            >
              Bulk Order Enquiry
            </Link>
            <Link
              to="/advisor"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 text-[#7a49a6] font-semibold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hygiene Advisor</span>
            </Link>

            {/* Mobile Coins Pocket Card */}
            <div className="py-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCoinModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl text-left shadow-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Coins className="w-4 h-4 text-white fill-white/80" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">WiZ Coins Pocket</span>
                    <span className="text-[10px] text-amber-800">Earn 2 Coins per ₹50 spent</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-900 block">{coins} Coins</span>
                  <span className="text-[10px] font-bold text-emerald-600">₹{coins}.00 OFF</span>
                </div>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Customer Coin Wallet Modal */}
      <CoinWalletModal isOpen={isCoinModalOpen} onClose={() => setIsCoinModalOpen(false)} />

    </header>
  );
};
