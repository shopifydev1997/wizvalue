import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MessageSquare, Check, AlertCircle, Coins } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCoinWallet } from '../context/CoinWalletContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const CheckoutPage: React.FC = () => {
  useSEO({
    title: 'Order Enquiry Checkout | WiZ Home Hygiene & Personal Care',
    description: 'Submit your delivery details to generate an official WiZ order enquiry and confirm dispatch directly via WhatsApp.'
  });

  const navigate = useNavigate();
  const { items, subtotal, discount, appliedCoupon, activeFreebie, shippingFee, finalTotal, submitOrderEnquiry } = useCart();
  const { coins, addCoins, redeemCoins, calculateCoinsForAmount } = useCoinWallet();
  const [usePocketCoins, setUsePocketCoins] = useState(false);

  // Maximum coins redeemable against items (1 Coin = 1 INR)
  const maxRedeemableCoins = Math.min(coins, Math.floor(Math.max(0, subtotal - discount)));
  const coinsRedeemedAmount = usePocketCoins && maxRedeemableCoins > 0 ? maxRedeemableCoins : 0;
  const effectiveFinalTotal = Math.max(0, finalTotal - coinsRedeemedAmount);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    notes: '',
    privacyConsent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[^0-9]/g, '').slice(-10))) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'PIN code must be 6 digits';
    }
    if (!formData.privacyConsent) {
      errs.privacyConsent = 'You must agree to the privacy policy to proceed';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { orderNumber, whatsappUrl } = await submitOrderEnquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        notes: formData.notes.trim()
      }, coinsRedeemedAmount);

      // Deduct redeemed coins from device pocket if applied
      if (coinsRedeemedAmount > 0) {
        redeemCoins(coinsRedeemedAmount, `Redeemed on Order #${orderNumber}`);
      }

      // Credit WiZ Coins to device pocket: Rs. 50 = 2 Coins
      const earnedCoins = calculateCoinsForAmount(effectiveFinalTotal);
      if (earnedCoins > 0) {
        addCoins(earnedCoins, `Order #${orderNumber} Reward`, effectiveFinalTotal);
      }

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error('Error submitting order enquiry:', error);
      setErrors({ form: 'An error occurred while creating your order enquiry. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: 'Cart', path: '/cart' },
          { label: 'Order Enquiry Checkout' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Order Enquiry &amp; Delivery Details
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          Fill in your delivery information to create your official order enquiry. You will be redirected to WhatsApp to confirm with our sales desk.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* =========================================================================
              LEFT: CUSTOMER & DELIVERY FORM
              ========================================================================= */}
          <div className="lg:col-span-7 bg-[#fafafa] border border-gray-300 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
              Customer Information
            </h2>

            {errors.form && (
              <div className="p-3 bg-[#ff675d]/5 border border-[#ff675d]/30 text-[#ff675d] text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2.5 text-xs bg-white border ${errors.name ? 'border-[#ff675d]' : 'border-gray-300'} focus:outline-none focus:border-[#7a49a6]`}
                />
                {errors.name && <p className="text-[11px] text-[#ff675d] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-3.5 py-2.5 text-xs bg-white border ${errors.phone ? 'border-[#ff675d]' : 'border-gray-300'} focus:outline-none focus:border-[#7a49a6]`}
                />
                {errors.phone && <p className="text-[11px] text-[#ff675d] mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rahul@example.com"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                Shipping Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                    Street Address / Apartment
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Flat / House No., Building Name, Street"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border ${errors.city ? 'border-[#ff675d]' : 'border-gray-300'} focus:outline-none focus:border-[#7a49a6]`}
                    />
                    {errors.city && <p className="text-[11px] text-[#ff675d] mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="e.g. 400054"
                      maxLength={6}
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border ${errors.pincode ? 'border-[#ff675d]' : 'border-gray-300'} focus:outline-none focus:border-[#7a49a6]`}
                    />
                    {errors.pincode && <p className="text-[11px] text-[#ff675d] mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                    Order Notes / Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Please dispatch before 5 PM / Leave at security gate"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Privacy Policy Consent */}
            <div className="pt-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 border-gray-300"
                />
                <span>
                  I consent to the WiZ{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-[#7a49a6] underline">
                    Privacy Policy
                  </Link>{' '}
                  and agree to receive order enquiry communication via WhatsApp/SMS.
                </span>
              </label>
              {errors.privacyConsent && (
                <p className="text-[11px] text-[#ff675d] mt-1">{errors.privacyConsent}</p>
              )}
            </div>
          </div>

          {/* =========================================================================
              RIGHT: ORDER SNAPSHOT & WHATSAPP ACTION
              ========================================================================= */}
          <div className="lg:col-span-5 bg-white border border-gray-300 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-200">
              Enquiry Summary ({items.length} Items)
            </h2>

            {/* Items review */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-2">
              {items.map((i) => (
                <div key={`${i.productId}-${i.variantId}`} className="py-2.5 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block truncate max-w-[200px]">
                      {i.productName}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      {i.variantName} × {i.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{(i.unitPrice * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
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

              {activeFreebie && (
                <div className="flex justify-between text-amber-800 font-semibold">
                  <span>Free Gift</span>
                  <span>{activeFreebie.freebieProduct}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {/* Coins Pocket Redemption Section */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Coins className="w-3 h-3 fill-white/80" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">Device Coins Pocket</span>
                      <span className="text-[10px] text-amber-800">
                        {coins > 0 ? (
                          <>Available on this device: <strong>{coins} Coins</strong> (₹{coins} value)</>
                        ) : (
                          <>Balance: <strong>0 Coins</strong> (First order on this device! Coins earn automatically on checkout)</>
                        )}
                      </span>
                    </div>
                  </div>
                  {coins > 0 && maxRedeemableCoins > 0 && (
                    <label className="inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={usePocketCoins}
                        onChange={(e) => setUsePocketCoins(e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="ml-1.5 text-xs font-bold text-amber-900">
                        {usePocketCoins ? 'Applied' : 'Redeem'}
                      </span>
                    </label>
                  )}
                </div>
                {usePocketCoins && coinsRedeemedAmount > 0 && (
                  <div className="mt-2 pt-2 border-t border-amber-200/80 flex justify-between items-center text-[11px] text-amber-900 font-medium">
                    <span>Pocket Coins Discount ({coinsRedeemedAmount} coins)</span>
                    <span className="font-bold text-emerald-700">-₹{coinsRedeemedAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {coinsRedeemedAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coins Pocket Redeemed</span>
                  <span>-₹{coinsRedeemedAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Final Estimated Total</span>
                <span className="text-2xl font-black text-gray-900">₹{effectiveFinalTotal.toFixed(2)}</span>
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
                    +{calculateCoinsForAmount(effectiveFinalTotal)} Coins
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold block">
                    (Worth ₹{calculateCoinsForAmount(effectiveFinalTotal)} OFF)
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white py-3.5 px-6 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>
                {isSubmitting ? 'Submitting Order Enquiry...' : 'Confirm & Submit Order Enquiry'}
              </span>
            </button>

            <div className="p-3 bg-gray-50 border border-gray-200 text-[11px] text-gray-500 leading-relaxed space-y-1">
              <div>
                <strong className="font-bold text-gray-800">Dispatch &amp; Order Routing:</strong>{' '}
                Order enquiry is submitted directly to WhatsApp (<strong>+91 93213 87229</strong>) and official email (<strong>wizvalue@cossmic.com</strong>).
              </div>
              <div>
                <strong className="font-bold text-gray-800">Payment Transparency:</strong>{' '}
                No card details are requested upfront. Our sales desk coordinates stock verification and dispatch details with you.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
