import {
  db,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  handleFirestoreError,
  OperationType
} from './firebase';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_FREEBIES,
  INITIAL_BLOG_POSTS
} from './initialData';
import {
  Product,
  Category,
  Coupon,
  Freebie,
  GeneralSettings,
  OrderEnquiry,
  BulkEnquiry,
  AnalyticsEvent,
  BlogPost
} from '../types';

const SETTINGS_DOC_PATH = 'settings/general';
const LOCAL_PRODUCTS_KEY = 'wiz_stored_products';
const LOCAL_DELETED_PRODUCTS_KEY = 'wiz_deleted_products';
const LOCAL_CATEGORIES_KEY = 'wiz_stored_categories';
const LOCAL_DELETED_CATEGORIES_KEY = 'wiz_deleted_categories';
const LOCAL_COUPONS_KEY = 'wiz_stored_coupons';
const LOCAL_DELETED_COUPONS_KEY = 'wiz_deleted_coupons';
const LOCAL_FREEBIES_KEY = 'wiz_stored_freebies';
const LOCAL_DELETED_FREEBIES_KEY = 'wiz_deleted_freebies';
const LOCAL_SETTINGS_KEY = 'wiz_stored_settings';
const LOCAL_BLOGS_KEY = 'wiz_blog_posts_v3';
const LOCAL_LEGACY_BLOGS_KEY = 'wiz_blog_posts_v2';
const LOCAL_DELETED_BLOGS_KEY = 'wiz_deleted_blogs';

/**
 * Recursively cleans any object to eliminate `undefined` fields.
 * Firestore setDoc / updateDoc rejects undefined values with
 * "Unsupported field value: undefined".
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        cleaned[key] = cleanFirestoreData(val);
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Normalizes asset paths so they resolve correctly across all hosting environments:
 * - Local / AI Studio development (root '/')
 * - Production on root domain (Vercel, Netlify, Cloud Run)
 * - Subdirectory deployments (e.g. GitHub Pages https://<user>.github.io/<repo>/)
 */
