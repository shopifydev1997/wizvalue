import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Filter,
  Check,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Tag
} from 'lucide-react';
import { Product, Category, GeneralSettings } from '../types';
import {
  getProducts,
  getCategories,
  getGeneralSettings,
  normalizePackagingSize,
  doesPackagingSizeMatch,
  extractProductFragrances
} from '../lib/storeService';
import { resolveAssetUrl } from '../lib/imageAsset';
import { DEFAULT_PACKAGING_PRESETS } from '../lib/initialData';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

// Main tab category groupings for product category Filters sidebar & drawer
const CATEGORY_GROUPS = [
  {
    groupName: 'Personal Care',
    items: [
      { name: 'Handwash', slug: 'handwash' },
      { name: 'Hand Sanitizer', slug: 'hand-sanitizer' },
      { name: 'Wet Wipes', slug: 'wet-wipes' },
      { name: 'Bodywash', slug: 'bodywash' }
    ]
  },
  {
    groupName: 'Household Cleaners',
    items: [
      { name: 'Floor Cleaner', slug: 'floor-cleaner' },
      { name: 'Dish Wash', slug: 'dishwash' },
      { name: 'Glass Cleaner', slug: 'glass-cleaner' },
      { name: 'Toilet Cleaner', slug: 'toilet-cleaner' },
      { name: 'Laundry Detergent', slug: 'laundry-detergent' }
    ]
  },
  {
    groupName: '1L & 5L Bulk Care',
    items: [
      { name: '1L & 5L Bulk', slug: '1l-5l-bulk' }
    ]
  },
  {
    groupName: 'Paper Products',
    items: [
      { name: 'Paper Products', slug: 'paper-products' }
    ]
  }
];

