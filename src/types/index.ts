export interface ProductVariant {
  id: string;
  name: string; // e.g. "500 ml Bottle", "1 Litre Refill Pouch", "5 Litre Can"
  sku: string;
  regularPrice: number;
  sellingPrice: number;
  stock: number;
  image?: string;
  packagingSize: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subcategory?: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  usageInstructions?: string;
  ingredients?: string;
  images: string[];
  regularPrice: number;
  sellingPrice: number;
  discountPercent: number;
  variants: ProductVariant[];
  packagingSize?: string;
  fragrance?: string;
  fragrances?: string[];
  stock: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isSoldout?: boolean;
  amazonUrl?: string;
  zeptoUrl?: string;
  blinkitUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  published: boolean;
  itemsCount?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  variantId: string;
  variantName: string;
  sku: string;
  unitPrice: number;
  regularPrice: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartValue: number;
  maxDiscount?: number;
  validFrom?: string;
  validTo?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface Freebie {
  id: string;
  title: string;
  description: string;
  minCartValue: number;
  qualifyingProduct?: string;
  freebieProduct: string;
  isActive: boolean;
  validTill?: string;
}

export interface OrderEnquiry {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  coinDiscount?: number;
  couponCode?: string;
  freebieText?: string;
  finalTotal: number;
  status:
    | 'Enquiry Created'
    | 'WhatsApp Opened'
    | 'Marketplace Redirected'
    | 'Follow-up Required'
    | 'Confirmed by Admin'
    | 'Completed'
    | 'Cancelled';
  source: 'Website WhatsApp' | 'Amazon Outbound' | 'Zepto Outbound' | 'Blinkit Outbound' | 'Direct Enquiry';
  createdAt: string;
  updatedAt?: string;
}

export interface BulkEnquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  productCategory: string;
  variantPackaging: string;
  requiredQuantity: string;
  frequency: string;
  specialRequirements?: string;
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Closed' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HeaderBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  thumbnailUrl?: string;
  buttonText: string;
  buttonLink: string;
  nextLabel: string;
  isActive: boolean;
  order: number;
}

export interface MegaMenuHighlight {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  badge: string;
  price: string;
}

export interface GeneralSettings {
  websiteName: string;
  headerLogo: string;
  footerLogo: string;
  favicon: string;
  showHeaderLogo?: boolean;
  showFooterLogo?: boolean;
  footerImage?: string;
  showFooterImage?: boolean;
  contactEmail: string;
  businessPhone: string;
  whatsappNumber: string;
  corporateAddress: string;
  factoryAddress: string;
  freeShippingThreshold: number;
  announcementText: string;
  announcementActive: boolean;
  currency: string;
  googleAnalyticsId: string;
  googleAdsConversionId: string;
  googleAdsStatus: string;
  headerBanners?: HeaderBanner[];
  megaMenuHighlights?: Record<string, MegaMenuHighlight>;
  megaMenuLeftImages?: Record<
    string,
    {
      imageUrl: string;
      title?: string;
      subtitle?: string;
      link?: string;
      badge?: string;
      visible?: boolean;
    }
  >;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  packagingPresets?: string[];
  updatedAt?: string;
}

export interface AnalyticsEvent {
  id?: string;
  eventType: 'amazon_click' | 'zepto_click' | 'blinkit_click' | 'whatsapp_order' | 'view_product' | 'add_to_cart';
  target: string;
  details?: Record<string, unknown> | string;
  timestamp?: string;
}
