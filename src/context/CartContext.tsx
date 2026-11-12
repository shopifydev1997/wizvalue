import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Coupon, Freebie, OrderEnquiry } from '../types';
import { getCoupons, getFreebies, createOrderEnquiry, getGeneralSettings } from '../lib/storeService';

interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  activeFreebie: Freebie | null;
  shippingFee: number;
  freeShippingThreshold: number;
  finalTotal: number;
  totalItemsCount: number;
  generateWhatsAppUrl: (customer?: CustomerDetails, orderNum?: string, coinDiscount?: number) => string;
  submitOrderEnquiry: (customer: CustomerDetails, coinDiscount?: number) => Promise<{ orderNumber: string; whatsappUrl: string }>;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'wiz_cart_items_v1';
const COUPON_STORAGE_KEY = 'wiz_applied_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [freebiesList, setFreebiesList] = useState<Freebie[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('+91 93213 87229');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(599);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  // Load rules and settings
  useEffect(() => {
    getCoupons().then(setCouponsList);
    getFreebies().then(setFreebiesList);
    getGeneralSettings().then((settings) => {
      if (settings.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
      if (settings.freeShippingThreshold) setFreeShippingThreshold(settings.freeShippingThreshold);
    });
  }, []);

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal < (appliedCoupon.minCartValue || 0)) {
      return 0;
    }
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      return appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  }, [appliedCoupon, subtotal]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= freeShippingThreshold) {
      return 0;
    }
    return 60; // Standard nominal shipping under threshold
  }, [subtotal, freeShippingThreshold]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discount + shippingFee);
  }, [subtotal, discount, shippingFee]);

  // Determine eligible freebie
  const activeFreebie = useMemo(() => {
    if (subtotal === 0 || !freebiesList.length) return null;
    const sorted = [...freebiesList]
      .filter((f) => f.isActive && subtotal >= f.minCartValue)
      .sort((a, b) => b.minCartValue - a.minCartValue);
    return sorted.length > 0 ? sorted[0] : null;
  }, [subtotal, freebiesList]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = couponsList.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < (found.minCartValue || 0)) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minCartValue}.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  /**
   * Helper to format official WhatsApp message
   */
  const generateWhatsAppMessage = (customer?: CustomerDetails, orderNum?: string, coinDiscount?: number): string => {
    const cleanNumber = orderNum || `WIZ-${Date.now().toString().slice(-6)}`;
    const effectiveTotal = Math.max(0, finalTotal - (coinDiscount || 0));
    let text = `🛒 *NEW WiZ HYGIENE ORDER ENQUIRY* #${cleanNumber}\n`;
    text += `──────────────────────\n`;

    if (customer && customer.name) {
      text += `👤 *Customer:* ${customer.name}\n`;
      text += `📞 *Phone:* ${customer.phone}\n`;
      if (customer.email) text += `✉️ *Email:* ${customer.email}\n`;
      text += `📍 *Delivery:* ${customer.city}, ${customer.state} - PIN: ${customer.pincode}\n`;
      if (customer.address) text += `🏠 *Address:* ${customer.address}\n`;
      if (customer.notes) text += `📝 *Customer Notes:* ${customer.notes}\n`;
      text += `──────────────────────\n`;
    }

    text += `📦 *Order Items:*\n`;
    items.forEach((item, index) => {
      text += `${index + 1}. *${item.productName}*\n`;
      text += `   • Variant: ${item.variantName} (SKU: ${item.sku})\n`;
      text += `   • Qty: ${item.quantity} × ₹${item.unitPrice} = *₹${item.quantity * item.unitPrice}*\n`;
    });

    text += `──────────────────────\n`;
    text += `Subtotal: ₹${subtotal}\n`;
    if (discount > 0 && appliedCoupon) {
      text += `Coupon (${appliedCoupon.code}): -₹${discount}\n`;
    }
    if (coinDiscount && coinDiscount > 0) {
      text += `🪙 *Coins Pocket Redeemed:* -₹${coinDiscount} (${coinDiscount} Coins)\n`;
    }
    if (activeFreebie) {
      text += `🎁 *Eligible Free Gift:* ${activeFreebie.freebieProduct}\n`;
    }
    text += `Shipping: ${shippingFee === 0 ? 'FREE (Orders > ₹' + freeShippingThreshold + ')' : '₹' + shippingFee}\n`;
    text += `*Estimated Final Total: ₹${effectiveTotal}*\n`;
    text += `──────────────────────\n`;
    text += `📧 Order copy submitted to: wizvalue@cossmic.com\n`;
    text += `Sent from WiZ Official Website Store.\nPlease confirm order availability and dispatch schedule.`;

    return text;
  };

  const generateWhatsAppUrl = (customer?: CustomerDetails, orderNum?: string, coinDiscount?: number): string => {
    const rawDigits = whatsappNumber.replace(/[^0-9]/g, '');
    const phone = rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
    const message = generateWhatsAppMessage(customer, orderNum, coinDiscount);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const submitOrderEnquiry = async (
    customer: CustomerDetails,
    coinDiscount?: number
  ): Promise<{ orderNumber: string; whatsappUrl: string }> => {
    const orderNumber = `WIZ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const effectiveTotal = Math.max(0, finalTotal - (coinDiscount || 0));
    const extraNote = coinDiscount ? ` | Redeemed ${coinDiscount} Coins (-₹${coinDiscount})` : '';

    const enquiry: OrderEnquiry = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || '',
      address: customer.address || '',
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      notes: `${customer.notes || ''}${extraNote}`.trim(),
      items: [...items],
      subtotal,
      discount: discount + (coinDiscount || 0),
      coinDiscount: coinDiscount || 0,
      couponCode: appliedCoupon?.code || '',
      freebieText: activeFreebie?.freebieProduct || '',
      finalTotal: effectiveTotal,
      status: 'WhatsApp Opened',
      source: 'Website WhatsApp',
      createdAt: new Date().toISOString()
    };

    // 1. Save to Firestore
    await createOrderEnquiry(enquiry);

    // 2. Submit order email notification to wizvalue@cossmic.com
    try {
      await fetch('/api/orders/notify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          enquiry,
          recipientEmail: 'wizvalue@cossmic.com'
        })
      });
    } catch (err) {
      console.warn('Order email notification dispatch notice:', err);
    }

    // 3. Save locally for Order Confirmation snapshot view
    try {
      sessionStorage.setItem(`wiz_recent_order_${orderNumber}`, JSON.stringify(enquiry));
    } catch {}

    const whatsappUrl = generateWhatsAppUrl(customer, orderNumber, coinDiscount);
    return { orderNumber, whatsappUrl };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        activeFreebie,
        shippingFee,
        freeShippingThreshold,
        finalTotal,
        totalItemsCount,
        generateWhatsAppUrl,
        submitOrderEnquiry
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
