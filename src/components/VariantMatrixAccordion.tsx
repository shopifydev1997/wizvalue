import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface VariantMatrixAccordionProps {
  products: Product[];
}

interface VariantItem {
  id: string;
  name: string;
  sku: string;
  regularPrice: number;
  sellingPrice: number;
  stock: number;
  thumbnail: string;
}

interface CategoryRow {
  id: string;
  name: string;
  regularPrice: number;
  sellingPrice: number;
  thumbnail: string;
  matchCategory: string;
  variants: VariantItem[];
}

const DEFAULT_CATEGORIES: CategoryRow[] = [
  {
    id: 'cat-handwash',
    name: 'Hand Wash',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/products/Orange Handwash 500ml-1.jpg',
    matchCategory: 'Handwash',
    variants: [
      {
        id: 'hw-500ml',
        name: 'Hand Wash 500ml',
        sku: 'WIZ-HW-500',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 120,
        thumbnail: '/assets/products/Orange Handwash 500ml-1.jpg'
      },
      {
        id: 'hw-1l',
        name: 'Hand Wash 1L',
        sku: 'WIZ-HW-1L',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 85,
        thumbnail: '/assets/products/Lavender-Handwash-1L.jpg'
      },
      {
        id: 'hw-5l-purple',
        name: 'Hand Wash 5L',
        sku: 'WIZ-HW-5L-PURPLE',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 50,
        thumbnail: '/assets/products/Orange Handwash 5L.jpg'
      },
      {
        id: 'hw-5l-pink',
        name: 'Hand Wash 5L',
        sku: 'WIZ-HW-5L-PINK',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 45,
        thumbnail: '/assets/products/Orange Handwash 5L.jpg'
      }
    ]
  },
  {
    id: 'cat-dishwash',
    name: 'Dishwash',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/thumb-dishwash.png',
    matchCategory: 'Dishwash',
    variants: [
      {
        id: 'dw-500ml',
        name: 'Dishwash 500ml',
        sku: 'WIZ-DW-500',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 90,
        thumbnail: '/assets/thumb-dishwash.png'
      },
      {
        id: 'dw-750ml',
        name: 'Dishwash 750ml',
        sku: 'WIZ-DW-750',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 110,
        thumbnail: '/assets/products/household-dishwash-750.jpg'
      },
      {
        id: 'dw-1l',
        name: 'Dishwash 1L',
        sku: 'WIZ-DW-1L',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 65,
        thumbnail: '/assets/products/household-dishwash-1l.jpg'
      },
      {
        id: 'dw-5l',
        name: 'Dishwash 5L Can',
        sku: 'WIZ-DW-5L',
        regularPrice: 450.0,
        sellingPrice: 399.0,
        stock: 30,
        thumbnail: '/assets/thumb-dishwash.png'
      }
    ]
  },
  {
    id: 'cat-floorcleaner',
    name: 'Floor Cleaner',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/thumb-floorcleaner.png',
    matchCategory: 'Floor Cleaner',
    variants: [
      {
        id: 'fc-500ml',
        name: 'Floor Cleaner 500ml',
        sku: 'WIZ-FC-500',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 75,
        thumbnail: '/assets/thumb-floorcleaner.png'
      },
      {
        id: 'fc-750ml',
        name: 'Floor Cleaner 750ml',
        sku: 'WIZ-FC-750',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 95,
        thumbnail: '/assets/products/household-floor-cleaner-750.jpg'
      },
      {
        id: 'fc-1l',
        name: 'Floor Cleaner 1L',
        sku: 'WIZ-FC-1L',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 80,
        thumbnail: '/assets/products/household-floor-cleaner-1l.jpg'
      },
      {
        id: 'fc-5l',
        name: 'Floor Cleaner 5L Can',
        sku: 'WIZ-FC-5L',
        regularPrice: 450.0,
        sellingPrice: 399.0,
        stock: 40,
        thumbnail: '/assets/thumb-floorcleaner.png'
      }
    ]
  },
  {
    id: 'cat-liquidmatic',
    name: 'Liquid Matic',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/thumb-liquidmatic.png',
    matchCategory: 'Laundry Detergent',
    variants: [
      {
        id: 'lm-1l',
        name: 'Liquid Matic 1L Pouch',
        sku: 'WIZ-LM-1L',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 60,
        thumbnail: '/assets/thumb-liquidmatic.png'
      },
      {
        id: 'lm-2l',
        name: 'Liquid Matic 2L Bottle',
        sku: 'WIZ-LM-2L',
        regularPrice: 250.0,
        sellingPrice: 199.0,
        stock: 85,
        thumbnail: '/assets/products/household-liquid-matic-2l.jpg'
      },
      {
        id: 'lm-5l',
        name: 'Liquid Matic 5L Bulk Can',
        sku: 'WIZ-LM-5L',
        regularPrice: 550.0,
        sellingPrice: 499.0,
        stock: 35,
        thumbnail: '/assets/thumb-liquidmatic.png'
      }
    ]
  },
  {
    id: 'cat-glasscleaner',
    name: 'Glass Cleaner',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/thumb-glasscleaner.png',
    matchCategory: 'Glass Cleaner',
    variants: [
      {
        id: 'gc-500ml',
        name: 'Glass Cleaner 500ml Trigger',
        sku: 'WIZ-GC-500',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 70,
        thumbnail: '/assets/thumb-glasscleaner.png'
      },
      {
        id: 'gc-1l',
        name: 'Glass Cleaner 1L Refill',
        sku: 'WIZ-GC-1L',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 55,
        thumbnail: '/assets/products/household-glass-cleaner-1l.jpg'
      },
      {
        id: 'gc-5l',
        name: 'Glass Cleaner 5L Can',
        sku: 'WIZ-GC-5L',
        regularPrice: 450.0,
        sellingPrice: 399.0,
        stock: 25,
        thumbnail: '/assets/thumb-glasscleaner.png'
      }
    ]
  },
  {
    id: 'cat-toiletcleaner',
    name: 'Toilet Cleaner',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/thumb-toiletcleaner.png',
    matchCategory: 'Toilet Cleaner',
    variants: [
      {
        id: 'tc-500ml',
        name: 'Toilet Cleaner 500ml',
        sku: 'WIZ-TC-500',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 90,
        thumbnail: '/assets/thumb-toiletcleaner.png'
      },
      {
        id: 'tc-1l',
        name: 'Toilet Cleaner 1L Heavy Duty',
        sku: 'WIZ-TC-1L',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 100,
        thumbnail: '/assets/products/household-toilet-cleaner-1l.jpg'
      },
      {
        id: 'tc-5l',
        name: 'Toilet Cleaner 5L Commercial',
        sku: 'WIZ-TC-5L',
        regularPrice: 450.0,
        sellingPrice: 399.0,
        stock: 40,
        thumbnail: '/assets/thumb-toiletcleaner.png'
      }
    ]
  },
  {
    id: 'cat-paperproducts',
    name: 'Paper Products',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    thumbnail: '/assets/thumb-paperproducts.png',
    matchCategory: 'Paper Products',
    variants: [
      {
        id: 'pp-wipes-25',
        name: 'Wet Wipes 25 pulls',
        sku: 'WIZ-WW-25',
        regularPrice: 75.0,
        sellingPrice: 49.0,
        stock: 150,
        thumbnail: '/assets/products/top-pick-wet-wipes.jpg'
      },
      {
        id: 'pp-wipes-80',
        name: 'Wet Wipes 80 pulls with Flip Lid',
        sku: 'WIZ-WW-80',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 200,
        thumbnail: '/assets/thumb-paperproducts.png'
      },
      {
        id: 'pp-facial-4',
        name: 'Facial Tissue - Pack of 4',
        sku: 'WIZ-FT-4',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 80,
        thumbnail: '/assets/products/household-facial-tissue-4.jpg'
      },
      {
        id: 'pp-kitchen-towel',
        name: 'Absorbent Kitchen Towels 2-Rolls',
        sku: 'WIZ-KT-2',
        regularPrice: 150.0,
        sellingPrice: 99.0,
        stock: 60,
        thumbnail: '/assets/thumb-paperproducts.png'
      }
    ]
  }
];

