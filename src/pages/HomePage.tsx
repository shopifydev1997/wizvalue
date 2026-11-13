import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Truck,
  Headphones,
  ShieldCheck,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  X,
  ArrowRight,
  Eye,
  Star,
  Check,
  ShoppingBag,
  Upload,
  ImageIcon
} from 'lucide-react';
import { Product, Category, GeneralSettings, HeaderBanner } from '../types';
import { getProducts, getCategories, getGeneralSettings, resolveAssetUrl } from '../lib/storeService';
import { ProductCard } from '../components/ProductCard';
import { VariantMatrixAccordion } from '../components/VariantMatrixAccordion';
import { QuickViewModal } from '../components/QuickViewModal';
import { ShoppableVideosSection } from '../components/ShoppableVideosSection';
import { useSEO } from '../hooks/useSEO';
import { useCart } from '../context/CartContext';
import { getRecentlyViewed, recordRecentlyViewed } from '../lib/recentlyViewed';

export interface ShoppableVideoItem {
  id: string;
  productTitle: string;
  regularPrice: number;
  sellingPrice: number;
  productImage: string;
  secondaryImage?: string;
  videoPoster: string;
  videoUrl?: string;
  isShopTheLook?: boolean;
  progress?: number;
  productId?: string;
}

export const DEFAULT_SHOPPABLE_VIDEOS: ShoppableVideoItem[] = [
  {
    id: 'shoppable-1',
    productTitle: 'Hand Wash',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/Lavender-Handwash-1L.jpg',
    secondaryImage: '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png',
    videoPoster: '/assets/products/stoppable-video01.jpg',
    isShopTheLook: false,
    progress: 42
  },
  {
    id: 'shoppable-2',
    productTitle: 'Wet Wipes',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/shoppable-thumb-2.jpg',
    videoPoster: '/assets/products/stoppable-video02.jpg',
    isShopTheLook: false,
    progress: 30
  },
  {
    id: 'shoppable-3',
    productTitle: 'Body Wash',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/LilyBodywash 5L.jpg',
    videoPoster: '/assets/products/stoppable-video03.jpg',
    isShopTheLook: true,
    progress: 30
  },
  {
    id: 'shoppable-4',
    productTitle: 'Liquid Matic',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/shoppable-thumb-4.jpg',
    videoPoster: '/assets/products/stoppable-video04.jpg',
    isShopTheLook: false,
    progress: 30
  }
];

export interface BlogPostItem {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  image: string | null;
  imagePosition: 'top' | 'bottom';
}

export const DEFAULT_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'blog-1',
    date: 'February 23, 2026',
    title: 'Glow Naturally With Hydrating Skin Rituals',
    excerpt: 'Healthy, radiant skin begins with one simple principle deep, consistent hydration....',
    tags: ['Facial', 'Lotion', 'Minimal'],
    image: '/assets/Blog01.jpg',
    imagePosition: 'bottom'
  },
  {
    id: 'blog-2',
    date: 'February 23, 2026',
    title: 'Flawless Foundation Secrets For Radiant Skin',
    excerpt: 'When it comes to achieving radiant skin, flawless foundation application...',
    tags: ['Facial', 'Minimal', 'Product'],
    image: '/assets/Blog02.jpg',
    imagePosition: 'top'
  },
  {
    id: 'blog-3',
    date: 'February 23, 2026',
    title: 'Golden Hour Makeup For Effortless Beauty',
    excerpt: 'Golden hour, that magical time of day when the sun...',
    tags: ['Beauty', 'Minimal', 'Product'],
    image: '/assets/Blog03.jpg',
    imagePosition: 'bottom'
  }
];

export interface CustomerReviewItem {
  id: string;
  customerName: string;
  customerRole: string;
  customerAvatar: string;
  reviewText: string;
  customerThumbnail: string | null;
  productTitle: string;
  productImage: string;
  originalPrice: number;
  salePrice: number;
}

export const DEFAULT_CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'review-1',
    customerName: 'Emily Carter',
    customerRole: 'Verified Customer',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    reviewText: 'My skin feels smoother and more balanced. Hydration lasts all day, and my routine finally feels simple, effective, and worth following consistently.',
    customerThumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop&q=80',
    productTitle: 'Hydrating Cleanser',
    productImage: '/assets/products/Lavender-Handwash-1L.jpg',
    originalPrice: 150.0,
    salePrice: 95.0
  },
  {
    id: 'review-2',
    customerName: 'Olivia Bennett',
    customerRole: 'Skincare Enthusiast',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    reviewText: 'Lightweight yet deeply nourishing, these products improved my skin texture, leaving it softer, brighter, and comfortably hydrated throughout the entire day.',
    customerThumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80',
    productTitle: 'Ultra Radiant Serum',
    productImage: '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png',
    originalPrice: 180.0,
    salePrice: 110.0
  },
  {
    id: 'review-3',
    customerName: 'Sophia Martinez',
    customerRole: 'Daily Ritual Lover',
    customerAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
    reviewText: 'After just two weeks of use, my skin barrier feels completely restored and hydrated. It has become the most cherished step of my evening self-care routine.',
    customerThumbnail: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80',
    productTitle: 'Restorative Moisture Creme',
    productImage: '/assets/products/shoppable-thumb-2.jpg',
    originalPrice: 160.0,
    salePrice: 105.0
  }
];

