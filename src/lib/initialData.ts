import { Product, Category, Coupon, Freebie, GeneralSettings, BlogPost } from '../types';

export const DEFAULT_PACKAGING_PRESETS: string[] = [
  '500 ml Bottle',
  '750 ml Bottle',
  '1 Litre Pouch',
  '1 Litre Bottle',
  '2 Litre Can',
  '5 Litre Can',
  '80 Pulls Pack',
  'Pack of 4 Boxes'
];

export const INITIAL_SETTINGS: GeneralSettings = {
  websiteName: 'WiZ Home Hygiene & Personal Care',
  headerLogo: '/assets/WiZ-Logo-NEW-1.png',
  footerLogo: '/assets/WiZ-Logo-NEW-1.png',
  favicon: '/assets/products/Orange Wet Wipes.jpg',
  showHeaderLogo: true,
  showFooterLogo: true,
  footerImage: '/assets/Fresh Home Care Product Line-1.png',
  showFooterImage: true,
  contactEmail: 'wizvalue@cossmic.com',
  businessPhone: '+91 93213 87229',
  whatsappNumber: '+91 93213 87229',
  corporateAddress: 'Office No. 3rd Floor, Hi Life Mall, Sir P. M Road, Santacruz (West), Next to Santacruz Station, Mumbai - 400054',
  factoryAddress: 'Plot No. 15, Survey No. 34, Waliv, Vasai (East), Palghar, Maharashtra - 401208',
  freeShippingThreshold: 599,
  announcementText: 'Pan India Free Shipping Order Above ₹599/-',
  announcementActive: true,
  currency: '₹',
  googleAnalyticsId: 'G-WIZHYGIENE01',
  googleAdsConversionId: 'AW-1092837482',
  googleAdsStatus: 'Configured & Tracking Ready',
  headerBanners: [
    {
      id: 'banner-wet-wipes',
      title: 'Wet Wipes',
      subtitle: 'Lorem ipsum is standard placeholder text used in design, publishing',
      imageUrl: '/assets/aistudio/WiZ-H-Banner01.jpg',
      thumbnailUrl: '/assets/banner-wet-wipes-thumb.jpg',
      buttonText: 'EXPLORE PRODUCTS',
      buttonLink: '/category/wet-wipes',
      nextLabel: 'Pure Skin Science',
      isActive: true,
      order: 1
    },
    {
      id: 'banner-pure-skin-science',
      title: 'Pure Skin Science',
      subtitle: 'Carefully crafted ingredients that nourish deeply and support healthy skin balance.',
      imageUrl: '/assets/aistudio/WiZ-H-Banner03.jpg',
      thumbnailUrl: '/assets/products/Fresh Lemon Dishwashing Refill Pouch.png',
      buttonText: 'EXPLORE PRODUCTS',
      buttonLink: '/category/personal-care',
      nextLabel: 'Our Most Loved Essentials',
      isActive: true,
      order: 2
    },
    {
      id: 'banner-most-loved',
      title: 'Our Most Loved Essentials',
      subtitle: 'Discover our most-loved essentials, carefully crafted to deliver visible results and keep your skin radiant.',
      imageUrl: '/assets/aistudio/WiZ-H-Banner02.jpg',
      thumbnailUrl: '/assets/Lemon-Handwash01.jpg',
      buttonText: 'SHOP BESTSELLERS',
      buttonLink: '/shop',
      nextLabel: 'Wet Wipes',
      isActive: true,
      order: 3
    }
  ],
  megaMenuHighlights: {
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
      link: '/product/wiz-facial-tissue-pack-of-4',
      badge: 'TOP CHOICE',
      price: '₹140.00'
    },
    offers: {
      title: 'Hygiene Mega Bundle & Combo Packs',
      subtitle: 'Get up to 40% OFF + Free 100ml Sanitizer on orders above ₹799.',
      imageUrl: '/assets/aistudio/menu-dd-pc.jpg',
      link: '/offers',
      badge: '40% OFF',
      price: 'From ₹99.00'
    }
  },
  megaMenuLeftImages: {
    household: {
      imageUrl: '/assets/menu-dd-hhc.jpg',
      title: 'Household Cleaners',
      subtitle: '99.9% germ protection for hand, floor & fabric hygiene',
      link: '/category/household-cleaners',
      badge: 'BESTSELLER',
      visible: true
    },
    personal: {
      imageUrl: '/assets/aistudio/menu-dd-pc.jpg',
      title: 'Personal Care Essentials',
      subtitle: 'Ultra-soft wipes & refreshing body washes',
      link: '/category/personal-care',
      badge: 'DERMA TESTED',
      visible: true
    },
    paper: {
      imageUrl: '/assets/aistudio/menu-dd-paper.jpg',
      title: 'Virgin Pulp Paper Range',
      subtitle: '100% virgin pulp facial, kitchen & toilet rolls',
      link: '/category/paper-products',
      badge: '100% VIRGIN',
      visible: true
    }
  },
  facebookUrl: 'https://facebook.com/wizhygiene',
  instagramUrl: 'https://instagram.com/wizhygiene',
  linkedinUrl: 'https://linkedin.com/company/gulshan-cosmetics-wiz',
  packagingPresets: DEFAULT_PACKAGING_PRESETS
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-handwash',
    name: 'Handwash',
    slug: 'handwash',
    description: 'Enriched with neem, aloe vera and moisturizing glycerin for complete 99.9% germ protection.',
    image: '/assets/products/Handwash-Innerpage-banner.jpg',
    order: 1,
    published: true,
    itemsCount: 6
  },
  {
    id: 'cat-bodywash',
    name: 'Bodywash',
    slug: 'bodywash',
    description: 'Luxurious lathering shower gels that hydrate, refresh, and maintain healthy skin pH balance.',
    image: '/assets/Bodywash-Innerpage-banner.jpg',
    order: 2,
    published: true,
    itemsCount: 4
  },
  {
    id: 'cat-wet-wipes',
    name: 'Wet Wipes',
    slug: 'wet-wipes',
    description: 'Ultra-soft, thick cleansing wipes infused with aloe vera, chamomile, and natural botanicals.',
    image: '/assets/products/Wet-Wipes-Innerpage-banner.jpg',
    order: 3,
    published: true,
    itemsCount: 8
  },
  {
    id: 'cat-hand-sanitizer',
    name: 'Hand Sanitizer',
    slug: 'hand-sanitizer',
    description: '70% Isopropyl Alcohol disinfectant sanitizers for instant, waterless germ defense.',
    image: '/assets/products/Sanitizer-Innerpage-banner.jpg',
    order: 4,
    published: true,
    itemsCount: 5
  },
  {
    id: 'cat-laundry-detergent',
    name: 'Laundry Detergent',
    slug: 'laundry-detergent',
    description: 'Liquid Matic advanced enzyme formula for front-load and top-load washing machines.',
    image: '/assets/products/Laundry-Detergent-Innerpage-banner.jpg',
    order: 5,
    published: true,
    itemsCount: 7
  },
  {
    id: 'cat-floor-cleaner',
    name: 'Floor Cleaner',
    slug: 'floor-cleaner',
    description: 'Surface disinfectant with long-lasting lavender, citrus, and floral fragrance.',
    image: '/assets/products/Floor-Cleaner-Innerpage-banner.jpg',
    order: 6,
    published: true,
    itemsCount: 10
  },
  {
    id: 'cat-dishwash',
    name: 'Dishwash',
    slug: 'dishwash',
    description: 'Tough lemon active degreasing gel that leaves utensils sparkling clean and odor-free.',
    image: '/assets/products/DishWash-Innerpage-banner.jpg',
    order: 7,
    published: true,
    itemsCount: 11
  },
  {
    id: 'cat-glass-cleaner',
    name: 'Glass Cleaner',
    slug: 'glass-cleaner',
    description: 'Streak-free crystal clear shine on mirrors, glass tables, car windshields, and displays.',
    image: '/assets/products/Glass-Cleaner-Innerpage-banner.jpg',
    order: 8,
    published: true,
    itemsCount: 4
  },
  {
    id: 'cat-toilet-cleaner',
    name: 'Toilet Cleaner',
    slug: 'toilet-cleaner',
    description: 'Thick power disinfectant formula that removes tough stains, limescale, and 99.9% germs.',
    image: '/assets/products/Toilet-Cleaner-Innerpage-banner.jpg',
    order: 9,
    published: true,
    itemsCount: 5
  },
  {
    id: 'cat-paper-products',
    name: 'Paper Products',
    slug: 'paper-products',
    description: 'Premium facial tissues, kitchen absorbent towels, and soft multi-ply paper rolls.',
    image: '/assets/products/Paper-Products-Innerpage-banner.jpg',
    order: 10,
    published: true,
    itemsCount: 6
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-wet-wipes',
    name: 'WiZ Gentle Cleansing & Refreshing Wet Wipes',
    slug: 'wiz-wet-wipes-80-pulls',
    sku: 'WIZ-WW-080',
    category: 'Wet Wipes',
    subcategory: 'Personal Care',
    shortDescription: 'Ultra-soft, alcohol-free gentle wet wipes infused with natural aloe vera and chamomile extracts.',
    fullDescription: 'WiZ Wet Wipes are specially crafted to offer safe, gentle, and nourishing hygiene on the go. Formulated with 98% purified water and enriched with soothing aloe vera and chamomile, these wipes effortlessly wipe away dirt, impurities, and excess oil while maintaining the natural moisture balance of your skin. Hypoallergenic, paraben-free, and dermatologically tested for daily use across all skin types.',
    benefits: [
      'Infused with pure Aloe Vera and soothing Chamomile extract',
      'Alcohol-free, paraben-free, and 100% skin safe',
      'Thick, textured honeycomb fabric for superior cleaning with a single pull',
      'Resealable moisture-lock flip-top lid preserves freshness'
    ],
    usageInstructions: 'Open the flip-top lid, peel back the protective adhesive seal, pull out a wipe, and immediately reseal to prevent drying. Gently wipe hands, face, or neck. Discard responsibly; do not flush.',
    ingredients: 'Purified Water, Aloe Barbadensis Leaf Extract, Chamomilla Recutita Flower Extract, Glycerin, Polysorbate 20, Vitamin E, Phenoxyethanol, Fragrance.',
    images: [
      '/assets/products/wiz-wet-wipes-card.jpg',
      '/assets/products/Orange Wet Wipes.jpg',
      'https://images.unsplash.com/photo-1608248597359-00f735878484?w=800&auto=format&fit=crop&q=80',
      '/assets/products/Lemon Bodywash 5L.jpg',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      '/assets/products/1L Dish Wash Pouch.jpg',
      '/assets/products/Glass-Cleaner 1L.jpg',
      '/assets/products/Top Load - Liquid Matic 2L.jpg'
    ],
    regularPrice: 125,
    sellingPrice: 99,
    discountPercent: 25,
    packagingSize: '80 Pulls Pack',
    fragrance: 'Aloe Vera & Chamomile',
    fragrances: ['Aloe Vera & Chamomile', 'Unscented Natural'],
    stock: 250,
    isFeatured: true,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+wet+wipes',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20wipes',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20wipes',
    seoTitle: 'WiZ Gentle Wet Wipes (80 Pulls) - Buy Online India | WiZ Hygiene',
    seoDescription: 'Buy WiZ Gentle Cleansing Wet Wipes with Aloe Vera & Chamomile online at best price in India. Instant WhatsApp order, fast shipping.',
    published: true,
    rating: 4.8,
    reviewsCount: 142,
    variants: [
      {
        id: 'var-ww-single',
        name: 'Single Pack (80 Pulls)',
        sku: 'WIZ-WW-080',
        regularPrice: 125,
        sellingPrice: 99,
        stock: 120,
        packagingSize: '80 Pulls Pack',
        image: '/assets/products/Orange Wet Wipes.jpg'
      },
      {
        id: 'var-ww-pack2',
        name: 'Value Pack of 2 (160 Pulls)',
        sku: 'WIZ-WW-160',
        regularPrice: 250,
        sellingPrice: 189,
        stock: 80,
        packagingSize: 'Pack of 2',
        image: '/assets/products/Orange Wet Wipes.jpg'
      },
      {
        id: 'var-ww-pack4',
        name: 'Mega Saver Pack of 4 (320 Pulls)',
        sku: 'WIZ-WW-320',
        regularPrice: 500,
        sellingPrice: 350,
        stock: 50,
        packagingSize: 'Pack of 4',
        image: '/assets/products/Orange Wet Wipes.jpg'
      }
    ]
  },
  {
    id: 'prod-handwash',
    name: 'WiZ Anti-Bacterial Moisturizing Liquid Handwash',
    slug: 'wiz-anti-bacterial-handwash-500ml',
    sku: 'WIZ-HW-500',
    category: 'Handwash',
    subcategory: 'Household Cleaners',
    shortDescription: 'Germ protection handwash with moisturizing glycerin and refreshing natural citrus and peach fragrance.',
    fullDescription: 'WiZ Anti-Bacterial Handwash delivers 99.9% proven protection against illness-causing germs while being gentle on hands. Infused with skin-hydrating glycerin and natural extracts, it washes away grime and bacteria without stripping your skin of essential oils, making it ideal for frequent washing throughout the day.',
    benefits: [
      'Kills 99.9% of bacteria and germs in just 20 seconds',
      'Enriched with hydrating glycerin to prevent dryness',
      'Rich foaming formula with refreshing fragrance',
      'Available in economical 1L Refill Pouch and 5L Institutional Can'
    ],
    usageInstructions: 'Press pump once onto wet hands. Lather thoroughly for at least 20 seconds covering palms, fingers, and back of hands. Rinse completely with clean running water.',
    ingredients: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Sodium Chloride, Benzalkonium Chloride, Fragrance, Citric Acid, Tetrasodium EDTA.',
    images: [
      '/assets/Lemon-Handwash01.jpg',
      '/assets/products/Lavender-Handwash-1L.jpg',
      '/assets/products/handwash-pouch01.jpg',
      '/assets/products/Orange Handwash 5L.jpg',
      '/assets/products/Orange Handwash 500ml-1.jpg',
      '/assets/products/pouch-handwash-lavender-1l.jpg'
    ],
    regularPrice: 125,
    sellingPrice: 99,
    discountPercent: 21,
    packagingSize: '500 ml Bottle',
    fragrance: 'Neem & Aloe Vera',
    fragrances: ['Neem & Aloe Vera', 'Citrus Lemon', 'Lavender'],
    stock: 250,
    isFeatured: true,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+handwash',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20handwash',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20handwash',
    seoTitle: 'WiZ Anti-Bacterial Handwash 500ml, 1L & 5L | WiZ Care India',
    seoDescription: 'Order WiZ Antibacterial Handwash in 500ml bottle, 1L bottle, 1L pouch and 5L can online. Best prices, instant WhatsApp order, Pan-India shipping.',
    published: true,
    rating: 4.9,
    reviewsCount: 98,
    variants: [
      {
        id: 'var-hw-500',
        name: '500 ml Bottle',
        sku: 'WIZ-HW-500',
        regularPrice: 165,
        sellingPrice: 96,
        stock: 90,
        packagingSize: '500 ml Bottle',
        image: '/assets/products/Orange Handwash 500ml-1.jpg'
      },
      {
        id: 'var-hw-1l-bottle',
        name: '1 Litre Bottle',
        sku: 'WIZ-HW-1LB',
        regularPrice: 210,
        sellingPrice: 159,
        stock: 70,
        packagingSize: '1 Litre Bottle',
        image: '/assets/products/Lavender-Handwash-1L.jpg'
      },
      {
        id: 'var-hw-1l',
        name: '1 Litre Refill Pouch',
        sku: 'WIZ-HW-1L',
        regularPrice: 199,
        sellingPrice: 149,
        stock: 60,
        packagingSize: '1 Litre Pouch',
        image: '/assets/products/handwash-pouch01.jpg'
      },
      {
        id: 'var-hw-5l',
        name: '5 Litre Heavy Duty Can',
        sku: 'WIZ-HW-5L',
        regularPrice: 650,
        sellingPrice: 480,
        stock: 30,
        packagingSize: '5 Litre Can',
        image: '/assets/products/Orange Handwash 5L.jpg'
      }
    ]
  },
  {
    id: 'prod-dishwash',
    name: 'WiZ Active Lemon Power Dishwash Gel',
    slug: 'wiz-liquid-dishwash-gel-lemon',
    sku: 'WIZ-DW-750',
    category: 'Dishwash',
    subcategory: 'Household Cleaners',
    shortDescription: 'Concentrated grease-cutting dishwash gel with real lemon juice extracts. One spoon cleans an entire sink of utensils.',
    fullDescription: 'WiZ Active Lemon Dishwash Gel tackles tough burnt oil, sticky grease, and food stains with supreme ease. Its concentrated formulation creates thick, active cleansing bubbles that wash away without leaving chalky white residue on steel, glassware, or non-stick cookware.',
    benefits: [
      'Turbo grease-cutting power with natural lime extract',
      'Zero chalky white residue on glassware and stainless steel',
      'Gentle on skin with neutral pH',
      'Leaves pleasant, refreshing citrus aroma eliminating food smells'
    ],
    usageInstructions: 'Take 1 teaspoon (4-5 ml) of WiZ Gel in a small bowl with water. Dip sponge or scrub pad, squeeze to generate rich lather, and wash utensils. Rinse with water.',
    ingredients: 'Aqua, Anionic Surfactants, Amphoteric Surfactants, Natural Citrus Limon Extract, Glycerin, Colorant, Fragrance.',
    images: [
      '/assets/products/1L Dish Wash Pouch.jpg',
      '/assets/products/household-dishwash-750.jpg',
      '/assets/products/pouch-dishwash-lemon-1l.jpg'
    ],
    regularPrice: 150,
    sellingPrice: 93,
    discountPercent: 38,
    packagingSize: '750 ml Bottle',
    fragrance: 'Active Lemon',
    fragrances: ['Active Lemon', 'Green Apple'],
    stock: 210,
    isFeatured: true,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+dishwash',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20dishwash',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20dishwash',
    seoTitle: 'WiZ Lemon Dishwash Gel 750ml, 1L & 5L | WiZ Care',
    seoDescription: 'WiZ Active Lemon Dishwash Gel for tough grease and stain removal. Order online via WhatsApp or Amazon.',
    published: true,
    rating: 4.7,
    reviewsCount: 86,
    variants: [
      {
        id: 'var-dw-750',
        name: '750 ml Bottle',
        sku: 'WIZ-DW-750',
        regularPrice: 150,
        sellingPrice: 93,
        stock: 120,
        packagingSize: '750 ml Bottle',
        image: '/assets/products/household-dishwash-750.jpg'
      },
      {
        id: 'var-dw-1l',
        name: '1 Litre Refill Pouch',
        sku: 'WIZ-DW-1L',
        regularPrice: 180,
        sellingPrice: 129,
        stock: 60,
        packagingSize: '1 Litre Pouch',
        image: '/assets/products/pouch-dishwash-lemon-1l.jpg'
      },
      {
        id: 'var-dw-5l',
        name: '5 Litre Commercial Can',
        sku: 'WIZ-DW-5L',
        regularPrice: 599,
        sellingPrice: 449,
        stock: 30,
        packagingSize: '5 Litre Can',
        image: '/assets/products/1L Dish Wash Pouch.jpg'
      }
    ]
  },
  {
    id: 'prod-floor-cleaner',
    name: 'WiZ Disinfectant Floor Cleaner (Lavender Blossom)',
    slug: 'wiz-lavender-floor-cleaner-1l',
    sku: 'WIZ-FC-1L',
    category: 'Floor Cleaner',
    subcategory: 'Household Cleaners',
    shortDescription: '10x better germ kill than ordinary phenyls, safe for marble, granite, and ceramic tiles with long-lasting scent.',
    fullDescription: 'WiZ Floor Cleaner is an advanced disinfectant formulation tested to kill 99.9% of bacteria and viruses while removing stubborn soil, spills, and grease marks. Suitable for everyday mopping across marble, vitrified tiles, granite, mosaic, and hardwood surfaces.',
    benefits: [
      '10X superior germ kill versus phenyl',
      'Safe on luxury marble, granite, and tiles without dulling the finish',
      'Refreshing French Lavender aroma that lingers for hours',
      'No rinsing required; leaves sparkling streak-free floors'
    ],
    usageInstructions: 'Dilute 1 capful (approx. 20 ml) in half a bucket (4 litres) of water. Mop surface gently. For heavy stains, use undiluted and wipe with wet mop after 5 minutes.',
    ingredients: 'Benzalkonium Chloride, Non-ionic Surfactants, Fragrance, Colorant, Purified Water.',
    images: [
      '/assets/products/Lemon-Floor-Cleaner 1L.jpg',
      '/assets/products/household-floor-cleaner-750.jpg',
      '/assets/products/pouch-floor-cleaner-rose-1l.jpg'
    ],
    regularPrice: 160,
    sellingPrice: 99,
    discountPercent: 38,
    packagingSize: '1 Litre Pouch',
    fragrance: 'Lavender Blossom',
    fragrances: ['Lavender Blossom', 'Citrus Lemon', 'Pine Fresh'],
    stock: 190,
    isFeatured: true,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+floor+cleaner',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20floor%20cleaner',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20floor%20cleaner',
    seoTitle: 'WiZ Lavender Floor Cleaner 750ml, 1L & 5L | WiZ Hygiene',
    seoDescription: 'Buy WiZ Disinfectant Floor Cleaner with Lavender aroma. Kills 99.9% germs, marble-safe. WhatsApp ordering available.',
    published: true,
    rating: 4.8,
    reviewsCount: 114,
    variants: [
      {
        id: 'var-fc-750',
        name: '750 ml Bottle',
        sku: 'WIZ-FC-750',
        regularPrice: 150,
        sellingPrice: 93,
        stock: 75,
        packagingSize: '750 ml Bottle',
        image: '/assets/products/household-floor-cleaner-750.jpg'
      },
      {
        id: 'var-fc-1l',
        name: '1 Litre Refill Pouch',
        sku: 'WIZ-FC-1L',
        regularPrice: 160,
        sellingPrice: 99,
        stock: 80,
        packagingSize: '1 Litre Pouch',
        image: '/assets/products/pouch-floor-cleaner-rose-1l.jpg'
      },
      {
        id: 'var-fc-5l',
        name: '5 Litre Can',
        sku: 'WIZ-FC-5L',
        regularPrice: 550,
        sellingPrice: 420,
        stock: 35,
        packagingSize: '5 Litre Can',
        image: '/assets/products/Lemon-Floor-Cleaner 1L.jpg'
      }
    ]
  },
  {
    id: 'prod-laundry-detergent',
    name: 'WiZ Liquid Matic Laundry Detergent (Top & Front Load)',
    slug: 'wiz-liquid-matic-laundry-detergent-2l',
    sku: 'WIZ-LM-2L',
    category: 'Laundry Detergent',
    subcategory: 'Household Cleaners',
    shortDescription: 'Advanced enzyme active liquid detergent designed for both Front Load and Top Load automatic washing machines.',
    fullDescription: 'WiZ Liquid Matic Laundry Detergent dissolves instantly in water without leaving powder deposits on dark clothes. Equipped with active bio-enzymes, it penetrates deep into garment fabric weave to eliminate stubborn sweat, food stains, and collar grime while retaining fabric softness and brightness.',
    benefits: [
      '100% soluble liquid leaves zero powder residue on clothes',
      'Color care shield prevents fabric fading and protects vibrancy',
      'Suitable for both Front Load and Top Load machines',
      'Delivers long-lasting fresh linen fragrance'
    ],
    usageInstructions: 'For regular loads (4-6 kg), pour 1 cap (approx. 45 ml) into detergent drawer or drum. For heavily soiled clothes, use 1.5 caps (approx. 65 ml).',
    ingredients: 'Bio-enzymes, Optical Brighteners, Surfactant Complex, Fabric Softening Agents, Fragrance.',
    images: [
      '/assets/products/wiz-liquid-matic-card.jpg',
      '/assets/products/Top Load - Liquid Matic 2L.jpg',
      '/assets/products/WiZ Liquid Matic Fresh Laundry Refill.png',
      '/assets/products/LiquidMatic-M1.jpg',
      '/assets/products/5L-TL-mockup.webp',
      '/assets/products/LiquidMatic-M2.jpg'
    ],
    regularPrice: 200,
    sellingPrice: 159,
    discountPercent: 21,
    packagingSize: '1 Litre Top Load & Front Load Pouch',
    fragrance: 'Fresh Linen',
    fragrances: ['Fresh Linen', 'Lavender Breeze'],
    stock: 160,
    isFeatured: true,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+liquid+matic',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20detergent',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20detergent',
    seoTitle: 'WiZ Liquid Matic Laundry Detergent 1L, 2L & 5L | WiZ Store',
    seoDescription: 'High efficiency WiZ Liquid Matic laundry detergent for top & front load washers. Instant WhatsApp order enquiry.',
    published: true,
    rating: 4.8,
    reviewsCount: 72,
    variants: [
      {
        id: 'var-lm-1l',
        name: '1 Litre Top Load & Front Load Pouch',
        sku: 'WIZ-LM-1L',
        regularPrice: 200,
        sellingPrice: 159,
        stock: 50,
        packagingSize: '1 Litre Top Load & Front Load Pouch',
        image: '/assets/products/WiZ Liquid Matic Fresh Laundry Refill.png'
      },
      {
        id: 'var-lm-2l-tl',
        name: '2 Litre Top Load Pouch',
        sku: 'WIZ-LM-2L-TL',
        regularPrice: 250,
        sellingPrice: 199,
        stock: 35,
        packagingSize: '2 Litre Top Load Pouch',
        image: '/assets/products/Top Load - Liquid Matic 2L.jpg'
      },
      {
        id: 'var-lm-2l-fl',
        name: '2 Litre Front Load Pouch',
        sku: 'WIZ-LM-2L-FL',
        regularPrice: 275,
        sellingPrice: 219,
        stock: 30,
        packagingSize: '2 Litre Front Load Pouch',
        image: '/assets/products/LiquidMatic-M1.jpg'
      },
      {
        id: 'var-lm-5l-tl',
        name: '5 Litre Can Top Load',
        sku: 'WIZ-LM-5L-TL',
        regularPrice: 999,
        sellingPrice: 799,
        stock: 25,
        packagingSize: '5 Litre Can Top Load',
        image: '/assets/products/5L-TL-mockup.webp'
      },
      {
        id: 'var-lm-5l-fl',
        name: '5 Litre Can Front Load',
        sku: 'WIZ-LM-5L-FL',
        regularPrice: 1050,
        sellingPrice: 849,
        stock: 20,
        packagingSize: '5 Litre Can Front Load',
        image: '/assets/products/LiquidMatic-M2.jpg'
      }
    ]
  },
  {
    id: 'prod-sanitizer',
    name: 'WiZ Instant Alcohol Hand Sanitizer (70% IPA)',
    slug: 'wiz-instant-hand-sanitizer-5l',
    sku: 'WIZ-HS-5L',
    category: 'Hand Sanitizer',
    subcategory: 'Household Cleaners',
    shortDescription: 'WHO-recommended 70% Isopropyl Alcohol disinfectant sanitizing liquid for instant germ defense.',
    fullDescription: 'WiZ Hand Sanitizer provides quick, water-free sanitization with pharmaceutical-grade 70% Isopropyl Alcohol. Enriched with moisturizers to prevent skin dryness, it evaporates quickly leaving hands feeling clean, non-sticky, and refreshed.',
    benefits: [
      'Formulated with 70% v/v Isopropyl Alcohol as per WHO norms',
      'Kills 99.9% of disease-causing pathogens in 15 seconds',
      'Non-sticky, fast-drying texture with gentle skin conditioners',
      'Available in single-use 2ml Pouch Pack of 500, 500ml bottle, and 5L bulk can'
    ],
    usageInstructions: 'Apply 3-5 ml of liquid on dry palms. Rub vigorously covering palm, back of hands, fingers, and nails until dry. Do not wipe off.',
    ingredients: 'Isopropyl Alcohol 70% v/v, Glycerol, Hydrogen Peroxide, Fragrance, Purified Water.',
    images: [
      '/assets/products/Sanitizer.jpg',
      '/assets/products/Fresh Mint Hand Sanitizer Still Life.png',
      '/assets/products/household-hand-sanitizer-5l.jpg'
    ],
    regularPrice: 165,
    sellingPrice: 96,
    discountPercent: 42,
    packagingSize: '500 ml Bottle',
    fragrance: 'Unscented Natural',
    fragrances: ['Unscented Natural', 'Lemon Fresh'],
    stock: 110,
    isFeatured: false,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+hand+sanitizer',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20sanitizer',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20sanitizer',
    seoTitle: 'WiZ Hand Sanitizer 70% IPA 2ml Pack, 500ml & 5L | WiZ Care',
    seoDescription: 'Order WiZ 70% Alcohol Hand Sanitizer online in India. 2ml sachet pack of 500, 500ml bottle, and bulk 5L cans available.',
    published: true,
    rating: 4.9,
    reviewsCount: 54,
    variants: [
      {
        id: 'var-hs-2ml-500',
        name: '2ml Pouch Pack of 500',
        sku: 'WIZ-HS-2ML500',
        regularPrice: 500,
        sellingPrice: 399,
        stock: 45,
        packagingSize: '2ml Pouch pack of 500',
        image: '/assets/products/Sanitizer.jpg'
      },
      {
        id: 'var-hs-500',
        name: '500 ml Bottle',
        sku: 'WIZ-HS-500',
        regularPrice: 165,
        sellingPrice: 96,
        stock: 35,
        packagingSize: '500 ml Bottle',
        image: '/assets/products/Fresh Mint Hand Sanitizer Still Life.png'
      },
      {
        id: 'var-hs-5l',
        name: '5 Litre Bulk Can',
        sku: 'WIZ-HS-5L',
        regularPrice: 950,
        sellingPrice: 699,
        stock: 30,
        packagingSize: '5 Litre Can',
        image: '/assets/products/household-hand-sanitizer-5l.jpg'
      }
    ]
  },
  {
    id: 'prod-toilet-cleaner',
    name: 'WiZ Ultra Thick Power Disinfectant Toilet Cleaner',
    slug: 'wiz-disinfectant-toilet-cleaner-1l',
    sku: 'WIZ-TC-1L',
    category: 'Toilet Cleaner',
    subcategory: 'Household Cleaners',
    shortDescription: 'Thick blue power clinging liquid eliminates yellow stains, limescale, and 99.9% germs with sparkling freshness.',
    fullDescription: 'WiZ Disinfectant Toilet Cleaner features a specialized high-viscosity clinging formula that coats the toilet bowl rim to rim. The active acidic agents dissolve tough hard-water limescale and organic stains without damaging septic tanks.',
    benefits: [
      'Thick cling formula stays on bowl surfaces for maximum contact time',
      'Removes yellow hard-water stains and rust scales with ease',
      'Kills 99.9% of bacteria and viral pathogens',
      'Available in economical 1 Litre Refill Pouch and 5 Litre Heavy Can'
    ],
    usageInstructions: 'Pour/refill into dispensing bottle, squeeze under the rim and around the bowl. Leave for 20 minutes, brush lightly, then flush for a sparkling clean toilet.',
    ingredients: 'Hydrochloric Acid 10.5% w/v, Cetyl Trimethyl Ammonium Chloride, Methyl Salicylate, Acid Blue 80, Purified Water.',
    images: [
      '/assets/products/Toilet-Cleaner 1L.jpg',
      '/assets/products/household-toilet-cleaner-1l.jpg'
    ],
    regularPrice: 150,
    sellingPrice: 93,
    discountPercent: 38,
    packagingSize: '1 Litre Pouch',
    fragrance: 'Power Pine',
    fragrances: ['Power Pine', 'Ocean Breeze'],
    stock: 140,
    isFeatured: false,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+toilet+cleaner',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20toilet%20cleaner',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20toilet%20cleaner',
    seoTitle: 'WiZ Disinfectant Toilet Cleaner 1L Pouch & 5L Can | WiZ Care',
    seoDescription: 'Order WiZ Thick Power Toilet Cleaner online in 1 Litre Pouch and 5 Litre Can. Eliminates limescale and 99.9% germs.',
    published: true,
    rating: 4.8,
    reviewsCount: 68,
    variants: [
      {
        id: 'var-tc-1l',
        name: '1 Litre Refill Pouch',
        sku: 'WIZ-TC-1L',
        regularPrice: 150,
        sellingPrice: 93,
        stock: 100,
        packagingSize: '1 Litre Pouch',
        image: '/assets/products/Toilet-Cleaner 1L.jpg'
      },
      {
        id: 'var-tc-5l',
        name: '5 Litre Heavy Can',
        sku: 'WIZ-TC-5L',
        regularPrice: 699,
        sellingPrice: 520,
        stock: 40,
        packagingSize: '5 Litre Can',
        image: '/assets/products/household-toilet-cleaner-1l.jpg'
      }
    ]
  },
  {
    id: 'prod-glass-cleaner',
    name: 'WiZ Sparkle Streak-Free Glass & Surface Cleaner',
    slug: 'wiz-sparkle-glass-cleaner-1l',
    sku: 'WIZ-GC-750',
    category: 'Glass Cleaner',
    subcategory: 'Household Cleaners',
    shortDescription: 'Shine boosters with streak-free formula for mirrors, glass dining tables, car windscreens, and television screens.',
    fullDescription: 'WiZ Sparkle Glass Cleaner cuts through greasy fingerprints, dust films, and haze on glass and reflective surfaces. Formulated with fast-evaporating shine boosters, it leaves clear surfaces spotless and glistening.',
    benefits: [
      'Streak-free crystal clear finish on all glass surfaces',
      'Removes oily fingerprints, smudge marks, and airborne grime',
      'Anti-dust shield prevents rapid dust re-accumulation',
      'Safe on tinted glass, car windscreens, mirrors, and laptops'
    ],
    usageInstructions: 'Spray evenly onto glass from a distance of 15-20 cm. Wipe off immediately with a clean, lint-free microfiber cloth or newspaper.',
    ingredients: 'Isopropanol, Ethylene Glycol Monobutyl Ether, Surfactant, Fragrance, Water.',
    images: [
      '/assets/products/Glass-Cleaner 1L.jpg',
      '/assets/products/household-glass-cleaner-1l.jpg'
    ],
    regularPrice: 145,
    sellingPrice: 99,
    discountPercent: 32,
    packagingSize: '750 ml Bottle',
    fragrance: 'Ocean Breeze',
    fragrances: ['Ocean Breeze'],
    stock: 110,
    isFeatured: false,
    isBestseller: false,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+glass+cleaner',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20glass%20cleaner',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20glass%20cleaner',
    seoTitle: 'WiZ Sparkle Glass Cleaner 750ml, 1L & 5L | WiZ Care India',
    seoDescription: 'Buy WiZ Sparkle Glass Cleaner in 750ml bottle, 1L pouch, and 5L can for crystal streak-free shine on mirrors and glass.',
    published: true,
    rating: 4.6,
    reviewsCount: 39,
    variants: [
      {
        id: 'var-gc-750',
        name: '750 ml Bottle',
        sku: 'WIZ-GC-750',
        regularPrice: 145,
        sellingPrice: 99,
        stock: 50,
        packagingSize: '750 ml Bottle',
        image: '/assets/products/Glass-Cleaner 1L.jpg'
      },
      {
        id: 'var-gc-1l',
        name: '1 Litre Refill Pouch',
        sku: 'WIZ-GC-1L',
        regularPrice: 165,
        sellingPrice: 115,
        stock: 40,
        packagingSize: '1 Litre Pouch',
        image: '/assets/products/household-glass-cleaner-1l.jpg'
      },
      {
        id: 'var-gc-5l',
        name: '5 Litre Can',
        sku: 'WIZ-GC-5L',
        regularPrice: 580,
        sellingPrice: 420,
        stock: 20,
        packagingSize: '5 Litre Can',
        image: '/assets/products/Glass-Cleaner 1L.jpg'
      }
    ]
  },
  {
    id: 'prod-bodywash',
    name: 'WiZ Deep Hydrating Aloe & Vitamin E Bodywash',
    slug: 'wiz-nourishing-bodywash-aloe-500ml',
    sku: 'WIZ-BW-500',
    category: 'Bodywash',
    subcategory: 'Personal Care',
    shortDescription: 'Soap-free conditioning shower gel that deeply cleanses, locks in moisture, and leaves skin radiantly soft.',
    fullDescription: 'Transform your daily shower into a soothing spa ritual with WiZ Deep Hydrating Bodywash. Packed with natural aloe vera extract, vitamin E, and moisturizing lipids, it forms a rich, creamy lather that gently lifts away impurities without drying or irritating sensitive skin.',
    benefits: [
      'Rich moisturizing formula leaves skin soft, supple, and hydrated',
      '100% soap-free and dermatologically tested',
      'Infused with antioxidant-rich Vitamin E and Aloe Vera',
      'Gentle everyday formula suitable for whole family'
    ],
    usageInstructions: 'Pour a small coin-sized quantity onto a wet loofah or sponge. Work into a luxuriant lather and gently massage all over wet body. Rinse thoroughly with water.',
    ingredients: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Aloe Barbadensis Leaf Juice, Tocopheryl Acetate (Vitamin E), Fragrance, Citric Acid.',
    images: [
      '/assets/products/Lemon Bodywash 5L.jpg'
    ],
    regularPrice: 220,
    sellingPrice: 199,
    discountPercent: 10,
    packagingSize: '500 ml Bottle',
    fragrance: 'Lavender & Tea Tree',
    fragrances: ['Lavender & Tea Tree', 'Citrus Burst', 'Rose Blossom'],
    stock: 85,
    isFeatured: true,
    isBestseller: true,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+bodywash',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20bodywash',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20bodywash',
    seoTitle: 'WiZ Aloe Vera & Vitamin E Bodywash | WiZ Hygiene',
    seoDescription: 'Buy WiZ Deep Hydrating Bodywash with Aloe Vera & Vitamin E. Cleanse and nourish skin with WiZ Personal Care.',
    published: true,
    rating: 4.9,
    reviewsCount: 92,
    variants: [
      {
        id: 'var-bw-250',
        name: '250 ml Bottle',
        sku: 'WIZ-BW-250',
        regularPrice: 150,
        sellingPrice: 129,
        stock: 45,
        packagingSize: '250 ml Bottle',
        image: '/assets/products/Lemon Bodywash 5L.jpg'
      },
      {
        id: 'var-bw-500',
        name: '500 ml Pump Bottle',
        sku: 'WIZ-BW-500',
        regularPrice: 220,
        sellingPrice: 199,
        stock: 30,
        packagingSize: '500 ml Bottle',
        image: '/assets/products/Lemon Bodywash 5L.jpg'
      },
      {
        id: 'var-bw-5l',
        name: '5 Litre Bulk Can',
        sku: 'WIZ-BW-5L',
        regularPrice: 1199,
        sellingPrice: 899,
        stock: 10,
        packagingSize: '5 Litre Can',
        image: '/assets/products/Lemon Bodywash 5L.jpg'
      }
    ]
  },
  {
    id: 'prod-facial-tissue',
    name: 'WiZ Ultra Soft 2-Ply Facial Tissues (Pack of 4)',
    slug: 'wiz-facial-tissue-pack-of-4',
    sku: 'WIZ-FT-004',
    category: 'Paper Products',
    subcategory: 'Paper Products',
    shortDescription: '100% virgin pulp, velvety soft 2-ply tissues gentle on delicate facial skin.',
    fullDescription: 'WiZ Facial Tissues provide unmatched softness, absorbency, and hygiene for home, car, and office use. Crafted from 100% virgin paper pulp without harsh chemical optical bleaches, they are ideal for makeup removal, cold or flu relief, and wiping lenses.',
    benefits: [
      'Made from 100% virgin wood pulp for premium softness',
      '2-ply absorbent sheets that do not tear easily when wet',
      'Optical brightener free, safe for sensitive baby skin',
      'Convenient pop-up dispenser box keeps tissues clean and sanitary'
    ],
    usageInstructions: 'Pull tissue upwards from box opening. Use gently on face, nose, or hands. Dispose in waste receptacle.',
    ingredients: '100% Virgin Wood Pulp, 2-Ply.',
    images: [
      '/assets/products/wiz-facial-tissue-card.jpg',
      '/assets/products/Mint-Paper-Products.jpg'
    ],
    regularPrice: 125,
    sellingPrice: 99,
    discountPercent: 21,
    packagingSize: 'Pack of 4 Boxes (100 pulls/box)',
    fragrance: 'Unscented Pure',
    fragrances: ['Unscented Pure'],
    stock: 110,
    isFeatured: true,
    isBestseller: false,
    isSoldout: false,
    amazonUrl: 'https://www.amazon.in/s?k=wiz+facial+tissues',
    zeptoUrl: 'https://www.zeptonow.com/search?q=wiz%20tissue',
    blinkitUrl: 'https://blinkit.com/s/?q=wiz%20tissue',
    seoTitle: 'WiZ 2-Ply Soft Facial Tissues Pack of 4 | WiZ Hygiene',
    seoDescription: 'Buy WiZ Soft 2-Ply Facial Tissues in value pack of 4. 100% virgin pulp, soft and absorbent. WhatsApp order online.',
    published: true,
    rating: 4.7,
    reviewsCount: 48,
    variants: [
      {
        id: 'var-ft-p4',
        name: 'Pack of 4 Boxes (400 Sheets)',
        sku: 'WIZ-FT-004',
        regularPrice: 125,
        sellingPrice: 99,
        stock: 70,
        packagingSize: 'Pack of 4 Boxes',
        image: '/assets/products/Mint-Paper-Products.jpg'
      },
      {
        id: 'var-ft-p8',
        name: 'Mega Pack of 8 Boxes (800 Sheets)',
        sku: 'WIZ-FT-008',
        regularPrice: 250,
        sellingPrice: 189,
        stock: 40,
        packagingSize: 'Pack of 8 Boxes',
        image: '/assets/products/Mint-Paper-Products.jpg'
      }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-wizfirst',
    code: 'WIZFIRST',
    discountType: 'percentage',
    discountValue: 15,
    minCartValue: 499,
    maxDiscount: 150,
    isActive: true,
    usageLimit: 1000,
    usedCount: 84
  },
  {
    id: 'coup-hygiene50',
    code: 'HYGIENE50',
    discountType: 'fixed',
    discountValue: 50,
    minCartValue: 699,
    isActive: true,
    usageLimit: 500,
    usedCount: 142
  },
  {
    id: 'coup-bulk10',
    code: 'BULK10',
    discountType: 'percentage',
    discountValue: 10,
    minCartValue: 1499,
    maxDiscount: 500,
    isActive: true,
    usageLimit: 200,
    usedCount: 29
  }
];