// Helper to find matching backend product by category, subcategory or name
const findBackendProduct = (category: CategoryRow, products: Product[]): Product | undefined => {
  if (!products || products.length === 0) return undefined;

  // Direct match by category or category slug
  const directMatch = products.find((p) => {
    const pCat = (p.category || '').toLowerCase();
    const matchCat = (category.matchCategory || '').toLowerCase();
    const catName = category.name.toLowerCase();
    return (
      pCat === matchCat ||
      pCat.includes(matchCat) ||
      matchCat.includes(pCat) ||
      pCat.includes(catName)
    );
  });
  if (directMatch) return directMatch;

  // Name keyword search
  return products.find((p) => {
    const pName = (p.name || '').toLowerCase();
    const catName = category.name.toLowerCase();
    if (catName.includes('hand wash') || catName.includes('handwash')) {
      return pName.includes('hand wash') || pName.includes('handwash');
    }
    if (catName.includes('dishwash')) {
      return pName.includes('dishwash');
    }
    if (catName.includes('floor')) {
      return pName.includes('floor');
    }
    if (catName.includes('matic') || catName.includes('laundry')) {
      return pName.includes('matic') || pName.includes('laundry');
    }
    if (catName.includes('glass')) {
      return pName.includes('glass');
    }
    if (catName.includes('toilet')) {
      return pName.includes('toilet');
    }
    if (catName.includes('paper') || catName.includes('wipes')) {
      return pName.includes('wipe') || pName.includes('tissue') || pName.includes('paper');
    }
    return pName.includes(catName);
  });
};

