import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { WhatsAppOrderButton } from './WhatsAppOrderButton';
import { MarketplaceButtons } from './MarketplaceButtons';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      name: product.packagingSize || 'Standard',
      sku: product.sku,
      regularPrice: product.regularPrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      packagingSize: product.packagingSize || ''
    }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      sku: selectedVariant.sku,
      unitPrice: selectedVariant.sellingPrice,
      regularPrice: selectedVariant.regularPrice,
      quantity,
      image: selectedVariant.image || product.images[0] || '',
      category: product.category
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const currentImage = selectedVariant.image || product.images[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="relative bg-white max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="aspect-square bg-gray-50 border border-gray-200 p-6 flex items-center justify-center">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a49a6]">
              {product.category}
            </span>
            <h2 className="text-lg font-bold text-gray-900 mt-1 leading-snug">
              {product.name}
            </h2>

            <div className="text-xs text-gray-500 mt-1">
              SKU: <span className="font-mono text-gray-700">{selectedVariant.sku}</span>
            </div>

            {/* Price */}
            <div className="mt-3 flex items-baseline space-x-3">
              <span className="text-2xl font-black text-gray-900">
                ₹{selectedVariant.sellingPrice.toFixed(2)}
              </span>
              {selectedVariant.regularPrice > selectedVariant.sellingPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{selectedVariant.regularPrice.toFixed(2)}
                  </span>
                  <span className="bg-[#ff675d] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                    Save {Math.round(((selectedVariant.regularPrice - selectedVariant.sellingPrice) / selectedVariant.regularPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mt-3 line-clamp-3">
              {product.shortDescription}
            </p>

            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                  Select Size / Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs px-3 py-2 border font-medium transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-500 bg-white'
                        }`}
                      >
                        {v.name} • ₹{v.sellingPrice}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div className="mt-6 flex items-center space-x-3">
              <div className="flex items-center border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-gray-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.isSoldout}
                className="flex-1 bg-black hover:bg-[#7a49a6] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Order */}
            <div className="mt-3">
              <WhatsAppOrderButton
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                className="w-full text-xs"
              />
            </div>

            {/* Marketplace Buttons */}
            <MarketplaceButtons
              amazonUrl={product.amazonUrl}
              zeptoUrl={product.zeptoUrl}
              blinkitUrl={product.blinkitUrl}
              productName={product.name}
            />

            <div className="mt-4 pt-3 border-t border-gray-200 text-right">
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#7a49a6] hover:underline"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
