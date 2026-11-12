import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Product } from '../types';
import { getProducts } from '../lib/storeService';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [inputVal, setInputVal] = useState(query);

  useSEO({
    title: query ? `Search: "${query}" | WiZ Care` : 'Search Products | WiZ Care',
    noIndex: true
  });

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.variants.some((v) => v.name.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q))
    );
  }, [query, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Search Input Box */}
        <div className="bg-[#fafafa] border border-gray-300 p-8 mb-8 max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">
            Search WiZ Hygiene Products
          </h1>

          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search by product name, variant, or category (e.g. Wet Wipes, 5L, Handwash)..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#7a49a6]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-[#7a49a6] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <p className="text-xs text-gray-600">
            {query ? (
              <span>
                Found <strong className="text-gray-900 font-bold">{results.length}</strong> products matching "
                <strong className="text-gray-900 font-bold">{query}</strong>"
              </span>
            ) : (
              <span>Please enter a search term above.</span>
            )}
          </p>

          <Link to="/shop" className="text-xs font-semibold text-[#7a49a6] hover:underline">
            View All Products →
          </Link>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} showCategory={true} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200">
            <h3 className="text-base font-bold text-gray-900">No matching products found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try searching with a broader keyword like "cleaner", "wipes", "sanitizer", or "5L".
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