// Default reference big banners extracted from WiZ-All_Products_b9e9079e.jpg
const DEFAULT_LEFT_BIG_BANNER = '/assets/wiz-lemon-handwash-banner.jpg';
const DEFAULT_RIGHT_BIG_BANNER = '/assets/wiz-bodywash-pink-can-banner.jpg';
const STORAGE_KEY_LEFT_BIG = 'wiz_variant_matrix_left_big_thumb_v2';
const STORAGE_KEY_RIGHT_BIG = 'wiz_variant_matrix_right_big_thumb_v2';

const PRESET_BIG_BANNERS = [
  {
    id: 'lemon-handwash',
    name: 'WiZ Lemon Hand Wash (Attached Reference)',
    url: '/assets/wiz-lemon-handwash-banner.jpg'
  },
  {
    id: 'bodywash-pink-can',
    name: 'WiZ Body Wash Paradise Lily Pink Can (Attached Reference)',
    url: '/assets/wiz-bodywash-pink-can-banner.jpg'
  },
  {
    id: 'pure-skin-science',
    name: 'WiZ Pure Skin Science Aesthetic',
    url: '/assets/aistudio/WiZ-H-Banner03.jpg'
  },
  {
    id: 'lavish-cleansing-foam',
    name: 'Lavish Cleansing Foam Nourishing',
    url: '/assets/wiz-banner-left.jpg'
  },
  {
    id: 'skincare-splash',
    name: 'Lavish Cleanse Purify & Refresh',
    url: '/assets/wiz-banner-right.jpg'
  },
  {
    id: 'wet-wipes-banner',
    name: 'Gentle Wet Wipes Reference',
    url: '/assets/aistudio/WiZ-H-Banner01.jpg'
  },
  {
    id: 'bestseller-portrait',
    name: 'Radiant Skincare Portrait',
    url: '/assets/products/bestseller-woman-portrait.jpg'
  }
];

