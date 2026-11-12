import { Product } from '../types';

const RECENTLY_VIEWED_KEY = 'wiz_recently_viewed_products';
const MAX_ITEMS = 4;

/**
 * Tracks a product that the user has clicked or viewed.
 * Saves up to 4 most recently clicked products in localStorage.
 */
export const recordRecentlyViewed = (product: Product): void => {
  if (!product || !product.id) return;

  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let items: Product[] = stored ? JSON.parse(stored) : [];

    // Filter out duplicate if it already exists
    items = items.filter((p) => p.id !== product.id && p.slug !== product.slug);

    // Prepend new product to the beginning
    items.unshift(product);

    // Keep only the last 4 clicked products
    if (items.length > MAX_ITEMS) {
      items = items.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));

    // Dispatch event so any open component/listener on the page syncs instantly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wiz_recently_viewed_updated', { detail: items }));
    }
  } catch (err) {
    console.warn('Failed to record recently viewed product:', err);
  }
};

/**
 * Retrieves the last 4 recently viewed products from localStorage.
 */
export const getRecentlyViewed = (): Product[] => {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch (err) {
    console.warn('Failed to parse recently viewed products:', err);
    return [];
  }
};

/**
 * Clears the recently viewed list.
 */
export const clearRecentlyViewed = (): void => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wiz_recently_viewed_updated', { detail: [] }));
    }
  } catch (err) {
    console.warn('Failed to clear recently viewed products:', err);
  }
};
