import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  Building2,
  Tag,
  Gift,
  BarChart3,
  Settings,
  Globe,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  Download,
  Search,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
  Sparkles,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getCategories,
  saveCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  getBulkEnquiries,
  updateBulkEnquiryStatus,
  getCoupons,
  saveCoupon,
  deleteCoupon,
  getFreebies,
  saveFreebie,
  deleteFreebie,
  getGeneralSettings,
  saveGeneralSettings,
  getAnalyticsEvents,
  seedInitialDataIfEmpty,
  resolveAssetUrl
} from '../../lib/storeService';
import { Product, Category, OrderEnquiry, BulkEnquiry, Coupon, Freebie, GeneralSettings, AnalyticsEvent, HeaderBanner, MegaMenuHighlight } from '../../types';
import { DEFAULT_PACKAGING_PRESETS } from '../../lib/initialData';
import { useAuth } from '../../context/AuthContext';
import { useSEO } from '../../hooks/useSEO';
import { Link } from 'react-router-dom';
import { PublicAssetPickerModal } from '../../components/admin/PublicAssetPickerModal';

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'banners'
  | 'orders'
  | 'bulk'
  | 'coupons'
  | 'freebies'
  | 'analytics'
  | 'settings'
  | 'seo';

export const AdminPage: React.FC = () => {
  useSEO({
    title: 'Admin Control Center | WiZ Care',
    noIndex: true
  });

  const { currentUser, isAdmin, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Datasets
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<OrderEnquiry[]>([]);
  const [bulkEnquiries, setBulkEnquiries] = useState<BulkEnquiry[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Editing modals / state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBanner, setEditingBanner] = useState<HeaderBanner | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingFreebie, setEditingFreebie] = useState<Freebie | null>(null);
  const [assetPickerTarget, setAssetPickerTarget] = useState<
    | { type: 'thumbnail' }
    | { type: 'side-post'; slotIndex: number }
    | { type: 'side-post-add' }
    | null
  >(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);

  // Orders search & filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Storefront Sections Media State
  const [bestsellerBg, setBestsellerBg] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('wiz_bestseller_bg_image_v2');
      if (saved && (saved.includes('bestseller-background') || saved.includes('bestseller-portrait') || saved.includes('bestseller-bg-clean'))) {
        return '/assets/products/lavender-podium-flower-background.jpg';
      }
      return saved !== null ? saved : '/assets/products/lavender-podium-flower-background.jpg';
    } catch {
      return '/assets/products/lavender-podium-flower-background.jpg';
    }
  });

  const [pcareThumbs, setPcareThumbs] = useState<Record<string, { image: string | null; title: string; link: string }>>(() => {
    try {
      const saved = localStorage.getItem('wiz_personal_care_thumbs_v5') || localStorage.getItem('wiz_personal_care_thumbs_v4');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'left-top': { image: '/assets/products/Bodywash-M1.jpg', title: 'Smiling Woman', link: '/category/personal-care' },
      'left-bottom': { image: '/assets/products/Bodywash-M2.jpg', title: 'Wet Wipes Pouch', link: '/category/wet-wipes' },
      'right-top': { image: '/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png', title: 'Bodywash Can', link: '/category/bodywash' },
      'right-bottom': { image: '/assets/products/LiquidMatic-M1.jpg', title: 'Radiant Woman', link: '/category/personal-care' }
    };
  });

  const [lovedEssentialsBg, setLovedEssentialsBg] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('wiz_most_loved_essentials_bg_v5') || localStorage.getItem('wiz_most_loved_essentials_bg_v4');
      return saved !== null && saved !== '' ? saved : '/assets/aistudio/Personcal Care-BG.jpg';
    } catch {
      return '/assets/aistudio/Personcal Care-BG.jpg';
    }
  });

  const [blogThumbnails, setBlogThumbnails] = useState<Array<{ id: number; title: string; image: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('wiz_blog_posts_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: 1, title: 'Clean Beauty Rituals for Radiant Skin Everyday', image: '/assets/Blog01.jpg', date: 'October 12, 2026' },
      { id: 2, title: 'Gentle pH Balance Formulas That Protect Daily', image: '/assets/Blog02.jpg', date: 'October 18, 2026' },
      { id: 3, title: 'Nourishing Body Care Routines for All Seasons', image: '/assets/Blog03.jpg', date: 'October 24, 2026' }
    ];
  });

  const handleSaveBestsellerBg = (url: string) => {
    setBestsellerBg(url);
    try {
      localStorage.setItem('wiz_bestseller_bg_image_v2', url);
    } catch {}
    triggerNotice('success', 'Our Bestsellers background image updated!');
  };

  const handleDeleteBestsellerBg = () => {
    setBestsellerBg('');
    try {
      localStorage.setItem('wiz_bestseller_bg_image_v2', '');
    } catch {}
    triggerNotice('success', 'Our Bestsellers background image deleted!');
  };

  const handleResetBestsellerBg = () => {
    const def = '/assets/products/lavender-podium-flower-background.jpg';
    setBestsellerBg(def);
    try {
      localStorage.setItem('wiz_bestseller_bg_image_v2', def);
    } catch {}
    triggerNotice('success', 'Our Bestsellers background reset to default!');
  };

  const handleSavePcareThumb = (slotKey: string, url: string) => {
    const updated = {
      ...pcareThumbs,
      [slotKey]: { ...pcareThumbs[slotKey], image: url }
    };
    setPcareThumbs(updated);
    try {
      localStorage.setItem('wiz_personal_care_thumbs_v5', JSON.stringify(updated));
    } catch {}
    triggerNotice('success', `Personal Care ${slotKey} thumbnail updated!`);
  };

  const handleDeletePcareThumb = (slotKey: string) => {
    const updated = {
      ...pcareThumbs,
      [slotKey]: { ...pcareThumbs[slotKey], image: null }
    };
    setPcareThumbs(updated);
    try {
      localStorage.setItem('wiz_personal_care_thumbs_v5', JSON.stringify(updated));
    } catch {}
    triggerNotice('success', `Personal Care ${slotKey} thumbnail deleted!`);
  };

  const handleResetPcareThumbs = () => {
    const def = {
      'left-top': { image: '/assets/products/Bodywash-M1.jpg', title: 'Smiling Woman', link: '/category/personal-care' },
      'left-bottom': { image: '/assets/products/Bodywash-M2.jpg', title: 'Wet Wipes Pouch', link: '/category/wet-wipes' },
      'right-top': { image: '/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png', title: 'Bodywash Can', link: '/category/bodywash' },
      'right-bottom': { image: '/assets/products/LiquidMatic-M1.jpg', title: 'Radiant Woman', link: '/category/personal-care' }
    };
    setPcareThumbs(def);
    try {
      localStorage.setItem('wiz_personal_care_thumbs_v5', JSON.stringify(def));
    } catch {}
    triggerNotice('success', 'Personal Care thumbnails reset to defaults!');
  };

  const handleSaveLovedEssentialsBg = (url: string) => {
    setLovedEssentialsBg(url);
    try {
      localStorage.setItem('wiz_most_loved_essentials_bg_v5', url);
    } catch {}
    triggerNotice('success', 'Our Most Loved Essentials background updated!');
  };

  const handleDeleteLovedEssentialsBg = () => {
    setLovedEssentialsBg('');
    try {
      localStorage.setItem('wiz_most_loved_essentials_bg_v5', '');
    } catch {}
    triggerNotice('success', 'Our Most Loved Essentials background deleted!');
  };

  const handleResetLovedEssentialsBg = () => {
    const def = '/assets/aistudio/Personcal Care-BG.jpg';
    setLovedEssentialsBg(def);
    try {
      localStorage.setItem('wiz_most_loved_essentials_bg_v5', def);
    } catch {}
    triggerNotice('success', 'Our Most Loved Essentials background reset to default!');
  };

  const handleSaveBlogThumb = (id: number, url: string) => {
    const updated = blogThumbnails.map((b) => (b.id === id ? { ...b, image: url } : b));
    setBlogThumbnails(updated);
    try {
      localStorage.setItem('wiz_blog_posts_v2', JSON.stringify(updated));
    } catch {}
    triggerNotice('success', `Blog Post #${id} thumbnail updated!`);
  };

  const handleDeleteBlogThumb = (id: number) => {
    const updated = blogThumbnails.map((b) => (b.id === id ? { ...b, image: '' } : b));
    setBlogThumbnails(updated);
    try {
      localStorage.setItem('wiz_blog_posts_v2', JSON.stringify(updated));
    } catch {}
    triggerNotice('success', `Blog Post #${id} thumbnail deleted!`);
  };

  const handleResetBlogThumbs = () => {
    const def = [
      { id: 1, title: 'Clean Beauty Rituals for Radiant Skin Everyday', image: '/assets/Blog01.jpg', date: 'October 12, 2026' },
      { id: 2, title: 'Gentle pH Balance Formulas That Protect Daily', image: '/assets/Blog02.jpg', date: 'October 18, 2026' },
      { id: 3, title: 'Nourishing Body Care Routines for All Seasons', image: '/assets/Blog03.jpg', date: 'October 24, 2026' }
    ];
    setBlogThumbnails(def);
    try {
      localStorage.setItem('wiz_blog_posts_v2', JSON.stringify(def));
    } catch {}
    triggerNotice('success', 'Blog thumbnails reset to defaults!');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await seedInitialDataIfEmpty();
      const [prods, cats, ords, bulks, coups, frees, sett, evts] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders().catch(() => []),
        getBulkEnquiries().catch(() => []),
        getCoupons(),
        getFreebies(),
        getGeneralSettings(),
        getAnalyticsEvents()
      ]);

      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setBulkEnquiries(bulks);
      setCoupons(coups);
      setFreebies(frees);
      setSettings(sett);
      setAnalyticsEvents(evts);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const triggerNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // While checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#7a49a6] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  // If not logged in as Admin, show login screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-300 p-8 shadow-xl text-center">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-[#7a49a6]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            Restricted Portal
          </span>
          <h1 className="text-xl font-bold text-gray-900 mb-2">WiZ Administrator Sign-In</h1>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Please sign in with your authorized Google Account (<strong>big99webdeveloper@gmail.com</strong>) to manage WiZ products, orders, coupons, and store settings.
          </p>

          {currentUser ? (
            <div className="space-y-3">
              <p className="text-xs text-red-600 bg-red-50 p-2.5 border border-red-200 rounded">
                Signed in as <strong>{currentUser.email}</strong>, which is not an authorized administrator.
              </p>
              <button
                onClick={() => logout()}
                className="w-full bg-gray-800 hover:bg-black text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Sign Out &amp; Switch Account
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="w-full bg-[#7a49a6] hover:bg-[#5f3786] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Sign in with Google
            </button>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link to="/" className="text-xs text-gray-500 hover:text-black">
              ← Return to WiZ Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistics
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const lowStockCount = products.filter((p) => p.stock <= 20).length;
  const totalEnquiries = orders.length;
  const totalBulkEnquiries = bulkEnquiries.length;
  const amazonClicks = analyticsEvents.filter((e) => e.eventType === 'amazon_click').length;
  const zeptoClicks = analyticsEvents.filter((e) => e.eventType === 'zepto_click').length;
  const blinkitClicks = analyticsEvents.filter((e) => e.eventType === 'blinkit_click').length;
  const totalMarketplaceOutbound = amazonClicks + zeptoClicks + blinkitClicks;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle CSV export of orders
  const handleExportOrdersCSV = () => {
    if (!orders.length) return;
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Subtotal', 'Discount', 'Final Total', 'Status', 'Source'];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.createdAt.split('T')[0]}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.city}"`,
      o.subtotal,
      o.discount,
      o.finalTotal,
      `"${o.status}"`,
      `"${o.source}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WiZ_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dedicated Handlers for Product Save & Delete
  const handleSaveProduct = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingProduct) return;

    const trimmedName = (editingProduct.name || '').trim();
    if (!trimmedName) {
      triggerNotice('error', 'Please enter a valid Product Name.');
      return;
    }

    setIsSavingProduct(true);
    try {
      const slug =
        (editingProduct.slug || '').trim() ||
        trimmedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') ||
        `prod-${Date.now()}`;

      const cleanImages = (editingProduct.images || [])
        .map((img) => (typeof img === 'string' ? img.trim() : ''))
        .filter(Boolean);

      if (cleanImages.length === 0) {
        cleanImages.push('/assets/products/Lemon-Handwash01.jpg');
      }

      const sanitizedProduct: Product = {
        ...editingProduct,
        id: editingProduct.id || `prod-${Date.now()}`,
        name: trimmedName,
        slug,
        category: editingProduct.category || categories[0]?.name || 'Household Cleaners',
        regularPrice: Number(editingProduct.regularPrice) || 0,
        sellingPrice: Number(editingProduct.sellingPrice) || 0,
        stock: Number(editingProduct.stock) || 0,
        packagingSize: (editingProduct.packagingSize || '').trim(),
        fragrance: (editingProduct.fragrance || '').trim(),
        fragrances: Array.isArray(editingProduct.fragrances)
          ? editingProduct.fragrances.map((f) => (typeof f === 'string' ? f.trim() : '')).filter(Boolean)
          : (editingProduct.fragrance ? [editingProduct.fragrance.trim()] : []),
        images: cleanImages,
        published: Boolean(editingProduct.published),
        isBestseller: Boolean(editingProduct.isBestseller),
        isSoldout: Boolean(editingProduct.isSoldout),
        variants:
          Array.isArray(editingProduct.variants) && editingProduct.variants.length > 0
            ? editingProduct.variants.map((v, idx) => ({
                ...v,
                id: v.id || `var-${Date.now()}-${idx}`,
                name: v.name || `${trimmedName} Variant ${idx + 1}`,
                sku: v.sku || `WIZ-${idx + 1}`,
                regularPrice: Number(v.regularPrice) || Number(editingProduct.regularPrice) || 0,
                sellingPrice: Number(v.sellingPrice) || Number(editingProduct.sellingPrice) || 0,
                stock: Number(v.stock) || 50,
                packagingSize: v.packagingSize || v.name || editingProduct.packagingSize || 'Standard'
              }))
            : [
                {
                  id: `var-${Date.now()}-1`,
                  name: editingProduct.packagingSize || 'Standard Pack',
                  sku: editingProduct.sku || `WIZ-${Date.now().toString().slice(-4)}`,
                  regularPrice: Number(editingProduct.regularPrice) || 0,
                  sellingPrice: Number(editingProduct.sellingPrice) || 0,
                  stock: Number(editingProduct.stock) || 100,
                  packagingSize: editingProduct.packagingSize || 'Standard'
                }
              ]
      };

      // 1. Immediate optimistic UI update
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === sanitizedProduct.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = sanitizedProduct;
          return copy;
        }
        return [sanitizedProduct, ...prev];
      });

      // 2. Persist to storage (both localStorage & Firestore)
      await saveProduct(sanitizedProduct);

      // 3. UI feedback & close modal
      triggerNotice('success', `Product "${sanitizedProduct.name}" saved successfully!`);
      setEditingProduct(null);

      // 4. Background refresh
      loadAllData();
    } catch (err) {
      console.error('Failed to save product:', err);
      triggerNotice('error', 'Product saved to local store.');
      setEditingProduct(null);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (confirm(`Delete product "${p.name}"?`)) {
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      try {
        await deleteProduct(p.id);
        triggerNotice('success', `Product "${p.name}" deleted`);
      } catch (err) {
        console.error('Delete error:', err);
        triggerNotice('success', `Product "${p.name}" deleted locally`);
      }
    }
  };

  const handleSaveCategory = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingCategory) return;
    const name = (editingCategory.name || '').trim();
    if (!name) {
      triggerNotice('error', 'Please enter a Category Name.');
      return;
    }

    setIsSavingCategory(true);
    try {
      const slug =
        (editingCategory.slug || '').trim() ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const sanitized: Category = {
        ...editingCategory,
        id: editingCategory.id || `cat-${Date.now()}`,
        name,
        slug,
        image: editingCategory.image || '/assets/products/Lemon-Handwash01.jpg',
        order: Number(editingCategory.order) || 0,
        published: Boolean(editingCategory.published)
      };

      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.id === sanitized.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = sanitized;
          return copy;
        }
        return [...prev, sanitized];
      });

      await saveCategory(sanitized);
      triggerNotice('success', `Category "${sanitized.name}" saved successfully!`);
      setEditingCategory(null);
      loadAllData();
    } catch (err) {
      console.error('Error saving category:', err);
      triggerNotice('error', 'Category saved to local store.');
      setEditingCategory(null);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (c: Category) => {
    if (confirm(`Delete category "${c.name}"?`)) {
      setCategories((prev) => prev.filter((item) => item.id !== c.id));
      try {
        await deleteCategory(c.id);
        triggerNotice('success', `Category "${c.name}" deleted`);
      } catch (err) {
        triggerNotice('success', `Category "${c.name}" deleted locally`);
      }
    }
  };

  const handleSaveCoupon = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingCoupon) return;
    const code = (editingCoupon.code || '').trim().toUpperCase();
    if (!code) {
      triggerNotice('error', 'Please enter a Coupon Code.');
      return;
    }

    setIsSavingCoupon(true);
    try {
      const sanitized: Coupon = {
        ...editingCoupon,
        id: editingCoupon.id || `coup-${Date.now()}`,
        code,
        discountType: editingCoupon.discountType || 'percentage',
        discountValue: Number(editingCoupon.discountValue) || 0,
        minCartValue: Number(editingCoupon.minCartValue) || 0,
        maxDiscount: Number(editingCoupon.maxDiscount) || 100,
        usageLimit: Number(editingCoupon.usageLimit) || 500,
        usedCount: Number(editingCoupon.usedCount) || 0,
        isActive: Boolean(editingCoupon.isActive)
      };

      setCoupons((prev) => {
        const idx = prev.findIndex((cp) => cp.id === sanitized.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = sanitized;
          return copy;
        }
        return [...prev, sanitized];
      });

      await saveCoupon(sanitized);
      triggerNotice('success', `Coupon "${sanitized.code}" saved!`);
      setEditingCoupon(null);
      loadAllData();
    } catch (err) {
      console.error('Error saving coupon:', err);
      triggerNotice('error', 'Coupon saved locally.');
      setEditingCoupon(null);
    } finally {
      setIsSavingCoupon(false);
    }
  };

  // Handle Settings Save - specifically fixes and verifies settings/general write
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await saveGeneralSettings(settings);
      triggerNotice('success', 'General settings saved successfully to Firestore (settings/general)!');
    } catch (err: unknown) {
      console.error('Settings save error:', err);
      triggerNotice('error', 'Error saving settings/general. Please ensure you are logged in as admin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black text-[#7a49a6] tracking-tight">
            WiZ<span className="text-xs font-normal text-gray-400 align-super ml-0.5">ADMIN</span>
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-xs font-medium text-gray-300">Home Hygiene &amp; Personal Care</span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-1 text-gray-400 hover:text-white"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <span className="text-gray-700">|</span>
          <span className="text-gray-400">{currentUser?.email}</span>
          <button
            onClick={() => logout()}
            className="text-[#ff675d] hover:text-[#ff8a82] font-semibold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Global Notification Banner */}
      {notice && (
        <div
          className={`px-6 py-3 text-xs font-bold flex items-center space-x-2 ${
            notice.type === 'success' ? 'bg-green-600 text-white' : 'bg-[#ff675d] text-white'
          }`}
        >
          {notice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-300 p-4 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'products' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Package className="w-4 h-4" />
              <span>Products &amp; Variants</span>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'categories' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2">{categories.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'banners' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 text-[#ff675d]" />
              <span>Header Banners</span>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2">
              {settings?.headerBanners?.length || 3}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders &amp; Enquiries</span>
            </div>
            <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'bulk' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Building2 className="w-4 h-4" />
              <span>Bulk B2B Enquiries</span>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2">{bulkEnquiries.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'coupons' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Tag className="w-4 h-4" />
              <span>Coupons</span>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2">{coupons.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('freebies')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'freebies' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Gift className="w-4 h-4" />
              <span>Free Gift Rules</span>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2">{freebies.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'analytics' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Google Ads &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>General Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold transition-all text-left ${
              activeTab === 'seo' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>SEO &amp; Sitemap</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* =========================================================================
              TAB: DASHBOARD
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Overview</h1>
                <p className="text-xs text-gray-500 mt-1">Live metrics and store status</p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-300 p-5 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Published Products
                  </span>
                  <div className="text-3xl font-black text-gray-900">{publishedProducts}</div>
                  <span className="text-[11px] text-gray-500 mt-1 block">Total in catalog: {totalProducts}</span>
                </div>

                <div className="bg-white border border-gray-300 p-5 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Active Categories
                  </span>
                  <div className="text-3xl font-black text-gray-900">{categories.length}</div>
                  <span className="text-[11px] text-gray-500 mt-1 block">Household &amp; Personal Care</span>
                </div>

                <div className="bg-white border border-gray-300 p-5 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Website Enquiries
                  </span>
                  <div className="text-3xl font-black text-[#7a49a6]">{totalEnquiries}</div>
                  <span className="text-[11px] text-gray-500 mt-1 block">Logged in Firestore</span>
                </div>

                <div className="bg-white border border-gray-300 p-5 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Marketplace Outbound Clicks
                  </span>
                  <div className="text-3xl font-black text-purple-700">{totalMarketplaceOutbound}</div>
                  <span className="text-[11px] text-gray-500 mt-1 block">Amazon, Zepto, Blinkit</span>
                </div>
              </div>

              {/* Recent Orders Snippet */}
              <div className="bg-white border border-gray-300 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Recent Customer Enquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#7a49a6] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No orders logged yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase">
                          <th className="py-2.5">Order #</th>
                          <th className="py-2.5">Customer</th>
                          <th className="py-2.5">Phone</th>
                          <th className="py-2.5">City</th>
                          <th className="py-2.5">Amount</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50">
                            <td className="py-2.5 font-mono font-bold">{o.orderNumber}</td>
                            <td className="py-2.5 font-semibold text-gray-900">{o.customerName}</td>
                            <td className="py-2.5 text-gray-600 font-mono">{o.customerPhone}</td>
                            <td className="py-2.5 text-gray-600">{o.city}</td>
                            <td className="py-2.5 font-bold">₹{o.finalTotal.toFixed(2)}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: PRODUCTS CRUD
              ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Products Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Add, edit, duplicate, and manage multi-variant pricing</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: '',
                      slug: '',
                      sku: `WIZ-NEW-${Math.floor(100 + Math.random() * 900)}`,
                      category: categories[0]?.name || 'Household Cleaners',
                      subcategory: 'Household Cleaners',
                      shortDescription: '',
                      fullDescription: '',
                      benefits: ['Kills 99.9% germs', 'FDA approved safe formulation'],
                      images: ['https://images.unsplash.com/photo-1608248597359-00f735878484?w=600&auto=format&fit=crop&q=80'],
                      regularPrice: 150,
                      sellingPrice: 99,
                      discountPercent: 34,
                      packagingSize: '500 ml Bottle',
                      stock: 100,
                      isFeatured: false,
                      isBestseller: false,
                      isSoldout: false,
                      published: true,
                      variants: [
                        {
                          id: `var-${Date.now()}-1`,
                          name: '500 ml Bottle',
                          sku: 'WIZ-500',
                          regularPrice: 150,
                          sellingPrice: 99,
                          stock: 100,
                          packagingSize: '500 ml'
                        }
                      ]
                    });
                  }}
                  className="bg-[#7a49a6] hover:bg-[#5f3786] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Table */}
              <div className="bg-white border border-gray-300 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold uppercase">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (₹)</th>
                      <th className="py-3 px-4">Variants</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-contain bg-gray-50 border p-1" />
                          <div>
                            <span className="font-bold text-gray-900 block truncate max-w-[200px]">{p.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{p.category}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900">₹{p.sellingPrice}</span>
                          {p.regularPrice > p.sellingPrice && (
                            <span className="text-[11px] text-gray-400 line-through ml-1.5">₹{p.regularPrice}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{p.variants.length} variant(s)</td>
                        <td className="py-3 px-4 font-semibold">{p.stock}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold ${
                              p.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="text-[#7a49a6] hover:underline font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="text-[#ff675d] hover:underline font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Editing Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white max-w-3xl w-full p-8 border border-gray-300 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200 mb-6">
                      {editingProduct.name ? `Edit: ${editingProduct.name}` : 'Create New Product'}
                    </h2>

                    <form
                      onSubmit={handleSaveProduct}
                      className="space-y-4 text-xs"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-1">Product Name *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              setEditingProduct({ ...editingProduct, name, slug });
                            }}
                            className="w-full p-2 border border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Slug *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.slug}
                            onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                            className="w-full p-2 border border-gray-300 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold mb-1">Category</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full p-2 border border-gray-300 bg-white"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Regular Price (₹)</label>
                          <input
                            type="number"
                            value={editingProduct.regularPrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full p-2 border border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            value={editingProduct.sellingPrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full p-2 border border-gray-300 font-bold"
                          />
                        </div>
                      </div>

                      {/* Product Packaging Size Backend Provision */}
                      <div className="p-3 bg-amber-50/60 border border-amber-200 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <label className="block font-bold text-xs uppercase text-amber-800 tracking-wide">
                            Packaging Size (Backend Filter Value)
                          </label>
                          <span className="text-[11px] text-gray-500">
                            Enables customer packaging size filtering on category &amp; shop listing pages
                          </span>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="e.g. 500 ml Bottle, 1 Litre Pouch, 5 Litre Can, 80 Pulls Pack"
                            value={editingProduct.packagingSize || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, packagingSize: e.target.value })}
                            className="w-full p-2 border border-amber-300 bg-white text-xs"
                          />
                        </div>
                        <div className="pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase mr-2">Quick Packaging Presets (Backend Filter Values):</span>
                            <button
                              type="button"
                              onClick={async () => {
                                const newP = prompt('Enter new packaging preset name (e.g. "250 ml Bottle", "3 Litre Can"):');
                                if (newP && newP.trim()) {
                                  const trimmed = newP.trim();
                                  const current = settings?.packagingPresets || DEFAULT_PACKAGING_PRESETS;
                                  if (!current.includes(trimmed)) {
                                    const updated = [...current, trimmed];
                                    const newSettings: GeneralSettings = { ...settings!, packagingPresets: updated };
                                    setSettings(newSettings);
                                    await saveGeneralSettings(newSettings);
                                    triggerNotice('success', `Added "${trimmed}" to Quick Packaging Presets!`);
                                  }
                                }
                              }}
                              className="text-[10px] text-[#7a49a6] hover:underline font-bold"
                            >
                              + Add New Preset
                            </button>
                          </div>
                          <div className="inline-flex flex-wrap gap-1 mt-1">
                            {(settings?.packagingPresets || DEFAULT_PACKAGING_PRESETS).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, packagingSize: sz })}
                                className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                                  editingProduct.packagingSize === sz
                                    ? 'bg-amber-700 text-white font-bold'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-400'
                                }`}
                              >
                                {editingProduct.packagingSize === sz ? `✓ ${sz}` : `+ ${sz}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Product Fragrance / Scent Backend Provision */}
                      <div className="p-3 bg-purple-50/60 border border-purple-200 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <label className="block font-bold text-xs uppercase text-[#7a49a6] tracking-wide">
                            Product Fragrance / Scent (Backend Provision)
                          </label>
                          <span className="text-[11px] text-gray-500">
                            Enables customer fragrance filtering on inner category &amp; search pages
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Primary Fragrance
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Neem &amp; Aloe Vera, Citrus Lemon, Lavender Blossom"
                              value={editingProduct.fragrance || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const existingList = editingProduct.fragrances || [];
                                const updatedList = val ? (existingList.includes(val) ? existingList : [val, ...existingList]) : existingList;
                                setEditingProduct({
                                  ...editingProduct,
                                  fragrance: val,
                                  fragrances: updatedList
                                });
                              }}
                              className="w-full p-2 border border-purple-300 bg-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              All Fragrance Options (comma-separated)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Neem &amp; Aloe Vera, Citrus Lemon, Ocean Breeze"
                              value={(editingProduct.fragrances || []).join(', ')}
                              onChange={(e) => {
                                const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setEditingProduct({
                                  ...editingProduct,
                                  fragrances: arr,
                                  fragrance: editingProduct.fragrance || arr[0] || ''
                                });
                              }}
                              className="w-full p-2 border border-purple-300 bg-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-1">
                          <span className="text-[10px] text-gray-500 font-bold uppercase mr-2">Quick Scent Presets:</span>
                          <div className="inline-flex flex-wrap gap-1 mt-1">
                            {[
                              'Neem & Aloe Vera',
                              'Citrus Lemon',
                              'Active Lemon',
                              'Lavender Blossom',
                              'Ocean Breeze',
                              'Power Pine',
                              'Fresh Linen',
                              'Aloe Vera & Chamomile',
                              'Rose Blossom',
                              'Unscented Natural'
                            ].map((scent) => {
                              const isSelected = (editingProduct.fragrances || []).includes(scent) || editingProduct.fragrance === scent;
                              return (
                                <button
                                  key={scent}
                                  type="button"
                                  onClick={() => {
                                    const current = editingProduct.fragrances || (editingProduct.fragrance ? [editingProduct.fragrance] : []);
                                    let next: string[];
                                    if (current.includes(scent)) {
                                      next = current.filter(s => s !== scent);
                                    } else {
                                      next = [...current, scent];
                                    }
                                    setEditingProduct({
                                      ...editingProduct,
                                      fragrances: next,
                                      fragrance: next[0] || ''
                                    });
                                  }}
                                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                                    isSelected
                                      ? 'bg-[#7a49a6] text-white font-bold'
                                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                                  }`}
                                >
                                  {isSelected ? `✓ ${scent}` : `+ ${scent}`}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={editingProduct.shortDescription}
                          onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Full Description</label>
                        <textarea
                          rows={4}
                          value={editingProduct.fullDescription}
                          onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>

                      {/* Product Thumbnail & 7 to 8 Side Post Gallery Images */}
                      <div className="pt-2 border-t border-gray-200 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block font-bold uppercase tracking-wide">
                              Main Product Thumbnail Image
                            </label>
                            {editingProduct.images.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...editingProduct.images];
                                  copy.splice(0, 1);
                                  setEditingProduct({ ...editingProduct, images: copy });
                                  triggerNotice('success', 'Thumbnail removed');
                                }}
                                className="text-xs text-[#ff675d] font-bold hover:underline cursor-pointer"
                              >
                                Delete Thumbnail
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-300 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={editingProduct.images[0] || 'https://via.placeholder.com/150'}
                                alt="Thumbnail"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 w-full flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter path (e.g. /assets/products/Lemon-Handwash01.jpg) or web URL"
                                value={editingProduct.images[0] || ''}
                                onChange={(e) => {
                                  const copy = [...editingProduct.images];
                                  copy[0] = e.target.value;
                                  setEditingProduct({ ...editingProduct, images: copy });
                                }}
                                className="flex-1 p-2 border border-gray-300 font-mono text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setAssetPickerTarget({ type: 'thumbnail' })}
                                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-[#7a49a6] text-[#7a49a6] text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer transition-colors shadow-2xs"
                                title="Choose image from /assets folder"
                              >
                                <FolderOpen className="w-4 h-4" />
                                <span>Browse Public Assets</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 7 to 8 Side Post Gallery Images */}
                        <div className="p-3.5 bg-gray-50 border border-gray-200 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <label className="block font-bold uppercase tracking-wide">
                                Side Post Images for Product Detail Page ({editingProduct.images.length} / 8 Slots)
                              </label>
                              <span className="text-[11px] text-gray-500">
                                Provision to add and manage up to 8 multi-angle views and packaging images from /assets folder
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setAssetPickerTarget({ type: 'side-post-add' })}
                                className="text-[11px] bg-purple-100 hover:bg-purple-200 border border-[#7a49a6] text-[#7a49a6] px-2.5 py-1 font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                                title="Pick from /assets and add to next side slot"
                              >
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span>+ Add from Public Assets</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const presets = [
                                    editingProduct.images[0] || '/assets/products/Orange Wet Wipes.jpg',
                                    '/assets/products/Lemon-Handwash01.jpg',
                                    '/assets/products/Lemon Bodywash 5L.jpg',
                                    '/assets/products/1L Dish Wash Pouch.jpg',
                                    '/assets/products/Glass-Cleaner 1L.jpg',
                                    '/assets/products/Top Load - Liquid Matic 2L.jpg',
                                    '/assets/products/Toilet-Cleaner 1L.jpg',
                                    '/assets/products/Sanitizer.jpg'
                                  ];
                                  setEditingProduct({ ...editingProduct, images: presets });
                                  triggerNotice('success', 'Loaded 8 side post angle presets from /assets!');
                                }}
                                className="text-[11px] bg-white border border-gray-300 text-gray-700 px-2 py-1 font-bold hover:bg-gray-100 cursor-pointer"
                              >
                                Auto-Fill 8 Angle Presets
                              </button>
                              {editingProduct.images.length < 8 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct({
                                      ...editingProduct,
                                      images: [...editingProduct.images, '']
                                    });
                                  }}
                                  className="text-[11px] bg-[#7a49a6] text-white px-2.5 py-1 font-bold hover:bg-[#5f3786] cursor-pointer"
                                >
                                  + Add Slot
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Visual Grid of up to 8 slots */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {editingProduct.images.map((imgUrl, idx) => (
                              <div key={idx} className="bg-white border border-gray-300 p-2.5 flex items-start gap-3">
                                <div className="w-14 h-14 bg-gray-50 border border-gray-200 p-1 shrink-0 flex items-center justify-center">
                                  {imgUrl ? (
                                    <img src={imgUrl} alt={`Slot ${idx + 1}`} className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[10px] text-gray-400">Empty</span>
                                  )}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase block">
                                      Side View Slot {idx + 1} of 8 {idx === 0 && '(Primary / Thumbnail)'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copy = editingProduct.images.filter((_, i) => i !== idx);
                                        setEditingProduct({ ...editingProduct, images: copy });
                                        triggerNotice('success', `Removed side post image #${idx + 1}`);
                                      }}
                                      className="text-[#ff675d] hover:underline text-[11px] font-bold cursor-pointer"
                                      title="Delete this side post image"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="e.g. /assets/products/..."
                                      value={imgUrl}
                                      onChange={(e) => {
                                        const copy = [...editingProduct.images];
                                        copy[idx] = e.target.value;
                                        setEditingProduct({ ...editingProduct, images: copy });
                                      }}
                                      className="flex-1 text-xs p-1.5 border border-gray-300 font-mono"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setAssetPickerTarget({ type: 'side-post', slotIndex: idx })}
                                      className="px-2 py-1 bg-purple-50 hover:bg-purple-100 border border-[#7a49a6] text-[#7a49a6] text-[11px] font-bold flex items-center space-x-1 shrink-0 cursor-pointer"
                                      title="Select image from /assets folder"
                                    >
                                      <FolderOpen className="w-3 h-3" />
                                      <span>Browse Asset</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold mb-1">Amazon URL</label>
                          <input
                            type="text"
                            placeholder="https://amazon.in/..."
                            value={editingProduct.amazonUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, amazonUrl: e.target.value })}
                            className="w-full p-2 border border-gray-300 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Zepto URL</label>
                          <input
                            type="text"
                            placeholder="https://zeptonow.com/..."
                            value={editingProduct.zeptoUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, zeptoUrl: e.target.value })}
                            className="w-full p-2 border border-gray-300 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Blinkit URL</label>
                          <input
                            type="text"
                            placeholder="https://blinkit.com/..."
                            value={editingProduct.blinkitUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, blinkitUrl: e.target.value })}
                            className="w-full p-2 border border-gray-300 font-mono text-sm"
                          />
                        </div>
                      </div>

                      {/* Variant editor */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block font-bold uppercase tracking-wide">Variants List</label>
                          <span className="text-[10px] text-gray-500">Each variant packaging size populates category size filters</span>
                        </div>
                        <div className="space-y-2">
                          {editingProduct.variants.map((v, i) => (
                            <div key={v.id} className="grid grid-cols-5 gap-2 bg-gray-50 p-2 border border-gray-200 items-center">
                              <input
                                type="text"
                                placeholder="Variant Name"
                                value={v.name}
                                onChange={(e) => {
                                  const copy = [...editingProduct.variants];
                                  copy[i].name = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: copy });
                                }}
                                className="p-1.5 bg-white border border-gray-300 text-xs"
                                title="Variant Name"
                              />
                              <input
                                type="text"
                                placeholder="Packaging Size (e.g. 1L, 5L)"
                                value={v.packagingSize || ''}
                                onChange={(e) => {
                                  const copy = [...editingProduct.variants];
                                  copy[i].packagingSize = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: copy });
                                }}
                                className="p-1.5 bg-white border border-gray-300 text-xs font-mono"
                                title="Packaging Size for Filters"
                              />
                              <input
                                type="text"
                                placeholder="SKU"
                                value={v.sku}
                                onChange={(e) => {
                                  const copy = [...editingProduct.variants];
                                  copy[i].sku = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: copy });
                                }}
                                className="p-1.5 bg-white border border-gray-300 font-mono text-xs"
                              />
                              <input
                                type="number"
                                placeholder="Price"
                                value={v.sellingPrice}
                                onChange={(e) => {
                                  const copy = [...editingProduct.variants];
                                  copy[i].sellingPrice = parseFloat(e.target.value) || 0;
                                  setEditingProduct({ ...editingProduct, variants: copy });
                                }}
                                className="p-1.5 bg-white border border-gray-300 text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = editingProduct.variants.filter((_, idx) => idx !== i);
                                  setEditingProduct({ ...editingProduct, variants: copy });
                                }}
                                className="text-[#ff675d] font-bold hover:underline text-right pr-2 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              const newVar = {
                                id: `var-${Date.now()}-${editingProduct.variants.length}`,
                                name: '1 Litre Refill Pouch',
                                sku: `WIZ-1L-${Math.floor(100 + Math.random() * 900)}`,
                                regularPrice: editingProduct.regularPrice * 2,
                                sellingPrice: editingProduct.sellingPrice * 1.8,
                                stock: 50,
                                packagingSize: '1 Litre'
                              };
                              setEditingProduct({
                                ...editingProduct,
                                variants: [...editingProduct.variants, newVar]
                              });
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 font-bold uppercase text-[11px] border border-gray-300"
                          >
                            + Add Variant
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 pt-3">
                        <label className="flex items-center space-x-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.published}
                            onChange={(e) => setEditingProduct({ ...editingProduct, published: e.target.checked })}
                          />
                          <span>Published</span>
                        </label>
                        <label className="flex items-center space-x-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.isBestseller}
                            onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                          />
                          <span>Bestseller</span>
                        </label>
                        <label className="flex items-center space-x-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.isSoldout}
                            onChange={(e) => setEditingProduct({ ...editingProduct, isSoldout: e.target.checked })}
                          />
                          <span>Soldout</span>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 border border-gray-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSavingProduct}
                          onClick={handleSaveProduct}
                          className="px-6 py-2 bg-[#7a49a6] hover:bg-[#5f3786] text-white font-bold uppercase tracking-wider disabled:opacity-60 flex items-center space-x-2 cursor-pointer transition-colors shadow-sm"
                        >
                          {isSavingProduct ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving Product...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Save Product</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Public Assets Picker Modal for Thumbnail & Side Posts */}
                    <PublicAssetPickerModal
                      isOpen={assetPickerTarget !== null}
                      title={
                        assetPickerTarget?.type === 'thumbnail'
                          ? 'Select Main Product Thumbnail'
                          : assetPickerTarget?.type === 'side-post'
                          ? `Select Side Post Image (Slot #${assetPickerTarget.slotIndex + 1} of 8)`
                          : 'Add Side Post Image from Public Assets'
                      }
                      subtitle="Choose any genuine product picture from /assets or /assets/products repository"
                      currentValue={
                        assetPickerTarget?.type === 'thumbnail'
                          ? editingProduct.images[0] || ''
                          : assetPickerTarget?.type === 'side-post'
                          ? editingProduct.images[assetPickerTarget.slotIndex] || ''
                          : ''
                      }
                      onSelect={(assetPath) => {
                        if (assetPickerTarget?.type === 'thumbnail') {
                          const copy = [...editingProduct.images];
                          if (copy.length === 0) copy.push(assetPath);
                          else copy[0] = assetPath;
                          setEditingProduct({ ...editingProduct, images: copy });
                          triggerNotice('success', `Updated thumbnail to ${assetPath}`);
                        } else if (assetPickerTarget?.type === 'side-post') {
                          const copy = [...editingProduct.images];
                          copy[assetPickerTarget.slotIndex] = assetPath;
                          setEditingProduct({ ...editingProduct, images: copy });
                          triggerNotice('success', `Updated Side Post #${assetPickerTarget.slotIndex + 1} to ${assetPath}`);
                        } else if (assetPickerTarget?.type === 'side-post-add') {
                          if (editingProduct.images.length >= 8) {
                            triggerNotice('error', 'Maximum 8 side post images allowed.');
                          } else {
                            setEditingProduct({
                              ...editingProduct,
                              images: [...editingProduct.images, assetPath]
                            });
                            triggerNotice('success', `Added side post image ${assetPath}`);
                          }
                        }
                      }}
                      onClose={() => setAssetPickerTarget(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: CATEGORIES CRUD
              ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Categories Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Organize store hierarchy and navigation taxonomies</p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategory({
                      id: `cat-${Date.now()}`,
                      name: '',
                      slug: '',
                      description: '',
                      image: 'https://images.unsplash.com/photo-1608248597359-00f735878484?w=600&auto=format&fit=crop&q=80',
                      order: categories.length + 1,
                      published: true,
                      itemsCount: 0
                    });
                  }}
                  className="bg-[#7a49a6] hover:bg-[#5f3786] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Categories Table */}
              <div className="bg-white border border-gray-300 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold uppercase">
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Category Name</th>
                      <th className="py-3 px-4">Slug</th>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img src={c.image} alt={c.name} className="w-10 h-10 object-cover border" />
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-gray-500">{c.slug}</td>
                        <td className="py-3 px-4 text-gray-700">{c.order}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold ${
                              c.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {c.published ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingCategory({ ...c })}
                            className="text-[#7a49a6] hover:underline font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c)}
                            className="text-[#ff675d] hover:underline font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Editing Category Modal */}
              {editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white max-w-md w-full p-6 border border-gray-300 shadow-2xl">
                    <h3 className="font-bold text-base mb-4">
                      {editingCategory.name ? `Edit: ${editingCategory.name}` : 'New Category'}
                    </h3>
                    <form
                      onSubmit={handleSaveCategory}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={editingCategory.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            setEditingCategory({ ...editingCategory, name, slug });
                          }}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Slug *</label>
                        <input
                          type="text"
                          required
                          value={editingCategory.slug}
                          onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                          className="w-full p-2 border border-gray-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Image URL / Public Assets Path</label>
                        <input
                          type="text"
                          value={editingCategory.image}
                          onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                          placeholder="e.g. /assets/... or https://..."
                          className="w-full p-2 border border-gray-300 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>
                      <div className="pt-3 flex justify-end space-x-2">
                        <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1.5 border">
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSavingCategory}
                          onClick={handleSaveCategory}
                          className="px-4 py-1.5 bg-[#7a49a6] hover:bg-[#5f3786] text-white font-bold disabled:opacity-60 flex items-center space-x-1.5 cursor-pointer transition-colors"
                        >
                          {isSavingCategory ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save Category</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: HEADER BANNERS & CAROUSEL (Matches WiZ-H-Banner03.jpg)
              ========================================================================= */}
          {activeTab === 'banners' && settings && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Header Banners &amp; Hero Carousel
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Provision to add, edit, or delete header banner background images, product dropper thumbnails, and slide controls
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={async () => {
                      const refBanner: HeaderBanner = {
                        id: `banner-ref-${Date.now()}`,
                        title: 'Pure Skin Science',
                        subtitle: 'Carefully crafted ingredients that nourish deeply and support healthy skin balance.',
                        imageUrl: '/assets/aistudio/WiZ-H-Banner03.jpg',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
                        buttonText: 'EXPLORE PRODUCTS',
                        buttonLink: '/shop',
                        nextLabel: 'Skin Essentials',
                        isActive: true,
                        order: (settings.headerBanners?.length || 0) + 1
                      };
                      const updated = {
                        ...settings,
                        headerBanners: [...(settings.headerBanners || []), refBanner]
                      };
                      await saveGeneralSettings(updated);
                      setSettings(updated);
                      triggerNotice('success', 'Added Reference Pure Skin Science Banner!');
                    }}
                    className="bg-black hover:bg-gray-800 text-white py-2 px-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#ff675d]" />
                    <span>+ Add Attached Header Banner</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingBanner({
                        id: `banner-${Date.now()}`,
                        title: 'Pure Skin Science',
                        subtitle: 'Carefully crafted ingredients that nourish deeply and support healthy skin balance.',
                        imageUrl: '/assets/aistudio/WiZ-H-Banner03.jpg',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
                        buttonText: 'EXPLORE PRODUCTS',
                        buttonLink: '/shop',
                        nextLabel: 'Skin Essentials',
                        isActive: true,
                        order: (settings.headerBanners?.length || 0) + 1
                      });
                    }}
                    className="bg-[#7a49a6] hover:bg-[#5f3786] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Custom Banner</span>
                  </button>
                </div>
              </div>

              {/* Banners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(settings.headerBanners || []).map((b, idx) => (
                  <div key={b.id} className="bg-white border border-gray-300 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Banner Preview */}
                      <div className="relative h-44 bg-neutral-900 overflow-hidden">
                        <img
                          src={b.imageUrl || '/assets/aistudio/WiZ-H-Banner03.jpg'}
                          alt={b.title}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-[#d5c7b7] p-1 shrink-0 border border-white/50">
                              <img src={b.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-white text-xs font-bold truncate drop-shadow-sm">{b.title}</span>
                          </div>
                        </div>

                        <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5">
                          Slide #{idx + 1}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-gray-900">{b.title}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                            {b.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-2">{b.subtitle}</p>
                        <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                          Button: <strong>{b.buttonText}</strong> → <span className="font-mono">{b.buttonLink}</span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Next Label: <strong>{b.nextLabel}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
                      <button
                        onClick={async () => {
                          const updatedBanners = (settings.headerBanners || []).map((item) =>
                            item.id === b.id ? { ...item, isActive: !item.isActive } : item
                          );
                          const updated = { ...settings, headerBanners: updatedBanners };
                          await saveGeneralSettings(updated);
                          setSettings(updated);
                          triggerNotice('success', `Banner status toggled`);
                        }}
                        className="text-gray-700 hover:text-black font-semibold"
                      >
                        {b.isActive ? 'Disable' : 'Enable'}
                      </button>

                      <div className="space-x-3">
                        <button
                          onClick={() => setEditingBanner({ ...b })}
                          className="text-[#7a49a6] hover:underline font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete header banner "${b.title}"?`)) {
                              const filtered = (settings.headerBanners || []).filter((item) => item.id !== b.id);
                              const updated = { ...settings, headerBanners: filtered };
                              await saveGeneralSettings(updated);
                              setSettings(updated);
                              triggerNotice('success', 'Header banner deleted');
                            }
                          }}
                          className="text-[#ff675d] hover:underline font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* =========================================================================
                  STOREFRONT SECTIONS MEDIA MANAGEMENT (Bestsellers, Personal Care, Essentials, Blogs)
                  ========================================================================= */}
              <div className="mt-10 pt-8 border-t-2 border-gray-200 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7a49a6]" />
                    <span>Storefront Sections Backgrounds &amp; Media Controls</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Centralized backend controls to add, change, or delete images for sections across the homepage without showing editing options on the live customer storefront.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card 1: Our Bestsellers Background */}
                  <div className="bg-white border border-gray-300 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">1. Our Bestsellers Background</h3>
                        <p className="text-[11px] text-gray-500">Full-width section backdrop for the Bestsellers product slider</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${bestsellerBg ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {bestsellerBg ? 'Image Active' : 'Clean Sage Background'}
                      </span>
                    </div>

                    <div className="relative h-28 bg-[#a8bba8] rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                      {bestsellerBg ? (
                        <img src={bestsellerBg} alt="Bestsellers BG" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-white/80 font-medium">Default Sage Background (No Image)</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-700">Image URL:</label>
                      <input
                        type="text"
                        value={bestsellerBg}
                        onChange={(e) => handleSaveBestsellerBg(e.target.value)}
                        placeholder="https://... or /assets/products/bestseller-background.jpg"
                        className="w-full p-2 border border-gray-300 font-mono text-xs rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleResetBestsellerBg}
                        className="text-xs text-gray-600 hover:text-black font-semibold underline cursor-pointer"
                      >
                        Reset to Default
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteBestsellerBg}
                        className="text-xs text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                      >
                        Delete Background Image
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Our Most Loved Essentials Background */}
                  <div className="bg-white border border-gray-300 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">2. Our Most Loved Essentials Banner</h3>
                        <p className="text-[11px] text-gray-500">Wide banner image behind the interactive Top Picks card</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${lovedEssentialsBg ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {lovedEssentialsBg ? 'Image Active' : 'Gradient Fallback'}
                      </span>
                    </div>

                    <div className="relative h-28 bg-[#f5ede5] rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                      {lovedEssentialsBg ? (
                        <img src={lovedEssentialsBg} alt="Essentials BG" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Warm Gradient (No Image)</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-700">Image URL:</label>
                      <input
                        type="text"
                        value={lovedEssentialsBg}
                        onChange={(e) => handleSaveLovedEssentialsBg(e.target.value)}
                        placeholder="https://... or /assets/products/most-loved-essentials-banner.jpg"
                        className="w-full p-2 border border-gray-300 font-mono text-xs rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleResetLovedEssentialsBg}
                        className="text-xs text-gray-600 hover:text-black font-semibold underline cursor-pointer"
                      >
                        Reset to Default
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteLovedEssentialsBg}
                        className="text-xs text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                      >
                        Delete Banner Image
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Personal Care Section Thumbnails (4 slots) */}
                  <div className="bg-white border border-gray-300 p-5 shadow-xs space-y-3 lg:col-span-2">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">3. Personal Care Section Thumbnails</h3>
                        <p className="text-[11px] text-gray-500">Manage all 4 corner thumbnails flanking the center showcase</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetPcareThumbs}
                        className="text-xs text-gray-600 hover:text-black font-semibold underline cursor-pointer"
                      >
                        Reset All 4 Slots to Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                      {(['left-top', 'left-bottom', 'right-top', 'right-bottom'] as const).map((key) => {
                        const slot = pcareThumbs[key];
                        const label =
                          key === 'left-top' ? 'Left Top' :
                          key === 'left-bottom' ? 'Left Bottom' :
                          key === 'right-top' ? 'Right Top' : 'Right Bottom';

                        return (
                          <div key={key} className="bg-gray-50 p-3 border border-gray-200 rounded space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-800">{label}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{key}</span>
                            </div>

                            <div className="relative aspect-[326/244] bg-white border border-gray-200 rounded overflow-hidden flex items-center justify-center">
                              {slot?.image ? (
                                <img src={slot.image} alt={label} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[11px] text-gray-400">Deleted / Blank</span>
                              )}
                            </div>

                            <input
                              type="text"
                              value={slot?.image || ''}
                              onChange={(e) => handleSavePcareThumb(key, e.target.value)}
                              placeholder="Image URL"
                              className="w-full p-1.5 border border-gray-300 font-mono text-[11px] rounded bg-white"
                            />

                            <div className="flex justify-end">
                              {slot?.image && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePcareThumb(key)}
                                  className="text-[11px] text-red-600 hover:text-red-800 font-bold cursor-pointer"
                                >
                                  Delete Slot Image
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card 4: Latest Blog Posts Thumbnails */}
                  <div className="bg-white border border-gray-300 p-5 shadow-xs space-y-3 lg:col-span-2">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">4. Latest Blog Posts Thumbnails</h3>
                        <p className="text-[11px] text-gray-500">Manage thumbnail images for all 3 featured blog articles</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetBlogThumbs}
                        className="text-xs text-gray-600 hover:text-black font-semibold underline cursor-pointer"
                      >
                        Reset All Blog Thumbnails
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      {blogThumbnails.map((post) => (
                        <div key={post.id} className="bg-gray-50 p-3 border border-gray-200 rounded space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 truncate max-w-[180px]">{post.title}</span>
                            <span className="text-[10px] text-gray-400">#{post.id}</span>
                          </div>

                          <div className="relative aspect-video bg-white border border-gray-200 rounded overflow-hidden flex items-center justify-center">
                            {post.image ? (
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[11px] text-gray-400">No Image (Deleted)</span>
                            )}
                          </div>

                          <input
                            type="text"
                            value={post.image || ''}
                            onChange={(e) => handleSaveBlogThumb(post.id, e.target.value)}
                            placeholder="Image URL (e.g. /assets/blog-post-1.jpg)"
                            className="w-full p-1.5 border border-gray-300 font-mono text-[11px] rounded bg-white"
                          />

                          <div className="flex justify-end">
                            {post.image && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBlogThumb(post.id)}
                                className="text-[11px] text-red-600 hover:text-red-800 font-bold cursor-pointer"
                              >
                                Delete Thumbnail
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Editing Banner Modal */}
              {editingBanner && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white max-w-lg w-full p-6 border border-gray-300 shadow-2xl space-y-4 my-8">
                    <h3 className="font-bold text-base">
                      {editingBanner.title ? `Edit Banner: ${editingBanner.title}` : 'Add New Header Banner'}
                    </h3>

                    {/* Live Preview Box */}
                    <div className="relative h-32 bg-neutral-900 border border-gray-300 overflow-hidden flex items-center p-3">
                      <img
                        src={editingBanner.imageUrl || '/assets/aistudio/WiZ-H-Banner03.jpg'}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                      />
                      <div className="relative flex items-center space-x-3 text-white">
                        <div className="w-12 h-12 bg-[#d5c7b7] p-1 shrink-0 border border-white/60">
                          <img src={editingBanner.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="text-sm font-light drop-shadow-sm">{editingBanner.title}</div>
                          <div className="text-[10px] text-white/80 line-clamp-1">{editingBanner.subtitle}</div>
                        </div>
                      </div>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const existing = settings.headerBanners || [];
                        const index = existing.findIndex((item) => item.id === editingBanner.id);
                        let updatedBanners: HeaderBanner[] = [];
                        if (index >= 0) {
                          updatedBanners = existing.map((item) => (item.id === editingBanner.id ? editingBanner : item));
                        } else {
                          updatedBanners = [...existing, editingBanner];
                        }
                        const updatedSettings = { ...settings, headerBanners: updatedBanners };
                        await saveGeneralSettings(updatedSettings);
                        setSettings(updatedSettings);
                        setEditingBanner(null);
                        triggerNotice('success', 'Header banner saved successfully!');
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold mb-1">Slide Heading / Title *</label>
                        <input
                          type="text"
                          required
                          value={editingBanner.title}
                          onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Subtitle / Description</label>
                        <textarea
                          rows={2}
                          value={editingBanner.subtitle}
                          onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold">Hero Background Image URL *</label>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBanner({
                                ...editingBanner,
                                imageUrl: '/assets/aistudio/WiZ-H-Banner03.jpg'
                              });
                            }}
                            className="text-[10px] text-[#7a49a6] font-bold hover:underline"
                          >
                            Use Reference Image (/assets/aistudio/WiZ-H-Banner03.jpg)
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={editingBanner.imageUrl}
                          onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                          className="w-full p-2 border border-gray-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Product Dropper / Thumbnail Image URL</label>
                        <input
                          type="text"
                          value={editingBanner.thumbnailUrl || ''}
                          onChange={(e) => setEditingBanner({ ...editingBanner, thumbnailUrl: e.target.value })}
                          className="w-full p-2 border border-gray-300 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">Button Text</label>
                          <input
                            type="text"
                            value={editingBanner.buttonText}
                            onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                            className="w-full p-2 border border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Button Link</label>
                          <input
                            type="text"
                            value={editingBanner.buttonLink}
                            onChange={(e) => setEditingBanner({ ...editingBanner, buttonLink: e.target.value })}
                            className="w-full p-2 border border-gray-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Next Slide Title / Label</label>
                        <input
                          type="text"
                          value={editingBanner.nextLabel}
                          onChange={(e) => setEditingBanner({ ...editingBanner, nextLabel: e.target.value })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <label className="flex items-center space-x-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingBanner.isActive}
                            onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                          />
                          <span>Active on Homepage Hero Carousel</span>
                        </label>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                        <button type="button" onClick={() => setEditingBanner(null)} className="px-3 py-1.5 border">
                          Cancel
                        </button>
                        <button type="submit" className="px-4 py-1.5 bg-[#7a49a6] text-white font-bold">
                          Save Banner
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: ORDERS & ENQUIRIES
              ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Enquiries</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Manage customer purchase requests and update status</p>
                </div>

                <button
                  onClick={handleExportOrdersCSV}
                  className="bg-black hover:bg-[#7a49a6] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 self-start"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by order #, customer, phone, city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="flex-1 p-2 text-xs bg-white border border-gray-300"
                />

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="p-2 text-xs bg-white border border-gray-300 font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="Enquiry Created">Enquiry Created</option>
                  <option value="WhatsApp Opened">WhatsApp Opened</option>
                  <option value="Marketplace Redirected">Marketplace Redirected</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Confirmed by Admin">Confirmed by Admin</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-gray-300 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold uppercase">
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">WhatsApp Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{o.orderNumber}</td>
                        <td className="py-3 px-4 text-gray-500">{o.createdAt?.split('T')[0]}</td>
                        <td className="py-3 px-4">
                          <strong className="block text-gray-900">{o.customerName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">{o.customerPhone}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{o.city}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {o.items.map((i) => `${i.productName} (${i.variantName}) × ${i.quantity}`).join(', ')}
                        </td>
                        <td className="py-3 px-4 font-bold">₹{o.finalTotal.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as OrderEnquiry['status'];
                              await updateOrderStatus(o.id, newStatus);
                              setOrders(orders.map((item) => (item.id === o.id ? { ...item, status: newStatus } : item)));
                              triggerNotice('success', `Status updated to ${newStatus}`);
                            }}
                            className="p-1 border border-gray-300 bg-white text-[11px] font-semibold"
                          >
                            <option value="Enquiry Created">Enquiry Created</option>
                            <option value="WhatsApp Opened">WhatsApp Opened</option>
                            <option value="Follow-up Required">Follow-up Required</option>
                            <option value="Confirmed by Admin">Confirmed by Admin</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${o.customerName}, this is regarding your WiZ order enquiry #${o.orderNumber}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white px-2.5 py-1 text-[11px] font-bold uppercase inline-flex items-center space-x-1"
                          >
                            <MessageSquare className="w-3 h-3 fill-current" />
                            <span>Message</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: BULK B2B ENQUIRIES
              ========================================================================= */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">B2B Bulk Enquiries</h1>
                <p className="text-xs text-gray-500 mt-0.5">Corporate &amp; institutional volume supply requests</p>
              </div>

              <div className="bg-white border border-gray-300 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold uppercase">
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Packaging &amp; Qty</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bulkEnquiries.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-gray-900">{b.companyName}</td>
                        <td className="py-3 px-4 text-gray-700">{b.contactPerson}</td>
                        <td className="py-3 px-4">
                          <span className="block font-mono text-gray-900">{b.phone}</span>
                          <span className="text-[11px] text-gray-500">{b.email}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{b.productCategory}</td>
                        <td className="py-3 px-4">
                          <strong className="block">{b.variantPackaging}</strong>
                          <span className="text-[11px] text-gray-500">{b.requiredQuantity} ({b.frequency})</span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={b.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as BulkEnquiry['status'];
                              await updateBulkEnquiryStatus(b.id, newStatus);
                              setBulkEnquiries(bulkEnquiries.map((item) => (item.id === b.id ? { ...item, status: newStatus } : item)));
                              triggerNotice('success', `Bulk enquiry updated to ${newStatus}`);
                            }}
                            className="p-1 border border-gray-300 bg-white text-[11px] font-semibold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quotation Sent">Quotation Sent</option>
                            <option value="Closed">Closed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: CATEGORIES CRUD
              ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Categories</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Manage store product classifications</p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategory({
                      id: `cat-${Date.now()}`,
                      name: '',
                      slug: '',
                      description: '',
                      image: 'https://images.unsplash.com/photo-1608248597359-00f735878484?w=600&auto=format&fit=crop&q=80',
                      order: categories.length + 1,
                      published: true
                    });
                  }}
                  className="bg-[#7a49a6] hover:bg-[#5f3786] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white border border-gray-300 p-4 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-3">
                      <img src={c.image} alt={c.name} className="w-12 h-12 object-cover bg-gray-50 border p-1" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{c.name}</h4>
                        <span className="text-[11px] text-gray-400 font-mono">slug: {c.slug}</span>
                      </div>
                    </div>
                    <div className="space-x-2 text-xs">
                      <button
                        onClick={() => setEditingCategory({ ...c })}
                        className="text-[#7a49a6] font-bold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete category "${c.name}"?`)) {
                            await deleteCategory(c.id);
                            setCategories(categories.filter((item) => item.id !== c.id));
                            triggerNotice('success', 'Category deleted');
                          }
                        }}
                        className="text-[#ff675d] font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white max-w-md w-full p-6 border border-gray-300 shadow-2xl">
                    <h3 className="font-bold text-base mb-4">Edit Category</h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await saveCategory(editingCategory);
                        setEditingCategory(null);
                        triggerNotice('success', 'Category saved!');
                        loadAllData();
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={editingCategory.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            setEditingCategory({ ...editingCategory, name, slug });
                          }}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Slug</label>
                        <input
                          type="text"
                          required
                          value={editingCategory.slug}
                          onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                          className="w-full p-2 border border-gray-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Image URL / Public Assets Path</label>
                        <input
                          type="text"
                          value={editingCategory.image}
                          onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                          placeholder="e.g. /assets/... or https://..."
                          className="w-full p-2 border border-gray-300 font-mono text-sm"
                        />
                      </div>
                      <div className="pt-3 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1.5 border"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#7a49a6] text-white font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: COUPONS
              ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Coupons &amp; Promo Codes</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Manage cart discounts and volume promotions</p>
                </div>

                <button
                  onClick={() => {
                    setEditingCoupon({
                      id: `coup-${Date.now()}`,
                      code: 'NEWCODE',
                      discountType: 'percentage',
                      discountValue: 10,
                      minCartValue: 499,
                      maxDiscount: 100,
                      usageLimit: 500,
                      usedCount: 0,
                      isActive: true
                    });
                  }}
                  className="bg-[#7a49a6] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-white border border-gray-300 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-black text-gray-900">{c.code}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      <div>Discount: <strong>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</strong></div>
                      <div>Min Cart: <strong>₹{c.minCartValue}</strong></div>
                      <div>Used: <strong>{c.usedCount} times</strong></div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                      <button
                        onClick={async () => {
                          const updated = { ...c, isActive: !c.isActive };
                          await saveCoupon(updated);
                          setCoupons(coupons.map((item) => (item.id === c.id ? updated : item)));
                          triggerNotice('success', 'Coupon status updated');
                        }}
                        className="text-[#7a49a6] font-bold hover:underline"
                      >
                        {c.isActive ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Delete coupon ${c.code}?`)) {
                            setCoupons(coupons.filter((item) => item.id !== c.id));
                            try {
                              await deleteCoupon(c.id);
                              triggerNotice('success', 'Coupon deleted');
                            } catch {
                              triggerNotice('success', 'Coupon deleted locally');
                            }
                          }
                        }}
                        className="text-[#ff675d] font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingCoupon && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white max-w-md w-full p-6 border border-gray-300 shadow-2xl">
                    <h3 className="font-bold text-base mb-4">Create / Edit Coupon</h3>
                    <form
                      onSubmit={handleSaveCoupon}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold mb-1">Coupon Code *</label>
                        <input
                          type="text"
                          required
                          value={editingCoupon.code}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                          className="w-full p-2 border border-gray-300 font-mono uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">Discount Type</label>
                          <select
                            value={editingCoupon.discountType}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                            className="w-full p-2 border border-gray-300"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Value</label>
                          <input
                            type="number"
                            value={editingCoupon.discountValue}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: parseFloat(e.target.value) || 0 })}
                            className="w-full p-2 border border-gray-300 font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Minimum Cart Value (₹)</label>
                        <input
                          type="number"
                          value={editingCoupon.minCartValue}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, minCartValue: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 border border-gray-300"
                        />
                      </div>
                      <div className="pt-3 flex justify-end space-x-2">
                        <button type="button" onClick={() => setEditingCoupon(null)} className="px-3 py-1.5 border">
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSavingCoupon}
                          onClick={handleSaveCoupon}
                          className="px-4 py-1.5 bg-[#7a49a6] hover:bg-[#5f3786] text-white font-bold disabled:opacity-60 flex items-center space-x-1.5 cursor-pointer transition-colors"
                        >
                          {isSavingCoupon ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: FREEBIES
              ========================================================================= */}
          {activeTab === 'freebies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Freebie Rules</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Complimentary gifts automatically applied to cart thresholds</p>
                </div>

                <button
                  onClick={() => {
                    setEditingFreebie({
                      id: `freeb-${Date.now()}`,
                      title: 'Free 100ml Pocket Sanitizer',
                      description: 'Get free 100ml sanitizer on orders above ₹799',
                      minCartValue: 799,
                      freebieProduct: 'WiZ Instant Sanitizer 100ml',
                      isActive: true
                    });
                  }}
                  className="bg-[#7a49a6] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Freebie Rule</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {freebies.map((f) => (
                  <div key={f.id} className="bg-white border border-gray-300 p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900">{f.title}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${f.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {f.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">{f.description}</p>
                    <div className="text-xs text-[#7a49a6] font-semibold">
                      Min Cart Value: ₹{f.minCartValue} • Freebie: {f.freebieProduct}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2 text-xs">
                      <button
                        onClick={async () => {
                          if (confirm(`Delete freebie rule?`)) {
                            setFreebies(freebies.filter((item) => item.id !== f.id));
                            try {
                              await deleteFreebie(f.id);
                              triggerNotice('success', 'Freebie rule deleted');
                            } catch {
                              triggerNotice('success', 'Freebie rule deleted locally');
                            }
                          }
                        }}
                        className="text-[#ff675d] font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: GOOGLE ADS & ANALYTICS
              ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Google Ads &amp; Analytics</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Integration status, conversion tracking, and real outbound marketplace clicks
                </p>
              </div>

              {/* Status Banner */}
              <div className="bg-white border border-gray-300 p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500"></div>
                  <h3 className="font-bold text-sm text-gray-900 uppercase">
                    Google Ads Integration Status: Ready For OAuth Credentials
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                  Per security requirements, actual Google Ads reporting requires server-side Google OAuth developer credentials. Until credentials are added to environment variables, website outbound clicks and conversions are tracked locally in Firestore.
                </p>
              </div>

              {/* Outbound Marketplace Redirects Log */}
              <div className="bg-white border border-gray-300 p-6 shadow-xs">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">
                  Outbound Marketplace Conversion &amp; Redirect Logs
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#232f3e] text-white p-4 text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-300 block">Amazon Outbound</span>
                    <span className="text-2xl font-black">{amazonClicks}</span>
                  </div>
                  <div className="bg-[#540075] text-white p-4 text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-300 block">Zepto Outbound</span>
                    <span className="text-2xl font-black">{zeptoClicks}</span>
                  </div>
                  <div className="bg-[#f8cb46] text-gray-900 p-4 text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-700 block">Blinkit Outbound</span>
                    <span className="text-2xl font-black">{blinkitClicks}</span>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase">
                        <th className="py-2">Event</th>
                        <th className="py-2">Target URL</th>
                        <th className="py-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analyticsEvents.slice(0, 10).map((evt, i) => (
                        <tr key={i}>
                          <td className="py-2 font-bold font-mono">{evt.eventType}</td>
                          <td className="py-2 text-gray-500 truncate max-w-xs">{evt.target}</td>
                          <td className="py-2 text-gray-400">{evt.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: GENERAL SETTINGS (Fixes and tests settings/general permissions!)
              ========================================================================= */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">General Store Settings</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Brand configuration stored in Firestore <code className="bg-gray-200 px-1 font-mono">settings/general</code>
                </p>
              </div>

              <div className="bg-white border border-gray-300 p-8 shadow-xs">
                <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-bold mb-1.5 uppercase">Website Name</label>
                      <input
                        type="text"
                        value={settings.websiteName}
                        onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1.5 uppercase">Currency Symbol</label>
                      <input
                        type="text"
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-bold mb-1.5 uppercase">Official WhatsApp Number</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1.5 uppercase">Support Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-bold mb-1.5 uppercase">Free Shipping Order Threshold (₹)</label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 border border-gray-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1.5 uppercase">Announcement Bar Text</label>
                      <input
                        type="text"
                        value={settings.announcementText}
                        onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 uppercase">Corporate Office Address</label>
                    <textarea
                      rows={2}
                      value={settings.corporateAddress}
                      onChange={(e) => setSettings({ ...settings, corporateAddress: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 uppercase">Factory Address</label>
                    <textarea
                      rows={2}
                      value={settings.factoryAddress}
                      onChange={(e) => setSettings({ ...settings, factoryAddress: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 bg-white"
                    />
                  </div>

                  {/* Logo Management (Top & Bottom Provision to Add/Delete) */}
                  <div className="p-4 bg-gray-50 border border-gray-300 space-y-4">
                    <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                      WiZ Logo Provision (Top Header &amp; Bottom Footer)
                    </h3>
                    <p className="text-gray-500 text-[11px]">
                      Add, update, or delete the official WiZ logo from the header navigation and footer
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Top Header Logo */}
                      <div className="bg-white p-4 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold uppercase tracking-wider text-xs">
                            Top Header Logo
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.showHeaderLogo !== false}
                              onChange={(e) => setSettings({ ...settings, showHeaderLogo: e.target.checked })}
                            />
                            <span className="font-semibold text-gray-700">Display in Header</span>
                          </label>
                        </div>

                        {/* Live Preview */}
                        <div className="h-16 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center p-2">
                          {settings.headerLogo ? (
                            <img src={resolveAssetUrl(settings.headerLogo)} alt="Header Logo" className="h-10 max-w-full object-contain" />
                          ) : (
                            <span className="text-2xl font-black text-[#7a49a6]">
                              WiZ<span className="text-xs align-super ml-0.5 text-gray-400">®</span> (Text Logo)
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Header Logo Image URL (leave empty for stylized typography)"
                            value={settings.headerLogo || ''}
                            onChange={(e) => setSettings({ ...settings, headerLogo: e.target.value })}
                            className="w-full p-2 border border-gray-300 font-mono text-[11px]"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                headerLogo: '',
                                showHeaderLogo: true
                              });
                              triggerNotice('success', 'Header logo reset to WiZ registered trademark text');
                            }}
                            className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 font-semibold border border-gray-300"
                          >
                            Use Default SVG Text
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                headerLogo: '',
                                showHeaderLogo: false
                              });
                              triggerNotice('success', 'Top Header logo removed / deleted');
                            }}
                            className="text-[11px] text-[#ff675d] hover:underline font-bold"
                          >
                            Delete Header Logo
                          </button>
                        </div>
                      </div>

                      {/* Bottom Footer Logo */}
                      <div className="bg-white p-4 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold uppercase tracking-wider text-xs">
                            Bottom Footer Logo
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.showFooterLogo !== false}
                              onChange={(e) => setSettings({ ...settings, showFooterLogo: e.target.checked })}
                            />
                            <span className="font-semibold text-gray-700">Display in Footer</span>
                          </label>
                        </div>

                        {/* Live Preview */}
                        <div className="h-16 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center p-2">
                          {settings.footerLogo ? (
                            <img src={resolveAssetUrl(settings.footerLogo)} alt="Footer Logo" className="h-10 max-w-full object-contain" />
                          ) : (
                            <span className="text-3xl font-black text-[#7a49a6]">
                              WiZ<span className="text-xs align-super ml-0.5 text-gray-400">®</span> (Brand Logo)
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Footer Logo Image URL (leave empty for brand typography)"
                            value={settings.footerLogo || ''}
                            onChange={(e) => setSettings({ ...settings, footerLogo: e.target.value })}
                            className="w-full p-2 border border-gray-300 font-mono text-[11px]"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                footerLogo: '',
                                showFooterLogo: true
                              });
                              triggerNotice('success', 'Footer logo reset to WiZ brand mark');
                            }}
                            className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 font-semibold border border-gray-300"
                          >
                            Use Default Brand Mark
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                footerLogo: '',
                                showFooterLogo: false
                              });
                              triggerNotice('success', 'Bottom Footer logo removed / deleted');
                            }}
                            className="text-[11px] text-[#ff675d] hover:underline font-bold"
                          >
                            Delete Footer Logo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Image Provision (Add, Change, Delete) */}
                  <div className="p-4 bg-gray-50 border border-gray-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                          Footer Image Provision
                        </h3>
                        <p className="text-gray-500 text-[11px]">
                          Lifestyle or product thumbnail badge displayed in the footer right column
                        </p>
                      </div>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.showFooterImage !== false}
                          onChange={(e) => setSettings({ ...settings, showFooterImage: e.target.checked })}
                        />
                        <span className="font-semibold text-gray-700">Display Footer Image</span>
                      </label>
                    </div>

                    <div className="flex gap-4 items-center bg-white p-3 border border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0 overflow-hidden">
                        {settings.footerImage ? (
                          <img src={settings.footerImage} alt="Footer Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Footer Image URL"
                          value={settings.footerImage || ''}
                          onChange={(e) => setSettings({ ...settings, footerImage: e.target.value })}
                          className="w-full p-2 border border-gray-300 font-mono text-[11px]"
                        />
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                footerImage: '/assets/Fresh Home Care Product Line-1.png',
                                showFooterImage: true
                              });
                              triggerNotice('success', 'Set lifestyle footer image');
                            }}
                            className="text-[11px] bg-gray-100 text-gray-800 px-2 py-1 font-semibold border"
                          >
                            Set Lifestyle Preset
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({
                                ...settings,
                                footerImage: '',
                                showFooterImage: false
                              });
                              triggerNotice('success', 'Footer image deleted');
                            }}
                            className="text-[11px] text-[#ff675d] hover:underline font-bold"
                          >
                            Delete Footer Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu 1 Right Product Thumbnail Highlights Provision */}
                  <div className="p-4 bg-gray-50 border border-gray-300 space-y-4">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                        Full-Width Mega Menu: 1 Right Product Thumbnail Card
                      </h3>
                      <p className="text-gray-500 text-[11px]">
                        Customize or delete the featured product thumbnail image card shown on the right side of each dropdown menu
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['household', 'personal', 'bulk', 'paper', 'offers'].map((menuKey) => {
                        const h: MegaMenuHighlight = settings.megaMenuHighlights?.[menuKey] || {
                          title: 'WiZ Product',
                          subtitle: 'Pure hygiene protection',
                          imageUrl: 'https://images.unsplash.com/photo-1608248597359-00f735878484?w=500&auto=format&fit=crop&q=80',
                          link: '/shop',
                          badge: 'FEATURED',
                          price: '₹99.00'
                        };

                        return (
                          <div key={menuKey} className="bg-white p-3.5 border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between border-b pb-1">
                              <span className="font-bold uppercase text-[11px] text-[#7a49a6]">
                                Dropdown: {menuKey.toUpperCase()}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = { ...(settings.megaMenuHighlights || {}) };
                                  delete copy[menuKey];
                                  setSettings({ ...settings, megaMenuHighlights: copy });
                                  triggerNotice('success', `Reset right product thumbnail for ${menuKey}`);
                                }}
                                className="text-[10px] text-[#ff675d] font-bold hover:underline"
                              >
                                Clear / Reset
                              </button>
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-14 h-14 bg-gray-50 border p-1 shrink-0 flex items-center justify-center">
                                <img src={h.imageUrl} alt={h.title} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  placeholder="Product Title"
                                  value={h.title}
                                  onChange={(e) => {
                                    const copy = { ...(settings.megaMenuHighlights || {}) };
                                    copy[menuKey] = { ...h, title: e.target.value };
                                    setSettings({ ...settings, megaMenuHighlights: copy });
                                  }}
                                  className="w-full p-1 border text-[11px] font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="Thumbnail Image URL"
                                  value={h.imageUrl}
                                  onChange={(e) => {
                                    const copy = { ...(settings.megaMenuHighlights || {}) };
                                    copy[menuKey] = { ...h, imageUrl: e.target.value };
                                    setSettings({ ...settings, megaMenuHighlights: copy });
                                  }}
                                  className="w-full p-1 border text-[10px] font-mono text-gray-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Badge"
                                value={h.badge}
                                onChange={(e) => {
                                  const copy = { ...(settings.megaMenuHighlights || {}) };
                                  copy[menuKey] = { ...h, badge: e.target.value };
                                  setSettings({ ...settings, megaMenuHighlights: copy });
                                }}
                                className="p-1 border text-[10px]"
                              />
                              <input
                                type="text"
                                placeholder="Price"
                                value={h.price}
                                onChange={(e) => {
                                  const copy = { ...(settings.megaMenuHighlights || {}) };
                                  copy[menuKey] = { ...h, price: e.target.value };
                                  setSettings({ ...settings, megaMenuHighlights: copy });
                                }}
                                className="p-1 border text-[10px] font-bold"
                              />
                              <input
                                type="text"
                                placeholder="Link"
                                value={h.link}
                                onChange={(e) => {
                                  const copy = { ...(settings.megaMenuHighlights || {}) };
                                  copy[menuKey] = { ...h, link: e.target.value };
                                  setSettings({ ...settings, megaMenuHighlights: copy });
                                }}
                                className="p-1 border text-[10px]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mega Menu Left-Side Banner Images (Add / Change / Delete) */}
                  <div className="p-4 bg-gray-50 border border-gray-300 space-y-4">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                        Full-Width Mega Menu: Left-Side Banner Images (Add / Change / Delete)
                      </h3>
                      <p className="text-gray-500 text-[11px]">
                        Manage promotional left-side images with title, subtitle, and badge for Household Cleaners, Personal Care, and Paper Products. When deleted, menus adapt to 4 full columns.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { key: 'household', label: 'Household Cleaners', defaultTitle: 'Clean Home, Pure Life', defaultSub: 'Effective cleaners powered by nature', defaultCat: 'handwash' },
                        { key: 'personal', label: 'Personal Care', defaultTitle: 'Gentle on Skin', defaultSub: 'Dermatologically tested formulations', defaultCat: 'bodywash' },
                        { key: 'paper', label: 'Paper Products', defaultTitle: '100% Virgin Pulp', defaultSub: 'Ultra-soft, ultra-absorbent hygiene paper', defaultCat: 'paper-products' }
                      ].map((item) => {
                        const imgConfig = settings.megaMenuLeftImages?.[item.key] || {
                          imageUrl: '',
                          title: item.defaultTitle,
                          subtitle: item.defaultSub,
                          link: `/category/${item.defaultCat}`,
                          badge: 'BESTSELLER',
                          visible: false
                        };

                        const isVisible = imgConfig.visible !== false && Boolean(imgConfig.imageUrl);

                        return (
                          <div key={item.key} className="bg-white p-3.5 border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between border-b pb-1">
                              <span className="font-bold uppercase text-[11px] text-[#7a49a6]">
                                {item.label}
                              </span>
                              {isVisible ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = { ...(settings.megaMenuLeftImages || {}) };
                                    copy[item.key] = { ...imgConfig, visible: false };
                                    setSettings({ ...settings, megaMenuLeftImages: copy });
                                    triggerNotice('success', `Deleted left image for ${item.label}`);
                                  }}
                                  className="text-[10px] text-[#ff675d] font-bold hover:underline"
                                >
                                  Delete Image
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-bold uppercase">No Image (4 Cols)</span>
                              )}
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-14 h-14 bg-gray-50 border p-1 shrink-0 flex items-center justify-center">
                                {isVisible ? (
                                  <img src={imgConfig.imageUrl} alt={imgConfig.title} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[9px] text-gray-400 text-center">Hidden / Deleted</span>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  placeholder="Image URL"
                                  value={imgConfig.imageUrl || ''}
                                  onChange={(e) => {
                                    const copy = { ...(settings.megaMenuLeftImages || {}) };
                                    copy[item.key] = { ...imgConfig, imageUrl: e.target.value, visible: true };
                                    setSettings({ ...settings, megaMenuLeftImages: copy });
                                  }}
                                  className="w-full p-1 border text-[10px] font-mono text-gray-600"
                                />
                                <input
                                  type="text"
                                  placeholder="Heading"
                                  value={imgConfig.title || ''}
                                  onChange={(e) => {
                                    const copy = { ...(settings.megaMenuLeftImages || {}) };
                                    copy[item.key] = { ...imgConfig, title: e.target.value };
                                    setSettings({ ...settings, megaMenuLeftImages: copy });
                                  }}
                                  className="w-full p-1 border text-[11px] font-bold"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Subtitle"
                                value={imgConfig.subtitle || ''}
                                onChange={(e) => {
                                  const copy = { ...(settings.megaMenuLeftImages || {}) };
                                  copy[item.key] = { ...imgConfig, subtitle: e.target.value };
                                  setSettings({ ...settings, megaMenuLeftImages: copy });
                                }}
                                className="p-1 border text-[10px]"
                              />
                              <input
                                type="text"
                                placeholder="Badge (e.g. BESTSELLER)"
                                value={imgConfig.badge || ''}
                                onChange={(e) => {
                                  const copy = { ...(settings.megaMenuLeftImages || {}) };
                                  copy[item.key] = { ...imgConfig, badge: e.target.value };
                                  setSettings({ ...settings, megaMenuLeftImages: copy });
                                }}
                                className="p-1 border text-[10px]"
                              />
                            </div>

                            {!isVisible && (
                              <button
                                type="button"
                                onClick={() => {
                                  const presets: Record<string, string> = {
                                    household: '/assets/menu-dd-hhc.jpg',
                                    personal: '/assets/aistudio/menu-dd-pc.jpg',
                                    paper: '/assets/aistudio/menu-dd-paper.jpg',
                                    bulk: '/assets/aistudio/menu-dd-5l.jpg'
                                  };
                                  const copy = { ...(settings.megaMenuLeftImages || {}) };
                                  copy[item.key] = {
                                    ...imgConfig,
                                    imageUrl: presets[item.key] || '/assets/menu-dd-hhc.jpg',
                                    visible: true
                                  };
                                  setSettings({ ...settings, megaMenuLeftImages: copy });
                                  triggerNotice('success', `Added left image for ${item.label}`);
                                }}
                                className="w-full text-center py-1 bg-purple-50 text-[#7a49a6] border border-purple-200 text-[10px] font-bold hover:bg-purple-100"
                              >
                                + Add Left Image (Preset)
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#7a49a6] hover:bg-[#5f3786] text-white py-3 px-8 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      Save Settings to Firestore
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SEO & SITEMAP
              ========================================================================= */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">SEO &amp; Dynamic XML Sitemap</h1>
                <p className="text-xs text-gray-500 mt-0.5">Search engine indexing, sitemap endpoint, and robots.txt</p>
              </div>

              <div className="bg-white border border-gray-300 p-8 shadow-xs space-y-6 text-xs">
                <div className="border border-green-200 bg-green-50/50 p-4">
                  <div className="flex items-center space-x-2 text-green-800 font-bold mb-1">
                    <Check className="w-4 h-4" />
                    <span>Dynamic XML Sitemap Endpoint is Active</span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    The sitemap generator queries indexable products and categories and serves valid XML with Content-Type application/xml.
                  </p>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[#7a49a6] font-bold hover:underline"
                  >
                    <span>View Live /sitemap.xml</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-bold text-gray-900 uppercase mb-1">Robots.txt Directive</h4>
                  <p className="text-gray-600 mb-2">
                    Configured to allow search engine crawling while protecting private admin and checkout paths.
                  </p>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[#7a49a6] font-bold hover:underline"
                  >
                    <span>View Live /robots.txt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