export const VariantMatrixAccordion: React.FC<VariantMatrixAccordionProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [openCategoryId, setOpenCategoryId] = useState<string>('cat-handwash');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedVariants, setAddedVariants] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Big Thumbnail Product Images State (with Add / Delete provisions)
  const [leftBigBanner, setLeftBigBanner] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEFT_BIG);
      if (saved !== null) {
        if (saved === 'null' || saved === '""') return null;
        try {
          return JSON.parse(saved);
        } catch {
          return saved;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_LEFT_BIG_BANNER;
  });

  const [rightBigBanner, setRightBigBanner] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RIGHT_BIG);
      if (saved !== null) {
        if (saved === 'null' || saved === '""') return null;
        try {
          return JSON.parse(saved);
        } catch {
          return saved;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_RIGHT_BIG_BANNER;
  });

  // Thumbnail overrides map for individual list rows (sourced from backend or storage)
  const [thumbnailOverrides] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('wiz_variant_matrix_thumbnails_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQtyChange = (variantId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[variantId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [variantId]: next };
    });
  };

  // Helper to get effective thumbnail for a category:
  // 1. Check if user manually overridden or deleted it
  // 2. Else check backend product uploaded image (from getProducts())
  // 3. Fallback to default thumbnail
  const getCategoryEffectiveData = (cat: CategoryRow) => {
    const backendProd = findBackendProduct(cat, products);

    let thumbnail = cat.thumbnail;
    if (thumbnailOverrides[cat.id] !== undefined) {
      thumbnail = thumbnailOverrides[cat.id]; // empty string if deleted
    } else if (cat.id === 'cat-handwash') {
      thumbnail = '/assets/products/Orange Handwash 500ml-1.jpg';
    } else if (backendProd?.images?.[0]) {
      thumbnail = backendProd.images[0];
    }

    const regularPrice = backendProd?.regularPrice || cat.regularPrice;
    const sellingPrice = backendProd?.sellingPrice || cat.sellingPrice;

    return {
      thumbnail,
      regularPrice,
      sellingPrice,
      backendProd
    };
  };

  // Helper to get effective thumbnail & price for a variant:
  // 1. Check if user manually overridden or deleted it
  // 2. Else check backend product variant image / price
  // 3. Else check backend product main image
  // 4. Fallback to default variant data
  const getVariantEffectiveData = (
    cat: CategoryRow,
    variant: VariantItem,
    backendProd: Product | undefined,
    idx: number
  ) => {
    let thumbnail = variant.thumbnail;

    // Try finding matching variant in backend product
    const backendVar =
      backendProd?.variants?.find(
        (v) =>
          v.name.toLowerCase().includes(variant.name.toLowerCase()) ||
          variant.name.toLowerCase().includes(v.packagingSize?.toLowerCase() || '') ||
          variant.name.toLowerCase().includes(v.name.toLowerCase())
      ) || backendProd?.variants?.[idx];

    if (thumbnailOverrides[variant.id] !== undefined) {
      thumbnail = thumbnailOverrides[variant.id];
    } else if (variant.id === 'hw-500ml' || (cat.id === 'cat-handwash' && idx === 0)) {
      thumbnail = '/assets/products/Orange Handwash 500ml-1.jpg';
    } else if (variant.id === 'hw-1l' || (cat.id === 'cat-handwash' && idx === 1)) {
      thumbnail = '/assets/products/Lavender-Handwash-1L.jpg';
    } else if (variant.id === 'hw-5l-purple' || variant.id === 'hw-5l-pink' || (cat.id === 'cat-handwash' && idx >= 2)) {
      thumbnail = '/assets/products/Orange Handwash 5L.jpg';
    } else if (backendVar?.image) {
      thumbnail = backendVar.image;
    } else if (backendProd?.images?.[0]) {
      thumbnail = backendProd.images[0];
    }

    const regularPrice = backendVar?.regularPrice ?? backendProd?.regularPrice ?? variant.regularPrice;
    const sellingPrice = backendVar?.sellingPrice ?? backendProd?.sellingPrice ?? variant.sellingPrice;
    const sku = backendVar?.sku || variant.sku;

    return {
      thumbnail,
      regularPrice,
      sellingPrice,
      sku,
      backendVar
    };
  };

  const handleAddVariant = (
    category: CategoryRow,
    variant: VariantItem,
    variantData: ReturnType<typeof getVariantEffectiveData>,
    categoryData: ReturnType<typeof getCategoryEffectiveData>
  ) => {
    const qty = quantities[variant.id] || 1;
    const effectiveImg = variantData.thumbnail || categoryData.thumbnail;
    const matched = categoryData.backendProd;

    addToCart({
      productId: matched?.id || category.id,
      productName: variant.name,
      slug: matched?.slug || `wiz-${variant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      variantId: variantData.backendVar?.id || variant.id,
      variantName: variant.name,
      sku: variantData.sku,
      unitPrice: variantData.sellingPrice,
      regularPrice: variantData.regularPrice,
      quantity: qty,
      image: effectiveImg,
      category: category.name
    });

    setAddedVariants((prev) => ({ ...prev, [variant.id]: true }));
    setTimeout(() => {
      setAddedVariants((prev) => ({ ...prev, [variant.id]: false }));
    }, 1500);
  };

  return (
    <section className="w-full bg-[#faf4ff] py-12 sm:py-16 lg:py-20 select-none overflow-hidden border-t border-b border-gray-200/60">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px]">
        {/* Top Header: Left Title "Order By Pack & Volume" + Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight font-['Poppins',sans-serif] leading-tight text-left">
              Order By Pack &amp; Volume
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 font-['Poppins',sans-serif] text-left max-w-2xl leading-relaxed">
              Select bottle sizes, multipacks, 1L pouches, and 5L bulk cans directly for home or commercial sanitation.
            </p>
          </div>
        </div>

        {/* 3-Column Visual Grid matching WiZ-All_Products_b9e9079e.jpg */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* =========================================================================
              LEFT COLUMN: Big Thumbnail Product Image (Lemon Hand Wash Yellow Bottle)
              Features: Add, Upload, Replace, or Delete provisions
              ========================================================================= */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
            {leftBigBanner && (
              <div className="relative bg-white border border-gray-200/80 shadow-xs overflow-hidden rounded-none">
                <img
                  src={leftBigBanner}
                  alt="WiZ Lemon Hand Wash Big Thumbnail"
                  className="w-full h-auto object-cover select-none pointer-events-none transition-transform duration-500 ease-out hover:scale-102"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* =========================================================================
              CENTER COLUMN: Multi-Variant Accordion List (Backend Sourced Products)
              ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="bg-white shadow-sm border border-gray-200/90 rounded-none divide-y divide-gray-100 overflow-hidden">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isOpen = openCategoryId === cat.id;
                const catData = getCategoryEffectiveData(cat);
                const catImg = catData.thumbnail;

                return (
                  <div key={cat.id} className="transition-colors">
                    {/* Header Row */}
                    <div
                      onClick={() => setOpenCategoryId(isOpen ? '' : cat.id)}
                      className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left cursor-pointer hover:bg-neutral-50/70 transition-colors group select-none"
                    >
                      <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
                        {/* Category Packshot Thumbnail Container */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#f7f7f8] rounded-none shrink-0 flex items-center justify-center p-1 border border-gray-100">
                          {catImg && (
                            <img
                              src={catImg}
                              alt={cat.name}
                              className="max-w-full max-h-full object-contain pointer-events-none"
                              loading="lazy"
                            />
                          )}
                        </div>

                        {/* Title & Price */}
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-normal sm:font-medium text-gray-900 font-['Poppins',sans-serif] truncate group-hover:text-[#7a49a6] transition-colors">
                            {cat.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-0.5 text-xs sm:text-sm font-['Poppins',sans-serif]">
                            <span className="line-through text-gray-400">
                              ₹{catData.regularPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-900 font-semibold">
                              ₹{catData.sellingPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Chevron Toggle Button */}
                      <div
                        className="w-8 h-8 rounded-full bg-[#f7f7f8] group-hover:bg-neutral-200/80 flex items-center justify-center text-gray-500 transition-colors shrink-0 ml-3"
                        style={{ borderRadius: '9999px' }}
                      >
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Sub-Rows (Variants) when Expanded */}
                    {isOpen && (
                      <div className="bg-neutral-50/40 px-3.5 sm:px-6 py-2 border-t border-gray-100 divide-y divide-gray-100/80">
                        {cat.variants.map((variant, idx) => {
                          const qty = quantities[variant.id] || 1;
                          const isAdded = addedVariants[variant.id];
                          const variantData = getVariantEffectiveData(
                            cat,
                            variant,
                            catData.backendProd,
                            idx
                          );
                          const vImg = variantData.thumbnail;

                          return (
                            <div
                              key={variant.id}
                              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              {/* Left: Variant Packshot + Title + Price */}
                              <div className="flex items-center space-x-3 min-w-0">
                                {/* Variant Thumbnail */}
                                <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-none shrink-0 flex items-center justify-center p-1 border border-gray-200/80">
                                  {vImg && (
                                    <img
                                      src={vImg}
                                      alt={variant.name}
                                      className="max-w-full max-h-full object-contain pointer-events-none"
                                      loading="lazy"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 text-left">
                                  <h4 className="text-xs sm:text-sm font-normal text-gray-900 font-['Poppins',sans-serif] truncate">
                                    {variant.name}
                                  </h4>
                                  <div className="flex items-center space-x-1.5 mt-0.5 text-xs font-['Poppins',sans-serif]">
                                    <span className="line-through text-gray-400 text-[11px]">
                                      ₹{variantData.regularPrice.toFixed(2)}
                                    </span>
                                    <span className="text-gray-900 font-semibold text-xs">
                                      ₹{variantData.sellingPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Quantity Stepper + Add To Cart Button */}
                              <div className="flex items-center space-x-2.5 self-end sm:self-auto shrink-0">
                                {/* Quantity Stepper */}
                                <div className="flex items-center border border-gray-300 bg-white rounded-none">
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(variant.id, -1)}
                                    className="w-7 h-8 sm:w-8 sm:h-8.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium cursor-pointer"
                                    aria-label="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <span className="w-7 sm:w-8 text-center text-xs font-bold text-gray-900 select-none">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(variant.id, 1)}
                                    className="w-7 h-8 sm:w-8 sm:h-8.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium cursor-pointer"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* ADD TO CART Button */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAddVariant(cat, variant, variantData, catData)
                                  }
                                  className={`px-4 sm:px-5 py-2 sm:py-2.5 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] transition-all duration-200 flex items-center space-x-1.5 rounded-none shadow-xs cursor-pointer ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-black hover:bg-[#7a49a6] text-white'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 mr-1" />
                                      <span>ADDED</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>ADD TO CART</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Big Thumbnail Product Image (Body Wash Paradise Lily Can)
              Features: Shifted downwards matching design, Add, Upload, or Delete
              ========================================================================= */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3 lg:mt-56 xl:mt-64">
            {rightBigBanner && (
              <div className="relative bg-white border border-gray-200/80 shadow-xs overflow-hidden rounded-none">
                <img
                  src={rightBigBanner}
                  alt="WiZ Body Wash Paradise Lily Big Thumbnail"
                  className="w-full h-auto object-cover select-none pointer-events-none transition-transform duration-500 ease-out hover:scale-102"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xs flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}


    </section>
  );
};
