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
  INITIAL_FREEBIES
} from './initialData';
import { Product, Category, Coupon, Freebie, GeneralSettings, OrderEnquiry, BulkEnquiry, AnalyticsEvent } from '../types';

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

  // Strip leading 'public/' if saved with prefix
  let clean = trimmed.replace(/^public\//, '');
  // Strip leading '/' so it becomes a relative asset path
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }

  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${clean}`;
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

  return {
    ...merged,
    headerLogo: resolveAssetUrl(merged.headerLogo),
    footerLogo: resolveAssetUrl(merged.footerLogo),
    footerImage: resolveAssetUrl(merged.footerImage)
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
export function normalizePackagingSize(rawSize: string, category?: string): string {
  if (!rawSize) return '';
  const trimmed = rawSize.trim();
  const lower = trimmed.toLowerCase();

  // Presets mapping
  if (lower === '500 ml bottle' || lower === '500ml bottle') return '500 ml Bottle';
  if (lower === '750 ml bottle' || lower === '750ml bottle') return '750 ml Bottle';
  if (lower === '1 litre pouch' || lower === '1 liter pouch' || lower === '1l pouch' || lower === '1 litre refill pouch') return '1 Litre Pouch';
  if (lower === '1 litre bottle' || lower === '1 liter bottle' || lower === '1l bottle' || lower === '1 litre angled bottle') return '1 Litre Bottle';
  if (lower === '2 litre can' || lower === '2 liter can' || lower === '2l can' || lower === '2 litre bottle') return '2 Litre Can';
  if (lower === '5 litre can' || lower === '5 liter can' || lower === '5l can' || lower === '5 litre heavy duty can' || lower === '5 litre commercial can') return '5 Litre Can';
  if (lower.includes('80 pull') || lower.includes('wipes')) return '80 Pulls Pack';
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
    const cat = (category || '').toLowerCase();
    if (cat.includes('toilet') || cat.includes('glass')) {
      return '1 Litre Bottle';
    }
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

/**
 * Loads Products from Firestore or falls back to INITIAL_PRODUCTS,
 * overlaying any locally saved/edited products.
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

  // Merge map: INITIAL_PRODUCTS -> Firestore -> Local overrides
  const map = new Map<string, Product>();
  INITIAL_PRODUCTS.forEach((p) => map.set(p.id, p));
  firestoreProducts.forEach((p) => map.set(p.id, p));
  localProducts.forEach((p) => map.set(p.id, p));

  const finalProducts = Array.from(map.values())
    .filter((p) => !deletedIds.has(p.id))
    .map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images.map(resolveAssetUrl) : [],
      packagingSize: p.packagingSize ? normalizePackagingSize(p.packagingSize, p.category) : p.packagingSize,
      variants: Array.isArray(p.variants)
        ? p.variants.map((v) => ({
            ...v,
            image: v.image ? resolveAssetUrl(v.image) : v.image,
            packagingSize: v.packagingSize
              ? normalizePackagingSize(v.packagingSize, p.category)
              : normalizePackagingSize(v.name, p.category)
          }))
        : p.variants
    }));
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
  } catch (error) {
    console.warn('Initial data seeding check finished:', error);
  }
}
