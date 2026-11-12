import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { logAnalyticsEvent } from '../lib/storeService';

interface WhatsAppOrderButtonProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity?: number;
  className?: string;
  whatsappNumber?: string;
}

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  product,
  selectedVariant,
  quantity = 1,
  className = '',
  whatsappNumber = '+91 93213 87229'
}) => {
  const variant = selectedVariant || product.variants[0] || {
    id: 'default',
    name: product.packagingSize || 'Standard Pack',
    sku: product.sku,
    sellingPrice: product.sellingPrice,
    regularPrice: product.regularPrice,
    stock: product.stock,
    packagingSize: product.packagingSize || ''
  };

  const subtotal = variant.sellingPrice * quantity;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://wizcare.in/product/${product.slug}`;

  const message = `👋 Hello WiZ Team,\nI would like to place an order enquiry for:\n\n• *Product:* ${product.name}\n• *Variant:* ${variant.name}\n• *SKU:* ${variant.sku}\n• *Quantity:* ${quantity}\n• *Price:* ₹${variant.sellingPrice} each\n• *Estimated Subtotal:* ₹${subtotal}\n• *Product Link:* ${currentUrl}\n\nPlease confirm availability and payment/delivery instructions.`;

  const rawDigits = whatsappNumber.replace(/[^0-9]/g, '');
  const phone = rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    logAnalyticsEvent({
      eventType: 'whatsapp_order',
      target: 'WhatsApp Order Button',
      details: {
        productName: product.name,
        variantName: variant.name,
        quantity,
        subtotal
      }
    });
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold py-3 px-6 transition-all shadow-sm ${className}`}
    >
      <MessageSquare className="w-5 h-5 fill-current" />
      <span>Order via WhatsApp</span>
    </a>
  );
};
