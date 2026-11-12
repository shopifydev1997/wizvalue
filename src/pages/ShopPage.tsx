import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { Product, Category } from '../types';
import { getProducts, getCategories } from '../lib/storeService';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const ShopPage: React.FC = () => {
  useSEO({
    title: 'Shop All Products | WiZ Home Hygiene & Personal Care',
    description: 'Explore our complete catalog of WiZ home hygiene and personal care products: Handwash, Wet Wipes, Dishwash Gel, Floor Cleaner, Liquid Matic Detergent, and 5L Bulk Cans.',
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/shop` : 'https://wizcare.in/shop'
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const selectedCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'featured';
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category.toLowerCase().replace(/\s+/g, '-') !== selectedCategory.toLowerCase().replace(/\s+/g, '-')) {
          return false;
        }
        if (inStockOnly && p.isSoldout) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // default / featured
      });
  }, [products, selectedCategory, sortBy, searchQuery, inStockOnly]);

  return (
    <div className="bg-white min-h-screen pb-16">
      <Breadcrumbs items={[{ label: 'Shop All Products' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner Header */}
        <div className="bg-[#f4f7f5] border border-gray-200 p-8 sm:p-12 mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1">
            Complete Product Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shop WiZ Hygiene Essentials
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
            From everyday pocket wipes to 5L industrial cans, discover lab-tested antibacterial and home cleaning formulations at factory-direct pricing.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4 border-b border-gray-200">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs font-semibold py-1">
            <button
              onClick={() => {
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className={`px-3 py-1.5 border transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((c) => {
              const cSlug = c.slug.toLowerCase();
              const isSelected = selectedCategory.toLowerCase() === cSlug;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    searchParams.set('category', cSlug);
                    setSearchParams(searchParams);
                  }}
                  className={`px-3 py-1.5 border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-[#7a49a6] text-xs w-40 sm:w-52"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            {/* In stock toggle */}
            <label className="flex items-center space-x-1.5 text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5"
              />
              <span>In Stock</span>
            </label>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                searchParams.set('sort', e.target.value);
                setSearchParams(searchParams);
              }}
              className="border border-gray-300 bg-white py-2 px-3 focus:outline-none focus:border-[#7a49a6] text-xs font-medium cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-gray-200 mt-8">
            <h3 className="text-base font-bold text-gray-900">No products match your criteria</h3>
            <p className="text-xs text-gray-500 mt-1">Try clearing your filters or search keywords.</p>
            <button
              onClick={() => {
                searchParams.delete('category');
                setSearchParams(searchParams);
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-4 bg-black text-white text-xs font-bold px-4 py-2 uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} showCategory={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