export const INITIAL_FREEBIES: Freebie[] = [
  {
    id: 'freeb-sanitizer',
    title: 'Free 100ml Pocket Sanitizer',
    description: 'Get a complimentary 100ml WiZ Hand Sanitizer on all cart orders above ₹799!',
    minCartValue: 799,
    freebieProduct: 'WiZ Instant Hand Sanitizer 100ml Pocket Pack',
    isActive: true,
    validTill: '2026-12-31'
  },
  {
    id: 'freeb-wipes',
    title: 'Free Pack of WiZ Wet Wipes',
    description: 'Complimentary full-size WiZ Wet Wipes pack on all orders above ₹1299!',
    minCartValue: 1299,
    freebieProduct: 'WiZ Gentle Cleansing Wet Wipes (80 Pulls)',
    isActive: true,
    validTill: '2026-12-31'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'personal-hygiene-market-gives-birth',
    date: 'November 21, 2022',
    title: 'Personal Hygiene Market Gives Birth',
    excerpt: 'Abrupt Rise In Personal Hygiene Market Gives Birth To New Startups.',
    content: `Abrupt rise in the personal hygiene market has sparked a wave of focused startups and consumer-first formulations across India. Over the past few years, everyday hygiene has shifted from an occasional necessity to a core household priority spanning hand hygiene, gentle skin cleansing, and travel-ready sanitization.

While agile new entrants have brought fresh packaging and digital-first distribution to the category, sustained growth depends on dependable manufacturing standards, skin-safe chemistry, and honest factory-direct pricing. Households now look beyond short-term trends to reliable daily staples such as moisturizing antibacterial handwash refills, soothing wet wipes, and pH-balanced bodywashes.

Backed by Cossmic Products Pvt Ltd’s decades of formulation and manufacturing expertise since 1978, WiZ combines institutional quality control with accessible pack formats—from convenient daily dispensers to economical 1L refill pouches and 5L cans.

As awareness continues to expand across urban and tier-2/tier-3 markets alike, brands anchored in proven quality and fair value are shaping the long-term future of India’s personal hygiene landscape.`,
    author: 'Sandeep Nair',
    readTime: '4 min read',
    category: 'Industry & Market',
    tags: ['Sandeep Nair', 'Cossmic', 'WiZ'],
    image: '/assets/aistudio/Reetesh-Sir-01_7339a95e.jpg',
    imagePosition: 'bottom',
    published: true,
    createdAt: '2022-11-21T10:00:00.000Z'
  },
  {
    id: 'blog-2',
    slug: 'women-leading-the-entrepreneur',
    date: 'November 18, 2022',
    title: 'Women Leading The Entrepreneur',
    excerpt: 'Women Leading The Entrepreneur Sector of India - By BUSINESS NEWS WEEK',
    content: `Featured by Business News Week, women leaders across India are redefining entrepreneurship across FMCG, personal care, and modern retail distribution—bringing empathy, operational rigor, and customer-centric innovation to boardrooms and manufacturing floors alike.

In the fast-evolving personal and home hygiene segment, understanding real family routines—from safe ingredients for children and sensitive skin to eco-conscious refill formats that lower household plastic use—has become a decisive advantage. Female entrepreneurs and leadership teams are driving higher benchmarks in product safety, formulation transparency, and ethical brand building.

At Cossmic Products Pvt Ltd and WiZ, collaborative leadership empowers both product R&D and consumer outreach, ensuring every handwash, bodywash, wet wipe, and surface cleaner meets strict quality standards before reaching homes across India.

Celebrating women leaders across India’s entrepreneurial ecosystem highlights how purposeful vision and hands-on execution continue to build trusted, enduring consumer brands.`,
    author: 'Sandeep Nair',
    readTime: '5 min read',
    category: 'Leadership & Media',
    tags: ['Sandeep Nair', 'Cossmic', 'WiZ'],
    image: '/assets/aistudio/Manish-Maam_d22e9dde.jpg',
    imagePosition: 'top',
    published: true,
    createdAt: '2022-11-18T10:00:00.000Z'
  },
  {
    id: 'blog-3',
    slug: 'global-handwashing-day',
    date: 'November 15, 2022',
    title: 'Global Handwashing Day',
    excerpt: 'Global Handwashing Day : Few Hygiene Essentials To Keep Handy',
    content: `Global Handwashing Day is an important reminder that clean hands remain one of the simplest and most effective safeguards for family, school, and workplace health. Building consistent handwashing habits—especially among children before meals, after outdoor play, and during commutes—creates lasting protection against everyday germs.

To make thorough hand hygiene effortless throughout the day, keep these essential items close at hand:
1. Moisturizing Antibacterial Handwash: Choose a gentle, soothing formulation at every sink so frequent washing cleans effectively without drying out young or sensitive skin.
2. Refreshing Cleansing Wet Wipes: Alcohol-free pocket and family-pack wipes help clean hands and faces cleanly when soap and running water are out of reach during travel or school hours.
3. Pocket & Desk Hand Sanitizer: Keeping a fast-drying 70% IPA sanitizer near entrances, study desks, and workstations reinforces clean habits on the go.

At WiZ, we believe good hygiene should be simple, skin-kind, and affordable for every household and community.`,
    author: 'Sandeep Nair',
    readTime: '4 min read',
    category: 'Hygiene Essentials',
    tags: ['Sandeep Nair', 'Cossmic', 'WiZ'],
    image: '/assets/aistudio/Handwash-Day_19b06b7d.jpg',
    imagePosition: 'bottom',
    published: true,
    createdAt: '2022-11-15T10:00:00.000Z'
  }
];