export const HomePage: React.FC = () => {
  useSEO({
    title: 'WiZ Home Hygiene & Personal Care | Official Website',
    description: 'Shop official WiZ Hygiene products online in India. Disinfectant Floor Cleaners, Antibacterial Handwash, Ultra-soft Wet Wipes, Liquid Matic Detergent, 1L Pouches, and 5L Bulk Cans with instant WhatsApp ordering.',
    canonicalUrl: typeof window !== 'undefined' ? window.location.origin : 'https://wizcare.in'
  });

  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'home' | 'personal'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addedNoticeMap, setAddedNoticeMap] = useState<Record<string, boolean>>({});
  const carouselContainerRef = React.useRef<HTMLDivElement>(null);
  const [lovedSlideIndex, setLovedSlideIndex] = useState(1);
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(true);
  const bestsellerScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollBestsellerLeft, setCanScrollBestsellerLeft] = useState(false);
  const [canScrollBestsellerRight, setCanScrollBestsellerRight] = useState(true);


  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 17,
    minutes: 36,
    seconds: 36
  });


  // Latest Blog Posts state with Add/Delete thumbnail support
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() => {
    try {
      const saved = localStorage.getItem('wiz_blog_posts_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            if (p.image === '/assets/blog-post-1.jpg') return { ...p, image: '/assets/Blog01.jpg' };
            if (p.image === '/assets/blog-post-2.jpg') return { ...p, image: '/assets/Blog02.jpg' };
            if (p.image === '/assets/blog-post-3.jpg') return { ...p, image: '/assets/Blog03.jpg' };
            return p;
          });
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_BLOG_POSTS;
  });

  const [activeBlogModal, setActiveBlogModal] = useState<{
    postId: string;
    mode: 'add' | 'edit';
  } | null>(null);

  const [blogImageUrlInput, setBlogImageUrlInput] = useState('');
  const blogFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDeleteBlogThumbnail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = blogPosts.map((p) => (p.id === id ? { ...p, image: null } : p));
    setBlogPosts(updated);
    try {
      localStorage.setItem('wiz_blog_posts_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenBlogModal = (postId: string, mode: 'add' | 'edit', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = blogPosts.find((p) => p.id === postId);
    setBlogImageUrlInput(current?.image || '');
    setActiveBlogModal({ postId, mode });
  };

  const handleSaveBlogThumbnail = (newImageUrl: string) => {
    if (!activeBlogModal) return;
    const updated = blogPosts.map((p) =>
      p.id === activeBlogModal.postId ? { ...p, image: newImageUrl.trim() || null } : p
    );
    setBlogPosts(updated);
    try {
      localStorage.setItem('wiz_blog_posts_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setActiveBlogModal(null);
    setBlogImageUrlInput('');
  };

  const handleResetBlogPosts = () => {
    setBlogPosts(DEFAULT_BLOG_POSTS);
    try {
      localStorage.setItem('wiz_blog_posts_v2', JSON.stringify(DEFAULT_BLOG_POSTS));
    } catch {
      // ignore
    }
  };

  const handleBlogFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSaveBlogThumbnail(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
    getGeneralSettings().then(setSettings);
  }, []);

  // Track and display last 4 products clicked/viewed by the user
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const refreshRecent = () => {
      const stored = getRecentlyViewed();
      if (stored && stored.length > 0) {
        setRecentlyViewedProducts(stored);
      } else if (products && products.length > 0) {
        setRecentlyViewedProducts(products.slice(0, 4));
      }
    };

    refreshRecent();

    const handleRecentUpdate = () => {
      refreshRecent();
    };

    window.addEventListener('wiz_recently_viewed_updated', handleRecentUpdate);
    return () => {
      window.removeEventListener('wiz_recently_viewed_updated', handleRecentUpdate);
    };
  }, [products]);

  // 3 Sliding Banners - Total 3 Banners with Add/Delete Background & Thumbnail Provisions
  interface BannerSlideItem {
    id: string;
    title: string;
    subtitle: string;
    defaultBg: string;
    defaultThumb: string;
    buttonText: string;
    buttonLink: string;
    nextLabel: string;
  }

  const DEFAULT_SLIDING_BANNERS: BannerSlideItem[] = [
    {
      id: 'banner-wet-wipes',
      title: 'Wet Wipes',
      subtitle: 'Lorem ipsum is standard placeholder text used in design, publishing',
      defaultBg: '/assets/aistudio/WiZ-H-Banner01.jpg',
      defaultThumb: '/assets/banner-wet-wipes-thumb.jpg',
      buttonText: 'EXPLORE PRODUCTS',
      buttonLink: '/category/wet-wipes',
      nextLabel: 'Pure Skin Science'
    },
    {
      id: 'banner-pure-skin-science',
      title: 'Pure Skin Science',
      subtitle: 'Carefully crafted ingredients that nourish deeply and support healthy skin balance.',
      defaultBg: '/assets/aistudio/WiZ-H-Banner03.jpg',
      defaultThumb: '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png',
      buttonText: 'EXPLORE PRODUCTS',
      buttonLink: '/category/personal-care',
      nextLabel: 'Our Most Loved Essentials'
    },
    {
      id: 'banner-most-loved',
      title: 'Our Most Loved Essentials',
      subtitle: 'Discover our most-loved essentials, carefully crafted to deliver visible results and keep your skin radiant.',
      defaultBg: '/assets/aistudio/WiZ-H-Banner02.jpg',
      defaultThumb: '/assets/Lemon-Handwash01.jpg',
      buttonText: 'SHOP BESTSELLERS',
      buttonLink: '/shop',
      nextLabel: 'Wet Wipes'
    }
  ];

  const BANNERS_CUSTOM_STORAGE_KEY = 'wiz_sliding_banners_custom_v8';

  // State mapping each banner to its custom/deleted background and thumbnail
  const [bannerCustomMap, setBannerCustomMap] = useState<
    Record<string, { bgImage: string | null; thumbImage: string | null }>
  >(() => {
    try {
      const saved = localStorage.getItem(BANNERS_CUSTOM_STORAGE_KEY) || localStorage.getItem('wiz_sliding_banners_custom_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed['banner-wet-wipes']) {
            if (parsed['banner-wet-wipes'].bgImage === '/assets/aistudio/Header_d4e78f99.jpg') parsed['banner-wet-wipes'].bgImage = '/assets/aistudio/WiZ-H-Banner01.jpg';
            if (parsed['banner-wet-wipes'].thumbImage === '/assets/aistudio/WiZ-H-Banner03.jpg' || parsed['banner-wet-wipes'].thumbImage === '') {
              parsed['banner-wet-wipes'].thumbImage = '/assets/banner-wet-wipes-thumb.jpg';
            }
          }
          if (parsed['banner-pure-skin-science']) {
            if (parsed['banner-pure-skin-science'].bgImage === '/assets/aistudio/WiZ-Website-01_96ef7286.jpg') parsed['banner-pure-skin-science'].bgImage = '/assets/aistudio/WiZ-H-Banner03.jpg';
            if (parsed['banner-pure-skin-science'].thumbImage === '/assets/products/shoppable-secondary-jar.jpg') parsed['banner-pure-skin-science'].thumbImage = '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png';
          }
          if (parsed['banner-most-loved']) {
            if (parsed['banner-most-loved'].bgImage === '/assets/aistudio/hero-banner-02_5e61a67d.jpg') parsed['banner-most-loved'].bgImage = '/assets/aistudio/WiZ-H-Banner02.jpg';
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return {
      'banner-wet-wipes': {
        bgImage: '/assets/aistudio/WiZ-H-Banner01.jpg',
        thumbImage: '/assets/banner-wet-wipes-thumb.jpg'
      },
      'banner-pure-skin-science': {
        bgImage: '/assets/aistudio/WiZ-H-Banner03.jpg',
        thumbImage: '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png'
      },
      'banner-most-loved': {
        bgImage: '/assets/aistudio/WiZ-H-Banner02.jpg',
        thumbImage: '/assets/Lemon-Handwash01.jpg'
      }
    };
  });

  const PRESET_BANNER_BGS = [
    {
      id: 'reference-bg',
      name: 'Wet Wipes Pink Header (Attached Design)',
      url: '/assets/aistudio/WiZ-H-Banner01.jpg'
    },
    {
      id: 'pure-skin-bg',
      name: 'WiZ Pure Skin Science',
      url: '/assets/aistudio/WiZ-H-Banner03.jpg'
    },
    {
      id: 'most-loved-bg',
      name: 'Our Most Loved Essentials',
      url: '/assets/aistudio/WiZ-H-Banner02.jpg'
    },
    {
      id: 'fresh-skincare-bg',
      name: 'Dewy Skin Care Ritual',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1800&auto=format&fit=crop&q=80'
    },
    {
      id: 'botanical-bg',
      name: 'Botanical Moisture & Cleanse',
      url: '/assets/products/Lemon Bodywash 5L.jpg'
    }
  ];

  const PRESET_BANNER_THUMBS = [
    {
      id: 'reference-thumb',
      name: 'Eucalyptus Mint Wet Wipes Pack (Attached Design)',
      url: '/assets/banner-wet-wipes-thumb.jpg'
    },
    {
      id: 'handwash-thumb',
      name: 'WiZ Anti-Bacterial Handwash',
      url: '/assets/Lemon-Handwash01.jpg'
    },
    {
      id: 'liquid-matic-thumb',
      name: 'Liquid Matic Detergent',
      url: '/assets/products/wiz-liquid-matic-card.jpg'
    },
    {
      id: 'dropper-thumb',
      name: 'Pure Nourishing Essence Jar',
      url: '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png'
    }
  ];

  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isThumbModalOpen, setIsThumbModalOpen] = useState(false);
  const [bgUrlInput, setBgUrlInput] = useState('');
  const [thumbUrlInput, setThumbUrlInput] = useState('');
  const [bannerToast, setBannerToast] = useState<string | null>(null);
  const [modalTargetBannerIndex, setModalTargetBannerIndex] = useState<number>(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const bgFileInputRef = React.useRef<HTMLInputElement>(null);
  const thumbFileInputRef = React.useRef<HTMLInputElement>(null);

  const showBannerToast = (msg: string) => {
    setBannerToast(msg);
    setTimeout(() => setBannerToast(null), 3000);
  };

  // 3 Banners Array
  const activeBanners = DEFAULT_SLIDING_BANNERS;
  const currentBanner = activeBanners[currentBannerIndex % activeBanners.length] || activeBanners[0];
  const nextBanner = activeBanners[(currentBannerIndex + 1) % activeBanners.length] || activeBanners[0];

  const DEFAULT_BANNER_BG = '/assets/aistudio/WiZ-H-Banner01.jpg';
  const DEFAULT_BANNER_THUMB = '/assets/banner-wet-wipes-thumb.jpg';

  // Active banner background & thumbnail values
  const activeBannerBg =
    bannerCustomMap[currentBanner.id]?.bgImage !== undefined
      ? bannerCustomMap[currentBanner.id].bgImage
      : currentBanner.defaultBg;

  const activeBannerThumb =
    bannerCustomMap[currentBanner.id]?.thumbImage !== undefined
      ? bannerCustomMap[currentBanner.id].thumbImage
      : currentBanner.defaultThumb;

  const bannerBgImage = activeBannerBg;
  const bannerThumbImage = activeBannerThumb;

  const handleDeleteBannerBg = (bannerId: string = currentBanner.id) => {
    const updated = {
      ...bannerCustomMap,
      [bannerId]: {
        ...bannerCustomMap[bannerId],
        bgImage: null
      }
    };
    setBannerCustomMap(updated);
    try {
      localStorage.setItem(BANNERS_CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showBannerToast(`Background deleted for ${activeBanners.find((b) => b.id === bannerId)?.title || 'Slide'}`);
  };

  const handleSetBannerBg = (url: string, bannerId: string = currentBanner.id) => {
    const updated = {
      ...bannerCustomMap,
      [bannerId]: {
        ...bannerCustomMap[bannerId],
        bgImage: url.trim()
      }
    };
    setBannerCustomMap(updated);
    try {
      localStorage.setItem(BANNERS_CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsBgModalOpen(false);
    setBgUrlInput('');
    showBannerToast(`Background updated for ${activeBanners.find((b) => b.id === bannerId)?.title || 'Slide'}`);
  };

  const handleResetBannerBg = (bannerId: string = currentBanner.id) => {
    const matched = activeBanners.find((b) => b.id === bannerId) || currentBanner;
    handleSetBannerBg(matched.defaultBg, bannerId);
  };

  const handleDeleteBannerThumb = (bannerId: string = currentBanner.id, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = {
      ...bannerCustomMap,
      [bannerId]: {
        ...bannerCustomMap[bannerId],
        thumbImage: null
      }
    };
    setBannerCustomMap(updated);
    try {
      localStorage.setItem(BANNERS_CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showBannerToast(`Thumbnail deleted for ${activeBanners.find((b) => b.id === bannerId)?.title || 'Slide'}`);
  };

  const handleSetBannerThumb = (url: string, bannerId: string = currentBanner.id) => {
    const updated = {
      ...bannerCustomMap,
      [bannerId]: {
        ...bannerCustomMap[bannerId],
        thumbImage: url.trim()
      }
    };
    setBannerCustomMap(updated);
    try {
      localStorage.setItem(BANNERS_CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsThumbModalOpen(false);
    setThumbUrlInput('');
    showBannerToast(`Thumbnail updated for ${activeBanners.find((b) => b.id === bannerId)?.title || 'Slide'}`);
  };

  const handleResetBannerThumb = (bannerId: string = currentBanner.id) => {
    const matched = activeBanners.find((b) => b.id === bannerId) || currentBanner;
    handleSetBannerThumb(matched.defaultThumb, bannerId);
  };

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetBannerBg(reader.result, activeBanners[modalTargetBannerIndex]?.id || currentBanner.id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetBannerThumb(reader.result, activeBanners[modalTargetBannerIndex]?.id || currentBanner.id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  // Auto-advance banner every 7 seconds, pauses when hovered
  useEffect(() => {
    if (activeBanners.length <= 1 || isBannerHovered) return;
    const interval = setInterval(handleNextBanner, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isBannerHovered]);

  // Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Essentials items matching reference attached image WiZ-Website_-_Copy__2__ec2da0db.jpg
  const allEssentialsItems = [
    {
      id: 'wiz-handwash-ref',
      productId: 'prod-handwash',
      title: 'Handwash',
      slug: 'wiz-anti-bacterial-handwash-500ml',
      image: '/assets/products/wiz-handwash-card.jpg',
      regularPrice: 125.00,
      sellingPrice: 99,
      badge: null,
      isSoldout: false,
      category: 'Home Care'
    },
    {
      id: 'wiz-wet-wipes-ref',
      productId: 'prod-wet-wipes',
      title: 'Wet Wipes',
      slug: 'wiz-wet-wipes-80-pulls',
      image: '/assets/products/wiz-wet-wipes-card.jpg',
      regularPrice: 125.00,
      sellingPrice: 99,
      badge: '25% OFF',
      isSoldout: false,
      category: 'Personal Care'
    },
    {
      id: 'wiz-facial-tissue-ref',
      productId: 'prod-facial-tissue',
      title: 'Facial Tissue (Pack of 4)',
      slug: 'wiz-facial-tissue-pack-of-4',
      image: '/assets/products/wiz-facial-tissue-card.jpg',
      regularPrice: 125.00,
      sellingPrice: 99,
      badge: null,
      isSoldout: false,
      category: 'Paper Products'
    },
    {
      id: 'wiz-liquid-matic-ref',
      productId: 'prod-laundry-detergent',
      title: 'Liquid Matic 2 Litre',
      slug: 'wiz-liquid-matic-laundry-detergent-2l',
      image: '/assets/products/wiz-liquid-matic-card.jpg',
      regularPrice: 125.00,
      sellingPrice: 99,
      badge: 'Soldout',
      isSoldout: true,
      category: 'Home Care'
    },
    {
      id: 'wiz-dishwash-ref',
      productId: 'prod-dishwash',
      title: 'Dishwash Gel 750ml',
      slug: 'wiz-power-degreasing-dishwash-gel-750ml',
      image: '/assets/products/1L Dish Wash Pouch.jpg',
      regularPrice: 135.00,
      sellingPrice: 99,
      badge: null,
      isSoldout: false,
      category: 'Home Care'
    },
    {
      id: 'wiz-floor-cleaner-ref',
      productId: 'prod-floor-cleaner',
      title: 'Disinfectant Floor Cleaner',
      slug: 'wiz-disinfectant-floor-cleaner-citrus-750ml',
      image: '/assets/products/Lemon-Floor-Cleaner 1L.jpg',
      regularPrice: 145.00,
      sellingPrice: 110,
      badge: null,
      isSoldout: false,
      category: 'Home Care'
    },
    {
      id: 'wiz-bodywash-ref',
      productId: 'prod-bodywash',
      title: 'Moisturizing Bodywash 300ml',
      slug: 'wiz-moisturizing-bodywash-citrus-splash-300ml',
      image: '/assets/products/Lemon Bodywash 5L.jpg',
      regularPrice: 180.00,
      sellingPrice: 149,
      badge: null,
      isSoldout: false,
      category: 'Personal Care'
    },
    {
      id: 'wiz-sanitizer-ref',
      productId: 'prod-hand-sanitizer',
      title: 'Instant Hand Sanitizer 500ml',
      slug: 'wiz-instant-hand-sanitizer-gel-500ml',
      image: '/assets/products/Sanitizer.jpg',
      regularPrice: 150.00,
      sellingPrice: 120,
      badge: null,
      isSoldout: false,
      category: 'Personal Care'
    }
  ];

  // Category Tab Small Thumbnails state with Add / Delete support
  const DEFAULT_TAB_THUMBNAILS: Record<'all' | 'home' | 'personal', string | null> = {
    all: '/assets/products/handwash.jpg',
    home: '/assets/products/homecare-Thumb.jpg',
    personal: '/assets/products/avatar-all-essentials-1.jpg'
  };

  const TAB_THUMBNAILS_STORAGE_KEY = 'wiz_category_tab_thumbnails_v3';

  const [tabThumbnails, setTabThumbnails] = useState<Record<'all' | 'home' | 'personal', string | null>>(() => {
    try {
      const saved = localStorage.getItem(TAB_THUMBNAILS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.all === '/assets/products/avatar-all-essentials.jpg') parsed.all = '/assets/products/handwash.jpg';
          if (parsed.home === '/assets/products/avatar-home-care.jpg') parsed.home = '/assets/products/homecare-Thumb.jpg';
          if (parsed.personal === '/assets/products/avatar-personal-care.jpg') parsed.personal = '/assets/products/avatar-all-essentials-1.jpg';
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_TAB_THUMBNAILS;
  });

  const [isTabThumbModalOpen, setIsTabThumbModalOpen] = useState(false);
  const [modalTargetTab, setModalTargetTab] = useState<'all' | 'home' | 'personal'>('all');
  const [tabThumbUrlInput, setTabThumbUrlInput] = useState('');
  const [tabThumbToast, setTabThumbToast] = useState<string | null>(null);
  const tabThumbFileInputRef = React.useRef<HTMLInputElement>(null);

  const showTabThumbToast = (msg: string) => {
    setTabThumbToast(msg);
    setTimeout(() => setTabThumbToast(null), 3000);
  };

  const handleDeleteTabThumb = (tabKey: 'all' | 'home' | 'personal', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = {
      ...tabThumbnails,
      [tabKey]: null
    };
    setTabThumbnails(updated);
    try {
      localStorage.setItem(TAB_THUMBNAILS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    const label = tabKey === 'all' ? 'All Essentials' : tabKey === 'home' ? 'Home Care' : 'Personal Care';
    showTabThumbToast(`Thumbnail deleted for "${label}" tab`);
  };

  const handleSetTabThumb = (tabKey: 'all' | 'home' | 'personal', url: string) => {
    const updated = {
      ...tabThumbnails,
      [tabKey]: url.trim() || null
    };
    setTabThumbnails(updated);
    try {
      localStorage.setItem(TAB_THUMBNAILS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsTabThumbModalOpen(false);
    setTabThumbUrlInput('');
    const label = tabKey === 'all' ? 'All Essentials' : tabKey === 'home' ? 'Home Care' : 'Personal Care';
    showTabThumbToast(`Thumbnail updated for "${label}" tab`);
  };

  const handleResetTabThumb = (tabKey: 'all' | 'home' | 'personal') => {
    handleSetTabThumb(tabKey, DEFAULT_TAB_THUMBNAILS[tabKey] || '');
  };

  const handleResetAllTabThumbs = () => {
    setTabThumbnails(DEFAULT_TAB_THUMBNAILS);
    try {
      localStorage.setItem(TAB_THUMBNAILS_STORAGE_KEY, JSON.stringify(DEFAULT_TAB_THUMBNAILS));
    } catch {
      // ignore
    }
    setIsTabThumbModalOpen(false);
    showTabThumbToast('Reset all tab thumbnails to default');
  };

  const handleTabThumbFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetTabThumb(modalTargetTab, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_TAB_THUMBS = [
    {
      id: 'avatar-essentials',
      name: 'WiZ Handwash Badge (All Essentials)',
      url: '/assets/products/handwash.jpg'
    },
    {
      id: 'avatar-home',
      name: 'Lemon Dishwash Glow (Home Care)',
      url: '/assets/products/homecare-Thumb.jpg'
    },
    {
      id: 'avatar-personal',
      name: 'Skincare Natural Radiance (Personal Care)',
      url: '/assets/products/avatar-all-essentials-1.jpg'
    },
    {
      id: 'handwash-orange',
      name: 'WiZ Orange Hand Wash Bottle',
      url: '/assets/Lemon-Handwash01.jpg'
    },
    {
      id: 'wet-wipes-lavender',
      name: 'French Lavender Wet Wipes',
      url: '/assets/products/wiz-wet-wipes-card.jpg'
    },
    {
      id: 'liquid-matic-pack',
      name: 'Liquid Matic Detergent',
      url: '/assets/products/wiz-liquid-matic-card.jpg'
    }
  ];

  const displayedEssentialsItems = allEssentialsItems.filter((item) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'home') return item.category === 'Home Care' || item.category === 'Paper Products';
    if (activeCategoryFilter === 'personal') return item.category === 'Personal Care';
    return true;
  });

  const handlePrevCategoryItems = () => {
    if (carouselContainerRef.current) {
      carouselContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleNextCategoryItems = () => {
    if (carouselContainerRef.current) {
      carouselContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (item: typeof allEssentialsItems[0]) => {
    if (item.isSoldout) return;
    const matched = products.find((p) => p.id === item.productId || p.slug === item.slug);
    const variant = matched?.variants?.[0] || {
      id: 'default',
      name: 'Standard',
      sku: matched?.sku || item.productId,
      regularPrice: item.regularPrice,
      sellingPrice: item.sellingPrice,
      stock: 100,
      packagingSize: ''
    };

    addToCart({
      productId: matched?.id || item.productId,
      productName: matched?.name || item.title,
      slug: matched?.slug || item.slug,
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku,
      unitPrice: item.sellingPrice,
      regularPrice: item.regularPrice,
      quantity: 1,
      image: item.image,
      category: matched?.category || item.category
    });

    setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Dynamic retrieval of backend uploaded products for Most Loved Picks
  const wetWipesProd = products.find((p) =>
    p.category?.toLowerCase() === 'wet wipes' ||
    p.category?.toLowerCase().includes('wipe') ||
    p.name?.toLowerCase().includes('wipe')
  ) || products[0];

  const bodywashProd = products.find((p) =>
    p.category?.toLowerCase() === 'bodywash' ||
    p.category?.toLowerCase().includes('body') ||
    p.name?.toLowerCase().includes('body') ||
    p.name?.toLowerCase().includes('shower')
  ) || products[products.length - 1] || products[0];

  const handwashProd = products.find((p) =>
    p.category?.toLowerCase() === 'handwash' ||
    p.category?.toLowerCase().includes('hand') ||
    p.name?.toLowerCase().includes('hand')
  ) || products[1] || products[0];

  const dishwashProd = products.find((p) =>
    p.category?.toLowerCase() === 'dishwash' ||
    p.category?.toLowerCase().includes('dish') ||
    p.name?.toLowerCase().includes('dish')
  ) || products[2] || products[0];

  const floorCleanerProd = products.find((p) =>
    p.category?.toLowerCase() === 'floor cleaner' ||
    p.category?.toLowerCase().includes('cleaner') ||
    p.name?.toLowerCase().includes('clean') ||
    p.name?.toLowerCase().includes('floor')
  ) || products[3] || products[0];

  // Helper to extract uploaded thumbnail from backend product
  const getBackendThumbnail = (prod: Product | undefined, fallback: string): string => {
    if (!prod) return fallback;
    if (Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) {
      return prod.images[0];
    }
    if ((prod as any).image) return (prod as any).image;
    return fallback;
  };

  // Helper to format price from backend product
  const getBackendPrice = (prod: Product | undefined, fallback: string = '₹99.00'): string => {
    if (prod && typeof prod.sellingPrice === 'number') {
      return `₹${prod.sellingPrice.toFixed(2)}`;
    }
    return fallback;
  };

  // Most Loved Picks slide background state with Add & Delete provisions
  const DEFAULT_LOVED_SLIDE_BGS: Record<string, string> = {
    'personal-care-slide': '/assets/products/Fresh Orange & Aloe Wet Wipes.png',
    'wet-wipes-slide': '/assets/products/WiZ-Wet-Wipes-02.jpg',
    'home-care-slide': '/assets/Lemon Fresh Dishwash Refill Ad.png.png'
  };

  const LOVED_PICKS_BG_STORAGE_KEY = 'wiz_most_loved_bgs_v4';

  const [lovedSlideBgs, setLovedSlideBgs] = useState<Record<string, string | null>>(() => {
    try {
      const saved = localStorage.getItem(LOVED_PICKS_BG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed['wet-wipes-slide'] === '/assets/products/most-loved-slide-1-clean.jpg') {
            parsed['wet-wipes-slide'] = '/assets/products/WiZ-Wet-Wipes-02.jpg';
          }
          if (parsed['personal-care-slide'] === '/assets/products/most-loved-slide-0.jpg') {
            parsed['personal-care-slide'] = '/assets/products/Fresh Orange & Aloe Wet Wipes.png';
          }
          if (parsed['home-care-slide'] === '/assets/products/most-loved-slide-2.jpg') {
            parsed['home-care-slide'] = '/assets/Lemon Fresh Dishwash Refill Ad.png.png';
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_LOVED_SLIDE_BGS;
  });

  const [isLovedBgModalOpen, setIsLovedBgModalOpen] = useState(false);
  const [targetLovedSlideId, setTargetLovedSlideId] = useState<string>('wet-wipes-slide');
  const [lovedBgUrlInput, setLovedBgUrlInput] = useState('');
  const [lovedBgToast, setLovedBgToast] = useState<string | null>(null);
  const lovedBgFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const showLovedBgToast = (msg: string) => {
    setLovedBgToast(msg);
    setTimeout(() => setLovedBgToast(null), 3000);
  };

  const handleSetLovedBg = (slideId: string, url: string) => {
    const updated = {
      ...lovedSlideBgs,
      [slideId]: url.trim() || null
    };
    setLovedSlideBgs(updated);
    try {
      localStorage.setItem(LOVED_PICKS_BG_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsLovedBgModalOpen(false);
    setLovedBgUrlInput('');
    showLovedBgToast('Background image updated successfully');
  };

  const handleDeleteLovedBg = (slideId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = {
      ...lovedSlideBgs,
      [slideId]: null
    };
    setLovedSlideBgs(updated);
    try {
      localStorage.setItem(LOVED_PICKS_BG_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showLovedBgToast('Background image deleted');
  };

  const handleResetLovedBg = (slideId: string) => {
    const defaultUrl = DEFAULT_LOVED_SLIDE_BGS[slideId] || null;
    const updated = {
      ...lovedSlideBgs,
      [slideId]: defaultUrl
    };
    setLovedSlideBgs(updated);
    try {
      localStorage.setItem(LOVED_PICKS_BG_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsLovedBgModalOpen(false);
    showLovedBgToast('Reset slide background to default');
  };

  const handleResetAllLovedBgs = () => {
    setLovedSlideBgs(DEFAULT_LOVED_SLIDE_BGS);
    try {
      localStorage.setItem(LOVED_PICKS_BG_STORAGE_KEY, JSON.stringify(DEFAULT_LOVED_SLIDE_BGS));
    } catch {
      // ignore
    }
    setIsLovedBgModalOpen(false);
    showLovedBgToast('Reset all slide backgrounds to default');
  };

  const handleLovedBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetLovedBg(targetLovedSlideId, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_LOVED_BGS = [
    {
      id: 'preset-wet-wipes',
      name: 'Wet Wipes (Woman with Pack - Reference)',
      url: '/assets/products/WiZ-Wet-Wipes-02.jpg'
    },
    {
      id: 'preset-personal-care',
      name: 'Personal Care (Fresh Orange & Aloe)',
      url: '/assets/products/Fresh Orange & Aloe Wet Wipes.png'
    },
    {
      id: 'preset-home-care',
      name: 'Home Care (Lemon Fresh Dishwash)',
      url: '/assets/Lemon Fresh Dishwash Refill Ad.png.png'
    },
    {
      id: 'preset-bath-glow',
      name: 'Fresh Glow Bath & Wellness',
      url: '/assets/products/wiz-bodywash-card.jpg'
    },
    {
      id: 'preset-pure-pink',
      name: 'WiZ Gentle Care Pink Aesthetic',
      url: '/assets/aistudio/WiZ-H-Banner02.jpg'
    }
  ];

  // Most Loved Picks slides matching the layout design in Most_Loved_Picks_0eb07c1b.jpg
  const lovedSlides = [
    {
      id: 'personal-care-slide',
      title: 'Personal Care',
      subtitle: 'Gentle hydration and nourishing daily care formulated for radiant skin.',
      bgImage: lovedSlideBgs['personal-care-slide'] !== undefined ? lovedSlideBgs['personal-care-slide'] : DEFAULT_LOVED_SLIDE_BGS['personal-care-slide'],
      shopLink: '/category/personal-care',
      products: [
        {
          id: 'card-handwash',
          title: handwashProd?.name || 'Handwash',
          price: getBackendPrice(handwashProd, '₹99.00'),
          image: getBackendThumbnail(handwashProd, '/assets/Lemon-Handwash01.jpg'),
          product: handwashProd
        },
        {
          id: 'card-bodywash-0',
          title: bodywashProd?.name || 'Bodywash',
          price: getBackendPrice(bodywashProd, '₹99.00'),
          image: getBackendThumbnail(bodywashProd, '/assets/products/mini-green-bodywash.jpg'),
          product: bodywashProd
        }
      ]
    },
    {
      id: 'wet-wipes-slide', // Center slide in reference image
      title: 'Wet Wipes',
      subtitle: 'Lorem ipsum is standard placeholder text used',
      bgImage: lovedSlideBgs['wet-wipes-slide'] !== undefined ? lovedSlideBgs['wet-wipes-slide'] : DEFAULT_LOVED_SLIDE_BGS['wet-wipes-slide'],
      shopLink: '/category/wet-wipes',
      products: [
        {
          id: 'card-wet-wipes',
          title: wetWipesProd?.name || 'Wet Wipes',
          price: getBackendPrice(wetWipesProd, '₹99.00'),
          image: getBackendThumbnail(wetWipesProd, '/assets/products/mini-orange-wipes.jpg'),
          product: wetWipesProd
        },
        {
          id: 'card-bodywash',
          title: bodywashProd?.name || 'Bodywash',
          price: getBackendPrice(bodywashProd, '₹99.00'),
          image: getBackendThumbnail(bodywashProd, '/assets/products/mini-green-bodywash.jpg'),
          product: bodywashProd
        }
      ]
    },
    {
      id: 'home-care-slide',
      title: 'Dish Wash & Home Care',
      subtitle: 'Tough on grease, gentle on hands with real lemon power.',
      bgImage: lovedSlideBgs['home-care-slide'] !== undefined ? lovedSlideBgs['home-care-slide'] : DEFAULT_LOVED_SLIDE_BGS['home-care-slide'],
      shopLink: '/category/household-cleaners',
      products: [
        {
          id: 'card-dishwash',
          title: dishwashProd?.name || 'Dishwash Gel',
          price: getBackendPrice(dishwashProd, '₹99.00'),
          image: getBackendThumbnail(dishwashProd, '/assets/products/wiz-liquid-matic-card.jpg'),
          product: dishwashProd
        },
        {
          id: 'card-floor-cleaner',
          title: floorCleanerProd?.name || 'Clean Surface',
          price: getBackendPrice(floorCleanerProd, '₹89.00'),
          image: getBackendThumbnail(floorCleanerProd, '/assets/products/mini-green-bodywash.jpg'),
          product: floorCleanerProd
        }
      ]
    }
  ];

  const handlePrevLovedSlide = () => {
    setLovedSlideIndex((prev) => (prev === 0 ? lovedSlides.length - 1 : prev - 1));
  };

  const handleNextLovedSlide = () => {
    setLovedSlideIndex((prev) => (prev + 1) % lovedSlides.length);
  };

  // Product Categories matching attached Product_Category_ddffba0a.jpg layout
  const DEFAULT_PRODUCT_CATEGORIES = [
    {
      id: 'cat-handwash',
      name: 'Handwash',
      count: '6 items',
      slug: '/category/handwash',
      image: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png'
    },
    {
      id: 'cat-wet-wipes',
      name: 'Wet Wipes',
      count: '6 items',
      slug: '/category/wet-wipes',
      image: '/assets/products/Fresh Lemon Mint Wet Wipes-1.png'
    },
    {
      id: 'cat-hand-sanitizer',
      name: 'Hand Sanitizer',
      count: '4 items',
      slug: '/category/hand-sanitizer',
      image: '/assets/products/Fresh Mint Hand Sanitizer Still Life-1.png'
    },
    {
      id: 'cat-dishwash',
      name: 'Dishwash',
      count: '12 items',
      slug: '/category/dishwash',
      image: '/assets/products/Lemon Fresh Dish Wash Refill Pouch-1.png'
    },
    {
      id: 'cat-floor-cleaner',
      name: 'Floor Cleaner',
      count: '10 items',
      slug: '/category/floor-cleaner',
      image: '/assets/products/Glossy Pink Floor Cleaner Refill Pouch-1.png'
    },
    {
      id: 'cat-liquid-matic',
      name: 'Liquid Matic',
      count: '10 items',
      slug: '/category/laundry-detergent',
      image: '/assets/WiZ Liquid Matic Fresh Laundry Refill.png'
    }
  ];

  const PRODUCT_CATEGORIES_STORAGE_KEY = 'wiz_product_categories_v3';

  const [productCategories, setProductCategories] = useState<typeof DEFAULT_PRODUCT_CATEGORIES>(() => {
    try {
      const saved = localStorage.getItem(PRODUCT_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((cat: any) => {
            if (cat.id === 'cat-handwash' && (cat.image === '/assets/products/cat-handwash.jpg' || !cat.image)) {
              return { ...cat, image: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png' };
            }
            if (cat.id === 'cat-wet-wipes' && (cat.image === '/assets/products/cat-wet-wipes.jpg' || !cat.image)) {
              return { ...cat, image: '/assets/products/Fresh Lemon Mint Wet Wipes-1.png' };
            }
            if (cat.id === 'cat-hand-sanitizer' && (cat.image === '/assets/products/cat-hand-sanitizer.jpg' || !cat.image)) {
              return { ...cat, image: '/assets/products/Fresh Mint Hand Sanitizer Still Life-1.png' };
            }
            if (cat.id === 'cat-dishwash' && (cat.image === '/assets/products/cat-dishwash.jpg' || !cat.image)) {
              return { ...cat, image: '/assets/products/Lemon Fresh Dish Wash Refill Pouch-1.png' };
            }
            if (cat.id === 'cat-floor-cleaner' && (cat.image === '/assets/products/cat-floor-cleaner.jpg' || !cat.image)) {
              return { ...cat, image: '/assets/products/Glossy Pink Floor Cleaner Refill Pouch-1.png' };
            }
            if (cat.id === 'cat-liquid-matic' && (cat.image === '/assets/products/cat-liquid-matic.jpg' || cat.image === '/assets/products/cat-liquid-matic-partial.jpg' || !cat.image)) {
              return { ...cat, image: '/assets/WiZ Liquid Matic Fresh Laundry Refill.png' };
            }
            return cat;
          });
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PRODUCT_CATEGORIES;
  });

  const productCategoryCards = productCategories;

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isCatThumbModalOpen, setIsCatThumbModalOpen] = useState(false);
  const [modalTargetCatId, setModalTargetCatId] = useState<string>('cat-handwash');
  const [catThumbUrlInput, setCatThumbUrlInput] = useState('');
  const [categoryToast, setCategoryToast] = useState<string | null>(null);
  const catThumbFileInputRef = React.useRef<HTMLInputElement>(null);
  const newCatFileInputRef = React.useRef<HTMLInputElement>(null);

  // New Category form state
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    count: '6 items',
    slug: '',
    image: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png'
  });

  const showCategoryToast = (msg: string) => {
    setCategoryToast(msg);
    setTimeout(() => setCategoryToast(null), 3000);
  };

  const handleDeleteCategoryThumb = (catId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = productCategories.map((c) =>
      c.id === catId ? { ...c, image: null as string | null } : c
    );
    setProductCategories(updated as typeof DEFAULT_PRODUCT_CATEGORIES);
    try {
      localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    const catName = productCategories.find((c) => c.id === catId)?.name || 'Category';
    showCategoryToast(`Thumbnail deleted for "${catName}"`);
  };

  const handleSetCategoryThumb = (catId: string, url: string) => {
    const updated = productCategories.map((c) =>
      c.id === catId ? { ...c, image: url.trim() || null } : c
    );
    setProductCategories(updated as typeof DEFAULT_PRODUCT_CATEGORIES);
    try {
      localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsCatThumbModalOpen(false);
    setCatThumbUrlInput('');
    const catName = productCategories.find((c) => c.id === catId)?.name || 'Category';
    showCategoryToast(`Thumbnail updated for "${catName}"`);
  };

  const handleResetCategoryThumb = (catId: string) => {
    const defaultCat = DEFAULT_PRODUCT_CATEGORIES.find((c) => c.id === catId);
    if (defaultCat && defaultCat.image) {
      handleSetCategoryThumb(catId, defaultCat.image);
    } else {
      handleSetCategoryThumb(catId, '/assets/products/Fresh Orange Hand Wash Advertisement-1.png');
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatForm.name.trim()) return;

    const slug = newCatForm.slug.trim()
      ? (newCatForm.slug.startsWith('/category/') ? newCatForm.slug : `/category/${newCatForm.slug.replace(/^\/+/, '')}`)
      : `/category/${newCatForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: newCatForm.name.trim(),
      count: newCatForm.count.trim() || '6 items',
      slug,
      image: newCatForm.image.trim() || '/assets/products/Fresh Orange Hand Wash Advertisement-1.png'
    };

    const updated = [...productCategories, newCategory];
    setProductCategories(updated);
    try {
      localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsAddCatModalOpen(false);
    setNewCatForm({
      name: '',
      count: '6 items',
      slug: '',
      image: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png'
    });
    showCategoryToast(`Category "${newCategory.name}" added successfully`);

    setTimeout(() => {
      if (categoryScrollRef.current) {
        categoryScrollRef.current.scrollTo({ left: 9999, behavior: 'smooth' });
      }
    }, 200);
  };

  const handleDeleteCategory = (catId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (productCategories.length <= 1) {
      alert('You must keep at least one category.');
      return;
    }
    const catName = productCategories.find((c) => c.id === catId)?.name || 'Category';
    const confirmed = window.confirm(`Are you sure you want to remove the category "${catName}"?`);
    if (!confirmed) return;

    const updated = productCategories.filter((c) => c.id !== catId);
    setProductCategories(updated);
    try {
      localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showCategoryToast(`Category "${catName}" removed`);
  };

  const handleResetDefaultCategories = () => {
    setProductCategories(DEFAULT_PRODUCT_CATEGORIES);
    try {
      localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCT_CATEGORIES));
    } catch {
      // ignore
    }
    showCategoryToast('Reset to default 6 product categories');
  };

  const handleCatThumbFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetCategoryThumb(modalTargetCatId, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewCatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewCatForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_CATEGORY_IMAGES = [
    {
      id: 'preset-cat-handwash',
      name: 'Handwash (Attached Design)',
      url: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png'
    },
    {
      id: 'preset-cat-wet-wipes',
      name: 'Wet Wipes (Attached Design)',
      url: '/assets/products/Fresh Lemon Mint Wet Wipes-1.png'
    },
    {
      id: 'preset-cat-hand-sanitizer',
      name: 'Hand Sanitizer (Attached Design)',
      url: '/assets/products/Fresh Mint Hand Sanitizer Still Life-1.png'
    },
    {
      id: 'preset-cat-dishwash',
      name: 'Dishwash (Attached Design)',
      url: '/assets/products/Lemon Fresh Dish Wash Refill Pouch-1.png'
    },
    {
      id: 'preset-cat-floor-cleaner',
      name: 'Floor Cleaner (Attached Design)',
      url: '/assets/products/Glossy Pink Floor Cleaner Refill Pouch-1.png'
    },
    {
      id: 'preset-cat-liquid-matic',
      name: 'Liquid Matic (Attached Design)',
      url: '/assets/WiZ Liquid Matic Fresh Laundry Refill.png'
    },
    {
      id: 'preset-cat-bodywash',
      name: 'Moisturizing Body Wash',
      url: '/assets/products/top-pick-bodywash.jpg'
    },
    {
      id: 'preset-cat-facial-tissue',
      name: 'Facial Tissues Pack',
      url: '/assets/products/wiz-facial-tissue-card.jpg'
    }
  ];

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 312; // 294px card width + 18px gap
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryScrollEvent = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollCatLeft(scrollLeft > 10);
      setCanScrollCatRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Bestseller Products matching attached Our_Bestsellers_998ce175.jpg layout
  const bestsellerProducts = [
    {
      id: 'bestseller-laundry-detergent',
      title: 'Laundry Detergent',
      slug: '/product/wiz-liquid-matic-laundry-detergent-2l',
      categorySlug: '/category/laundry-detergent',
      image: '/assets/products/bestseller-laundry-matic.jpg',
      regularPrice: 250.0,
      sellingPrice: 199.0,
      badge: null,
      isSoldout: false,
      productId: 'prod-laundry-detergent'
    },
    {
      id: 'bestseller-wet-wipes',
      title: 'Wet Wipes',
      slug: '/product/wiz-wet-wipes-80-pulls',
      categorySlug: '/category/wet-wipes',
      image: '/assets/products/bestseller-wet-wipes.jpg',
      regularPrice: 250.0,
      sellingPrice: 199.0,
      badge: '25% OFF',
      isSoldout: false,
      productId: 'prod-wet-wipes'
    },
    {
      id: 'bestseller-dish-wash',
      title: 'Dish Wash',
      slug: '/product/wiz-power-degreasing-dishwash-gel-750ml',
      categorySlug: '/category/dishwash',
      image: '/assets/products/bestseller-dishwash.jpg',
      regularPrice: 250.0,
      sellingPrice: 199.0,
      badge: null,
      isSoldout: false,
      productId: 'prod-dishwash'
    },
    {
      id: 'bestseller-hand-wash',
      title: 'Hand Wash',
      slug: '/product/wiz-anti-bacterial-handwash-500ml',
      categorySlug: '/category/handwash',
      image: '/assets/products/bestseller-handwash.jpg',
      regularPrice: 250.0,
      sellingPrice: 199.0,
      badge: null,
      isSoldout: false,
      productId: 'prod-handwash'
    },
    {
      id: 'bestseller-floor-cleaner',
      title: 'Floor Cleaner',
      slug: '/product/wiz-disinfectant-floor-cleaner-500ml',
      categorySlug: '/category/floor-cleaner',
      image: '/assets/products/bestseller-floor-cleaner.jpg',
      regularPrice: 250.0,
      sellingPrice: 199.0,
      badge: 'Soldout',
      isSoldout: true,
      productId: 'prod-floor-cleaner'
    }
  ];

  const handleScrollBestsellers = (direction: 'left' | 'right') => {
    if (bestsellerScrollRef.current) {
      const scrollAmount = 360;
      bestsellerScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBestsellerScrollEvent = () => {
    if (bestsellerScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = bestsellerScrollRef.current;
      setCanScrollBestsellerLeft(scrollLeft > 10);
      setCanScrollBestsellerRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleAddBestsellerToBag = (e: React.MouseEvent, item: typeof bestsellerProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.isSoldout) return;

    const matched = products.find((p) => p.id === item.productId || p.slug === item.slug.replace('/product/', ''));
    const variant = matched?.variants?.[0] || {
      id: `${item.id}-default`,
      name: item.title,
      sku: matched?.sku || item.productId,
      regularPrice: item.regularPrice,
      sellingPrice: item.sellingPrice,
      stock: 100,
      packagingSize: ''
    };

    addToCart({
      productId: matched?.id || item.productId,
      productName: matched?.name || item.title,
      slug: matched?.slug || item.slug.replace('/product/', ''),
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku,
      unitPrice: item.sellingPrice,
      regularPrice: item.regularPrice,
      quantity: 1,
      image: item.image,
      category: matched?.category || 'Bestsellers'
    });

    setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Our Bestsellers Background Image State with Add & Delete provisions (full width image)
  const DEFAULT_BESTSELLER_BG = '/assets/products/lavender-podium-flower-background.jpg';
  const BESTSELLER_BG_STORAGE_KEY = 'wiz_bestseller_bg_image_v2';

  const [bestsellerBgImage, setBestsellerBgImage] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(BESTSELLER_BG_STORAGE_KEY);
      if (saved !== null) {
        if (saved === 'null' || saved === '""') return null;
        let val = saved;
        try {
          val = JSON.parse(saved);
        } catch {
          val = saved;
        }
        if (
          val &&
          (val.includes('bestseller-portrait') ||
            val.includes('bestseller-bg-clean') ||
            val.includes('bestseller-clean-bg') ||
            val.includes('bestseller-background'))
        ) {
          return DEFAULT_BESTSELLER_BG;
        }
        return val;
      }
    } catch {
      // fallback
    }
    return DEFAULT_BESTSELLER_BG;
  });

  const [isBestsellerBgModalOpen, setIsBestsellerBgModalOpen] = useState(false);
  const [bestsellerBgUrlInput, setBestsellerBgUrlInput] = useState('');
  const [bestsellerToast, setBestsellerToast] = useState<string | null>(null);
  const bestsellerFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const showBestsellerToast = (msg: string) => {
    setBestsellerToast(msg);
    setTimeout(() => setBestsellerToast(null), 3000);
  };

  const handleSetBestsellerBg = (url: string) => {
    const clean = url.trim() || null;
    setBestsellerBgImage(clean);
    try {
      localStorage.setItem(BESTSELLER_BG_STORAGE_KEY, JSON.stringify(clean));
    } catch {
      // ignore
    }
    setIsBestsellerBgModalOpen(false);
    setBestsellerBgUrlInput('');
    showBestsellerToast('Bestsellers background image updated');
  };

  const handleDeleteBestsellerBg = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setBestsellerBgImage(null);
    try {
      localStorage.setItem(BESTSELLER_BG_STORAGE_KEY, JSON.stringify(null));
    } catch {
      // ignore
    }
    showBestsellerToast('Bestsellers background image deleted');
  };

  const handleResetBestsellerBg = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setBestsellerBgImage(DEFAULT_BESTSELLER_BG);
    try {
      localStorage.setItem(BESTSELLER_BG_STORAGE_KEY, JSON.stringify(DEFAULT_BESTSELLER_BG));
    } catch {
      // ignore
    }
    showBestsellerToast('Default background restored');
  };

  const handleBestsellerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          handleSetBestsellerBg(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Personal Care 2-Slide Center Big Image (Wet Wipes & Bodywash with redirects)
  const PERSONAL_CARE_CENTER_SLIDES = [
    {
      id: 'slide-wet-wipes',
      name: 'Wet Wipes',
      image: '/assets/Rose Water Wet Wipes in Bloom.png',
      link: '/category/wet-wipes',
      description: 'Ultra-soft, refreshing wipes infused with aloe vera & calming botanical extracts.'
    },
    {
      id: 'slide-bodywash',
      name: 'Bodywash',
      image: '/assets/products/Bodywash-5L-Banner.jpg',
      link: '/category/bodywash',
      description: 'Luxurious moisturizing body wash with floral paradise lily and gentle lather.'
    }
  ];

  const [pcareSlideIndex, setPcareSlideIndex] = useState(0);

  interface PcareThumbnailSlot {
    image: string | null;
    title: string;
    link: string;
  }

  const DEFAULT_PCARE_THUMBNAILS: Record<string, PcareThumbnailSlot> = {
    'left-top': {
      image: '/assets/products/Bodywash-M1.jpg',
      title: 'Glowing Daily Hydration',
      link: '/category/personal-care'
    },
    'left-bottom': {
      image: '/assets/products/Bodywash-M2.jpg',
      title: 'Eucalyptus Mint Wet Wipes',
      link: '/category/wet-wipes'
    },
    'right-top': {
      image: '/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png',
      title: 'Paradise Lily Body Wash',
      link: '/category/bodywash'
    },
    'right-bottom': {
      image: '/assets/products/LiquidMatic-M1.jpg',
      title: 'Pure Radiant Care',
      link: '/category/personal-care'
    }
  };

  const PCARE_THUMBNAILS_STORAGE_KEY = 'wiz_personal_care_thumbs_v5';

  const [pcareThumbnails, setPcareThumbnails] = useState<Record<string, PcareThumbnailSlot>>(() => {
    try {
      const saved = localStorage.getItem(PCARE_THUMBNAILS_STORAGE_KEY) || localStorage.getItem('wiz_personal_care_thumbs_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          const migrated = { ...parsed };
          if (migrated['left-top']?.image === '/assets/products/pcare-thumb-left-top.jpg') {
            migrated['left-top'].image = '/assets/products/Bodywash-M1.jpg';
          }
          if (migrated['left-bottom']?.image === '/assets/products/pcare-thumb-left-bot.jpg') {
            migrated['left-bottom'].image = '/assets/products/Bodywash-M2.jpg';
          }
          if (migrated['right-top']?.image === '/assets/products/pcare-thumb-right-top.jpg') {
            migrated['right-top'].image = '/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png';
          }
          if (migrated['right-bottom']?.image === '/assets/products/pcare-thumb-right-bot.jpg') {
            migrated['right-bottom'].image = '/assets/products/LiquidMatic-M1.jpg';
          }
          return migrated;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PCARE_THUMBNAILS;
  });

  const [isPcareThumbModalOpen, setIsPcareThumbModalOpen] = useState(false);
  const [modalTargetPcareSlot, setModalTargetPcareSlot] = useState<string>('left-top');
  const [pcareThumbUrlInput, setPcareThumbUrlInput] = useState('');
  const [pcareToast, setPcareToast] = useState<string | null>(null);
  const pcareThumbFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const showPcareToast = (msg: string) => {
    setPcareToast(msg);
    setTimeout(() => setPcareToast(null), 3000);
  };

  const handleSetPcareThumb = (slotKey: string, imageUrl: string) => {
    const updated = {
      ...pcareThumbnails,
      [slotKey]: {
        ...pcareThumbnails[slotKey],
        image: imageUrl.trim() || null
      }
    };
    setPcareThumbnails(updated);
    try {
      localStorage.setItem(PCARE_THUMBNAILS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsPcareThumbModalOpen(false);
    setPcareThumbUrlInput('');
    showPcareToast('Thumbnail updated successfully');
  };

  const handleDeletePcareThumb = (slotKey: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = {
      ...pcareThumbnails,
      [slotKey]: {
        ...pcareThumbnails[slotKey],
        image: null
      }
    };
    setPcareThumbnails(updated);
    try {
      localStorage.setItem(PCARE_THUMBNAILS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showPcareToast('Thumbnail deleted');
  };

  const handleResetPcareThumb = (slotKey: string) => {
    const defaultSlot = DEFAULT_PCARE_THUMBNAILS[slotKey];
    if (defaultSlot) {
      handleSetPcareThumb(slotKey, defaultSlot.image || '');
    }
  };

  const handleResetAllPcareThumbs = () => {
    setPcareThumbnails(DEFAULT_PCARE_THUMBNAILS);
    try {
      localStorage.setItem(PCARE_THUMBNAILS_STORAGE_KEY, JSON.stringify(DEFAULT_PCARE_THUMBNAILS));
    } catch {
      // ignore
    }
    setIsPcareThumbModalOpen(false);
    showPcareToast('Reset all thumbnails to default');
  };

  const handlePcareThumbFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetPcareThumb(modalTargetPcareSlot, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_PCARE_THUMBS = [
    {
      id: 'preset-left-top',
      name: 'Glowing Daily Hydration (Left Top)',
      url: '/assets/products/Bodywash-M1.jpg'
    },
    {
      id: 'preset-left-bot',
      name: 'Eucalyptus Mint Wipes (Left Bottom)',
      url: '/assets/products/Bodywash-M2.jpg'
    },
    {
      id: 'preset-right-top',
      name: 'Paradise Lily Body Wash (Right Top)',
      url: '/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png'
    },
    {
      id: 'preset-right-bot',
      name: 'Pure Radiant Care (Right Bottom)',
      url: '/assets/products/LiquidMatic-M1.jpg'
    },
    {
      id: 'preset-lavender-wipes',
      name: 'French Lavender Wet Wipes',
      url: '/assets/products/wiz-wet-wipes-card.jpg'
    },
    {
      id: 'preset-orange-hw',
      name: 'WiZ Handwash Bottle',
      url: '/assets/Lemon-Handwash01.jpg'
    }
  ];

  // Household Cleaners Products matching attached Home_Care_Products_498fd88a.jpg
  const householdCleanerProducts = [
    {
      id: 'hh-dishwash-750',
      title: 'Dishwash 750ml',
      slug: '/product/wiz-power-degreasing-dishwash-gel-750ml',
      image: '/assets/products/household-dishwash-750.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-dishwash'
    },
    {
      id: 'hh-floor-cleaner-750',
      title: 'Floor Cleaner 750ml',
      slug: '/product/wiz-disinfectant-floor-cleaner-500ml',
      image: '/assets/products/household-floor-cleaner-750.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-floor-cleaner'
    },
    {
      id: 'hh-handwash-500',
      title: 'Handwash 500ml',
      slug: '/product/wiz-anti-bacterial-handwash-500ml',
      image: '/assets/products/household-handwash-500.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-handwash'
    },
    {
      id: 'hh-liquid-matic-2l',
      title: 'Liquid Matic 2L',
      slug: '/product/wiz-liquid-matic-laundry-detergent-2l',
      image: '/assets/products/household-liquid-matic-2l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-laundry-detergent'
    },
    {
      id: 'hh-glass-cleaner-1l',
      title: 'Glass Cleaner 1L',
      slug: '/product/wiz-glass-multi-surface-cleaner-500ml',
      image: '/assets/products/household-glass-cleaner-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      isSoldout: true,
      productId: 'prod-glass-cleaner'
    },
    {
      id: 'hh-toilet-cleaner-1l',
      title: 'Toilet Cleaner 1L',
      slug: '/product/wiz-toilet-cleaner-1l',
      image: '/assets/products/household-toilet-cleaner-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-toilet-cleaner'
    },
    {
      id: 'hh-floor-cleaner-1l',
      title: 'Floor Cleaner 1L',
      slug: '/product/wiz-disinfectant-floor-cleaner-500ml',
      image: '/assets/products/household-floor-cleaner-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-floor-cleaner'
    },
    {
      id: 'hh-hand-sanitizer-5l',
      title: 'Hand Sanitizer 5L',
      slug: '/product/wiz-hand-sanitizer-500ml',
      image: '/assets/products/household-hand-sanitizer-5l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-hand-sanitizer'
    },
    {
      id: 'hh-dishwash-1l',
      title: 'Dishwash 1L',
      slug: '/product/wiz-power-degreasing-dishwash-gel-750ml',
      image: '/assets/products/household-dishwash-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-dishwash'
    },
    {
      id: 'hh-facial-tissue-4',
      title: 'Facial Tissue - Pack of 4',
      slug: '/product/wiz-facial-tissue-pack-of-4',
      image: '/assets/products/household-facial-tissue-4.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-facial-tissue'
    }
  ];

  const handleAddHouseholdToBag = (e: React.MouseEvent, item: typeof householdCleanerProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.isSoldout) return;

    const matched = products.find((p) => p.id === item.productId || p.slug === item.slug.replace('/product/', ''));
    const variant = matched?.variants?.[0] || {
      id: `${item.id}-default`,
      name: item.title,
      sku: matched?.sku || item.productId,
      regularPrice: item.regularPrice,
      sellingPrice: item.sellingPrice,
      stock: 100,
      packagingSize: ''
    };

    addToCart({
      productId: matched?.id || item.productId,
      productName: matched?.name || item.title,
      slug: matched?.slug || item.slug.replace('/product/', ''),
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku,
      unitPrice: item.sellingPrice,
      regularPrice: item.regularPrice,
      quantity: 1,
      image: item.image,
      category: matched?.category || 'Household Cleaners'
    });

    setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Our Most Loved Essentials banner background state with Add & Delete provisions
  const DEFAULT_MOST_LOVED_ESSENTIALS_BG = '/assets/aistudio/Personcal Care-BG.jpg';
  const MOST_LOVED_ESSENTIALS_BG_STORAGE_KEY = 'wiz_most_loved_essentials_bg_v5';

  const [lovedEssentialsBg, setLovedEssentialsBg] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(MOST_LOVED_ESSENTIALS_BG_STORAGE_KEY) || localStorage.getItem('wiz_most_loved_essentials_bg_v4');
      if (saved !== null) {
        if (saved === 'null' || saved === '""') return null;
        let parsedVal: string | null = saved;
        try {
          parsedVal = JSON.parse(saved);
        } catch {
          parsedVal = saved;
        }
        if (parsedVal === '/assets/aistudio/Radiant_Skincare_Essentials_Banner_91be65a8.png') {
          return DEFAULT_MOST_LOVED_ESSENTIALS_BG;
        }
        return parsedVal;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MOST_LOVED_ESSENTIALS_BG;
  });

  const [isLovedEssentialsBgModalOpen, setIsLovedEssentialsBgModalOpen] = useState(false);
  const [lovedEssentialsBgUrlInput, setLovedEssentialsBgUrlInput] = useState('');
  const [lovedEssentialsToast, setLovedEssentialsToast] = useState<string | null>(null);
  const lovedEssentialsBgFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const showLovedEssentialsToast = (msg: string) => {
    setLovedEssentialsToast(msg);
    setTimeout(() => setLovedEssentialsToast(null), 3000);
  };

  const handleSetLovedEssentialsBg = (url: string) => {
    const clean = url.trim() || null;
    setLovedEssentialsBg(clean);
    try {
      localStorage.setItem(MOST_LOVED_ESSENTIALS_BG_STORAGE_KEY, JSON.stringify(clean));
    } catch {
      // ignore
    }
    setIsLovedEssentialsBgModalOpen(false);
    setLovedEssentialsBgUrlInput('');
    showLovedEssentialsToast('Background image updated successfully');
  };

  const handleDeleteLovedEssentialsBg = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLovedEssentialsBg(null);
    try {
      localStorage.setItem(MOST_LOVED_ESSENTIALS_BG_STORAGE_KEY, JSON.stringify(null));
    } catch {
      // ignore
    }
    showLovedEssentialsToast('Background image deleted');
  };

  const handleResetLovedEssentialsBg = () => {
    setLovedEssentialsBg(DEFAULT_MOST_LOVED_ESSENTIALS_BG);
    try {
      localStorage.setItem(MOST_LOVED_ESSENTIALS_BG_STORAGE_KEY, JSON.stringify(DEFAULT_MOST_LOVED_ESSENTIALS_BG));
    } catch {
      // ignore
    }
    setIsLovedEssentialsBgModalOpen(false);
    showLovedEssentialsToast('Reset background image to default');
  };

  const handleLovedEssentialsBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleSetLovedEssentialsBg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_LOVED_ESSENTIALS_BGS = [
    {
      id: 'preset-personal-care-bg',
      name: 'Personal Care BG (Personcal Care-BG.jpg)',
      url: '/assets/aistudio/Personcal Care-BG.jpg'
    },
    {
      id: 'preset-hero-curly',
      name: 'Our Most Loved Essentials (Curly Model)',
      url: '/assets/aistudio/WiZ-H-Banner02.jpg'
    },
    {
      id: 'preset-pure-skin',
      name: 'WiZ Pure Skin Science',
      url: '/assets/aistudio/WiZ-H-Banner03.jpg'
    },
    {
      id: 'preset-wet-wipes',
      name: 'Fresh Gentle Care Pink',
      url: '/assets/aistudio/WiZ-H-Banner01.jpg'
    },
    {
      id: 'preset-bathroom-mirror',
      name: 'Fresh Orange & Aloe Wet Wipes',
      url: '/assets/products/Fresh Orange & Aloe Wet Wipes.png'
    }
  ];

  // Top Picks Curated Slides matching attached Personcal Care-BG.jpg layout
  // Dynamically populated from backend uploaded products
  const topPicksSlides = [
    {
      id: 'slide-0',
      item1: {
        id: wetWipesProd?.id || 'top-pick-wipes',
        title: wetWipesProd?.name ? (wetWipesProd.name.toLowerCase().includes('wipe') ? 'Wet Wipes' : wetWipesProd.name) : 'Wet Wipes',
        slug: wetWipesProd ? `/product/${wetWipesProd.slug}` : '/product/wiz-wet-wipes-80-pulls',
        productId: wetWipesProd?.id || 'prod-wet-wipes',
        image: getBackendThumbnail(wetWipesProd, '/assets/products/Bodywash-M2.jpg'),
        badge: '25% OFF',
        regularPrice: wetWipesProd?.regularPrice || 150.0,
        sellingPrice: wetWipesProd?.sellingPrice || 99.0
      },
      item2: {
        id: bodywashProd?.id || 'top-pick-bodywash',
        title: bodywashProd?.name ? (bodywashProd.name.toLowerCase().includes('body') ? 'Bodywash' : bodywashProd.name) : 'Bodywash',
        slug: bodywashProd ? `/product/${bodywashProd.slug}` : '/product/wiz-moisturizing-bodywash-citrus-splash-300ml',
        productId: bodywashProd?.id || 'prod-bodywash',
        image: getBackendThumbnail(bodywashProd, '/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png'),
        badge: null,
        regularPrice: bodywashProd?.regularPrice || 900.0,
        sellingPrice: bodywashProd?.sellingPrice || 450.0
      }
    },
    {
      id: 'slide-1',
      item1: {
        id: dishwashProd?.id || 'top-pick-dishwash',
        title: dishwashProd?.name || 'Dishwash 750ml',
        slug: dishwashProd ? `/product/${dishwashProd.slug}` : '/product/wiz-power-degreasing-dishwash-gel-750ml',
        productId: dishwashProd?.id || 'prod-dishwash',
        image: getBackendThumbnail(dishwashProd, '/assets/products/household-dishwash-750.jpg'),
        badge: null,
        regularPrice: dishwashProd?.regularPrice || 150.0,
        sellingPrice: dishwashProd?.sellingPrice || 99.0
      },
      item2: {
        id: floorCleanerProd?.id || 'top-pick-floor-cleaner',
        title: floorCleanerProd?.name || 'Floor Cleaner 750ml',
        slug: floorCleanerProd ? `/product/${floorCleanerProd.slug}` : '/product/wiz-disinfectant-floor-cleaner-500ml',
        productId: floorCleanerProd?.id || 'prod-floor-cleaner',
        image: getBackendThumbnail(floorCleanerProd, '/assets/products/household-floor-cleaner-750.jpg'),
        badge: '25% OFF',
        regularPrice: floorCleanerProd?.regularPrice || 150.0,
        sellingPrice: floorCleanerProd?.sellingPrice || 99.0
      }
    },
    {
      id: 'slide-2',
      item1: {
        id: handwashProd?.id || 'top-pick-handwash',
        title: handwashProd?.name || 'Handwash 500ml',
        slug: handwashProd ? `/product/${handwashProd.slug}` : '/product/wiz-anti-bacterial-handwash-500ml',
        productId: handwashProd?.id || 'prod-handwash',
        image: getBackendThumbnail(handwashProd, '/assets/products/household-handwash-500.jpg'),
        badge: null,
        regularPrice: handwashProd?.regularPrice || 150.0,
        sellingPrice: handwashProd?.sellingPrice || 99.0
      },
      item2: {
        id: 'top-pick-facial-tissue',
        title: 'Facial Tissue - 4pk',
        slug: '/product/wiz-facial-tissue-pack-of-4',
        productId: 'prod-facial-tissue',
        image: '/assets/products/household-facial-tissue-4.jpg',
        badge: null,
        regularPrice: 150.0,
        sellingPrice: 99.0
      }
    }
  ];

  const [topPicksSlideIndex, setTopPicksSlideIndex] = useState(0);
  const currentTopPickPair = topPicksSlides[topPicksSlideIndex % topPicksSlides.length];

  const handlePrevTopPick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTopPicksSlideIndex((prev) => (prev === 0 ? topPicksSlides.length - 1 : prev - 1));
  };

  const handleNextTopPick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTopPicksSlideIndex((prev) => (prev + 1) % topPicksSlides.length);
  };

  const handleAddTopPickToBag = (
    e: React.MouseEvent,
    item: { id: string; title: string; slug: string; productId: string; image: string; regularPrice: number; sellingPrice: number }
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const matched = products.find((p) => p.id === item.productId || p.slug === item.slug.replace('/product/', ''));
    const variant = matched?.variants?.[0] || {
      id: `${item.id}-default`,
      name: item.title,
      sku: matched?.sku || item.productId,
      regularPrice: item.regularPrice,
      sellingPrice: item.sellingPrice,
      stock: 100,
      packagingSize: ''
    };

    addToCart({
      productId: matched?.id || item.productId,
      productName: matched?.name || item.title,
      slug: matched?.slug || item.slug.replace('/product/', ''),
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku,
      unitPrice: item.sellingPrice,
      regularPrice: item.regularPrice,
      quantity: 1,
      image: item.image,
      category: matched?.category || 'Personal Care'
    });

    setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Flash Deal Products matching attached 50_Percent_Off_3bd6c5c5.jpg
  const flashDealProducts = [
    {
      id: 'fd-handwash-lavender-1l',
      title: 'Handwash Lavender 1L',
      slug: '/product/wiz-anti-bacterial-handwash-500ml',
      image: '/assets/products/pouch-handwash-lavender-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-handwash'
    },
    {
      id: 'fd-dishwash-lemon-1l',
      title: 'Dishwash Lemon 1L',
      slug: '/product/wiz-power-degreasing-dishwash-gel-750ml',
      image: '/assets/products/pouch-dishwash-lemon-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-dishwash'
    },
    {
      id: 'fd-floor-cleaner-rose-1l',
      title: 'Floor Cleaner Rose 1L',
      slug: '/product/wiz-disinfectant-floor-cleaner-500ml',
      image: '/assets/products/pouch-floor-cleaner-rose-1l.jpg',
      regularPrice: 150.0,
      sellingPrice: 99.0,
      productId: 'prod-floor-cleaner'
    }
  ];

  const handleAddFlashDealToBag = (e: React.MouseEvent, item: typeof flashDealProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();

    const matched = products.find((p) => p.id === item.productId || p.slug === item.slug.replace('/product/', ''));
    const variant = matched?.variants?.[0] || {
      id: `${item.id}-default`,
      name: item.title,
      sku: matched?.sku || item.productId,
      regularPrice: item.regularPrice,
      sellingPrice: item.sellingPrice,
      stock: 100,
      packagingSize: '1L'
    };

    addToCart({
      productId: matched?.id || item.productId,
      productName: matched?.name || item.title,
      slug: matched?.slug || item.slug.replace('/product/', ''),
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku,
      unitPrice: item.sellingPrice,
      regularPrice: item.regularPrice,
      quantity: 1,
      image: item.image,
      category: matched?.category || 'Home Care'
    });

    setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };


  return (
    <div className="bg-white text-gray-900">
      {/* =========================================================================
          SECTION 1: HERO HEADER BANNER (Matches Attached WiZ-H-Banner01.jpg Layout Exactly)
          ========================================================================= */}
      <section
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        className="relative w-full overflow-hidden bg-[#efc0c6] group select-none h-[440px] sm:h-[525px]"
      >
        {/* Hero Background Image */}
        {bannerBgImage ? (
          <img
            src={resolveAssetUrl(bannerBgImage)}
            alt={currentBanner.title || 'WiZ Banner'}
            key={bannerBgImage + currentBanner.id}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f8d7dc] via-[#f0bcc5] to-[#e49ca9] text-center p-6 z-0">
            <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl max-w-md border border-white/60">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Background Banner Image Deleted
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-5">
                Slide {currentBannerIndex + 1} ({currentBanner.title}): Add a new background image or restore the default banner.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setModalTargetBannerIndex(currentBannerIndex);
                    setIsBgModalOpen(true);
                  }}
                  className="px-4 py-2 bg-black hover:bg-[#7a49a6] text-white text-xs font-semibold rounded-md shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Add Background Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResetBannerBg(currentBanner.id)}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtle dark gradient overlay across bottom/left for text readability */}
        {bannerBgImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
        )}

        {/* Hero Overlay Content & Slide Controls - Unified Flexbox Container Aligned with Hero Margins */}
        <div className="absolute inset-x-0 bottom-12 sm:bottom-14 md:bottom-[95px] z-20 w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pointer-events-none">
          {/* Left Side: Thumbnail Card + Heading, Subtitle & CTA */}
          <div className="flex flex-row items-center gap-5 sm:gap-7 lg:gap-8 max-w-2xl sm:max-w-3xl pointer-events-auto">
            {/* Banner Small Square Thumbnail Card */}
            {bannerThumbImage && (
              <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/30 bg-white/10 backdrop-blur-xs transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={resolveAssetUrl(bannerThumbImage)}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Typography & White CTA Button */}
            <div className="text-white text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold tracking-tight text-white leading-tight font-['Poppins',sans-serif] drop-shadow-sm">
                {currentBanner.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-white/95 max-w-sm sm:max-w-md mt-2 sm:mt-3 leading-relaxed font-normal drop-shadow-xs font-['Poppins',sans-serif]">
                {currentBanner.subtitle}
              </p>

              <div className="mt-4 sm:mt-6">
                <Link
                  to={currentBanner.buttonLink || '/shop'}
                  className="inline-block bg-white text-black hover:bg-[#7a49a6] hover:text-white text-xs sm:text-[13px] font-bold uppercase tracking-wider py-3 sm:py-3.5 px-7 sm:px-9 transition-colors shadow-sm rounded-none cursor-pointer"
                >
                  {currentBanner.buttonText || 'EXPLORE PRODUCTS'}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Slide Controls */}
          <div className="flex items-end space-x-6 shrink-0 self-end pointer-events-auto">
            <div className="text-left hidden sm:block">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/90 block mb-0.5">
                NEXT
              </span>
              <span className="text-sm sm:text-base font-semibold text-white tracking-wide block">
                {currentBanner.nextLabel || nextBanner.title}
              </span>
              <div className="h-[2px] bg-white w-36 sm:w-56 mt-2 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white transition-all duration-300"
                  style={{
                    width: `${((currentBannerIndex + 1) / activeBanners.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevBanner}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:bg-[#7a49a6] hover:text-white transition-colors cursor-pointer"
                style={{ borderRadius: '9999px' }}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextBanner}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:bg-[#7a49a6] hover:text-white transition-colors cursor-pointer"
                style={{ borderRadius: '9999px' }}
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Sliding Banners - Bottom Navigation Indicator Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {activeBanners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setCurrentBannerIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentBannerIndex === idx
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              title={`Switch to Slide ${idx + 1}: ${b.title}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 1B: WiZ CATEGORIES QUICK NAVIGATION STRIP (Matches Attached WiZ-Categories Design)
          ========================================================================= */}
      <section className="w-full bg-white py-8 sm:py-10 border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-[100px]">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-x-3 gap-y-6 sm:gap-x-4 items-end">
            {[
              {
                name: 'Hand Wash',
                image: '/assets/categories/cat-hand-wash.png',
                link: '/category/handwash'
              },
              {
                name: 'Bodywash',
                image: '/assets/categories/cat-bodywash.png',
                link: '/category/bodywash'
              },
              {
                name: 'Wet Wipes',
                image: '/assets/categories/cat-wet-wipes.png',
                link: '/category/wet-wipes'
              },
              {
                name: 'Liquid Matic',
                image: '/assets/categories/cat-liquid-matic.png',
                link: '/category/laundry-detergent'
              },
              {
                name: 'Dish Wash',
                image: '/assets/categories/cat-dish-wash.png',
                link: '/category/dishwash'
              },
              {
                name: 'Floor Cleaner',
                image: '/assets/categories/cat-floor-cleaner.png',
                link: '/category/floor-cleaner'
              },
              {
                name: 'Glass Cleaner',
                image: '/assets/categories/cat-glass-cleaner.png',
                link: '/category/glass-cleaner'
              },
              {
                name: 'Toilet Cleaner',
                image: '/assets/categories/cat-toilet-cleaner.png',
                link: '/category/toilet-cleaner'
              },
              {
                name: 'Tissue Paper',
                image: '/assets/categories/cat-tissue-paper.png',
                link: '/category/paper-products'
              }
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="group flex flex-col items-center text-center focus:outline-none"
              >
                <div className="w-full h-28 sm:h-32 md:h-36 flex items-center justify-center overflow-visible">
                  <img
                    src={resolveAssetUrl(cat.image)}
                    alt={cat.name}
                    className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="mt-2.5 text-[13px] sm:text-sm font-medium text-gray-900 group-hover:text-[#7a49a6] transition-colors font-['Poppins',sans-serif] whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* =========================================================================
          SECTION 2: ALL ESSENTIALS, HOME CARE & PERSONAL CARE (Exact Layout Match)
          ========================================================================= */}
      {/* =========================================================================
          SECTION 2: ALL ESSENTIALS, HOME CARE & PERSONAL CARE (Exact Layout Match)
          ========================================================================= */}
      <section className="w-full pt-10 sm:pt-14 pb-14 sm:pb-20 bg-white">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
          {/* Category Tabs & Carousel Navigation Header (Matches attached WiZ-Products_8ebda911.jpg) */}
          <div className="flex items-center justify-between pb-8 sm:pb-10 border-b border-transparent">
          {/* Category Tabs: All Essentials, Home Care, Personal Care with small circular thumbnails */}
          <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-12 overflow-x-auto no-scrollbar py-2">
            {/* 1. All Essentials Tab */}
            <div className="flex items-center space-x-3.5 group cursor-pointer text-left shrink-0 relative">
              {tabThumbnails.all && (
                <div
                  onClick={() => setActiveCategoryFilter('all')}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white border border-gray-200/80 shadow-xs relative"
                  style={{ borderRadius: '9999px' }}
                >
                  <img
                    src={tabThumbnails.all}
                    alt="All Essentials"
                    className="w-full h-full object-cover rounded-full"
                    style={{ borderRadius: '9999px' }}
                  />
                </div>
              )}

              {/* Tab Title with active underline under text */}
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className="flex flex-col justify-center cursor-pointer text-left focus:outline-none"
              >
                <span className="text-base sm:text-lg lg:text-[19px] font-normal text-gray-900 group-hover:text-black transition-colors whitespace-nowrap leading-none">
                  All Essentials
                </span>
                {activeCategoryFilter === 'all' && (
                  <div className="h-[2px] bg-black w-full mt-2 transition-all" />
                )}
              </button>
            </div>

            {/* 2. Home Care Tab */}
            <div className="flex items-center space-x-3.5 group cursor-pointer text-left shrink-0 relative">
              {tabThumbnails.home && (
                <div
                  onClick={() => setActiveCategoryFilter('home')}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white border border-gray-200/80 shadow-xs relative"
                  style={{ borderRadius: '9999px' }}
                >
                  <img
                    src={tabThumbnails.home}
                    alt="Home Care"
                    className="w-full h-full object-cover rounded-full"
                    style={{ borderRadius: '9999px' }}
                  />
                </div>
              )}

              {/* Tab Title with active underline under text */}
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('home')}
                className="flex flex-col justify-center cursor-pointer text-left focus:outline-none"
              >
                <span className="text-base sm:text-lg lg:text-[19px] font-normal text-gray-800 group-hover:text-black transition-colors whitespace-nowrap leading-none">
                  Home Care
                </span>
                {activeCategoryFilter === 'home' && (
                  <div className="h-[2px] bg-black w-full mt-2 transition-all" />
                )}
              </button>
            </div>

            {/* 3. Personal Care Tab */}
            <div className="flex items-center space-x-3.5 group cursor-pointer text-left shrink-0 relative">
              {tabThumbnails.personal && (
                <div
                  onClick={() => setActiveCategoryFilter('personal')}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white border border-gray-200/80 shadow-xs relative"
                  style={{ borderRadius: '9999px' }}
                >
                  <img
                    src={tabThumbnails.personal}
                    alt="Personal Care"
                    className="w-full h-full object-cover rounded-full"
                    style={{ borderRadius: '9999px' }}
                  />
                </div>
              )}

              {/* Tab Title with active underline under text */}
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('personal')}
                className="flex flex-col justify-center cursor-pointer text-left focus:outline-none"
              >
                <span className="text-base sm:text-lg lg:text-[19px] font-normal text-gray-800 group-hover:text-black transition-colors whitespace-nowrap leading-none">
                  Personal Care
                </span>
                {activeCategoryFilter === 'personal' && (
                  <div className="h-[2px] bg-black w-full mt-2 transition-all" />
                )}
              </button>
            </div>
          </div>

          {/* Right Header Area: Manage Tab Thumbnails button + Carousel Navigation Arrows */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-4">

            {/* Carousel Navigation Arrows matching attached WiZ-Products_8ebda911.jpg */}
            <button
              onClick={handlePrevCategoryItems}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#a3a3a3] hover:bg-gray-700 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              style={{ borderRadius: '9999px' }}
              aria-label="Previous items"
              title="Previous items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextCategoryItems}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-[#7a49a6] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              style={{ borderRadius: '9999px' }}
              aria-label="Next items"
              title="Next items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Product Cards Grid matching attached WiZ-Products_8ebda911.jpg */}
        <div
          ref={carouselContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {displayedEssentialsItems.slice(0, 4).map((item) => (
            <div key={item.id} className="group flex flex-col justify-between">
              {/* Product Image Container: #f6f6f6 clean background, centered packshot */}
              <div className="relative w-full aspect-[1/1.08] sm:aspect-[4/5] bg-[#f6f6f6] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                <Link
                  to={`/product/${item.slug}`}
                  onClick={() => {
                    const matched = products.find((p) => p.id === item.productId || p.slug === item.slug.replace('/product/', ''));
                    if (matched) recordRecentlyViewed(matched);
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Badges matching attached image: 25% OFF (coral) & Soldout (black) */}
                {item.badge === '25% OFF' && (
                  <span
                    className="absolute top-4 left-4 bg-[#ff5757] text-white text-xs font-semibold px-3.5 py-1 shadow-xs tracking-wide rounded-full"
                    style={{ borderRadius: '9999px' }}
                  >
                    25% OFF
                  </span>
                )}
                {item.isSoldout && (
                  <span
                    className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-4 py-1 shadow-xs tracking-wide rounded-full"
                    style={{ borderRadius: '9999px' }}
                  >
                    Soldout
                  </span>
                )}

                {/* Add to Bag hover button on card */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {item.isSoldout ? (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-500 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider cursor-not-allowed text-center shadow-md rounded-none"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-1.5 cursor-pointer rounded-none ${
                        addedNoticeMap[item.id]
                          ? 'bg-green-600 text-white'
                          : 'bg-black hover:bg-[#7a49a6] text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{addedNoticeMap[item.id] ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Product Info below container: Left Aligned Title + Price matching attached layout */}
              <div className="pt-3 pb-1 text-left">
                <h3 className="text-sm sm:text-[15px] font-normal text-gray-900 hover:text-black transition-colors leading-snug text-left">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => {
                      const matched = products.find((p) => p.id === item.productId || p.slug === item.slug.replace('/product/', ''));
                      if (matched) recordRecentlyViewed(matched);
                    }}
                  >
                    {item.title}
                  </Link>
                </h3>

                <div className="mt-1 flex items-center justify-start space-x-2 text-left">
                  {item.regularPrice && (
                    <span className="text-xs sm:text-[13px] text-gray-400 line-through font-normal">
                      ₹{item.regularPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    ₹{item.sellingPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>


        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MOST LOVED PICKS (Slider Layout matching Reference Image Most_Loved_Picks_0eb07c1b.jpg)
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 overflow-hidden bg-white">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight text-left font-['Poppins',sans-serif]">
                Most Loved Picks
              </h2>
            </div>
          </div>
        </div>

        {/* Carousel Slider with Side Previews / Peeks */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex items-center transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(50vw - (min(68vw, 1180px) / 2) - ${lovedSlideIndex} * (min(68vw, 1180px) + 20px)))`
            }}
          >
            {lovedSlides.map((slide, idx) => {
              const isActive = idx === lovedSlideIndex;
              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    if (!isActive) setLovedSlideIndex(idx);
                  }}
                  className={`shrink-0 w-[68vw] max-w-[1180px] mr-[20px] relative aspect-[1180/700] overflow-hidden select-none transition-opacity duration-300 group ${
                    isActive ? 'cursor-default opacity-100' : 'cursor-pointer opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Slide Background Image */}
                  {slide.bgImage ? (
                    <img
                      src={slide.bgImage}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-neutral-800 via-neutral-900 to-black" />
                  )}

                  {/* Left-Bottom Overlay Text & CTA Button (Matching Reference Image) */}
                  <div className="absolute left-6 sm:left-10 lg:left-14 bottom-6 sm:bottom-10 lg:bottom-12 z-20 text-left max-w-sm sm:max-w-md">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight mb-2 drop-shadow-md font-['Poppins',sans-serif]">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/95 line-clamp-2 mb-4 drop-shadow">
                      {slide.subtitle}
                    </p>
                    <Link
                      to={slide.shopLink}
                      className="inline-block bg-white text-black hover:bg-[#7a49a6] hover:text-white px-6 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      SHOP NOW
                    </Link>
                  </div>

                  {/* Right Floating Product Listing Boxes with Backend Product Details & Thumbnails */}
                  <div className="absolute right-4 sm:right-6 lg:right-10 bottom-6 sm:bottom-10 lg:bottom-12 flex flex-col space-y-3 sm:space-y-4 z-20">
                    {slide.products.map((pItem) => (
                      <div
                        key={pItem.id}
                        className="bg-white shadow-xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 w-60 sm:w-72 md:w-80 lg:w-[350px] border-0"
                      >
                        {/* Product Image Thumbnail from Backend Product Upload */}
                        <div className="w-16 h-14 sm:w-20 sm:h-18 lg:w-24 lg:h-20 flex items-center justify-center shrink-0 p-1 bg-white">
                          <img
                            src={pItem.image}
                            alt={pItem.title}
                            className="max-h-full max-w-full object-contain"
                            draggable={false}
                          />
                        </div>

                        {/* Product Info & QUICK VIEW Button */}
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {pItem.title}
                          </h4>
                          <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 mb-2 sm:mb-2.5">
                            {pItem.price}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (pItem.product) setQuickViewProduct(pItem.product);
                            }}
                            className="w-full bg-black text-white hover:bg-[#7a49a6] py-1.5 sm:py-2 px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors text-center cursor-pointer shadow-xs"
                          >
                            QUICK VIEW
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Left and Right Navigation Arrows shifted directly onto the slide image */}
                  {isActive && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevLovedSlide();
                        }}
                        className="absolute left-3 sm:left-5 md:left-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/65 hover:bg-[#7a49a6] text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-xs cursor-pointer border border-white/20 hover:scale-105"
                        title="Previous Slide"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextLovedSlide();
                        }}
                        className="absolute right-3 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/65 hover:bg-[#7a49a6] text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-xs cursor-pointer border border-white/20 hover:scale-105"
                        title="Next Slide"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>


      </section>

      {/* =========================================================================
          SECTION 4: PRODUCT CATEGORIES (Exact Layout Match with Product_Category_ddffba0a.jpg)
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-white overflow-hidden">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] flex flex-col">
          {/* Header Row: Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 text-left font-['Poppins',sans-serif]">
              Product Categories
            </h2>
          </div>

          {/* Horizontal Slider Track matching Hero Banner left/right alignment */}
          <div
            ref={categoryScrollRef}
            onScroll={handleCategoryScrollEvent}
            className="flex items-stretch gap-[18px] overflow-x-auto scroll-smooth pb-4 select-none no-scrollbar w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {productCategories.map((cat) => (
              <div
                key={cat.id}
                className="group relative shrink-0 w-[calc((100%-18px)/1.35)] sm:w-[calc((100%-18px)/2)] md:w-[calc((100%-36px)/3)] lg:w-[calc((100%-54px)/4)] h-[320px] sm:h-[350px] md:h-[365px] overflow-hidden bg-gray-50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Category Thumbnail Image or Clean Neutral Box */}
                {cat.image ? (
                  <Link to={cat.slug} className="block w-full h-full">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      draggable={false}
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center p-6 text-center" />
                )}

                {/* Floating White Label Box at Bottom matching attached design */}
                <Link
                  to={cat.slug}
                  className="absolute left-3 right-3 sm:left-4 sm:right-4 bottom-3 sm:bottom-4 bg-white shadow-sm px-4 py-3 flex items-center justify-between border-0 transition-transform duration-300 group-hover:-translate-y-0.5 z-10"
                >
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-500 font-normal">
                    {cat.count}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Centered Circular Navigation Buttons matching attached Product_Category_ddffba0a.jpg */}
          <div className="flex items-center justify-center space-x-3 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => handleScrollCategories('left')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#a3a3a3] hover:bg-black text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              style={{ borderRadius: '9999px' }}
              aria-label="Previous product categories"
              title="Previous product categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollCategories('right')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-[#7a49a6] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              style={{ borderRadius: '9999px' }}
              aria-label="Next product categories"
              title="Next product categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: OUR BESTSELLERS (Full width background image with Add/Delete provision)
          ========================================================================= */}
      <section className="relative w-full py-12 sm:py-16 overflow-hidden bg-[#a8bba8]">
        {/* Full width background image or clean gradient if deleted */}
        {bestsellerBgImage ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat transition-all duration-500 pointer-events-none"
            style={{ backgroundImage: `url('${bestsellerBgImage}')` }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#8ba18b] via-[#9bb09b] to-[#7a937a] pointer-events-none flex items-center justify-center">
            <div className="text-white/40 text-xs uppercase tracking-widest font-semibold">
              Background Image Deleted
            </div>
          </div>
        )}

        <div className="relative w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
          {/* Header row: Left title & subtitle, Center provisions, Right circular navigation buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight font-['Poppins',sans-serif] text-left">
                Our Bestsellers
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-normal mt-3 leading-relaxed max-w-lg font-['Poppins',sans-serif] text-left">
                Explore our most loved beauty essentials, trusted by customers for delivering radiant skin, everyday confidence, and visible results.
              </p>
            </div>

            {/* Circular Navigation Buttons */}
            <div className="flex items-center space-x-2 self-start md:self-end">
              <button
                type="button"
                onClick={() => handleScrollBestsellers('left')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                  canScrollBestsellerLeft
                    ? 'bg-white text-gray-900 hover:bg-[#7a49a6] hover:text-white'
                    : 'bg-white/40 text-gray-700 hover:bg-white hover:text-black'
                }`}
                aria-label="Previous bestsellers"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
                <button
                  type="button"
                  onClick={() => handleScrollBestsellers('right')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                    canScrollBestsellerRight
                      ? 'bg-white text-gray-900 hover:bg-[#7a49a6] hover:text-white'
                      : 'bg-white/40 text-gray-700 hover:bg-white hover:text-black'
                  }`}
                  aria-label="Next bestsellers"
                >
                  <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 5 Product Listings Row matching reference */}
          <div
            ref={bestsellerScrollRef}
            onScroll={handleBestsellerScrollEvent}
            className="flex items-start gap-2 overflow-x-auto scroll-smooth pb-4 select-none no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {bestsellerProducts.map((item) => (
              <div
                key={item.id}
                className="group shrink-0 w-[270px] sm:w-[320px] md:w-[350px] lg:w-[calc((100%-32px)/5)] flex flex-col"
              >
                {/* Product Box (Pure White, border-0, shadow-xs) */}
                <div className="relative aspect-[374/498] bg-white overflow-hidden shadow-xs border-0">
                  <Link to={item.slug} className="block w-full h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                      draggable={false}
                    />
                  </Link>

                  {/* Add to Bag on mouse hover */}
                  {!item.isSoldout && (
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => handleAddBestsellerToBag(e, item)}
                        className="w-full py-2.5 px-4 bg-white/95 hover:bg-[#7a49a6] text-gray-900 hover:text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 border border-gray-100"
                      >
                        {addedNoticeMap[item.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            <span>Added to Bag!</span>
                          </>
                        ) : (
                          <span>Add to Bag</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Left-aligned details below the white box directly against sage background */}
                <div className="mt-3 text-left">
                  <Link
                    to={item.slug}
                    className="block text-sm sm:text-base font-medium text-white hover:text-white/80 transition-colors font-['Inter',sans-serif]"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center space-x-2 mt-0.5 text-xs sm:text-sm font-['Inter',sans-serif]">
                    <span className="line-through text-white/60">
                      ₹{item.regularPrice.toFixed(2)}
                    </span>
                    <span className="text-white font-medium">
                      ₹{item.sellingPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </section>

      {/* =========================================================================
          SECTION 6: PERSONAL CARE (Exact Layout Matching Personal-Care-Section_bad93f56.jpg)
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-[#5f3786] overflow-hidden select-none">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] flex flex-col">
          {/* Top Header: Left-Aligned Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-white tracking-tight font-['Poppins',sans-serif] text-left">
              Personal Care
            </h2>
          </div>

          {/* 3-Column Flexbox Layout: Left Thumbnails, Center 2-Slide Big Image, Right Thumbnails */}
          <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-6 sm:gap-7">
            {/* Left Column: 2 Stacked Thumbnails */}
            <div className="hidden lg:flex lg:flex-1 min-w-0 flex-col justify-between gap-6">
              {/* Left Top Thumbnail */}
              {(() => {
                const slotKey = 'left-top';
                const slot = pcareThumbnails[slotKey];
                const hasImage = Boolean(slot?.image);

                return (
                  <div className="relative flex-1 min-h-0 w-full bg-white overflow-hidden shadow-xs group">
                    {hasImage && (
                      <Link to={slot.link || '/category/personal-care'} className="block w-full h-full relative cursor-pointer">
                        <img
                          src={slot.image!}
                          alt={slot.title || 'Personal Care'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      </Link>
                    )}
                  </div>
                );
              })()}

              {/* Left Bottom Thumbnail */}
              {(() => {
                const slotKey = 'left-bottom';
                const slot = pcareThumbnails[slotKey];
                const hasImage = Boolean(slot?.image);

                return (
                  <div className="relative flex-1 min-h-0 w-full bg-white overflow-hidden shadow-xs group">
                    {hasImage && (
                      <Link to={slot.link || '/category/wet-wipes'} className="block w-full h-full relative cursor-pointer">
                        <img
                          src={slot.image!}
                          alt={slot.title || 'Personal Care'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      </Link>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Center Big Image: 2 Slides (Slide 1: Wet Wipes, Slide 2: Bodywash) with Respective Page Redirects */}
            {(() => {
              const currentCenterSlide = PERSONAL_CARE_CENTER_SLIDES[pcareSlideIndex] || PERSONAL_CARE_CENTER_SLIDES[0];

              return (
                <div className="relative w-full lg:w-[44%] xl:w-[42%] aspect-square shrink-0 overflow-hidden shadow-xs group bg-white">
                  <Link
                    to={currentCenterSlide.link}
                    className="block w-full h-full relative cursor-pointer"
                    title={`View ${currentCenterSlide.name} Collection`}
                  >
                    <img
                      src={currentCenterSlide.image}
                      alt={currentCenterSlide.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      draggable={false}
                    />
                  </Link>

                  {/* Circular Left and Right Arrows inside Center Image Matching Attached Design */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPcareSlideIndex((prev) => (prev === 0 ? 1 : 0));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-gray-900 hover:bg-black hover:text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous center slide"
                    title={`Switch to ${pcareSlideIndex === 0 ? 'Bodywash' : 'Wet Wipes'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPcareSlideIndex((prev) => (prev === 1 ? 0 : 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-gray-900 hover:bg-black hover:text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next center slide"
                    title={`Switch to ${pcareSlideIndex === 1 ? 'Wet Wipes' : 'Bodywash'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Slide Indicator Badge */}
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full pointer-events-none">
                    <span className="text-[11px] font-semibold text-white tracking-wider uppercase">
                      {currentCenterSlide.name}
                    </span>
                    <span className="text-white/70 text-[10px]">({pcareSlideIndex + 1}/2)</span>
                  </div>
                </div>
              );
            })()}

            {/* Right Column: 2 Stacked Thumbnails */}
            <div className="hidden lg:flex lg:flex-1 min-w-0 flex-col justify-between gap-6">
              {/* Right Top Thumbnail */}
              {(() => {
                const slotKey = 'right-top';
                const slot = pcareThumbnails[slotKey];
                const hasImage = Boolean(slot?.image);

                return (
                  <div className="relative flex-1 min-h-0 w-full bg-white overflow-hidden shadow-xs group">
                    {hasImage && (
                      <Link to={slot.link || '/category/bodywash'} className="block w-full h-full relative cursor-pointer">
                        <img
                          src={slot.image!}
                          alt={slot.title || 'Personal Care'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      </Link>
                    )}
                  </div>
                );
              })()}

              {/* Right Bottom Thumbnail */}
              {(() => {
                const slotKey = 'right-bottom';
                const slot = pcareThumbnails[slotKey];
                const hasImage = Boolean(slot?.image);

                return (
                  <div className="relative flex-1 min-h-0 w-full bg-white overflow-hidden shadow-xs group">
                    {hasImage && (
                      <Link to={slot.link || '/category/personal-care'} className="block w-full h-full relative cursor-pointer">
                        <img
                          src={slot.image!}
                          alt={slot.title || 'Personal Care'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      </Link>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 7: HOUSEHOLD CLEANERS (2-Row 5-Column Grid matching Reference Image)
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-white overflow-hidden select-none">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
          {/* Top-Left Heading matching reference image */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight font-['Poppins',sans-serif] text-left mb-8 sm:mb-10">
            Household Cleaners
          </h2>

          {/* 10 Products in a 2-Row 5-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-[20px]">
            {householdCleanerProducts.map((item) => (
              <div key={item.id} className="group flex flex-col">
                {/* Product Image Box */}
                <div className="relative aspect-[261/348] bg-[#f7f7f8] rounded-none overflow-hidden border-0">
                  <Link to={item.slug} className="block w-full h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      draggable={false}
                    />
                  </Link>

                  {/* Add to Bag on mouse hover */}
                  {!item.isSoldout && (
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => handleAddHouseholdToBag(e, item)}
                        className="w-full py-2.5 px-4 bg-white/95 hover:bg-[#7a49a6] text-gray-900 hover:text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 border border-gray-100"
                      >
                        {addedNoticeMap[item.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            <span>Added to Bag!</span>
                          </>
                        ) : (
                          <span>Add to Bag</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Left-aligned details below the product listing image */}
                <div className="mt-3 text-left">
                  <Link
                    to={item.slug}
                    className="block text-sm sm:text-base font-normal text-gray-900 hover:text-[#7a49a6] transition-colors font-['Poppins',sans-serif] truncate"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center space-x-2 mt-0.5 text-xs sm:text-sm font-['Poppins',sans-serif]">
                    <span className="line-through text-gray-400">
                      ₹{item.regularPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      ₹{item.sellingPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: TICKER MARQUEE BANNER (Color #5f3786)
          ========================================================================= */}
      <div className="bg-[#5f3786] text-white py-3 overflow-hidden border-y border-[#5f3786]">
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold tracking-wider uppercase flex space-x-8">
          <span>Pan-India Free shipping on orders over ₹599</span>
          <span>•</span>
          <span>100% Genuine Direct From Manufacturer</span>
          <span>•</span>
          <span>FDA Approved GMP Certified Facility</span>
          <span>•</span>
          <span>99.9% Certified Germ Protection</span>
          <span>•</span>
          <span>Bulk &amp; Institutional Supply Available</span>
          <span>•</span>
          <span>Pan-India Free shipping on orders over ₹599</span>
          <span>•</span>
          <span>100% Genuine Direct From Manufacturer</span>
          <span>•</span>
          <span>FDA Approved GMP Certified Facility</span>
          <span>•</span>
          <span>99.9% Certified Germ Protection</span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 9: OUR MOST LOVED ESSENTIALS (Matches Personcal Care-BG.jpg)
          Features:
          1. Dynamic background image with persistent Add & Delete provisions + device upload
          2. Product listing details & thumbnails dynamically retrieved from backend uploaded products
          3. Exact typography, layout, "SHOP NOW" CTA, and "Top Picks 30% Off" interactive floating card
          ========================================================================= */}
      <section className="relative w-full aspect-[1825/862] min-h-[380px] sm:min-h-[500px] lg:min-h-[640px] overflow-hidden select-none bg-[#f5ede5]">
        {/* Full Section Background Banner Image or Gradient Fallback */}
        {lovedEssentialsBg ? (
          <img
            src={lovedEssentialsBg}
            alt="Our Most Loved Essentials"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-linear-to-r from-[#d8c3b0] via-[#ede3d8] to-[#d8c3b0]" />
        )}

        {/* Left Side Content Overlay: Shifted to bottom and bottom-aligned with the right side white product box */}
        <div className="absolute left-4 sm:left-8 md:left-12 lg:left-[180px] xl:left-[200px] bottom-[6%] sm:bottom-[8%] md:bottom-[10%] max-w-[420px] sm:max-w-[480px] z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <span className="block text-white/90 text-xs sm:text-sm md:text-base font-light tracking-[0.2em] uppercase font-['Poppins',sans-serif] drop-shadow-xs">
              Our Most
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-semibold text-white leading-tight font-['Poppins',sans-serif] mt-1 sm:mt-1.5 drop-shadow-md">
              <span className="italic font-serif font-medium text-white">Loved</span> Essentials
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/95 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-[360px] font-['Poppins',sans-serif] drop-shadow-sm font-normal">
              Carefully formulated essentials designed for daily freshness, radiant hygiene, and complete family protection.
            </p>
            <div className="mt-4 sm:mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-5 sm:px-7 py-2 sm:py-2.5 bg-white hover:bg-[#7a49a6] text-gray-900 hover:text-white border border-white/80 hover:border-[#7a49a6] text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.18em] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>SHOP NOW</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Card ("Top Picks 30% Off") Overlay - Dynamically loaded from backend products */}
        <div className="absolute right-4 sm:right-8 md:right-12 lg:right-[180px] xl:right-[200px] bottom-[6%] sm:bottom-[8%] md:bottom-[10%] w-[92%] max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] bg-white rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between z-20 border border-black/5">
          {/* Card Header: Title & Navigation Arrows */}
          <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm md:text-base font-normal text-gray-900 font-['Poppins',sans-serif] tracking-tight">
                Top Picks 30% Off
              </h3>
              <span className="bg-[#7a49a6]/10 text-[#7a49a6] text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded">
                Live Store
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={handlePrevTopPick}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Previous top picks"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={handleNextTopPick}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Next top picks"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* 2 Products Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 flex-1 mt-2.5 sm:mt-3">
            {/* Product 1 */}
            {(() => {
              const item = currentTopPickPair.item1;
              return (
                <div key={item.id} className="group/item flex flex-col justify-between">
                  {/* Product Box */}
                  <div className="relative aspect-[247/310] bg-[#f7f7f8] rounded-md overflow-hidden flex items-center justify-center border border-gray-100/60">
                    {item.badge && (
                      <span className="absolute top-1.5 left-1.5 z-10 bg-[#f06553] text-white text-[8px] sm:text-[9px] md:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full leading-tight shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    <Link to={item.slug} className="block w-full h-full p-2 sm:p-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover/item:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        draggable={false}
                      />
                    </Link>

                    {/* Add to Bag on mouse hover or tap */}
                    <div className="absolute inset-x-1.5 sm:inset-x-2 bottom-1.5 sm:bottom-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-20">
                      <button
                        type="button"
                        onClick={(e) => handleAddTopPickToBag(e, item)}
                        className="w-full py-1 sm:py-1.5 px-1 sm:px-2 bg-white/95 hover:bg-[#7a49a6] text-gray-900 hover:text-white text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 border border-gray-100 rounded-sm"
                      >
                        {addedNoticeMap[item.id] ? (
                          <>
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 mr-1" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <span>Add to Bag</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Title and Price - backend derived */}
                  <div className="mt-1.5 sm:mt-2 text-left">
                    <Link
                      to={item.slug}
                      className="block text-[11px] sm:text-xs md:text-sm font-normal text-gray-900 hover:text-[#7a49a6] transition-colors font-['Poppins',sans-serif] truncate"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-['Poppins',sans-serif]">
                      <span className="line-through text-gray-400">
                        ₹{item.regularPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ₹{item.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Product 2 */}
            {(() => {
              const item = currentTopPickPair.item2;
              return (
                <div key={item.id} className="group/item flex flex-col justify-between">
                  {/* Product Box */}
                  <div className="relative aspect-[247/310] bg-[#f7f7f8] rounded-md overflow-hidden flex items-center justify-center border border-gray-100/60">
                    {item.badge && (
                      <span className="absolute top-1.5 left-1.5 z-10 bg-[#f06553] text-white text-[8px] sm:text-[9px] md:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full leading-tight shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    <Link to={item.slug} className="block w-full h-full p-2 sm:p-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover/item:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        draggable={false}
                      />
                    </Link>

                    {/* Add to Bag on mouse hover or tap */}
                    <div className="absolute inset-x-1.5 sm:inset-x-2 bottom-1.5 sm:bottom-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-20">
                      <button
                        type="button"
                        onClick={(e) => handleAddTopPickToBag(e, item)}
                        className="w-full py-1 sm:py-1.5 px-1 sm:px-2 bg-white/95 hover:bg-[#7a49a6] text-gray-900 hover:text-white text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 border border-gray-100 rounded-sm"
                      >
                        {addedNoticeMap[item.id] ? (
                          <>
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 mr-1" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <span>Add to Bag</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Title and Price - backend derived */}
                  <div className="mt-1.5 sm:mt-2 text-left">
                    <Link
                      to={item.slug}
                      className="block text-[11px] sm:text-xs md:text-sm font-normal text-gray-900 hover:text-[#7a49a6] transition-colors font-['Poppins',sans-serif] truncate"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-['Poppins',sans-serif]">
                      <span className="line-through text-gray-400">
                        ₹{item.regularPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ₹{item.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: UP TO 50% OFF FLASH DEAL WITH COUNTDOWN (Matches 50_Percent_Off_3bd6c5c5.jpg)
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-[#5f3786] select-none overflow-hidden">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
          {/* Top Header Row: Left Title & Right Countdown Timer */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-white tracking-tight font-['Poppins',sans-serif] leading-tight text-left">
                UP TO 50% OFF
              </h2>
            </div>

            {/* Countdown timer matching reference */}
            <div className="flex items-start space-x-3 sm:space-x-4 text-white select-none self-start sm:self-auto">
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[48px]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-white/90 font-light mt-1.5 font-['Inter',sans-serif]">
                  Days
                </span>
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light leading-none -mt-0.5">:</span>
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[48px]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-white/90 font-light mt-1.5 font-['Inter',sans-serif]">
                  Hours
                </span>
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light leading-none -mt-0.5">:</span>
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[48px]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-white/90 font-light mt-1.5 font-['Inter',sans-serif]">
                  Minutes
                </span>
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light leading-none -mt-0.5">:</span>
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[48px]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-none">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-white/90 font-light mt-1.5 font-['Inter',sans-serif]">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* Center Split Box: Left Lifestyle Photo (50%) + Right Product Listing (50%) */}
          <div className="relative bg-white grid grid-cols-1 md:grid-cols-2 shadow-xl overflow-hidden rounded-none">
            {/* Left Lifestyle Photo */}
            <div className="relative aspect-[682/512] md:aspect-auto md:h-full bg-gray-100 overflow-hidden">
              <img
                src="/assets/products/flash-deal-lifestyle.jpg"
                alt="WiZ Handwash Lavender Refill Pouch Complete Beauty Care"
                className="w-full h-full object-cover object-center pointer-events-none"
                loading="lazy"
                draggable={false}
              />

              {/* Center Nav Pill on the seam */}
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-20 items-center justify-center bg-white shadow-md rounded-full w-9 h-14 border border-gray-100 cursor-pointer">
                <div className="flex items-center space-x-0.5 text-gray-400 hover:text-gray-900 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                  <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
              </div>
            </div>

            {/* Right White Product Listing Panel */}
            <div className="p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between bg-white text-left">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-[22px] font-semibold text-gray-900 font-['Poppins',sans-serif] mb-6 sm:mb-8 text-left">
                  Complete Beauty Care
                </h3>

                {/* 3 Products Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                  {flashDealProducts.map((item) => (
                    <div key={item.id} className="group flex flex-col">
                      {/* Product Box */}
                      <div className="relative aspect-[184/246] bg-[#f7f7f8] rounded-none overflow-hidden border-0 flex items-center justify-center">
                        <Link to={item.slug} className="block w-full h-full">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                            draggable={false}
                          />
                        </Link>

                        {/* Add to Bag on mouse hover */}
                        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <button
                            type="button"
                            onClick={(e) => handleAddFlashDealToBag(e, item)}
                            className="w-full py-1.5 sm:py-2 px-1.5 bg-white/95 hover:bg-[#7a49a6] text-gray-900 hover:text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 border border-gray-100"
                          >
                            {addedNoticeMap[item.id] ? (
                              <>
                                <Check className="w-2.5 h-2.5 text-emerald-600 mr-1" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <span>Add to Bag</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title & Prices below */}
                      <div className="mt-2 text-left">
                        <Link
                          to={item.slug}
                          className="block text-xs sm:text-sm font-normal text-gray-900 hover:text-[#7a49a6] transition-colors font-['Poppins',sans-serif] truncate"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center space-x-1.5 mt-0.5 text-xs sm:text-sm font-['Poppins',sans-serif]">
                          <span className="line-through text-gray-400">
                            ₹{item.regularPrice.toFixed(2)}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            ₹{item.sellingPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: FULL-WIDTH MANIFESTO BANNER (Matches Reference Image)
          ========================================================================= */}
      <section className="relative w-full h-[400px] sm:h-[480px] bg-black overflow-hidden flex items-center justify-center text-center">
        <img
          src="/assets/every-drop-metters.jpg"
          alt="Every Drop Matters"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />

        <div className="relative max-w-2xl mx-auto px-4 text-white z-10">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-4 font-['Poppins',sans-serif]">
            Every Drop Matters
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-lg mx-auto mb-8">
            Watch how our formulations work to deliver pristine hygiene, active protection, and nourishing care with every single use.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-black hover:bg-[#7a49a6] hover:text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 transition-colors"
          >
            EXPLORE ALL PRODUCT
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: SHOPPABLE VIDEOS (Matching Reference Image with Add/Delete & Instagram Link)
          ========================================================================= */}
      <ShoppableVideosSection
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* =========================================================================
          SECTION 13: INTERACTIVE MULTI-VARIANT ACCORDION (Matches Reference Section 16)
          ========================================================================= */}
      <VariantMatrixAccordion products={products} />

      {/* =========================================================================
          SECTION 14: LATEST BLOG POSTS (Exact Match to Reference Layout Design)
          ========================================================================= */}
      <section className="w-full py-16 bg-white">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
          {/* Section Header: Heading positioned strictly on the left side */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight text-left font-['Poppins',sans-serif]">
                Latest Blog Posts
              </h2>
              <p className="text-xs text-gray-500 mt-1 text-left">
                Expert skincare rituals, minimalist beauty formulas, and radiant skin advice
              </p>
            </div>
          </div>

        {/* 3-Column Grid divided by thin vertical borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white">
          {blogPosts.map((post) => {
            const isImageTop = post.imagePosition === 'top';

            const textBlock = (
              <div
                key={`text-${post.id}`}
                className="flex flex-col items-center text-center px-4 py-8 sm:px-6 flex-1 justify-center"
              >
                <div className="inline-flex items-center px-4 py-1 rounded-full text-xs text-gray-600 bg-gray-50 border border-gray-200/90 mb-4 font-normal tracking-wide">
                  {post.date}
                </div>
                <h3 className="text-xl sm:text-[22px] font-semibold text-gray-900 leading-snug mb-3 text-center max-w-[280px] mx-auto hover:text-[#7a49a6] transition-colors cursor-pointer font-['Poppins',sans-serif]">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 text-center leading-relaxed max-w-[280px] mx-auto mb-5">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3.5 py-0.5 text-xs text-gray-700 bg-white border border-gray-200 hover:border-gray-300 transition-colors shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );

            const imageBlock = (
              <div
                key={`image-${post.id}`}
                className="p-4 sm:p-6 flex items-center justify-center"
              >
                {post.image ? (
                  <div className="relative group w-full max-w-[360px] aspect-square overflow-hidden bg-gray-50 shadow-2xs border border-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[360px] aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center" />
                )}
              </div>
            );

            return (
              <article key={post.id} className="flex flex-col justify-between">
                {isImageTop ? (
                  <>
                    {imageBlock}
                    {textBlock}
                  </>
                ) : (
                  <>
                    {textBlock}
                    {imageBlock}
                  </>
                )}
              </article>
            );
          })}
        </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: RECENTLY VIEWED (Tracks & Displays Last 4 Clicked Products)
          ========================================================================= */}
      {recentlyViewedProducts.length > 0 && (
        <section className="w-full py-14 sm:py-16 bg-[#fbfbfb] border-t border-gray-200">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] flex flex-col">
            {/* Header: Title, Browsing Subtitle, and Quick Links */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div className="text-left">
                <span className="text-[11px] font-bold tracking-widest text-[#7a49a6] uppercase block mb-1">
                  Based on your browsing
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-gray-900 tracking-tight font-['Poppins',sans-serif]">
                  Recently Viewed
                </h2>
              </div>

              <div className="flex items-center gap-4 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.removeItem('wiz_recently_viewed_products');
                      setRecentlyViewedProducts(products.slice(0, 4));
                    } catch {
                      // ignore
                    }
                  }}
                  className="text-xs text-gray-400 hover:text-[#7a49a6] transition-colors cursor-pointer"
                  title="Reset recently viewed items"
                >
                  Clear History
                </button>
                <Link
                  to="/shop"
                  className="text-xs sm:text-sm font-semibold text-[#7a49a6] hover:text-[#5f3786] transition-colors flex items-center gap-1 group"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* 4 Recently Viewed Cards Flexbox Row */}
            <div className="flex flex-wrap lg:flex-nowrap items-stretch justify-start gap-6">
              {recentlyViewedProducts.slice(0, 4).map((item) => {
                const defaultVariant = item.variants?.[0] || {
                  id: `${item.id}-default`,
                  name: item.packagingSize || 'Standard Pack',
                  sku: item.sku || item.id,
                  regularPrice: item.regularPrice,
                  sellingPrice: item.sellingPrice,
                  stock: item.stock || 100,
                  packagingSize: item.packagingSize || ''
                };

                const isNoticeActive = Boolean(addedNoticeMap[item.id]);

                return (
                  <div
                    key={item.id}
                    className="w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] shrink-0 group relative bg-white border border-gray-200 hover:border-gray-400 transition-all duration-200 flex flex-col justify-between shadow-2xs"
                  >
                    <div>
                      {/* Product Image Area */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#f8f8f8] flex items-center justify-center p-5">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => recordRecentlyViewed(item)}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <img
                            src={item.images?.[0] || '/assets/products/mini-green-bodywash.jpg'}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {item.discountPercent > 0 && (
                            <span className="bg-[#ff675d] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                              {item.discountPercent}% OFF
                            </span>
                          )}
                          {item.isSoldout && (
                            <span className="bg-black text-white text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-2xs">
                              Soldout
                            </span>
                          )}
                        </div>

                        {/* Quick View Button on Image */}
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(item)}
                          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Add To Bag on Hover */}
                        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          {item.isSoldout ? (
                            <button
                              disabled
                              className="w-full bg-gray-200 text-gray-500 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider cursor-not-allowed text-center shadow-md"
                            >
                              Sold Out
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                addToCart({
                                  productId: item.id,
                                  productName: item.name,
                                  slug: item.slug,
                                  variantId: defaultVariant.id,
                                  variantName: defaultVariant.name,
                                  sku: defaultVariant.sku,
                                  unitPrice: defaultVariant.sellingPrice,
                                  regularPrice: defaultVariant.regularPrice,
                                  quantity: 1,
                                  image: defaultVariant.image || item.images?.[0] || '',
                                  category: item.category
                                });
                                setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
                                setTimeout(() => {
                                  setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
                                }, 2000);
                              }}
                              className={`w-full py-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-1.5 cursor-pointer ${
                                isNoticeActive
                                  ? 'bg-green-600 text-white'
                                  : 'bg-black hover:bg-[#7a49a6] text-white'
                              }`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{isNoticeActive ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4 text-left">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                          {item.category || 'Hygiene Essential'}
                        </span>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#7a49a6] transition-colors text-left">
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={() => recordRecentlyViewed(item)}
                          >
                            {item.name}
                          </Link>
                        </h3>

                        {/* Pricing */}
                        <div className="mt-1.5 flex items-center justify-start space-x-2">
                          {item.regularPrice > item.sellingPrice && (
                            <span className="text-xs text-gray-400 line-through font-normal">
                              ₹{item.regularPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{item.sellingPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 15: LOVED BY EVERY SKIN TYPE (Matches Reference Design Exactly)
          ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#5f3786] border-t border-purple-900">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] flex flex-col">
          <div className="text-left mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-['Poppins',sans-serif]">
              Loved By Every Skin Type
            </h2>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-stretch justify-between gap-6">
            {/* Card 1: Free shipping */}
            <div className="w-full sm:w-[calc((100%-24px)/2)] lg:flex-1 lg:min-w-0 bg-white p-8 sm:p-10 flex flex-col items-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-full bg-[#f0e6fa] flex items-center justify-center mb-6 text-[#7a49a6]">
                <svg className="w-6 h-6 stroke-[#7a49a6]" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5h11v11H2z" />
                  <path d="M13 9h4l3 3v4h-7V9z" />
                  <circle cx="6" cy="17" r="2" />
                  <circle cx="16.5" cy="17" r="2" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Free shipping</h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-[240px]">
                Premium skincare products deliver a refreshing skin experience without compromising on quality and comfort for everyday beauty care.
              </p>
            </div>

            {/* Card 2: Customer Support */}
            <div className="w-full sm:w-[calc((100%-24px)/2)] lg:flex-1 lg:min-w-0 bg-white p-8 sm:p-10 flex flex-col items-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-full bg-[#f0e6fa] flex items-center justify-center mb-6 text-[#7a49a6]">
                <svg className="w-6 h-6 stroke-[#7a49a6]" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
                  <rect x="2" y="13" width="3.5" height="5.5" rx="1" />
                  <rect x="18.5" y="13" width="3.5" height="5.5" rx="1" />
                  <rect x="8" y="10" width="8" height="6" rx="1.5" strokeWidth="1.5" />
                  <path d="M10 16l-1 2v-2" />
                  <circle cx="10.5" cy="13" r="0.6" fill="#7a49a6" stroke="none" />
                  <circle cx="12" cy="13" r="0.6" fill="#7a49a6" stroke="none" />
                  <circle cx="13.5" cy="13" r="0.6" fill="#7a49a6" stroke="none" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Support</h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-[240px]">
                Our skincare experts provide reliable guidance and support without compromising your experience and comfort for better skincare results.
              </p>
            </div>

            {/* Card 3: Satisfaction */}
            <div className="w-full sm:w-[calc((100%-24px)/2)] lg:flex-1 lg:min-w-0 bg-white p-8 sm:p-10 flex flex-col items-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-full bg-[#f0e6fa] flex items-center justify-center mb-6 text-[#7a49a6]">
                <svg className="w-6 h-6 stroke-[#7a49a6]" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="10" r="1.5" />
                  <path d="M12 11.5V15" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Satisfaction</h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-[240px]">
                High-quality skincare products ensure a satisfying experience without compromising on results and comfort for your daily beauty routine.
              </p>
            </div>

            {/* Card 4: Free Returns */}
            <div className="w-full sm:w-[calc((100%-24px)/2)] lg:flex-1 lg:min-w-0 bg-white p-8 sm:p-10 flex flex-col items-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 rounded-full bg-[#f0e6fa] flex items-center justify-center mb-6 text-[#7a49a6]">
                <svg className="w-6 h-6 stroke-[#7a49a6]" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                  <text x="12" y="14.5" fontSize="7" fontWeight="bold" textAnchor="middle" stroke="none" fill="#7a49a6" fontFamily="sans-serif">24</text>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Free Returns</h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-[240px]">
                Enjoy hassle-free returns on skincare products without compromising your convenience and comfort for a smooth shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
