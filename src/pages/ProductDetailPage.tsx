import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { getProducts, resolveAssetUrl } from '../lib/storeService';
import { useCart } from '../context/CartContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { WhatsAppOrderButton } from '../components/WhatsAppOrderButton';
import { MarketplaceButtons } from '../components/MarketplaceButtons';
import { ProductCard } from '../components/ProductCard';
import { useSEO } from '../hooks/useSEO';
import { recordRecentlyViewed } from '../lib/recentlyViewed';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      const found = data.find((p) => p.slug === slug);
      if (found) {
        setProduct(found);
        recordRecentlyViewed(found);
        const defaultVar = found.variants[0] || {
          id: 'default',
          name: found.packagingSize || 'Standard Pack',
          sku: found.sku,
          regularPrice: found.regularPrice,
          sellingPrice: found.sellingPrice,
          stock: found.stock,
          packagingSize: found.packagingSize || ''
        };
        setSelectedVariant(defaultVar);
        setActiveImage(defaultVar.image || found.images[0] || '');
      }
    });
  }, [slug]);

  // Handle variant switch
  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setActiveImage(variant.image);
    }
  };

  useSEO({
    title: product ? `${product.name} | WiZ Hygiene` : 'Product Details',
    description: product?.shortDescription,
    image: activeImage,
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/product/${slug}` : `https://wizcare.in/product/${slug}`
  });

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#7a49a6] border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Loading Product Details...
          </p>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant.sellingPrice;
  const regularPrice = selectedVariant.regularPrice;
  const discountPercent = regularPrice > currentPrice
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
    : 0;

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
      image: selectedVariant.image || activeImage,
      category: product.category
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Structured Data Schema (Product & Offer)
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: activeImage,
    description: product.shortDescription,
    sku: selectedVariant.sku,
    brand: {
      '@type': 'Brand',
      name: 'WiZ'
    },
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'INR',
      price: selectedVariant.sellingPrice,
      priceValidUntil: '2027-12-31',
      availability: selectedVariant.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 5);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Shop', path: '/shop' },
          { label: product.category, path: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
          { label: product.name }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* =========================================================================
              LEFT COLUMN: 7 TO 8 SIDE POST IMAGE GALLERY
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Side Post Thumbnails Strip (Up to 8 Images) */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[580px] w-full sm:w-20 md:w-24 shrink-0 no-scrollbar py-1">
                {product.images.slice(0, 8).map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    onMouseEnter={() => setActiveImage(imgUrl)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 p-1.5 bg-gray-50 border shrink-0 transition-all cursor-pointer group ${
                      activeImage === imgUrl
                        ? 'border-[#ff675d] ring-2 ring-[#ff675d]/40'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    title={`View angle ${i + 1}`}
                  >
                    <img
                      src={resolveAssetUrl(imgUrl)}
                      alt={`${product.name} angle ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 font-mono leading-none">
                      {i + 1}/8
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 w-full relative aspect-square bg-[#f9faf9] border border-gray-200 p-8 flex items-center justify-center overflow-hidden group">
              <img
                src={resolveAssetUrl(activeImage)}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#ff675d] text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm">
                  {discountPercent}% OFF
                </div>
              )}

              {selectedVariant.stock === 0 && (
                <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wider">
                  Soldout
                </div>
              )}

              {/* Side Images Counter Badge */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-gray-200 text-[10px] font-semibold text-gray-700 px-2 py-0.5 shadow-xs">
                {product.images.length} High-Res Views
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: PRODUCT DETAILS & ACTIONS
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7a49a6]">
                  {product.category}
                </span>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-black p-1 cursor-pointer"
                  title="Share product link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>SKU: <strong className="text-gray-800 font-mono">{selectedVariant.sku}</strong></span>
                <span>•</span>
                <span className={selectedVariant.stock > 0 ? 'text-green-600 font-semibold' : 'text-[#ff675d] font-semibold'}>
                  {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock} available)` : 'Currently Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Box matching reference */}
            <div className="bg-[#f8faf9] border border-gray-200 p-4 flex items-baseline space-x-3">
              <span className="text-3xl font-black text-gray-900">
                ₹{currentPrice.toFixed(2)}
              </span>
              {regularPrice > currentPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ₹{regularPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#ff675d]">
                    Save ₹{(regularPrice - currentPrice).toFixed(2)} ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variant Switcher Buttons */}
            {product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-900">
                  Select Packaging / Size Variant:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleVariantChange(v)}
                        className={`p-3 text-left border transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white hover:border-gray-500 text-gray-800'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{v.name}</div>
                        <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                          ₹{v.sellingPrice} {v.stock === 0 && '• Soldout'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center border border-gray-300 bg-white shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-3 text-sm font-semibold hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-3 text-xs font-bold text-gray-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-3 text-sm font-semibold hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button (no payment gateway) */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedVariant.stock === 0}
                className="flex-1 bg-black hover:bg-[#7a49a6] text-white py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (₹{currentPrice * quantity})</span>
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp Direct Enquiry Button */}
            <div className="pt-2">
              <WhatsAppOrderButton
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                className="w-full text-xs"
              />
            </div>

            {/* Marketplace Outbound Outlets */}
            <MarketplaceButtons
              amazonUrl={product.amazonUrl}
              zeptoUrl={product.zeptoUrl}
              blinkitUrl={product.blinkitUrl}
              productName={product.name}
            />

            {/* Hygiene Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 text-center text-[11px] text-gray-600">
              <div className="p-2 border border-gray-100 bg-gray-50">
                <Truck className="w-4 h-4 mx-auto mb-1 text-[#7a49a6]" />
                <span className="font-semibold block">Free Shipping</span>
                <span className="text-[10px] text-gray-400">On ₹599+</span>
              </div>
              <div className="p-2 border border-gray-100 bg-gray-50">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#7a49a6]" />
                <span className="font-semibold block">99.9% Kill</span>
                <span className="text-[10px] text-gray-400">Lab Tested</span>
              </div>
              <div className="p-2 border border-gray-100 bg-gray-50">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-[#7a49a6]" />
                <span className="font-semibold block">FDA Approved</span>
                <span className="text-[10px] text-gray-400">GMP Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PRODUCT TABS: DESCRIPTION, BENEFITS, USAGE, INGREDIENTS
            ========================================================================= */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-4">
                Detailed Product Overview
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>

              {product.benefits && product.benefits.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                    Key Features &amp; Hygiene Benefits:
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-[#7a49a6] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {product.usageInstructions && (
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                    How To Use &amp; Dilution Guidelines
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {product.usageInstructions}
                  </p>
                </div>
              )}

              {product.ingredients && (
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                    Active Ingredients &amp; Formulation
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-mono">
                    {product.ingredients}
                  </p>
                </div>
              )}

              <div className="bg-teal-50/60 p-6 border border-teal-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a49a6] mb-2">
                  Institutional / High-Volume Need?
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  WiZ supplies 5L cans and industrial bulk quantities directly from our manufacturing plant in Palghar, Maharashtra with custom GST billing.
                </p>
                <Link
                  to="/bulk-order"
                  className="inline-block bg-[#7a49a6] hover:bg-[#5f3786] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Submit Bulk Order Request →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RELATED PRODUCTS
            ========================================================================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
