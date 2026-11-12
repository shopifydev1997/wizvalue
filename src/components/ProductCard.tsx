import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { QuickViewModal } from './QuickViewModal';
import { recordRecentlyViewed } from '../lib/recentlyViewed';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showCategory = false }) => {
  const { addToCart } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const defaultVariant = product.variants[0] || {
    id: 'default',
    name: product.packagingSize || 'Standard',
    sku: product.sku,
    regularPrice: product.regularPrice,
    sellingPrice: product.sellingPrice,
    stock: product.stock,
    packagingSize: product.packagingSize || ''
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      variantId: defaultVariant.id,
      variantName: defaultVariant.name,
      sku: defaultVariant.sku,
      unitPrice: defaultVariant.sellingPrice,
      regularPrice: defaultVariant.regularPrice,
      quantity: 1,
      image: defaultVariant.image || product.images[0] || '',
      category: product.category
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const mainImage = product.images[0] || 'public/assets/products/Orange Wet Wipes.jpg';

  return (
    <>
      <div className="group relative bg-white border border-gray-200 transition-all duration-200 hover:border-gray-400 flex flex-col justify-between">
        <div>
          {/* Image & Badges */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4">
            <Link
              to={`/product/${product.slug}`}
              onClick={() => recordRecentlyViewed(product)}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={mainImage}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
              {product.discountPercent > 0 && (
                <span
                  className="bg-[#ff675d] text-white text-[11px] font-semibold px-3 py-1 shadow-xs tracking-wide rounded-full"
                  style={{ borderRadius: '9999px' }}
                >
                  {product.discountPercent}% OFF
                </span>
              )}
              {product.isSoldout && (
                <span
                  className="bg-black text-white text-[11px] font-semibold px-3.5 py-1 shadow-xs tracking-wide rounded-full"
                  style={{ borderRadius: '9999px' }}
                >
                  Soldout
                </span>
              )}
            </div>

            {/* Add to Bag Button on Hover */}
            <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              {product.isSoldout ? (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 py-2 px-3 text-xs font-semibold uppercase tracking-wider cursor-not-allowed text-center shadow-md"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleQuickAdd}
                  className={`w-full py-2 px-3 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-1.5 cursor-pointer ${
                    addedNotice
                      ? 'bg-green-600 text-white'
                      : 'bg-black hover:bg-[#7a49a6] text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{addedNotice ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Details - Left Aligned */}
          <div className="p-3.5 text-left">
            {showCategory && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                {product.category}
              </span>
            )}

            <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#7a49a6] transition-colors text-left">
              <Link
                to={`/product/${product.slug}`}
                onClick={() => recordRecentlyViewed(product)}
              >
                {product.name}
              </Link>
            </h3>

            {/* Price formatting matching reference: ₹125.00 ₹99 */}
            <div className="mt-1.5 flex items-center justify-start space-x-2">
              {product.regularPrice > product.sellingPrice && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  ₹{product.regularPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm font-semibold text-gray-900">
                ₹{product.sellingPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
};
