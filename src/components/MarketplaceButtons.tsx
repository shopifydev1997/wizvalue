import React from 'react';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { logAnalyticsEvent } from '../lib/storeService';

interface MarketplaceButtonsProps {
  amazonUrl?: string;
  zeptoUrl?: string;
  blinkitUrl?: string;
  productName: string;
}

export const MarketplaceButtons: React.FC<MarketplaceButtonsProps> = ({
  amazonUrl,
  zeptoUrl,
  blinkitUrl,
  productName
}) => {
  const handleClick = (platform: 'amazon' | 'zepto' | 'blinkit', url: string) => {
    logAnalyticsEvent({
      eventType: `${platform}_click` as const,
      target: url,
      details: { productName }
    });
  };

  return (
    <div className="space-y-2.5 pt-2">
      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        Buy on Quick Commerce &amp; Marketplaces:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {amazonUrl && (
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick('amazon', amazonUrl)}
            className="flex items-center justify-center space-x-2 bg-[#232f3e] hover:bg-[#131921] text-white py-2.5 px-3 text-xs font-semibold transition-colors"
          >
            <span>Buy with Amazon</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {zeptoUrl && (
          <a
            href={zeptoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick('zepto', zeptoUrl)}
            className="flex items-center justify-center space-x-2 bg-[#540075] hover:bg-[#3d0055] text-white py-2.5 px-3 text-xs font-semibold transition-colors"
          >
            <span>Buy on Zepto</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {blinkitUrl && (
          <a
            href={blinkitUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick('blinkit', blinkitUrl)}
            className="flex items-center justify-center space-x-2 bg-[#f8cb46] hover:bg-[#eab308] text-gray-900 py-2.5 px-3 text-xs font-bold transition-colors"
          >
            <span>Buy on Blinkit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <p className="text-[11px] text-gray-400 italic">
        *Marketplace purchases are completed directly on the respective platforms.
      </p>
    </div>
  );
};
