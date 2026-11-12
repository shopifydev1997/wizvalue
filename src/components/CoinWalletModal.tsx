import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  X,
  Sparkles,
  ArrowRight,
  Calculator,
  Gift,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { useCoinWallet } from '../context/CoinWalletContext';

interface CoinWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinWalletModal: React.FC<CoinWalletModalProps> = ({ isOpen, onClose }) => {
  const { coins, transactions, calculateCoinsForAmount, claimDailyBonus, lastClaimDate } = useCoinWallet();
  const [calcAmount, setCalcAmount] = useState<string>('500');
  const [claimToast, setClaimToast] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const parsedCalcAmount = parseFloat(calcAmount) || 0;
  const simulatedCoins = calculateCoinsForAmount(parsedCalcAmount);
  const today = new Date().toISOString().split('T')[0];
  const isAlreadyClaimedToday = lastClaimDate === today;

  const handleClaim = () => {
    const res = claimDailyBonus();
    setClaimToast({ text: res.message, isError: !res.success });
    setTimeout(() => setClaimToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header with Golden Theme */}
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-6 text-white overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/15 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/35 text-white transition-colors cursor-pointer"
            aria-label="Close Coin Wallet"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-amber-500 flex items-center justify-center shadow-md">
              <Coins className="w-7 h-7 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-950/80 block">
                Device Royalty Coins
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
                WiZ Coins Pocket
              </h3>
            </div>
          </div>

          {/* Balance Display */}
          <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 text-gray-900 shadow-md border border-white/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-600 block font-medium">Your Coins Pocket</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-3xl font-black text-amber-600 tracking-tight">{coins}</span>
                <span className="text-sm font-bold text-amber-700">Coins</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-gray-500 block uppercase tracking-wider font-semibold">
                Redeem Value
              </span>
              <span className="text-lg font-bold text-emerald-600">₹{coins}.00 OFF</span>
              <span className="text-[10px] text-gray-500 block">1 Coin = ₹1 discount</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-left text-sm">
          {/* Toast Notification */}
          {claimToast && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                claimToast.isError
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{claimToast.text}</span>
            </div>
          )}

          {/* Main Earning Rule Spotlight */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  Earn 2 WiZ Coins for every ₹50 spent!
                </h4>
                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                  Every time you place an order on WiZ Hygiene, your wallet gets automatically credited with 
                  <strong className="text-amber-950 font-bold"> 2 Coins per ₹50 </strong> 
                  spent. Use coins on any future order for direct cash discounts!
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-semibold text-amber-900">
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                    ₹50 Order = 2 Coins
                  </span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                    ₹250 Order = 10 Coins
                  </span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                    ₹500 Order = 20 Coins
                  </span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                    ₹1,000 Order = 40 Coins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Coin Calculator */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Calculator className="w-4 h-4 text-gray-700" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Live Order Coin Calculator
              </h5>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Enter your anticipated order value to see how many coins you will earn:
            </p>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  placeholder="500"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-gray-900"
                />
              </div>
              <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-lg text-center shrink-0">
                <span className="text-[10px] text-amber-800 uppercase font-bold block">
                  You Gain
                </span>
                <span className="text-base font-black text-amber-900">
                  +{simulatedCoins} Coins
                </span>
              </div>
            </div>
          </div>

          {/* Daily Check-in Bonus */}
          <div className="border border-teal-200 bg-teal-50/70 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-teal-950 text-xs">Daily Check-in Bonus</h5>
                <p className="text-[11px] text-teal-800">
                  Tap to collect your free +5 WiZ Coins daily!
                </p>
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={isAlreadyClaimedToday}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                isAlreadyClaimedToday
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#7a49a6] hover:bg-[#5f3786] text-white shadow-xs'
              }`}
            >
              {isAlreadyClaimedToday ? 'Claimed Today' : 'Claim +5 Coins'}
            </button>
          </div>

          {/* Recent Coin Activity Ledger */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-gray-800 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Coin Activity History</span>
              </div>
              <span className="text-[11px] text-gray-500">{transactions.length} records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg text-center text-xs text-amber-900/80">
                <p className="font-semibold text-gray-800 mb-1">Your Pocket is Empty (0 Coins)</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Start shopping any products on this device to earn 2 WiZ Coins for every ₹50 spent. Coins can be redeemed for direct discounts while placing orders!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 block">{tx.description}</span>
                      <span className="text-[10px] text-gray-500">{tx.date}</span>
                    </div>
                    <span
                      className={`font-bold ${
                        tx.type === 'earned' ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {tx.type === 'earned' ? '+' : '-'}
                      {tx.amount} Coins
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Device specific: Coins are saved locally to this device</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              to="/shop"
              onClick={onClose}
              className="px-4 py-2 bg-black hover:bg-[#7a49a6] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop &amp; Earn Coins</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
