export interface PublicAssetItem {
  path: string;
  name: string;
  category: string;
}

export const FALLBACK_PUBLIC_ASSETS: PublicAssetItem[] = [
  // Handwash products & thumbnails
  { path: 'public/assets/products/Lemon-Handwash01.jpg', name: 'Lemon Handwash 01', category: 'Handwash' },
  { path: 'public/assets/products/Orange Handwash 500ml-1.jpg', name: 'Orange Handwash 500ml (Variant 1)', category: 'Handwash' },
  { path: 'public/assets/products/Orange Handwash 500ml.jpg', name: 'Orange Handwash 500ml', category: 'Handwash' },
  { path: 'public/assets/products/Orange Handwash 5L.jpg', name: 'Orange Handwash 5L Can', category: 'Handwash' },
  { path: 'public/assets/products/Lavender-Handwash-1L.jpg', name: 'Lavender Handwash 1L Refill Pouch', category: 'Handwash' },
  { path: 'public/assets/products/wiz-handwash-card.jpg', name: 'WiZ Handwash Card Preview', category: 'Handwash' },
  { path: 'public/assets/products/handwash.jpg', name: 'WiZ Antibacterial Handwash', category: 'Handwash' },
  { path: 'public/assets/products/household-handwash-500.jpg', name: 'Household Handwash 500ml', category: 'Handwash' },
  { path: 'public/assets/products/pouch-handwash-lavender-1l.jpg', name: 'Lavender Handwash 1L Value Pouch', category: 'Handwash' },
  { path: 'public/assets/products/Fresh Orange Hand Wash Advertisement-1.png', name: 'Fresh Orange Hand Wash Ad', category: 'Handwash' },
  { path: 'public/assets/products/Handwash-Innerpage-banner.jpg', name: 'Handwash Innerpage Banner', category: 'Handwash' },
  { path: 'public/assets/products/lemon-handwash-footer.jpg', name: 'Lemon Handwash Footer Image', category: 'Handwash' },

  // Wet Wipes
  { path: 'public/assets/products/Orange Wet Wipes.jpg', name: 'WiZ Orange Wet Wipes (80 Pulls)', category: 'Wet Wipes' },
  { path: 'public/assets/products/Fresh Lemon Mint Wet Wipes-1.png', name: 'Fresh Lemon Mint Wet Wipes', category: 'Wet Wipes' },
  { path: 'public/assets/products/Fresh Orange & Aloe Wet Wipes.png', name: 'Fresh Orange & Aloe Wet Wipes', category: 'Wet Wipes' },
  { path: 'public/assets/products/Rose Water Wet Wipes in Bloom.png', name: 'Rose Water Wet Wipes in Bloom', category: 'Wet Wipes' },
  { path: 'public/assets/Rose Water Wet Wipes in Bloom.png', name: 'Rose Water Wet Wipes', category: 'Wet Wipes' },
  { path: 'public/assets/products/WiZ-Wet-Wipes-02.jpg', name: 'WiZ Wet Wipes Flip Lid Pouch', category: 'Wet Wipes' },
  { path: 'public/assets/products/wiz-wet-wipes-card.jpg', name: 'WiZ Wet Wipes Card View', category: 'Wet Wipes' },
  { path: 'public/assets/products/mini-orange-wipes.jpg', name: 'Mini Orange Wipes Pack', category: 'Wet Wipes' },
  { path: 'public/assets/products/Wet-Wipes-Innerpage-banner.jpg', name: 'Wet Wipes Innerpage Banner', category: 'Wet Wipes' },

  // Bodywash
  { path: 'public/assets/products/Lemon Bodywash 5L.jpg', name: 'WiZ Lemon Bodywash 5L Can', category: 'Bodywash' },
  { path: 'public/assets/products/LilyBodywash 5L.jpg', name: 'WiZ Lily Bodywash 5L Can', category: 'Bodywash' },
  { path: 'public/assets/products/Bodywash-5L-Banner.jpg', name: 'WiZ Bodywash 5L Banner', category: 'Bodywash' },
  { path: 'public/assets/products/Bodywash-M1.jpg', name: 'WiZ Bodywash Lifestyle M1', category: 'Bodywash' },
  { path: 'public/assets/products/Bodywash-M2.jpg', name: 'WiZ Bodywash Lifestyle M2', category: 'Bodywash' },
  { path: 'public/assets/Bodywash-Innerpage-banner.jpg', name: 'Bodywash Innerpage Banner', category: 'Bodywash' },
  { path: 'public/assets/products/mini-green-bodywash.jpg', name: 'Nourishing Green Bodywash', category: 'Bodywash' },
  { path: 'public/assets/products/top-pick-bodywash.jpg', name: 'Top Pick Bodywash', category: 'Bodywash' },

  // Dishwash
  { path: 'public/assets/products/1L Dish Wash Pouch.jpg', name: 'WiZ 1L Dishwash Gel Pouch', category: 'Dishwash' },
  { path: 'public/assets/products/Lemon Fresh Dish Wash Refill Pouch-1.png', name: 'Lemon Fresh Dishwash Refill Pouch', category: 'Dishwash' },
  { path: 'public/assets/products/pouch-dishwash-lemon-1l.jpg', name: 'Lemon Active Dishwash Pouch 1L', category: 'Dishwash' },
  { path: 'public/assets/products/household-dishwash-1l.jpg', name: 'Household Dishwash 1L Bottle', category: 'Dishwash' },
  { path: 'public/assets/products/household-dishwash-750.jpg', name: 'Household Dishwash 750ml Bottle', category: 'Dishwash' },
  { path: 'public/assets/products/DishWash-Innerpage-banner.jpg', name: 'Dishwash Innerpage Banner', category: 'Dishwash' },
  { path: 'public/assets/Lemon Fresh Dishwash Refill Ad.png.png', name: 'Lemon Fresh Dishwash Refill Ad', category: 'Dishwash' },

  // Floor Cleaners
  { path: 'public/assets/products/Lemon-Floor-Cleaner 1L.jpg', name: 'WiZ Lemon Floor Cleaner 1L', category: 'Floor Cleaner' },
  { path: 'public/assets/products/Glossy Pink Floor Cleaner Refill Pouch-1.png', name: 'Pink Rose Floor Cleaner Refill Pouch', category: 'Floor Cleaner' },
  { path: 'public/assets/products/household-floor-cleaner-1l.jpg', name: 'Household Floor Cleaner 1L', category: 'Floor Cleaner' },
  { path: 'public/assets/products/household-floor-cleaner-750.jpg', name: 'Household Floor Cleaner 750ml', category: 'Floor Cleaner' },
  { path: 'public/assets/products/pouch-floor-cleaner-rose-1l.jpg', name: 'Rose Floor Cleaner 1L Pouch', category: 'Floor Cleaner' },
  { path: 'public/assets/products/Floor-Cleaner-Innerpage-banner.jpg', name: 'Floor Cleaner Innerpage Banner', category: 'Floor Cleaner' },
  { path: 'public/assets/Pink Rose Floor Cleaner Refill Ad.png', name: 'Pink Rose Floor Cleaner Refill Ad', category: 'Floor Cleaner' },
  { path: 'public/assets/products/lavender-podium-flower-background.jpg', name: 'Lavender Podium Background', category: 'Floor Cleaner' },

  // Laundry Detergents
  { path: 'public/assets/products/Top Load - Liquid Matic 2L.jpg', name: 'Top Load Liquid Matic 2L Bottle', category: 'Laundry' },
  { path: 'public/assets/products/WiZ Liquid Matic Fresh Laundry Ad.png', name: 'WiZ Liquid Matic Fresh Laundry Ad', category: 'Laundry' },
  { path: 'public/assets/WiZ Liquid Matic Fresh Laundry Refill.png', name: 'Liquid Matic Laundry Refill Pouch', category: 'Laundry' },
  { path: 'public/assets/products/LiquidMatic-M1.jpg', name: 'Liquid Matic Lifestyle M1', category: 'Laundry' },
  { path: 'public/assets/products/LiquidMatic-M2.jpg', name: 'Liquid Matic Lifestyle M2', category: 'Laundry' },
  { path: 'public/assets/products/household-liquid-matic-2l.jpg', name: 'Household Liquid Matic 2L', category: 'Laundry' },
  { path: 'public/assets/products/wiz-liquid-matic-card.jpg', name: 'WiZ Liquid Matic Card', category: 'Laundry' },
  { path: 'public/assets/products/Laundry-Detergent-Innerpage-banner.jpg', name: 'Laundry Detergent Banner', category: 'Laundry' },

  // Glass & Toilet Cleaners
  { path: 'public/assets/products/Glass-Cleaner 1L.jpg', name: 'WiZ Glass Cleaner 1L Bottle', category: 'Glass Cleaner' },
  { path: 'public/assets/products/household-glass-cleaner-1l.jpg', name: 'Household Glass Cleaner 1L', category: 'Glass Cleaner' },
  { path: 'public/assets/products/Glass-Cleaner-Innerpage-banner.jpg', name: 'Glass Cleaner Innerpage Banner', category: 'Glass Cleaner' },
  { path: 'public/assets/products/Toilet-Cleaner 1L.jpg', name: 'WiZ Power Toilet Cleaner 1L', category: 'Toilet Cleaner' },
  { path: 'public/assets/products/household-toilet-cleaner-1l.jpg', name: 'Household Toilet Cleaner 1L', category: 'Toilet Cleaner' },
  { path: 'public/assets/products/Toilet-Cleaner-Innerpage-banner.jpg', name: 'Toilet Cleaner Innerpage Banner', category: 'Toilet Cleaner' },

  // Sanitizers
  { path: 'public/assets/products/Sanitizer.jpg', name: 'WiZ 70% IPA Instant Hand Sanitizer', category: 'Sanitizer' },
  { path: 'public/assets/products/Fresh Mint Hand Sanitizer Still Life-1.png', name: 'Fresh Mint Hand Sanitizer Still Life', category: 'Sanitizer' },
  { path: 'public/assets/products/household-hand-sanitizer-5l.jpg', name: 'Institutional Hand Sanitizer 5L Can', category: 'Sanitizer' },
  { path: 'public/assets/products/Sanitizer-Innerpage-banner.jpg', name: 'Hand Sanitizer Innerpage Banner', category: 'Sanitizer' },

  // 1L & 5L Institutional Bulk Cans
  { path: 'public/assets/products/1-5LCan-Innerpage-banner.jpg', name: '1L & 5L Can Innerpage Banner', category: '1L & 5L Bulk' },

  // Paper Products & Tissues
  { path: 'public/assets/products/Mint-Paper-Products.jpg', name: 'WiZ Mint Facial Paper Products', category: 'Paper Products' },
  { path: 'public/assets/products/household-facial-tissue-4.jpg', name: 'Facial Tissue Box Pack of 4', category: 'Paper Products' },
  { path: 'public/assets/products/wiz-facial-tissue-card.jpg', name: 'WiZ Facial Tissue Card', category: 'Paper Products' },
  { path: 'public/assets/products/Paper-Products-Innerpage-banner.jpg', name: 'Paper Products Innerpage Banner', category: 'Paper Products' },

  // Brand, Line & Banners
  { path: 'public/assets/Fresh Home Care Product Line-1.png', name: 'Fresh Home Care Product Line', category: 'Banners' },
  { path: 'public/assets/WiZ-Logo-NEW-1.png', name: 'WiZ Official Logo', category: 'Banners' },
  { path: 'public/assets/WiZ-Logo-NEW.png', name: 'WiZ Brand Logo', category: 'Banners' },
  { path: 'public/assets/Blog01.jpg', name: 'Blog 01 - Clean Rituals', category: 'Blog' },
  { path: 'public/assets/Blog02.jpg', name: 'Blog 02 - Gentle pH Balance', category: 'Blog' },
  { path: 'public/assets/Blog03.jpg', name: 'Blog 03 - Nourishing Body Care', category: 'Blog' }
];

export async function fetchPublicAssets(): Promise<PublicAssetItem[]> {
  try {
    const res = await fetch('/api/admin/asset-library');
    if (res.ok) {
      const data = await res.json();
      if (data.assets && Array.isArray(data.assets) && data.assets.length > 0) {
        return data.assets;
      }
    }
  } catch (err) {
    console.warn('Using pre-indexed public assets library:', err);
  }
  return FALLBACK_PUBLIC_ASSETS;
}
