import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { Product, GeneralSettings } from '../types';
import {
  getProducts,
  getGeneralSettings,
  normalizePackagingSize,
  doesPackagingSizeMatch,
  extractProductFragrances
} from '../lib/storeService';
import { DEFAULT_PACKAGING_PRESETS } from '../lib/initialData';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

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
    items: [{ name: '1L & 5L Bulk', slug: '1l-5l-bulk' }]
  },
  {
    groupName: 'Paper Products',
    items: [{ name: 'Paper Products', slug: 'paper-products' }]
  }
];

export const ShopPage: React.FC = () => {
  useSEO({
    title: 'Shop All Products | WiZ Home Hygiene & Personal Care',
    description:
      'Explore our complete catalog of WiZ home hygiene and personal care products: Handwash, Wet Wipes, Dishwash Gel, Floor Cleaner, Liquid Matic Detergent, and 5L Bulk Cans.',
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/shop` : 'https://wizcare.in/shop'
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'featured';
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion open/close state: Categories expanded, all other Filters collapsed initially
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    categories: true,
    sizes: false,
    fragrance: false,
    price: false,
    availability: false
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [priceBucket, setPriceBucket] = useState<string>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  useEffect(() => {
    getProducts().then(setProducts);
    getGeneralSettings().then(setSettings);
  }, []);

  // Sync URL query params for size & fragrance filters
  useEffect(() => {
    const rawSizeParams = searchParams.getAll('size').flatMap((s) => s.split(',').map((x) => x.trim()).filter(Boolean));
    if (rawSizeParams.length > 0) {
      setSelectedSizes(
        rawSizeParams
          .map((s) => normalizePackagingSize(s) || s)
          .filter((s, idx, arr) => arr.indexOf(s) === idx)
      );
    } else {
      setSelectedSizes([]);
    }
    const rawFragParams = searchParams.getAll('fragrance').flatMap((f) => f.split(',').map((x) => x.trim()).filter(Boolean));
    setSelectedFragrances(rawFragParams);
  }, [searchParams]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Products scoped to selected category + search
  const baseScopedProducts = useMemo(() => {
    const catSlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
    return products.filter((p) => {
      if (catSlug !== 'all') {
        if (catSlug === '1l-5l-bulk') {
          const isBulkText = (text?: string) => Boolean(text && /\b(1|2|5)\s*(l|litre|liter)\b/i.test(text));
          const hasBulk = isBulkText(p.packagingSize) || p.variants.some((v) => isBulkText(v.packagingSize) || isBulkText(v.name));
          if (!hasBulk) return false;
        } else {
          const pCatSlug = p.category.toLowerCase().replace(/\s+/g, '-');
          if (pCatSlug !== catSlug && !p.slug.includes(catSlug)) return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const getProductPrices = (p: Product): number[] => {
    const prices = new Set<number>();
    if (typeof p.sellingPrice === 'number') prices.add(p.sellingPrice);
    if (Array.isArray(p.variants)) {
      p.variants.forEach((v) => {
        if (typeof v.sellingPrice === 'number') prices.add(v.sellingPrice);
      });
    }
    return Array.from(prices);
  };

  // Packaging Sizes extracted from backend product catalog & sorted by backend packagingPresets
  const availableSizes = useMemo(() => {
    const backendPresets = (settings?.packagingPresets || DEFAULT_PACKAGING_PRESETS).map((s) =>
      normalizePackagingSize(s)
    );
    const sizeMap = new Map<string, number>();

    baseScopedProducts.forEach((p) => {
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
        sizeMap.set(size, (sizeMap.get(size) || 0) + 1);
      });
    });

    const results: { size: string; count: number }[] = [];
    sizeMap.forEach((count, size) => results.push({ size, count }));

    return results.sort((a, b) => {
      const idxA = backendPresets.indexOf(a.size);
      const idxB = backendPresets.indexOf(b.size);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.count - a.count || a.size.localeCompare(b.size);
    });
  }, [baseScopedProducts, settings]);

  // Fragrances extracted from backend product catalog
  const availableFragrances = useMemo(() => {
    const fragCounts = new Map<string, { label: string; count: number }>();

    baseScopedProducts.forEach((p) => {
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
  }, [baseScopedProducts]);

  // Price tiers
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
        baseScopedProducts.forEach((p) => {
          const prices = getProductPrices(p);
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
  }, [baseScopedProducts]);

  const { inStockCount, outOfStockCount } = useMemo(() => {
    let inStock = 0;
    let outOfStock = 0;
    baseScopedProducts.forEach((p) => {
      if (p.isSoldout || p.stock <= 0) outOfStock += 1;
      else inStock += 1;
    });
    return { inStockCount: inStock, outOfStockCount: outOfStock };
  }, [baseScopedProducts]);

  const showSizesFilter = availableSizes.length > 0;
  const showFragranceFilter = availableFragrances.length > 0;
  const showPriceFilter =
    baseScopedProducts.length > 0 &&
    (availablePriceBuckets.length > 1 ||
      categoryMaxPrice > categoryMinPrice ||
      priceBucket !== 'all' ||
      Boolean(customMinPrice) ||
      Boolean(customMaxPrice));
  const showAvailabilityFilter = (inStockCount > 0 && outOfStockCount > 0) || availability !== 'all';

  const filteredProducts = useMemo(() => {
    return baseScopedProducts
      .filter((p) => {
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

        if (selectedFragrances.length > 0) {
          const productFrags = extractProductFragrances(p).map((f) => f.toLowerCase());
          const hasMatchingFrag = selectedFragrances.some((f) => {
            const cleanFrag = f.trim().toLowerCase();
            return productFrags.some((pf) => pf === cleanFrag);
          });
          if (!hasMatchingFrag) return false;
        }

        const productPrices = getProductPrices(p);
        if (priceBucket === 'under-100' && !productPrices.some((pr) => pr < 100)) return false;
        if (priceBucket === '100-200' && !productPrices.some((pr) => pr >= 100 && pr <= 200)) return false;
        if (priceBucket === '200-500' && !productPrices.some((pr) => pr > 200 && pr <= 500)) return false;
        if (priceBucket === 'above-500' && !productPrices.some((pr) => pr > 500)) return false;

        if (customMinPrice || customMaxPrice) {
          const minVal = customMinPrice ? parseFloat(customMinPrice) : -Infinity;
          const maxVal = customMaxPrice ? parseFloat(customMaxPrice) : Infinity;
          if (!productPrices.some((pr) => pr >= minVal && pr <= maxVal)) return false;
        }

        if (availability === 'in-stock' && (p.isSoldout || p.stock <= 0)) return false;
        if (availability === 'out-of-stock' && !p.isSoldout && p.stock > 0) return false;

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
    baseScopedProducts,
    selectedSizes,
    selectedFragrances,
    priceBucket,
    customMinPrice,
    customMaxPrice,
    availability,
    sortBy
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

  const selectCategory = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', slug);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const resetAllFilters = () => {
    setSelectedSizes([]);
    setSelectedFragrances([]);
    setPriceBucket('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setAvailability('all');
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  const totalActiveFilters =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedFragrances.length +
    (priceBucket !== 'all' || customMinPrice || customMaxPrice ? 1 : 0) +
    (availability !== 'all' ? 1 : 0);

  return (
    <div className="bg-white min-h-screen pb-16">
      <Breadcrumbs items={[{ label: 'Shop All Products' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner Header */}
        <div className="bg-[#f4f7f5] border border-gray-200 p-6 sm:p-10 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
            Complete Product Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shop WiZ Hygiene Essentials
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
            From everyday pocket wipes to 5L industrial cans, discover lab-tested antibacterial and home cleaning formulations at factory-direct pricing.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 gap-3 border-b border-gray-200">
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

          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-gray-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7a49a6]" />
              <span>Filters ({totalActiveFilters})</span>
            </button>

            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-300 focus:outline-none focus:border-[#7a49a6] text-xs w-full sm:w-48"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                next.set('sort', e.target.value);
                setSearchParams(next, { replace: true });
              }}
              className="border border-gray-300 bg-white py-1.5 px-2.5 focus:outline-none focus:border-[#7a49a6] text-xs font-medium cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Two-Column Layout: Left Filter Sidebar + Right Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white border border-gray-200 p-5 divide-y divide-gray-200 shadow-2xs">
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
                  {selectedCategory !== 'all' && (
                    <span className="text-[10px] bg-purple-50 text-[#7a49a6] px-1.5 py-0.2 font-bold">
                      1 Selected
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 group-hover:text-[#7a49a6] transition-transform duration-200 ${
                    openAccordions.categories ? 'rotate-180 text-[#7a49a6]' : ''
                  }`}
                />
              </button>

              {openAccordions.categories && (
                <div className="pb-3 pt-1 space-y-4 text-xs">
                  <button
                    type="button"
                    onClick={() => selectCategory('all')}
                    className={`w-full text-left px-2 py-1.5 rounded-sm transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#7a49a6] text-white font-bold shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Products ({products.length})</span>
                    {selectedCategory === 'all' && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.groupName} className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block pt-1">
                        {group.groupName}
                      </span>
                      <ul className="space-y-1 pl-1">
                        {group.items.map((item) => {
                          const isSelected = selectedCategory.toLowerCase() === item.slug;
                          return (
                            <li key={item.slug}>
                              <button
                                type="button"
                                onClick={() => selectCategory(item.slug)}
                                className={`w-full text-left px-2 py-1.5 rounded-sm transition-all flex items-center justify-between group cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#7a49a6] text-white font-bold shadow-xs'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <span className="truncate">{item.name}</span>
                                {isSelected && <Check className="w-3 h-3 stroke-[3] shrink-0" />}
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

            {/* ACCORDION 2: PACKAGING SIZES */}
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

            {/* ACCORDION 3: FRAGRANCE */}
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

            {/* ACCORDION 4: PRICE (₹) */}
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
                      { label: 'All Prices', value: 'all', count: baseScopedProducts.length },
                      ...availablePriceBuckets
                    ].map((tier) => (
                      <label
                        key={tier.value}
                        className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="shopPriceTier"
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

            {/* ACCORDION 5: AVAILABILITY */}
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
                      { label: 'All Items', value: 'all', count: baseScopedProducts.length },
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
                            name="shopAvailability"
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

          {/* Right Product Grid Area */}
          <main className="flex-1 min-w-0 w-full">
            {totalActiveFilters > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                <span className="text-[11px] font-bold uppercase text-gray-500 mr-1">
                  Active Filters:
                </span>

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800">
                    <span>Category: {selectedCategory}</span>
                    <button onClick={() => selectCategory('all')} className="text-gray-400 hover:text-red-500 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800"
                  >
                    <span>Size: {s}</span>
                    <button onClick={() => toggleSize(s)} className="text-gray-400 hover:text-red-500 p-0.5">
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
                    <button onClick={() => toggleFragrance(f)} className="text-[#7a49a6] hover:text-red-500 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {priceBucket !== 'all' && (
                  <span className="inline-flex items-center space-x-1 bg-white border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-800">
                    <span>Price: {priceBucket}</span>
                    <button onClick={() => setPriceBucket('all')} className="text-gray-400 hover:text-red-500 p-0.5">
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
                    <button onClick={() => setAvailability('all')} className="text-gray-400 hover:text-red-500 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button onClick={resetAllFilters} className="text-xs text-[#7a49a6] font-bold hover:underline ml-auto">
                  Clear All
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-200">
                <h3 className="text-base font-bold text-gray-900">No products match your criteria</h3>
                <p className="text-xs text-gray-500 mt-1">Try clearing your filters or search keywords.</p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 bg-black text-white text-xs font-bold px-4 py-2 uppercase tracking-wider"
                >
                  Reset Filters
                </button>
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
                  }
                  return <ProductCard key={p.id} product={p} showCategory={true} preferredVariantId={preferredVariantId} />;
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end lg:hidden">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-['Poppins'] font-semibold text-base text-gray-900 uppercase">
                Filter Products
              </h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-black p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories (Mobile) */}
            <div className="border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => toggleAccordion('categories')}
                className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
              >
                <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                  Categories
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openAccordions.categories ? 'rotate-180 text-[#7a49a6]' : ''
                  }`}
                />
              </button>

              {openAccordions.categories && (
                <div className="space-y-3 text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      selectCategory('all');
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded-sm text-xs flex items-center justify-between ${
                      selectedCategory === 'all' ? 'bg-[#7a49a6] text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Products</span>
                    {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.groupName} className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{group.groupName}</span>
                      <div className="space-y-1 pl-2">
                        {group.items.map((item) => {
                          const isSelected = selectedCategory.toLowerCase() === item.slug;
                          return (
                            <button
                              key={item.slug}
                              type="button"
                              onClick={() => {
                                navigate(`/category/${item.slug}`);
                                setMobileFiltersOpen(false);
                              }}
                              className={`w-full text-left py-1.5 px-2 rounded-sm text-xs flex items-center justify-between ${
                                isSelected ? 'bg-[#7a49a6] text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
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

            {/* Packaging Sizes (Mobile) */}
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

            {/* Fragrance (Mobile) */}
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

            {/* Price (Mobile) */}
            {showPriceFilter && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('price')}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
                >
                  <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                    Price (₹)
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openAccordions.price ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.price && (
                  <div className="space-y-2 text-xs pt-2">
                    {[
                      { label: 'All Prices', value: 'all', count: baseScopedProducts.length },
                      ...availablePriceBuckets
                    ].map((tier) => (
                      <label key={tier.value} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="shopPriceTierMobile"
                            checked={priceBucket === tier.value}
                            onChange={() => setPriceBucket(tier.value)}
                            className="border-gray-300 text-[#7a49a6]"
                          />
                          <span className={priceBucket === tier.value ? 'font-bold text-[#7a49a6]' : ''}>
                            {tier.label}
                          </span>
                        </div>
                        {tier.value !== 'all' && <span className="text-[10px] text-gray-400 font-mono">{tier.count}</span>}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Availability (Mobile) */}
            {showAvailabilityFilter && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('availability')}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer select-none"
                >
                  <span className="font-['Poppins'] font-semibold text-xs uppercase tracking-wider text-gray-900">
                    Availability
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openAccordions.availability ? 'rotate-180 text-[#7a49a6]' : ''
                    }`}
                  />
                </button>

                {openAccordions.availability && (
                  <div className="space-y-2 text-xs pt-2">
                    {[
                      { label: 'All Items', value: 'all', count: baseScopedProducts.length },
                      ...(inStockCount > 0 ? [{ label: 'In Stock Only', value: 'in-stock', count: inStockCount }] : []),
                      ...(outOfStockCount > 0 ? [{ label: 'Out of Stock', value: 'out-of-stock', count: outOfStockCount }] : [])
                    ].map((item) => (
                      <label key={item.value} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="shopAvailabilityMobile"
                            checked={availability === item.value}
                            onChange={() => setAvailability(item.value as 'all' | 'in-stock' | 'out-of-stock')}
                            className="border-gray-300 text-[#7a49a6]"
                          />
                          <span className={availability === item.value ? 'font-bold text-[#7a49a6]' : ''}>
                            {item.label}
                          </span>
                        </div>
                        {item.value !== 'all' && <span className="text-[10px] text-gray-400 font-mono">{item.count}</span>}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

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