export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Preserve absolute external protocols and inline data/blob URIs
  if (/^(https?:|\/\/|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  // Extract normalized path relative to assets/
  let clean = trimmed;
  const assetsMarkerIdx = clean.toLowerCase().indexOf('assets/');
  if (assetsMarkerIdx !== -1) {
    const prefix = clean.slice(0, assetsMarkerIdx);
    if (
      prefix === '' ||
      prefix === '/' ||
      prefix === './' ||
      /^\/?public\/$/i.test(prefix) ||
      /^\/[^/]+\/(?:dist-static\/)?$/i.test(prefix)
    ) {
      clean = clean.slice(assetsMarkerIdx + 'assets/'.length);
    }
  } else {
    clean = clean.replace(/^(\/?public\/)/i, '').replace(/^(\.\/|\/)+/, '');
    if (clean.toLowerCase().startsWith('assets/')) {
      clean = clean.slice('assets/'.length);
    }
  }

  const encodedClean = clean
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      try {
        return encodeURI(decodeURI(seg));
      } catch {
        return encodeURI(seg);
      }
    })
    .join('/');

  // Determine deployment base prefix dynamically for GitHub Pages, dist-static, and root hosting
  if (typeof window !== 'undefined') {
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    const segments = window.location.pathname.split('/').filter(Boolean);
    const distIdx = segments.indexOf('dist-static');

    if (isGitHubPages) {
      if (distIdx !== -1) {
        return `/${segments.slice(0, distIdx + 1).join('/')}/assets/${encodedClean}`;
      }
      const repo = segments.length > 0 && segments[0] !== 'assets' ? segments[0] : '';
      if (repo) {
        return `/${repo}/assets/${encodedClean}`;
      }
      return `/assets/${encodedClean}`;
    }

    if (distIdx !== -1) {
      return `/${segments.slice(0, distIdx + 1).join('/')}/assets/${encodedClean}`;
    }
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base === './' || base === '.' ? '/' : base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}assets/${encodedClean}`;
}

/**
 * Loads General Settings from Firestore or returns default settings
 */
export async function getGeneralSettings(): Promise<GeneralSettings> {
  let localSettings: Partial<GeneralSettings> | null = null;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_SETTINGS_KEY) : null;
    if (raw) localSettings = JSON.parse(raw);
  } catch {}

  let merged: GeneralSettings = { ...INITIAL_SETTINGS, ...localSettings };

  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (settingsDoc.exists()) {
      const fsData = settingsDoc.data() as GeneralSettings;
      merged = { ...INITIAL_SETTINGS, ...localSettings, ...fsData };
    }
  } catch (error) {
    console.warn('Could not read settings/general from Firestore, using initial settings:', error);
  }

  const normalizeBrandLogo = (logo?: string) => {
    if (!logo) return '/assets/WiZ-Logo-NEW-1.png';
    if (logo.includes('WiZ-Logo-NEW.png') || logo.includes('wiz-footer-logo-extracted')) {
      return '/assets/WiZ-Logo-NEW-1.png';
    }
    return logo;
  };

  return {
    ...merged,
    headerLogo: resolveAssetUrl(normalizeBrandLogo(merged.headerLogo)),
    footerLogo: resolveAssetUrl(normalizeBrandLogo(merged.footerLogo)),
    footerImage: resolveAssetUrl(merged.footerImage),
    headerBanners: Array.isArray(merged.headerBanners)
      ? merged.headerBanners.map((b) => ({
          ...b,
          imageUrl: resolveAssetUrl(b.imageUrl),
          thumbnailUrl: resolveAssetUrl(b.thumbnailUrl)
        }))
      : merged.headerBanners,
    megaMenuHighlights:
      typeof merged.megaMenuHighlights === 'object' && merged.megaMenuHighlights !== null
        ? Object.fromEntries(
            Object.entries(merged.megaMenuHighlights).map(([k, v]) => [
              k,
              v && typeof v === 'object' && 'imageUrl' in v
                ? { ...v, imageUrl: resolveAssetUrl((v as { imageUrl?: string }).imageUrl) }
                : v
            ])
          )
        : merged.megaMenuHighlights
  };
}

/**
 * Saves General Settings to Firestore `settings/general`
 * Fixed security rule and authorization pattern for authenticated admins
 */
export async function saveGeneralSettings(settings: GeneralSettings): Promise<void> {
  const path = SETTINGS_DOC_PATH;
  const cleanData = cleanFirestoreData({
    ...settings,
    updatedAt: new Date().toISOString()
  });

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(cleanData));
    }
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  try {
    await setDoc(doc(db, 'settings', 'general'), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Normalizes raw/shortened packaging size strings (e.g. '500 ml', '1 Litre')
 * to standard Quick Packaging Presets as configured in the backend admin panel.
 */
export function normalizePackagingSize(rawSize: string, _category?: string): string {
  if (!rawSize) return '';
  const trimmed = rawSize.trim();
  const lower = trimmed.toLowerCase();

  // Laundry Top Load / Front Load distinct packaging formats
  if (lower.includes('top load') && lower.includes('front load')) return '1 Litre Top Load & Front Load Pouch';
  if (lower.includes('2') && lower.includes('top load')) return '2 Litre Top Load Pouch';
  if (lower.includes('2') && lower.includes('front load')) return '2 Litre Front Load Pouch';
  if (lower.includes('5') && lower.includes('top load')) return '5 Litre Can Top Load';
  if (lower.includes('5') && lower.includes('front load')) return '5 Litre Can Front Load';

  // Sanitizer 2ml sachet pack of 500
  if (lower.includes('2ml') || lower.includes('2 ml') || lower.includes('pack of 500')) {
    return '2ml Pouch pack of 500';
  }

  // Presets mapping
  if (lower === '500 ml bottle' || lower === '500ml bottle' || lower === '500 ml pump bottle') return '500 ml Bottle';
  if (lower === '750 ml bottle' || lower === '750ml bottle') return '750 ml Bottle';
  if (lower === '1 litre pouch' || lower === '1 liter pouch' || lower === '1l pouch' || lower === '1 litre refill pouch') return '1 Litre Pouch';
  if (lower === '1 litre bottle' || lower === '1 liter bottle' || lower === '1l bottle' || lower === '1 litre angled bottle' || lower === '1 litre pump bottle') return '1 Litre Bottle';
  if (lower === '2 litre can' || lower === '2 liter can' || lower === '2l can' || lower === '2 litre bottle') return '2 Litre Can';
  if (lower === '5 litre can' || lower === '5 liter can' || lower === '5l can' || lower === '5 litre heavy duty can' || lower === '5 litre commercial can' || lower === '5 litre bulk can' || lower === '5 litre heavy can') return '5 Litre Can';
  if (lower.includes('80 pull') || lower.includes('wipes')) return '80 Pulls Pack';
  if (lower === 'pack of 2') return 'Pack of 2';
  if (lower === 'pack of 4' && !(_category || '').toLowerCase().includes('paper')) return 'Pack of 4';
  if (lower.includes('pack of 4') || lower.includes('facial tissue')) return 'Pack of 4 Boxes';
  if (lower.includes('pack of 8')) return 'Pack of 8 Boxes';

  // Consolidate raw shortened fragments:
  if (lower === '500 ml' || lower === '500ml' || lower === '500 ml pump' || lower === '500 ml dispenser' || lower === '500 ml spray' || lower === '500 ml trigger spray') {
    return '500 ml Bottle';
  }

  if (lower === '750 ml' || lower === '750ml') {
    return '750 ml Bottle';
  }

  if (lower === '1 litre' || lower === '1 liter' || lower === '1l') {
    return '1 Litre Pouch';
  }

  if (lower === '2 litre' || lower === '2 liter' || lower === '2l') {
    return '2 Litre Can';
  }

  if (lower === '5 litre' || lower === '5 liter' || lower === '5l') {
    return '5 Litre Can';
  }

  if (lower === '250 ml' || lower === '250ml') {
    return '250 ml Bottle';
  }

  return trimmed;
}

const isDiscontinuedProductOrVariant = (
  categoryOrName: string,
  sizeOrName: string
): boolean => {
  const cat = categoryOrName.toLowerCase();
  const sz = sizeOrName.toLowerCase();
  if (cat.includes('sanitizer')) {
    return /\b(50|200)\s*ml\b/.test(sz);
  }
  if (cat.includes('toilet')) {
    return /\b750\s*ml\b/.test(sz);
  }
  return false;
};

/**
 * Loads Products from Firestore or falls back to INITIAL_PRODUCTS,
 * overlaying any locally saved/edited products while reconciling new catalog variants
 * and removing discontinued SKUs.
 */
export async function getProducts(): Promise<Product[]> {
  const firestoreProducts: Product[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (!snapshot.empty) {
      snapshot.forEach(docSnap => {
        firestoreProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
    }
  } catch (error) {
    console.warn('Using initial product dataset:', error);
  }

  // Load locally saved custom/edited products
  let localProducts: Product[] = [];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_PRODUCTS_KEY) : null;
    if (raw) localProducts = JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local products:', e);
  }

  // Load deleted product IDs
  const deletedIds = new Set<string>();
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DELETED_PRODUCTS_KEY) : null;
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      arr.forEach((id) => deletedIds.add(id));
    }
  } catch {}

  const initialById = new Map<string, Product>(INITIAL_PRODUCTS.map((p) => [p.id, p]));

  // Merge map: INITIAL_PRODUCTS -> Firestore -> Local overrides
  const map = new Map<string, Product>();
  INITIAL_PRODUCTS.forEach((p) => map.set(p.id, p));
  firestoreProducts.forEach((p) => map.set(p.id, p));
  localProducts.forEach((p) => map.set(p.id, p));

  const finalProducts = Array.from(map.values())
    .filter((p) => {
      if (deletedIds.has(p.id)) return false;
      // Remove any standalone discontinued SKU products (Sanitizer 50ml/200ml, Toilet Cleaner 750ml)
      if (isDiscontinuedProductOrVariant(p.category || p.name || '', `${p.name} ${p.slug} ${p.packagingSize || ''}`)) {
        return false;
      }
      return true;
    })
    .map((p) => {
      const initialMatch = initialById.get(p.id);
      const rawVariants = Array.isArray(p.variants) ? [...p.variants] : [];
      const supersededIds = new Set(['var-lm-2l', 'var-lm-5l', 'var-gc-500']);

      // Filter out discontinued variants (50ml/200ml Sanitizer, 750ml Toilet Cleaner) and superseded generic seeds
      const cleanedVariants = rawVariants
        .filter((v) => !isDiscontinuedProductOrVariant(p.category || p.name || '', `${v.name || ''} ${v.packagingSize || ''} ${v.sku || ''}`))
        .filter((v) => !(initialMatch && supersededIds.has(v.id)))
        .map((v) => {
          // Upgrade legacy un-distinguished 1L variants for Toilet Cleaner & Glass Cleaner to 1 Litre Pouch
          if ((p.id === 'prod-toilet-cleaner' && v.id === 'var-tc-1l') || (p.id === 'prod-glass-cleaner' && v.id === 'var-gc-1l')) {
            return {
              ...v,
              name: '1 Litre Refill Pouch',
              packagingSize: '1 Litre Pouch'
            };
          }
          if (p.id === 'prod-laundry-detergent' && v.id === 'var-lm-1l') {
            return {
              ...v,
              name: '1 Litre Top Load & Front Load Pouch',
              packagingSize: '1 Litre Top Load & Front Load Pouch'
            };
          }
          return v;
        });

      // Reconcile new catalog variants from INITIAL_PRODUCTS if missing in legacy DB/localStorage seeds
      if (initialMatch && Array.isArray(initialMatch.variants)) {
        initialMatch.variants.forEach((initVar) => {
          const exists = cleanedVariants.some((cv) => cv.id === initVar.id);
          if (!exists) {
            cleanedVariants.push(initVar);
          }
        });
      }

      const normalizedVariants = cleanedVariants.map((v) => ({
        ...v,
        image: v.image ? resolveAssetUrl(v.image) : v.image,
        packagingSize: v.packagingSize
          ? normalizePackagingSize(v.packagingSize, p.category)
          : normalizePackagingSize(v.name, p.category)
      }));

      const basePack = p.packagingSize ? normalizePackagingSize(p.packagingSize, p.category) : p.packagingSize;

      return {
        ...p,
        images: Array.isArray(p.images) ? p.images.map(resolveAssetUrl) : [],
        packagingSize: basePack,
        variants: normalizedVariants
      };
    });
  return finalProducts;
}

/**
 * Saves or updates a product in Firestore and local persistence.
 * Sanitizes all undefined fields to prevent Firebase setDoc errors.
 */
export async function saveProduct(product: Product): Promise<Product> {
  const productId = product.id || `prod-${Date.now()}`;
  const normalizedVariants = Array.isArray(product.variants)
    ? product.variants.map((v) => ({
        ...v,
        packagingSize: v.packagingSize
          ? normalizePackagingSize(v.packagingSize, product.category)
          : normalizePackagingSize(v.name, product.category)
      }))
    : product.variants;

  const cleanProduct = cleanFirestoreData({
    ...product,
    id: productId,
    packagingSize: product.packagingSize
      ? normalizePackagingSize(product.packagingSize, product.category)
      : '',
    variants: normalizedVariants,
    updatedAt: new Date().toISOString()
  });

  // 1. Immediately persist to localStorage for instant UI availability
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      const list: Product[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((p) => p.id === cleanProduct.id);
      if (idx >= 0) {
        list[idx] = cleanProduct;
      } else {
        list.unshift(cleanProduct);
      }
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));

      // Remove from deleted list if previously marked deleted
      const delRaw = localStorage.getItem(LOCAL_DELETED_PRODUCTS_KEY);
      if (delRaw) {
        const delList: string[] = JSON.parse(delRaw);
        const filtered = delList.filter((id) => id !== cleanProduct.id);
        localStorage.setItem(LOCAL_DELETED_PRODUCTS_KEY, JSON.stringify(filtered));
      }
    }
  } catch (err) {
    console.warn('LocalStorage saveProduct warning:', err);
  }

  // 2. Persist to Firestore
  const path = `products/${cleanProduct.id}`;
  try {
    await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct);
  } catch (error) {
    console.warn('Firestore setDoc failed, product preserved in local store:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  }

  return cleanProduct;
}

/**
 * Deletes a product from Firestore and local persistence
 */
export async function deleteProduct(productId: string): Promise<void> {
  // 1. Update localStorage
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (raw) {
        const list: Product[] = JSON.parse(raw);
        const filtered = list.filter((p) => p.id !== productId);
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
      }

      const delRaw = localStorage.getItem(LOCAL_DELETED_PRODUCTS_KEY);
      const delList: string[] = delRaw ? JSON.parse(delRaw) : [];
      if (!delList.includes(productId)) {
        delList.push(productId);
        localStorage.setItem(LOCAL_DELETED_PRODUCTS_KEY, JSON.stringify(delList));
      }
    }
  } catch (err) {
    console.warn('LocalStorage deleteProduct warning:', err);
  }

  // 2. Remove from Firestore
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.warn('Firestore deleteDoc failed, deleted locally:', error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
  }
}

/**
 * Loads Categories from Firestore or falls back to INITIAL_CATEGORIES,
 * overlaying any locally saved/edited categories.
 */
export async function getCategories(): Promise<Category[]> {
  const firestoreCategories: Category[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (!snapshot.empty) {
      snapshot.forEach(docSnap => {
        firestoreCategories.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
    }
  } catch (error) {
    console.warn('Using initial categories dataset:', error);
  }

  // Load locally saved custom/edited categories
  let localCategories: Category[] = [];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_CATEGORIES_KEY) : null;
    if (raw) localCategories = JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local categories:', e);
  }

  // Load deleted category IDs
  const deletedIds = new Set<string>();
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DELETED_CATEGORIES_KEY) : null;
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      arr.forEach((id) => deletedIds.add(id));
    }
  } catch {}

  const map = new Map<string, Category>();
  INITIAL_CATEGORIES.forEach((c) => map.set(c.id, c));
  firestoreCategories.forEach((c) => map.set(c.id, c));
  localCategories.forEach((c) => map.set(c.id, c));

  const finalCategories = Array.from(map.values())
    .filter((c) => !deletedIds.has(c.id))
    .map((c) => ({
      ...c,
      image: resolveAssetUrl(c.image)
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return finalCategories;
}

/**
 * Saves a category to Firestore and local persistence
 */
export async function saveCategory(category: Category): Promise<Category> {
  const cleanCategory = cleanFirestoreData({
    ...category,
    id: category.id || `cat-${Date.now()}`
  });

  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      const list: Category[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((c) => c.id === cleanCategory.id);
      if (idx >= 0) {
        list[idx] = cleanCategory;
      } else {
        list.push(cleanCategory);
      }
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));

      const delRaw = localStorage.getItem(LOCAL_DELETED_CATEGORIES_KEY);
      if (delRaw) {
        const delList: string[] = JSON.parse(delRaw);
        localStorage.setItem(
          LOCAL_DELETED_CATEGORIES_KEY,
          JSON.stringify(delList.filter((id) => id !== cleanCategory.id))
        );
      }
    }
  } catch (err) {
    console.warn('LocalStorage saveCategory warning:', err);
  }

  const path = `categories/${cleanCategory.id}`;
  try {
    await setDoc(doc(db, 'categories', cleanCategory.id), cleanCategory);
  } catch (error) {
    console.warn('Firestore setDoc failed, category saved locally:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  }

  return cleanCategory;
}

/**
 * Deletes a category from Firestore and local persistence
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      if (raw) {
        const list: Category[] = JSON.parse(raw);
        localStorage.setItem(
          LOCAL_CATEGORIES_KEY,
          JSON.stringify(list.filter((c) => c.id !== categoryId))
        );
      }

      const delRaw = localStorage.getItem(LOCAL_DELETED_CATEGORIES_KEY);
      const delList: string[] = delRaw ? JSON.parse(delRaw) : [];
      if (!delList.includes(categoryId)) {
        delList.push(categoryId);
        localStorage.setItem(LOCAL_DELETED_CATEGORIES_KEY, JSON.stringify(delList));
      }
    }
  } catch (err) {
    console.warn('LocalStorage deleteCategory warning:', err);
  }

  const path = `categories/${categoryId}`;
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    console.warn('Firestore deleteDoc failed, category deleted locally:', error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
  }
}

/**
 * Creates an order enquiry in Firestore
 */
export async function createOrderEnquiry(order: OrderEnquiry): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Loads all orders from Firestore (for Admin)
 */
export async function getOrders(): Promise<OrderEnquiry[]> {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    const items: OrderEnquiry[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() } as OrderEnquiry);
    });
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'orders');
  }
}

/**
 * Updates an order status or admin notes
 */
export async function updateOrderStatus(orderId: string, status: OrderEnquiry['status'], notes?: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) updateData.notes = notes;
    await updateDoc(doc(db, 'orders', orderId), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Creates a B2B Bulk Enquiry in Firestore
 */
export async function createBulkEnquiry(enquiry: BulkEnquiry): Promise<void> {
  const path = `bulkEnquiries/${enquiry.id}`;
  try {
    await setDoc(doc(db, 'bulkEnquiries', enquiry.id), enquiry);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Loads Bulk Enquiries (Admin)
 */
export async function getBulkEnquiries(): Promise<BulkEnquiry[]> {
  try {
    const snapshot = await getDocs(collection(db, 'bulkEnquiries'));
    const items: BulkEnquiry[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() } as BulkEnquiry);
    });
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'bulkEnquiries');
  }
}

/**
 * Updates Bulk Enquiry status
 */
export async function updateBulkEnquiryStatus(enquiryId: string, status: BulkEnquiry['status'], adminNotes?: string): Promise<void> {
  const path = `bulkEnquiries/${enquiryId}`;
  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    await updateDoc(doc(db, 'bulkEnquiries', enquiryId), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Loads active Coupons from Firestore or fallback, overlaying local storage
 */
export async function getCoupons(): Promise<Coupon[]> {
  const firestoreCoupons: Coupon[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'coupons'));
    if (!snapshot.empty) {
      snapshot.forEach(docSnap => {
        firestoreCoupons.push({ id: docSnap.id, ...docSnap.data() } as Coupon);
      });
    }
  } catch (error) {
    console.warn('Using initial coupons dataset:', error);
  }

  let localCoupons: Coupon[] = [];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_COUPONS_KEY) : null;
    if (raw) localCoupons = JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local coupons:', e);
  }

  const deletedIds = new Set<string>();
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DELETED_COUPONS_KEY) : null;
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      arr.forEach((id) => deletedIds.add(id));
    }
  } catch {}

  const map = new Map<string, Coupon>();
  INITIAL_COUPONS.forEach((c) => map.set(c.id, c));
  firestoreCoupons.forEach((c) => map.set(c.id, c));
  localCoupons.forEach((c) => map.set(c.id, c));

  return Array.from(map.values()).filter((c) => !deletedIds.has(c.id));
}

/**
 * Saves a Coupon
 */
export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  const cleanCoupon = cleanFirestoreData({
    ...coupon,
    id: coupon.id || `coup-${Date.now()}`
  });

  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_COUPONS_KEY);
      const list: Coupon[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((c) => c.id === cleanCoupon.id);
      if (idx >= 0) {
        list[idx] = cleanCoupon;
      } else {
        list.push(cleanCoupon);
      }
      localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(list));

      const delRaw = localStorage.getItem(LOCAL_DELETED_COUPONS_KEY);
      if (delRaw) {
        const delList: string[] = JSON.parse(delRaw);
        localStorage.setItem(
          LOCAL_DELETED_COUPONS_KEY,
          JSON.stringify(delList.filter((id) => id !== cleanCoupon.id))
        );
      }
    }
  } catch (err) {
    console.warn('LocalStorage saveCoupon warning:', err);
  }

  const path = `coupons/${cleanCoupon.id}`;
  try {
    await setDoc(doc(db, 'coupons', cleanCoupon.id), cleanCoupon);
  } catch (error) {
    console.warn('Firestore setDoc failed, coupon saved locally:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  }

  return cleanCoupon;
}

/**
 * Deletes a Coupon
 */
export async function deleteCoupon(couponId: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_COUPONS_KEY);
      if (raw) {
        const list: Coupon[] = JSON.parse(raw);
        localStorage.setItem(
          LOCAL_COUPONS_KEY,
          JSON.stringify(list.filter((c) => c.id !== couponId))
        );
      }

      const delRaw = localStorage.getItem(LOCAL_DELETED_COUPONS_KEY);
      const delList: string[] = delRaw ? JSON.parse(delRaw) : [];
      if (!delList.includes(couponId)) {
        delList.push(couponId);
        localStorage.setItem(LOCAL_DELETED_COUPONS_KEY, JSON.stringify(delList));
      }
    }
  } catch (err) {
    console.warn('LocalStorage deleteCoupon warning:', err);
  }

  const path = `coupons/${couponId}`;
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
  } catch (error) {
    console.warn('Firestore deleteDoc failed, coupon deleted locally:', error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
  }
}

/**
 * Loads active Freebies
 */
export async function getFreebies(): Promise<Freebie[]> {
  const firestoreFreebies: Freebie[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'freebies'));
    if (!snapshot.empty) {
      snapshot.forEach(docSnap => {
        firestoreFreebies.push({ id: docSnap.id, ...docSnap.data() } as Freebie);
      });
    }
  } catch (error) {
    console.warn('Using initial freebies dataset:', error);
  }

  let localFreebies: Freebie[] = [];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_FREEBIES_KEY) : null;
    if (raw) localFreebies = JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local freebies:', e);
  }

  const deletedIds = new Set<string>();
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DELETED_FREEBIES_KEY) : null;
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      arr.forEach((id) => deletedIds.add(id));
    }
  } catch {}

  const map = new Map<string, Freebie>();
  INITIAL_FREEBIES.forEach((f) => map.set(f.id, f));
  firestoreFreebies.forEach((f) => map.set(f.id, f));
  localFreebies.forEach((f) => map.set(f.id, f));

  return Array.from(map.values()).filter((f) => !deletedIds.has(f.id));
}

/**
 * Saves a Freebie
 */
export async function saveFreebie(freebie: Freebie): Promise<Freebie> {
  const cleanFreebie = cleanFirestoreData({
    ...freebie,
    id: freebie.id || `freeb-${Date.now()}`
  });

  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_FREEBIES_KEY);
      const list: Freebie[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((f) => f.id === cleanFreebie.id);
      if (idx >= 0) {
        list[idx] = cleanFreebie;
      } else {
        list.push(cleanFreebie);
      }
      localStorage.setItem(LOCAL_FREEBIES_KEY, JSON.stringify(list));

      const delRaw = localStorage.getItem(LOCAL_DELETED_FREEBIES_KEY);
      if (delRaw) {
        const delList: string[] = JSON.parse(delRaw);
        localStorage.setItem(
          LOCAL_DELETED_FREEBIES_KEY,
          JSON.stringify(delList.filter((id) => id !== cleanFreebie.id))
        );
      }
    }
  } catch (err) {
    console.warn('LocalStorage saveFreebie warning:', err);
  }

  const path = `freebies/${cleanFreebie.id}`;
  try {
    await setDoc(doc(db, 'freebies', cleanFreebie.id), cleanFreebie);
  } catch (error) {
    console.warn('Firestore setDoc failed, freebie saved locally:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  }

  return cleanFreebie;
}

/**
 * Deletes a Freebie
 */
export async function deleteFreebie(freebieId: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_FREEBIES_KEY);
      if (raw) {
        const list: Freebie[] = JSON.parse(raw);
        localStorage.setItem(
          LOCAL_FREEBIES_KEY,
          JSON.stringify(list.filter((f) => f.id !== freebieId))
        );
      }

      const delRaw = localStorage.getItem(LOCAL_DELETED_FREEBIES_KEY);
      const delList: string[] = delRaw ? JSON.parse(delRaw) : [];
      if (!delList.includes(freebieId)) {
        delList.push(freebieId);
        localStorage.setItem(LOCAL_DELETED_FREEBIES_KEY, JSON.stringify(delList));
      }
    }
  } catch (err) {
    console.warn('LocalStorage deleteFreebie warning:', err);
  }

  const path = `freebies/${freebieId}`;
  try {
    await deleteDoc(doc(db, 'freebies', freebieId));
  } catch (error) {
    console.warn('Firestore deleteDoc failed, freebie deleted locally:', error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
  }
}

/**
 * Logs Outbound Marketplace Redirection or User Action
 */
export async function logAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await setDoc(doc(db, 'analyticsEvents', eventId), {
      ...event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics event log error:', error);
  }
}

/**
 * Loads Analytics Events for Admin reporting
 */
export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  try {
    const snapshot = await getDocs(collection(db, 'analyticsEvents'));
    const items: AnalyticsEvent[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() } as AnalyticsEvent);
    });
    return items.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  } catch (error) {
    console.warn('Could not read analytics events:', error);
    return [];
  }
}

/**
 * Seeds initial store data to Firestore if not already seeded
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }

    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty) {
      console.log('Seeding initial categories into Firestore...');
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    const coupSnap = await getDocs(collection(db, 'coupons'));
    if (coupSnap.empty) {
      console.log('Seeding initial coupons into Firestore...');
      for (const coup of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', coup.id), coup);
      }
    }

    const freeSnap = await getDocs(collection(db, 'freebies'));
    if (freeSnap.empty) {
      console.log('Seeding initial freebies into Firestore...');
      for (const free of INITIAL_FREEBIES) {
        await setDoc(doc(db, 'freebies', free.id), free);
      }
    }

    const setSnap = await getDoc(doc(db, 'settings', 'general'));
    if (!setSnap.exists()) {
      console.log('Seeding default general settings into Firestore...');
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
    }

    const blogSnap = await getDocs(collection(db, 'blogs'));
    const legacySeedTitles = new Set([
      'Glow Naturally With Hydrating Skin Rituals',
      'Flawless Foundation Secrets For Radiant Skin',
      'Golden Hour Makeup For Effortless Beauty',
      'Clean Beauty Rituals for Radiant Skin Everyday',
      'Gentle pH Balance Formulas That Protect Daily',
      'Nourishing Body Care Routines for All Seasons'
    ]);
    const shouldSeedUpdatedBlogs =
      blogSnap.empty ||
      blogSnap.docs.every((d) => legacySeedTitles.has(String(d.data()?.title || '')));
    if (shouldSeedUpdatedBlogs) {
      console.log('Seeding updated blog posts into Firestore...');
      for (const blog of INITIAL_BLOG_POSTS) {
        await setDoc(doc(db, 'blogs', blog.id), cleanFirestoreData(blog));
      }
    }
  } catch (error) {
    console.warn('Initial data seeding check finished:', error);
  }
}

export function slugifyBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `post-${Date.now()}`;
}

function normalizeBlogPost(raw: any, index = 0): BlogPost {
  const id = typeof raw.id === 'number' ? `blog-${raw.id}` : String(raw.id || `blog-${Date.now()}-${index}`);
  const fallbackDefault = INITIAL_BLOG_POSTS.find((b) => b.id === id);
  const title = (typeof raw.title === 'string' && raw.title.trim()) || fallbackDefault?.title || 'WiZ Hygiene Journal';
  const slug = (typeof raw.slug === 'string' && raw.slug.trim()) || fallbackDefault?.slug || slugifyBlogTitle(title);

  let rawImage: string | null = raw.image !== undefined ? raw.image : (fallbackDefault?.image ?? null);
  if (rawImage === '/assets/blog-post-1.jpg') rawImage = '/assets/Blog01.jpg';
  if (rawImage === '/assets/blog-post-2.jpg') rawImage = '/assets/Blog02.jpg';
  if (rawImage === '/assets/blog-post-3.jpg') rawImage = '/assets/Blog03.jpg';

  const resolvedImg = rawImage ? resolveAssetUrl(rawImage) : null;
  const excerpt = (typeof raw.excerpt === 'string' && raw.excerpt.trim()) || fallbackDefault?.excerpt || '';
  const content = (typeof raw.content === 'string' && raw.content.trim()) || fallbackDefault?.content || excerpt;

  return {
    id,
    slug,
    title,
    excerpt,
    content,
    author: (typeof raw.author === 'string' && raw.author.trim()) || fallbackDefault?.author || 'WiZ Editorial Team',
    date: (typeof raw.date === 'string' && raw.date.trim()) || fallbackDefault?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: (typeof raw.readTime === 'string' && raw.readTime.trim()) || fallbackDefault?.readTime || '4 min read',
    category: (typeof raw.category === 'string' && raw.category.trim()) || fallbackDefault?.category || 'Personal Care',
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : (fallbackDefault?.tags || ['Hygiene', 'WiZ Care']),
    image: resolvedImg,
    imagePosition: raw.imagePosition === 'top' || raw.imagePosition === 'bottom'
      ? raw.imagePosition
      : (fallbackDefault?.imagePosition || (index % 2 === 1 ? 'top' : 'bottom')),
    published: raw.published !== false,
    createdAt: raw.createdAt || fallbackDefault?.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || fallbackDefault?.updatedAt
  };
}

/**
 * Loads Blog Posts from Firestore, localStorage (v3 & legacy v2), and INITIAL_BLOG_POSTS
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const firestoreBlogs: BlogPost[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'blogs'));
    if (!snapshot.empty) {
      snapshot.forEach((docSnap) => {
        firestoreBlogs.push(normalizeBlogPost({ id: docSnap.id, ...docSnap.data() }));
      });
    }
  } catch (error) {
    console.warn('Using initial/local blog posts dataset:', error);
  }

  let legacyBlogs: any[] = [];
  try {
    const rawLegacy = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_LEGACY_BLOGS_KEY) : null;
    if (rawLegacy) {
      const parsed = JSON.parse(rawLegacy);
      if (Array.isArray(parsed)) legacyBlogs = parsed;
    }
  } catch {}

  let localBlogs: BlogPost[] = [];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_BLOGS_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localBlogs = parsed.map((b, i) => normalizeBlogPost(b, i));
      }
    }
  } catch (e) {
    console.warn('Error reading local blogs:', e);
  }

  const deletedIds = new Set<string>();
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_DELETED_BLOGS_KEY) : null;
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      arr.forEach((id) => deletedIds.add(id));
    }
  } catch {}

  const legacySeedTitles = new Set([
    'Glow Naturally With Hydrating Skin Rituals',
    'Flawless Foundation Secrets For Radiant Skin',
    'Golden Hour Makeup For Effortless Beauty',
    'Clean Beauty Rituals for Radiant Skin Everyday',
    'Gentle pH Balance Formulas That Protect Daily',
    'Nourishing Body Care Routines for All Seasons'
  ]);
  const isUneditedLegacySeed = (b: { id: string; title: string }) =>
    legacySeedTitles.has(b.title);

  const map = new Map<string, BlogPost>();
  INITIAL_BLOG_POSTS.forEach((b, i) => map.set(b.id, normalizeBlogPost(b, i)));

  // Overlay any user-edited legacy v2 adjustments without overwriting updated defaults
  legacyBlogs.forEach((b, i) => {
    const norm = normalizeBlogPost(b, i);
    if (isUneditedLegacySeed(norm)) return;
    const prev = map.get(norm.id);
    map.set(norm.id, {
      ...prev,
      ...norm,
      excerpt: norm.excerpt || prev?.excerpt || '',
      content: norm.content || prev?.content || '',
      tags: norm.tags?.length ? norm.tags : (prev?.tags || ['Hygiene']),
      image: b.image === '' || b.image === null ? null : norm.image
    });
  });

  firestoreBlogs.forEach((b) => {
    if (!isUneditedLegacySeed(b)) map.set(b.id, b);
  });
  localBlogs.forEach((b) => {
    if (!isUneditedLegacySeed(b)) map.set(b.id, b);
  });

  return Array.from(map.values())
    .filter((b) => !deletedIds.has(b.id))
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
}

export async function getBlogPostBySlugOrId(slugOrId: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

/**
 * Saves or creates a Blog Post in localStorage and Firestore (when authenticated)
 */
export async function saveBlogPost(post: BlogPost): Promise<BlogPost> {
  const id = post.id && /^[a-zA-Z0-9_-]+$/.test(post.id) ? post.id : `blog-${Date.now()}`;
  const slug = post.slug?.trim() || slugifyBlogTitle(post.title);
  const now = new Date().toISOString();

  const normalized = cleanFirestoreData(
    normalizeBlogPost({
      ...post,
      id,
      slug,
      createdAt: post.createdAt || now,
      updatedAt: now
    })
  );

  // 1. Immediately persist to localStorage so /blog & HomePage stay updated instantly
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_BLOGS_KEY);
      const list: BlogPost[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((b) => b.id === normalized.id);
      if (idx >= 0) {
        list[idx] = normalized;
      } else {
        list.unshift(normalized);
      }
      localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(list));

      // Keep legacy v2 thumbnail array synced if matching one of default 3
      const legacyRaw = localStorage.getItem(LOCAL_LEGACY_BLOGS_KEY);
      if (legacyRaw) {
        const legacyList: any[] = JSON.parse(legacyRaw);
        const updatedLegacy = legacyList.map((item) => {
          const itemId = typeof item.id === 'number' ? `blog-${item.id}` : String(item.id);
          return itemId === normalized.id
            ? { ...item, title: normalized.title, image: normalized.image || '', date: normalized.date }
            : item;
        });
        localStorage.setItem(LOCAL_LEGACY_BLOGS_KEY, JSON.stringify(updatedLegacy));
      }

      const delRaw = localStorage.getItem(LOCAL_DELETED_BLOGS_KEY);
      if (delRaw) {
        const delList: string[] = JSON.parse(delRaw);
        localStorage.setItem(
          LOCAL_DELETED_BLOGS_KEY,
          JSON.stringify(delList.filter((deletedId) => deletedId !== normalized.id))
        );
      }
    }
  } catch (err) {
    console.warn('LocalStorage saveBlogPost warning:', err);
  }

  // 2. Sync to Firestore cleanly
  const path = `blogs/${normalized.id}`;
  try {
    await setDoc(doc(db, 'blogs', normalized.id), normalized);
  } catch (error) {
    console.warn('Firestore blog sync skipped/warned (preserved locally):', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Handled gracefully while preserving local persistence
    }
  }

  return normalized;
}

export async function deleteBlogPost(blogId: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_BLOGS_KEY);
      if (raw) {
        const list: BlogPost[] = JSON.parse(raw);
        localStorage.setItem(
          LOCAL_BLOGS_KEY,
          JSON.stringify(list.filter((b) => b.id !== blogId))
        );
      }

      const delRaw = localStorage.getItem(LOCAL_DELETED_BLOGS_KEY);
      const delList: string[] = delRaw ? JSON.parse(delRaw) : [];
      if (!delList.includes(blogId)) {
        delList.push(blogId);
        localStorage.setItem(LOCAL_DELETED_BLOGS_KEY, JSON.stringify(delList));
      }
    }
  } catch (err) {
    console.warn('LocalStorage deleteBlogPost warning:', err);
  }

  const path = `blogs/${blogId}`;
  try {
    await deleteDoc(doc(db, 'blogs', blogId));
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch {
      // Local delete remains intact
    }
  }
}