// High-resolution banner image mapping for category pages
const CATEGORY_BANNERS: Record<string, string> = {
  'handwash': '/assets/products/Handwash-Innerpage-banner.jpg',
  'hand-sanitizer': '/assets/products/Sanitizer-Innerpage-banner.jpg',
  'floor-cleaner': '/assets/products/Floor-Cleaner-Innerpage-banner.jpg',
  'dishwash': '/assets/products/DishWash-Innerpage-banner.jpg',
  'glass-cleaner': '/assets/products/Glass-Cleaner-Innerpage-banner.jpg',
  'toilet-cleaner': '/assets/products/Toilet-Cleaner-Innerpage-banner.jpg',
  'laundry-detergent': '/assets/products/Laundry-Detergent-Innerpage-banner.jpg',
  'wet-wipes': '/assets/products/Wet-Wipes-Innerpage-banner.jpg',
  'bodywash': '/assets/Bodywash-Innerpage-banner.jpg',
  '1l-5l-bulk': '/assets/products/1-5LCan-Innerpage-banner.jpg',
  'paper-products': '/assets/products/Paper-Products-Innerpage-banner.jpg',
  'household-cleaners': '/assets/products/DishWash-Innerpage-banner.jpg',
  'personal-care': '/assets/Bodywash-Innerpage-banner.jpg'
};

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Accordion open/close state: Categories expanded, all other Filters collapsed initially
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    categories: true,
    sizes: false,
    fragrance: false,
    price: false,
    availability: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter States
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [priceBucket, setPriceBucket] = useState<string>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState('featured');

  // Collapse filter accordions (except Categories) and clear stale price/availability when switching category pages
  useEffect(() => {
    setOpenAccordions({
      categories: true,
      sizes: false,
      fragrance: false,
      price: false,
      availability: false
    });
    setPriceBucket('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setAvailability('all');
  }, [slug]);

  // Load initial parameters from URL and keep synced on route/query change
  useEffect(() => {
    const targetSlug = (slug || 'household-cleaners').toLowerCase();
    const rawSizeParams = searchParams.getAll('size').flatMap((s) => s.split(',').map((x) => x.trim()).filter(Boolean));
    if (rawSizeParams.length > 0) {
      const normalizedSizes = rawSizeParams
        .map((s) => normalizePackagingSize(s, targetSlug) || s)
        .filter((s, idx, arr) => arr.indexOf(s) === idx);
      setSelectedSizes(normalizedSizes);
    } else {
      setSelectedSizes([]);
    }
    const rawFragParams = searchParams.getAll('fragrance').flatMap((f) => f.split(',').map((x) => x.trim()).filter(Boolean));
    setSelectedFragrances(rawFragParams);
  }, [searchParams, slug]);

  useEffect(() => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
    getGeneralSettings().then(setSettings);
  }, []);

  const currentSlug = (slug || 'household-cleaners').toLowerCase();

  const currentCategory = useMemo(() => {
    const found = categories.find((c) => c.slug.toLowerCase() === currentSlug);
    if (found) return found;

    // Search inside the static category groups
    for (const group of CATEGORY_GROUPS) {
      const match = group.items.find((it) => it.slug === currentSlug);
      if (match) {
        return {
          id: match.slug,
          name: match.name,
          slug: match.slug,
          description: `Shop authentic FDA-approved WiZ ${match.name}. Clinical grade disinfection with pure skin-nourishing botanicals.`,
          image: '',
          order: 0,
          published: true
        };
      }
    }

    return {
      id: currentSlug,
      name: currentSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug: currentSlug,
      description: 'Explore FDA-approved WiZ home hygiene and personal care solutions.',
      image: '',
      order: 0,
      published: true
    };
  }, [currentSlug, categories]);

  const activeHeading =
    selectedSizes.length === 1
      ? `${currentCategory?.name || 'Category'} ${selectedSizes[0]}`
      : currentCategory?.name || 'Category';

  // SEO Friendly Metadata & Canonical URL
  useSEO({
    title: `${activeHeading} | WiZ Care`,
    description: `Shop genuine WiZ ${activeHeading} products. 99.9% germ protection, multiple packaging sizes, authentic factory prices, and direct WhatsApp order.`,
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/category/${currentSlug}` : `https://wizcare.in/category/${currentSlug}`
  });

  // Base Products for this category
  const baseCategoryProducts = useMemo(() => {
    if (!currentSlug) return products;

    return products.filter((p) => {
      if (currentSlug === 'household-cleaners') {
        const isPersonalCareProduct = ['Handwash', 'Hand Sanitizer', 'Wet Wipes', 'Bodywash'].includes(p.category);
        return (
          !isPersonalCareProduct &&
          (p.subcategory === 'Household Cleaners' ||
            ['Dishwash', 'Floor Cleaner', 'Laundry Detergent', 'Toilet Cleaner', 'Glass Cleaner'].includes(p.category))
        );
      }
      if (currentSlug === 'personal-care') {
        return (
          p.subcategory === 'Personal Care' ||
          ['Handwash', 'Hand Sanitizer', 'Wet Wipes', 'Bodywash'].includes(p.category)
        );
      }
      if (currentSlug === '1l-5l-bulk') {
        const isBulkText = (text?: string) =>
          Boolean(text && /\b(1|2|5)\s*(l|litre|liter)\b/i.test(text));
        return (
          isBulkText(p.packagingSize) ||
          p.variants.some((v) => isBulkText(v.packagingSize) || isBulkText(v.name))
        );
      }
      if (currentSlug === 'paper-products') {
        return p.category === 'Paper Products' || p.subcategory === 'Paper Products' || p.slug.includes('tissue');
      }

      // Check category name or slug
      const catSlug = p.category.toLowerCase().replace(/\s+/g, '-');
      return catSlug === currentSlug || p.slug.includes(currentSlug);
    });
  }, [currentSlug, products]);

  // Helper to get applicable prices for a product within the current category
  const getCategoryProductPrices = (p: Product): number[] => {
    const prices = new Set<number>();
    if (currentSlug === '1l-5l-bulk' && Array.isArray(p.variants) && p.variants.length > 0) {
      p.variants.forEach((v) => {
        const sizeLabel = normalizePackagingSize(v.packagingSize || v.name, p.category).toLowerCase();
        if (/\b(1|2|5)\s*litre\b/.test(sizeLabel)) {
          prices.add(v.sellingPrice);
        }
      });
    } else {
      if (typeof p.sellingPrice === 'number') prices.add(p.sellingPrice);
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => {
          if (typeof v.sellingPrice === 'number') prices.add(v.sellingPrice);
        });
      }
    }
    return Array.from(prices);
  };

  // Available Packaging Sizes dynamically extracted from backend products & normalized against backend presets
  const availableSizes = useMemo(() => {
    const backendPresets = (settings?.packagingPresets || DEFAULT_PACKAGING_PRESETS).map((s) =>
      normalizePackagingSize(s)
    );
    const sizeMap = new Map<string, number>();

    baseCategoryProducts.forEach((p) => {
      const productSizes = new Set<string>();
      if (p.packagingSize) {
        const norm = normalizePackagingSize(p.packagingSize, p.category);
        if (norm) productSizes.add(norm);
      }
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => {
          const raw = v.packagingSize || v.name;
          if (raw) {
            const norm = normalizePackagingSize(raw, p.category);
            if (norm) productSizes.add(norm);
          }
        });
      }

      productSizes.forEach((size) => {
        const lower = size.toLowerCase();
        if (!lower || lower === 'standard' || lower === 'standard pack') return;
        // On 1L & 5L Bulk category page, only list bulk 1L/2L/5L packaging filters
        if (currentSlug === '1l-5l-bulk' && !/\b(1|2|5)\s*litre\b/i.test(lower)) return;
        sizeMap.set(size, (sizeMap.get(size) || 0) + 1);
      });
    });

    const results: { size: string; count: number }[] = [];
    sizeMap.forEach((count, size) => {
      results.push({ size, count });
    });

    // Sort by backend Quick Packaging Presets order first, then count
    return results.sort((a, b) => {
      const idxA = backendPresets.indexOf(a.size);
      const idxB = backendPresets.indexOf(b.size);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.count - a.count || a.size.localeCompare(b.size);
    });
  }, [baseCategoryProducts, settings, currentSlug]);

  // Available Fragrances dynamically extracted strictly from backend product scent fields
  const availableFragrances = useMemo(() => {
    // Paper products (tissues/towels) are not filtered by fragrance
    if (currentSlug === 'paper-products') return [];

    const fragCounts = new Map<string, { label: string; count: number }>();

    baseCategoryProducts.forEach((p) => {
      const frags = extractProductFragrances(p);
      frags.forEach((frag) => {
        const key = frag.toLowerCase();
        const existing = fragCounts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          fragCounts.set(key, { label: frag, count: 1 });
        }
      });
    });

    return Array.from(fragCounts.values())
      .map(({ label, count }) => ({ fragrance: label, count }))
      .sort((a, b) => b.count - a.count || a.fragrance.localeCompare(b.fragrance));
  }, [baseCategoryProducts, currentSlug]);

  // Available Price Tiers dynamically computed from products & variants in the active category
  const { availablePriceBuckets, categoryMinPrice, categoryMaxPrice } = useMemo(() => {
    const tiers = [
      { label: 'Under ₹100', value: 'under-100', match: (price: number) => price < 100 },
      { label: '₹100 to ₹200', value: '100-200', match: (price: number) => price >= 100 && price <= 200 },
      { label: '₹200 to ₹500', value: '200-500', match: (price: number) => price > 200 && price <= 500 },
      { label: 'Above ₹500', value: 'above-500', match: (price: number) => price > 500 }
    ];

    let minP = Infinity;
    let maxP = -Infinity;

    const bucketResults = tiers
      .map((tier) => {
        let count = 0;
        baseCategoryProducts.forEach((p) => {
          const prices = getCategoryProductPrices(p);
          prices.forEach((pr) => {
            if (pr < minP) minP = pr;
            if (pr > maxP) maxP = pr;
          });
          if (prices.some(tier.match)) count += 1;
        });
        return { label: tier.label, value: tier.value, count };
      })
      .filter((b) => b.count > 0);

    return {
      availablePriceBuckets: bucketResults,
      categoryMinPrice: Number.isFinite(minP) ? minP : 0,
      categoryMaxPrice: Number.isFinite(maxP) ? maxP : 0
    };
  }, [baseCategoryProducts, currentSlug]);

  // Dynamic Availability counts for the active category
  const { inStockCount, outOfStockCount } = useMemo(() => {
    let inStock = 0;
    let outOfStock = 0;
    baseCategoryProducts.forEach((p) => {
      if (p.isSoldout || p.stock <= 0) outOfStock += 1;
      else inStock += 1;
    });
    return { inStockCount: inStock, outOfStockCount: outOfStock };
  }, [baseCategoryProducts]);

  // Show filter accordions only when relevant options exist for the selected product category
  const showSizesFilter = availableSizes.length > 0;
  const showFragranceFilter = availableFragrances.length > 0;
  const showPriceFilter =
    baseCategoryProducts.length > 0 &&
    (availablePriceBuckets.length > 1 || categoryMaxPrice > categoryMinPrice || priceBucket !== 'all' || Boolean(customMinPrice) || Boolean(customMaxPrice));
  const showAvailabilityFilter =
    (inStockCount > 0 && outOfStockCount > 0) || availability !== 'all';

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return baseCategoryProducts
      .filter((p) => {
        // Size Filter (matches backend normalized sizes cleanly across product & variants)
        if (selectedSizes.length > 0) {
          const candidateSizes: string[] = [];
          if (p.packagingSize) candidateSizes.push(p.packagingSize);
          if (Array.isArray(p.variants)) {
            p.variants.forEach((v) => {
              if (v.packagingSize) candidateSizes.push(v.packagingSize);
              if (v.name) candidateSizes.push(v.name);
            });
          }

          const hasMatchingSize = selectedSizes.some((sel) =>
            candidateSizes.some((cand) => doesPackagingSizeMatch(cand, sel, p.category))
          );
          if (!hasMatchingSize) return false;
        }

        // Fragrance Filter (matches backend primary fragrance & all fragrance options)
        if (selectedFragrances.length > 0) {
          const productFrags = extractProductFragrances(p).map((f) => f.toLowerCase());
          const hasMatchingFrag = selectedFragrances.some((f) => {
            const cleanFrag = f.trim().toLowerCase();
            return productFrags.some((pf) => pf === cleanFrag);
          });
          if (!hasMatchingFrag) return false;
        }

        // Price Bucket & Custom Min/Max Filter (checks product and variant prices)
        const productPrices = getCategoryProductPrices(p);
        if (priceBucket === 'under-100' && !productPrices.some((pr) => pr < 100)) return false;
        if (priceBucket === '100-200' && !productPrices.some((pr) => pr >= 100 && pr <= 200)) return false;
        if (priceBucket === '200-500' && !productPrices.some((pr) => pr > 200 && pr <= 500)) return false;
        if (priceBucket === 'above-500' && !productPrices.some((pr) => pr > 500)) return false;

        if (customMinPrice || customMaxPrice) {
          const minVal = customMinPrice ? parseFloat(customMinPrice) : -Infinity;
          const maxVal = customMaxPrice ? parseFloat(customMaxPrice) : Infinity;
          if (!productPrices.some((pr) => pr >= minVal && pr <= maxVal)) return false;
        }

        // Availability Filter
        if (availability === 'in-stock' && (p.isSoldout || p.stock <= 0)) return false;
        if (availability === 'out-of-stock' && (!p.isSoldout && p.stock > 0)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [
    baseCategoryProducts,
    selectedSizes,
    selectedFragrances,
    priceBucket,
    customMinPrice,
    customMaxPrice,
    availability,
    sortBy,
    currentSlug
  ]);

  const toggleSize = (size: string) => {
    const nextSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(nextSizes);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('size');
    nextSizes.forEach((s) => nextParams.append('size', s));
    setSearchParams(nextParams, { replace: true });
  };

  const toggleFragrance = (frag: string) => {
    const nextFrags = selectedFragrances.includes(frag)
      ? selectedFragrances.filter((f) => f !== frag)
      : [...selectedFragrances, frag];
    setSelectedFragrances(nextFrags);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('fragrance');
    nextFrags.forEach((f) => nextParams.append('fragrance', f));
    setSearchParams(nextParams, { replace: true });
  };

  const resetAllFilters = () => {
    setSelectedSizes([]);
    setSelectedFragrances([]);
    setPriceBucket('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setAvailability('all');
    setSearchParams({}, { replace: true });
  };

  const totalActiveFilters =
    selectedSizes.length +
    selectedFragrances.length +
    (priceBucket !== 'all' || customMinPrice || customMaxPrice ? 1 : 0) +
    (availability !== 'all' ? 1 : 0);

  // Schema.org JSON-LD Structured Data for CollectionPage & BreadcrumbList
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: typeof window !== 'undefined' ? window.location.origin : 'https://wizcare.in'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Shop',
            item: typeof window !== 'undefined' ? `${window.location.origin}/shop` : 'https://wizcare.in/shop'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: currentCategory?.name || 'Category',
            item: typeof window !== 'undefined' ? `${window.location.origin}/category/${currentSlug}` : `https://wizcare.in/category/${currentSlug}`
          }
        ]
      },
      {
        '@type': 'CollectionPage',
        name: `${currentCategory?.name || 'Category'} | WiZ Care`,
        description: currentCategory?.description,
        url: typeof window !== 'undefined' ? window.location.href : `https://wizcare.in/category/${currentSlug}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: filteredProducts.slice(0, 10).map((p, idx) => ({
            '@type': 'Product',
            position: idx + 1,
            name: p.name,
            description: p.shortDescription,
            image: p.images[0],
            sku: p.sku,
            offers: {
              '@type': 'Offer',
              price: p.sellingPrice,
              priceCurrency: 'INR',
              availability: p.isSoldout ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'
            }
          }))
        }
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Full-Width 350px Hero Banner below Menu with Breadcrumbs on Image */}
      <div className="w-full h-[350px] relative overflow-hidden bg-gray-900 mb-6 select-none">
        {/* Background Image */}
        <img
          src={resolveAssetUrl(
            CATEGORY_BANNERS[currentSlug] ||
            currentCategory?.image ||
            '/assets/products/Handwash-Innerpage-banner.jpg'
          )}
          alt={currentCategory?.name || 'Category Banner'}
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-700"
        />

        {/* Ambient Dark Gradient Overlays for high-contrast legible typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-[#7a49a6]/15 mix-blend-multiply" />

        {/* Banner Content Container aligned with uniform 180-200px margins */}
        <div className="absolute inset-0 w-full h-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] flex flex-col justify-between py-6 sm:py-8 z-10">
          {/* Breadcrumbs placed directly on the banner image */}
          <div>
            <Breadcrumbs
              light
              className="p-0 max-w-none"
              items={
                selectedSizes.length === 1
                  ? [
                      { label: 'Shop', path: '/shop' },
                      { label: currentCategory?.name || 'Category', path: `/category/${currentSlug}` },
                      { label: selectedSizes[0] }
                    ]
                  : [
                      { label: 'Shop', path: '/shop' },
                      { label: currentCategory?.name || 'Category' }
                    ]
              }
            />
          </div>

          {/* Banner Heading & Description */}
          <div className="max-w-2xl sm:max-w-3xl space-y-2 pb-2 sm:pb-3">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#3cd070] inline-block" />
              <span>Certified Hygiene</span>
              <span className="text-white/40">•</span>
              <span>{filteredProducts.length} Items Available</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-['Poppins'] font-semibold text-white tracking-tight drop-shadow-sm">
              {activeHeading}
            </h1>

            <p className="text-xs sm:text-sm text-gray-200 max-w-2xl leading-relaxed line-clamp-2 drop-shadow-xs">
              {currentCategory?.description ||
                'Formulated with high-efficacy active cleaning agents to deliver 99.9% germ protection while remaining gentle on hands and home surfaces.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Page Container with uniform 180-200px horizontal margins */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
        {/* Controls Bar: Total Count, Mobile Filters, and Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
            </span>
            {totalActiveFilters > 0 && (
              <span className="text-[11px] bg-purple-50 text-[#7a49a6] px-2 py-0.5 font-bold">
                {totalActiveFilters} filters applied
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border border-gray-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7a49a6]" />
              <span>Filters ({totalActiveFilters})</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium focus:outline-none focus:border-[#7a49a6]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Left Filter Sidebar + Right Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* =========================================================================
              LEFT SIDE FILTER SIDEBAR (Desktop Accordion Tabs)
              ========================================================================= */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white border border-gray-200 p-5 divide-y divide-gray-200 shadow-2xs">
            {/* Filter Header with Reset */}
            <div className="pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#7a49a6]" />
                <h3 className="font-['Poppins'] font-semibold text-sm text-gray-900 tracking-wide uppercase">
                  Filters
                </h3>
                {totalActiveFilters > 0 && (
                  <span className="bg-[#7a49a6] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalActiveFilters}
                  </span>
                )}
              </div>
              {totalActiveFilters > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] text-[#ff675d] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* ACCORDION 1: CATEGORIES */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleAccordion('categories')}
                className="w-full flex items-center justify-between py-2.5 text-left group cursor-pointer select-none"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900 group-hover:text-[#7a49a6] transition-colors">
                    Categories
                  </span>
                  <span className="text-[10px] bg-purple-50 text-[#7a49a6] px-1.5 py-0.2 font-bold">
                    1 Selected
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 group-hover:text-[#7a49a6] transition-transform duration-200 ${
                    openAccordions.categories ? 'rotate-180 text-[#7a49a6]' : ''
                  }`}
                />
              </button>

              {openAccordions.categories && (
                <div className="pb-3 pt-1 space-y-4 text-xs">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.groupName} className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block pt-1">
                        {group.groupName}
                      </span>
                      <ul className="space-y-1 pl-1">
                        {group.items.map((item) => {
                          const isSelected = currentSlug === item.slug;

                          return (
                            <li key={item.slug}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!isSelected) {
                                    navigate(`/category/${item.slug}`);
                                  }
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-sm transition-all flex items-center justify-between group cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#7a49a6] text-white font-bold shadow-xs'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'border-white bg-white text-[#7a49a6]'
                                        : 'border-gray-300 group-hover:border-[#7a49a6]'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span className="truncate">{item.name}</span>
                                </div>
                                {isSelected && (
                                  <span className="text-[9px] bg-white/20 px-1 font-mono uppercase">
                                    Active
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACCORDION 2: PACKAGING SIZES (Only if category has size filters) */}
            {showSizesFilter && (
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('sizes')}
                  className="w-full flex items-center justify-between py-2.5 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900 group-hover:text-[#7a49a6] transition-colors">
                      Packaging Sizes
                    </span>
                    {selectedSizes.length > 0 && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        {selectedSizes.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 group-hover:text-[#7a49a6] transition-transform duration-200 ${
                      openAccordions.sizes ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.sizes && (
                  <div className="pb-3 pt-1 space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                    {availableSizes.map(({ size, count }) => {
                      const isChecked = selectedSizes.includes(size);

                      return (
                        <label
                          key={size}
                          className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group py-0.5"
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSize(size)}
                              className="rounded border-gray-300 text-[#7a49a6] focus:ring-[#7a49a6] cursor-pointer"
                            />
                            <span className={`text-[11px] ${isChecked ? 'font-bold text-[#7a49a6]' : ''}`}>
                              {size}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-mono">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 3: FRAGRANCE (Only if category supports fragrance options) */}
            {showFragranceFilter && (
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('fragrance')}
                  className="w-full flex items-center justify-between py-2.5 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900 group-hover:text-[#7a49a6] transition-colors">
                      Fragrance
                    </span>
                    {selectedFragrances.length > 0 && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        {selectedFragrances.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#7a49a6]" />
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 group-hover:text-[#7a49a6] transition-transform duration-200 ${
                        openAccordions.fragrance ? 'rotate-180 text-[#7a49a6]' : ''
                      }`}
                    />
                  </div>
                </button>

                {openAccordions.fragrance && (
                  <div className="pb-3 pt-1 space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                    {availableFragrances.map(({ fragrance, count }) => {
                      const isChecked = selectedFragrances.includes(fragrance);

                      return (
                        <label
                          key={fragrance}
                          className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group py-0.5"
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFragrance(fragrance)}
                              className="rounded border-gray-300 text-[#7a49a6] focus:ring-[#7a49a6] cursor-pointer"
                            />
                            <span className={`text-[11px] ${isChecked ? 'font-bold text-[#7a49a6]' : ''}`}>
                              {fragrance}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-mono">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 4: PRICE (₹) (Only matching price ranges in this category) */}
            {showPriceFilter && (
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('price')}
                  className="w-full flex items-center justify-between py-2.5 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900 group-hover:text-[#7a49a6] transition-colors">
                      Price (₹)
                    </span>
                    {(priceBucket !== 'all' || customMinPrice || customMaxPrice) && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 group-hover:text-[#7a49a6] transition-transform duration-200 ${
                      openAccordions.price ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.price && (
                  <div className="pb-3 pt-1 space-y-2 text-xs">
                    {[
                      { label: 'All Prices', value: 'all', count: baseCategoryProducts.length },
                      ...availablePriceBuckets
                    ].map((tier) => (
                      <label
                        key={tier.value}
                        className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="priceTier"
                            checked={priceBucket === tier.value}
                            onChange={() => setPriceBucket(tier.value)}
                            className="border-gray-300 text-[#7a49a6] focus:ring-[#7a49a6] cursor-pointer"
                          />
                          <span className={`text-[11px] ${priceBucket === tier.value ? 'font-bold text-[#7a49a6]' : ''}`}>
                            {tier.label}
                          </span>
                        </div>
                        {tier.value !== 'all' && (
                          <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-mono">
                            {tier.count}
                          </span>
                        )}
                      </label>
                    ))}

                    {/* Min / Max numeric inputs scoped to category range */}
                    <div className="pt-2 flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder={categoryMinPrice > 0 ? `Min ₹${categoryMinPrice}` : 'Min ₹'}
                        value={customMinPrice}
                        onChange={(e) => setCustomMinPrice(e.target.value)}
                        className="w-1/2 p-1.5 border border-gray-300 text-[11px]"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder={categoryMaxPrice > 0 ? `Max ₹${categoryMaxPrice}` : 'Max ₹'}
                        value={customMaxPrice}
                        onChange={(e) => setCustomMaxPrice(e.target.value)}
                        className="w-1/2 p-1.5 border border-gray-300 text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 5: AVAILABILITY (Shown only if category has mixed stock states) */}
            {showAvailabilityFilter && (
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('availability')}
                  className="w-full flex items-center justify-between py-2.5 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900 group-hover:text-[#7a49a6] transition-colors">
                      Availability
                    </span>
                    {availability !== 'all' && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 group-hover:text-[#7a49a6] transition-transform duration-200 ${
                      openAccordions.availability ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.availability && (
                  <div className="pb-3 pt-1 space-y-2 text-xs">
                    {[
                      { label: 'All Items', value: 'all', count: baseCategoryProducts.length },
                      ...(inStockCount > 0 ? [{ label: 'In Stock Only', value: 'in-stock', count: inStockCount }] : []),
                      ...(outOfStockCount > 0 ? [{ label: 'Out of Stock', value: 'out-of-stock', count: outOfStockCount }] : [])
                    ].map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="availability"
                            checked={availability === item.value}
                            onChange={() => setAvailability(item.value as 'all' | 'in-stock' | 'out-of-stock')}
                            className="border-gray-300 text-[#7a49a6] focus:ring-[#7a49a6] cursor-pointer"
                          />
                          <span className={`text-[11px] ${availability === item.value ? 'font-bold text-[#7a49a6]' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                        {item.value !== 'all' && (
                          <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-mono">
                            {item.count}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* =========================================================================
              RIGHT CONTENT AREA (Active Filters Bar + Product Grid)
              ========================================================================= */}
          <main className="flex-1 min-w-0 w-full">
            {/* Active Filters Badges */}
            {totalActiveFilters > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                <span className="text-[11px] font-bold uppercase text-gray-500 mr-1">
                  Active Filters:
                </span>

                {selectedSizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800"
                  >
                    <span>Size: {s}</span>
                    <button
                      onClick={() => toggleSize(s)}
                      className="text-gray-400 hover:text-red-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedFragrances.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center space-x-1 bg-purple-50 border border-purple-200 text-[#7a49a6] px-2 py-1 text-[11px] font-semibold"
                  >
                    <span>Fragrance: {f}</span>
                    <button
                      onClick={() => toggleFragrance(f)}
                      className="text-[#7a49a6] hover:text-red-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {priceBucket !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800">
                    <span>Price: {priceBucket}</span>
                    <button
                      onClick={() => setPriceBucket('all')}
                      className="text-gray-400 hover:text-red-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(customMinPrice || customMaxPrice) && (
                  <span className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800">
                    <span>Range: ₹{customMinPrice || '0'} - ₹{customMaxPrice || '∞'}</span>
                    <button
                      onClick={() => {
                        setCustomMinPrice('');
                        setCustomMaxPrice('');
                      }}
                      className="text-gray-400 hover:text-red-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {availability !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800">
                    <span>Status: {availability}</span>
                    <button
                      onClick={() => setAvailability('all')}
                      className="text-gray-400 hover:text-red-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetAllFilters}
                  className="text-xs text-[#7a49a6] font-bold hover:underline ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-200 p-8">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 mx-auto flex items-center justify-center mb-3">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-['Poppins'] font-semibold text-base text-gray-900">
                  No products match your selected filters
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try unchecking specific size, fragrance or price criteria to see more available hygiene products.
                </p>
                <div className="mt-5 flex items-center justify-center space-x-3">
                  <button
                    onClick={resetAllFilters}
                    className="bg-[#7a49a6] hover:bg-[#5f3786] text-white text-xs font-bold px-6 py-2.5 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <Link
                    to="/shop"
                    className="bg-black text-white text-xs font-bold px-6 py-2.5 uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((p) => {
                  let preferredVariantId: string | undefined;
                  if (selectedSizes.length >= 1 && Array.isArray(p.variants)) {
                    const matchedVar = p.variants.find((v) =>
                      selectedSizes.some((sel) =>
                        doesPackagingSizeMatch(v.packagingSize || v.name, sel, p.category)
                      )
                    );
                    preferredVariantId = matchedVar?.id;
                  } else if (currentSlug === '1l-5l-bulk' && Array.isArray(p.variants)) {
                    const bulkVar = p.variants.find((v) =>
                      /\b(1|2|5)\s*litre\b/i.test(normalizePackagingSize(v.packagingSize || v.name, p.category))
                    );
                    preferredVariantId = bulkVar?.id;
                  } else if (priceBucket !== 'all' && Array.isArray(p.variants)) {
                    const priceMatch = (pr: number) => {
                      if (priceBucket === 'under-100') return pr < 100;
                      if (priceBucket === '100-200') return pr >= 100 && pr <= 200;
                      if (priceBucket === '200-500') return pr > 200 && pr <= 500;
                      if (priceBucket === 'above-500') return pr > 500;
                      return true;
                    };
                    if (!priceMatch(p.sellingPrice)) {
                      preferredVariantId = p.variants.find((v) => priceMatch(v.sellingPrice))?.id;
                    }
                  }
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      preferredVariantId={preferredVariantId}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =========================================================================
          MOBILE FILTER DRAWER
          ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end lg:hidden">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-['Poppins'] font-semibold text-base text-gray-900 uppercase">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ACCORDION 1: CATEGORIES (Mobile) */}
            <div className="border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => toggleAccordion('categories')}
                className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                    Categories
                  </span>
                  <span className="text-[10px] bg-purple-50 text-[#7a49a6] px-1.5 py-0.2 font-bold">
                    Active
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openAccordions.categories ? 'rotate-180 text-[#7a49a6]' : ''
                  }`}
                />
              </button>

              {openAccordions.categories && (
                <div className="space-y-3 text-xs pt-2">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.groupName} className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {group.groupName}
                      </span>
                      <div className="space-y-1 pl-2">
                        {group.items.map((item) => {
                          const isSelected = currentSlug === item.slug;
                          return (
                            <button
                              key={item.slug}
                              type="button"
                              onClick={() => {
                                navigate(`/category/${item.slug}`);
                                setMobileFiltersOpen(false);
                              }}
                              className={`w-full text-left py-1.5 px-2 rounded-sm text-xs flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#7a49a6] text-white font-bold'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span>{item.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACCORDION 2: PACKAGING SIZES (Mobile) */}
            {showSizesFilter && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('sizes')}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                      Packaging Sizes
                    </span>
                    {selectedSizes.length > 0 && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        {selectedSizes.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openAccordions.sizes ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.sizes && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs pt-2">
                    {availableSizes.map(({ size, count }) => (
                      <label key={size} className="flex items-center justify-between cursor-pointer py-0.5">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => toggleSize(size)}
                            className="rounded border-gray-300 text-[#7a49a6]"
                          />
                          <span className={selectedSizes.includes(size) ? 'font-bold text-[#7a49a6]' : ''}>
                            {size}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">{count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 3: FRAGRANCE (Mobile) */}
            {showFragranceFilter && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('fragrance')}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                      Fragrance
                    </span>
                    {selectedFragrances.length > 0 && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        {selectedFragrances.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#7a49a6]" />
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openAccordions.fragrance ? 'rotate-180 text-[#7a49a6]' : ''
                      }`}
                    />
                  </div>
                </button>

                {openAccordions.fragrance && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs pt-2">
                    {availableFragrances.map(({ fragrance, count }) => (
                      <label key={fragrance} className="flex items-center justify-between cursor-pointer py-0.5">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedFragrances.includes(fragrance)}
                            onChange={() => toggleFragrance(fragrance)}
                            className="rounded border-gray-300 text-[#7a49a6]"
                          />
                          <span className={selectedFragrances.includes(fragrance) ? 'font-bold text-[#7a49a6]' : ''}>
                            {fragrance}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">{count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 4: PRICE (₹) (Mobile) */}
            {showPriceFilter && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('price')}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                      Price (₹)
                    </span>
                    {(priceBucket !== 'all' || customMinPrice || customMaxPrice) && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openAccordions.price ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.price && (
                  <div className="space-y-2 text-xs pt-2">
                    {[
                      { label: 'All Prices', value: 'all', count: baseCategoryProducts.length },
                      ...availablePriceBuckets
                    ].map((tier) => (
                      <label
                        key={tier.value}
                        className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="priceTierMobile"
                            checked={priceBucket === tier.value}
                            onChange={() => setPriceBucket(tier.value)}
                            className="border-gray-300 text-[#7a49a6]"
                          />
                          <span className={priceBucket === tier.value ? 'font-bold text-[#7a49a6]' : ''}>
                            {tier.label}
                          </span>
                        </div>
                        {tier.value !== 'all' && (
                          <span className="text-[10px] text-gray-400 font-mono">{tier.count}</span>
                        )}
                      </label>
                    ))}

                    <div className="pt-2 flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder={categoryMinPrice > 0 ? `Min ₹${categoryMinPrice}` : 'Min ₹'}
                        value={customMinPrice}
                        onChange={(e) => setCustomMinPrice(e.target.value)}
                        className="w-1/2 p-1.5 border border-gray-300 text-[11px]"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder={categoryMaxPrice > 0 ? `Max ₹${categoryMaxPrice}` : 'Max ₹'}
                        value={customMaxPrice}
                        onChange={(e) => setCustomMaxPrice(e.target.value)}
                        className="w-1/2 p-1.5 border border-gray-300 text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 5: AVAILABILITY (Mobile) */}
            {showAvailabilityFilter && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('availability')}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                      Availability
                    </span>
                    {availability !== 'all' && (
                      <span className="text-[10px] bg-[#7a49a6] text-white px-1.5 py-0.2 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openAccordions.availability ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.availability && (
                  <div className="space-y-2 text-xs pt-2">
                    {[
                      { label: 'All Items', value: 'all', count: baseCategoryProducts.length },
                      ...(inStockCount > 0 ? [{ label: 'In Stock Only', value: 'in-stock', count: inStockCount }] : []),
                      ...(outOfStockCount > 0 ? [{ label: 'Out of Stock', value: 'out-of-stock', count: outOfStockCount }] : [])
                    ].map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="availabilityMobile"
                            checked={availability === item.value}
                            onChange={() => setAvailability(item.value as 'all' | 'in-stock' | 'out-of-stock')}
                            className="border-gray-300 text-[#7a49a6]"
                          />
                          <span className={availability === item.value ? 'font-bold text-[#7a49a6]' : ''}>
                            {item.label}
                          </span>
                        </div>
                        {item.value !== 'all' && (
                          <span className="text-[10px] text-gray-400 font-mono">{item.count}</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Apply / Reset Buttons */}
            <div className="pt-4 border-t border-gray-200 flex items-center space-x-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="w-1/2 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-wider"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 bg-[#7a49a6] text-white py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
