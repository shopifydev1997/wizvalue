import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Gift,
  Tag,
  MessageSquare,
  ShieldCheck,
  Check,
  Coins
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCoinWallet } from '../context/CoinWalletContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const CartPage: React.FC = () => {
  useSEO({
    title: 'Shopping Cart | WiZ Home Hygiene & Personal Care',
    description: 'Review your selected WiZ hygiene products and multi-pack variants before generating your WhatsApp order enquiry.'
  });

  const navigate = useNavigate();
  const {
    items,
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
    generateWhatsAppUrl
  } = useCart();
  const { coins, calculateCoinsForAmount } = useCoinWallet();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  const freebieGap = activeFreebie ? 0 : Math.max(0, 799 - subtotal);
  const shippingGap = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            You have not added any WiZ hygiene or personal care products yet. Explore our bestsellers and multi-pack options.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#7a49a6] hover:bg-[#5f3786] text-white text-xs font-bold uppercase tracking-wider py-3 px-8 transition-colors"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Cart' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* =========================================================================
              LEFT: CART ITEMS TABLE / LIST
              ========================================================================= */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Alert Banner */}
            <div className="bg-[#f0f9f8] border border-[#7a49a6]/30 p-3.5 flex items-center justify-between text-xs text-gray-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#7a49a6]" />
                {shippingGap === 0 ? (
                  <span className="font-semibold text-[#7a49a6]">
                    🎉 Congratulations! You have unlocked Free Shipping on this order.
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-gray-900 font-bold">₹{shippingGap}</strong> more to get <strong>Free Pan-India Shipping!</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Items Header */}
            <div className="hidden sm:grid sm:grid-cols-12 pb-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-200 border-b border-gray-200">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="py-4 sm:grid sm:grid-cols-12 items-center gap-4 flex flex-col sm:flex-row text-xs"
                >
                  {/* Product thumbnail & title */}
                  <div className="sm:col-span-6 flex items-center space-x-4 w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-200 p-2 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <Link
                        to={`/product/${item.slug}`}
                        className="font-bold text-gray-900 hover:text-[#7a49a6] text-sm line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        Variant: <strong className="text-gray-700">{item.variantName}</strong>
                      </div>
                      <div className="text-gray-400 text-[10px]">SKU: {item.sku}</div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-[#ff675d] hover:text-[#e0554c] text-[11px] font-semibold flex items-center space-x-1 mt-2 sm:hidden cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="sm:col-span-2 text-center hidden sm:block font-medium text-gray-900">
                    ₹{item.unitPrice.toFixed(2)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-center w-full sm:w-auto">
                    <span className="text-gray-500 sm:hidden">Quantity:</span>
                    <div className="flex items-center border border-gray-300 bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-bold text-gray-900 min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal & Delete */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto">
                    <span className="text-gray-500 sm:hidden">Total:</span>
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="text-gray-400 hover:text-[#7a49a6] p-1 hidden sm:block cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 text-xs">
              <Link
                to="/shop"
                className="text-[#7a49a6] hover:underline font-semibold flex items-center space-x-1"
              >
                <span>← Continue Shopping</span>
              </Link>

              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-[#7a49a6] font-medium cursor-pointer"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* =========================================================================
              RIGHT: ORDER SUMMARY & WHATSAPP CHECKOUT
              ========================================================================= */}
          <div className="lg:col-span-4 bg-[#fafafa] border border-gray-300 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
              Order Summary
            </h2>

            {/* Subtotal & Freebie details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && appliedCoupon && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {/* Free Gift indicator */}
              {activeFreebie && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-2">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Free Gift Included:</strong>
                    <span>{activeFreebie.freebieProduct}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Estimated Total</span>
                <span className="text-2xl font-black text-gray-900">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* WiZ Coins Gain from Order: Rs. 50 = 2 Coins */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/90 rounded-lg flex items-center justify-between text-amber-950">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Coins className="w-3.5 h-3.5 fill-white/80" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Coins Earned On Order</span>
                    <span className="text-[10px] text-amber-800">Rule: ₹50 spent = 2 WiZ Coins</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-900 bg-white/90 px-2 py-0.5 rounded border border-amber-300 block">
                    +{calculateCoinsForAmount(finalTotal)} Coins
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold block">
                    (Worth ₹{calculateCoinsForAmount(finalTotal)} OFF)
                  </span>
                </div>
              </div>

              {/* Device Pocket Status */}
              <div className="flex items-center justify-between text-[11px] p-2.5 bg-amber-50/60 rounded border border-amber-200/70 text-amber-950">
                <span className="flex items-center gap-1.5 font-medium">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  Your Device Pocket: <strong>{coins} Coins</strong>
                </span>
                {coins > 0 ? (
                  <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                    Redeem at Checkout
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">
                    0 Coins • Earns on order
                  </span>
                )}
              </div>

              <p className="text-[10px] text-gray-400 italic">
                *Prices are in INR (₹). No payment gateway is required.
              </p>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Apply Promo Coupon</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2 text-xs">
                  <span className="text-green-800 font-bold">Code {appliedCoupon.code} Applied</span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#ff675d] font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex">
                  <input
                    type="text"
                    placeholder="E.g. WIZFIRST or HYGIENE50"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#7a49a6] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-[#7a49a6] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p className={`text-[11px] mt-1.5 font-medium ${couponFeedback.success ? 'text-green-600' : 'text-[#ff675d]'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Primary: Proceed to Checkout / Order Enquiry Form */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#7a49a6] hover:bg-[#5f3786] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <span>Proceed to Order Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Multi-Product Direct WhatsApp Enquiry */}
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Send All Products via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
