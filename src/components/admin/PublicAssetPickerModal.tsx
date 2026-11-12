import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Check, FolderOpen, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PublicAssetItem, fetchPublicAssets, FALLBACK_PUBLIC_ASSETS } from '../../lib/assetLibrary';
import { resolveAssetUrl } from '../../lib/storeService';

interface PublicAssetPickerModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  currentValue?: string;
  onSelect: (assetPath: string) => void;
  onClose: () => void;
}

export const PublicAssetPickerModal: React.FC<PublicAssetPickerModalProps> = ({
  isOpen,
  title,
  subtitle,
  currentValue,
  onSelect,
  onClose
}) => {
  const [assets, setAssets] = useState<PublicAssetItem[]>(FALLBACK_PUBLIC_ASSETS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customPath, setCustomPath] = useState(currentValue || '');

  useEffect(() => {
    if (isOpen) {
      fetchPublicAssets().then(setAssets);
      setCustomPath(currentValue || '');
      setSearch('');
    }
  }, [isOpen, currentValue]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ['All', ...Array.from(set)];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCat = selectedCategory === 'All' || asset.category === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        asset.name.toLowerCase().includes(q) ||
        asset.path.toLowerCase().includes(q) ||
        asset.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [assets, selectedCategory, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white max-w-4xl w-full border border-gray-300 shadow-2xl flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#7a49a6] text-white flex items-center justify-center shrink-0">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base uppercase tracking-wider">
                {title}
              </h3>
              <p className="text-[11px] text-gray-500">
                {subtitle || 'Select an authentic product image from the /assets repository'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Custom Path Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by product name, variant, or category (e.g. handwash, lemon, wipes, 5L, floor)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#7a49a6]"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Direct manual path entry provision */}
            <div className="flex items-center gap-1.5 sm:max-w-xs w-full">
              <input
                type="text"
                placeholder="Or paste any custom path..."
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                className="flex-1 bg-white border border-gray-300 px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-[#7a49a6]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customPath.trim()) {
                    let cleaned = customPath.trim();
                    if (!/^(https?:|\/\/|data:|blob:)/i.test(cleaned)) {
                      cleaned = cleaned.replace(/^(\/?public\/)/i, '/');
                      if (!cleaned.startsWith('/')) {
                        cleaned = '/' + cleaned;
                      }
                    }
                    onSelect(cleaned);
                    onClose();
                  }
                }}
                disabled={!customPath.trim()}
                className="bg-[#7a49a6] hover:bg-[#5f3786] disabled:opacity-50 text-white px-3 py-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
              >
                Apply Path
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs max-h-24 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer rounded-xs ${
                  selectedCategory === cat
                    ? 'bg-[#7a49a6] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-white">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-xs text-gray-700">No assets matching "{search}"</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Try searching for another keyword or select the "All" category.
              </p>
            </div>
          ) : (
            filteredAssets.map((asset, idx) => {
              const isSelected = currentValue === asset.path;
              return (
                <div
                  key={`${asset.path}-${idx}`}
                  onClick={() => {
                    onSelect(asset.path);
                    onClose();
                  }}
                  className={`group relative border p-2 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-[#7a49a6] ring-2 ring-[#7a49a6]/20 bg-purple-50/30'
                      : 'border-gray-200 hover:border-[#7a49a6] bg-white'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-2 overflow-hidden mb-2 relative">
                    <img
                      src={resolveAssetUrl(asset.path)}
                      alt={asset.name}
                      className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.dataset.retried) {
                          target.dataset.retried = 'true';
                          target.src = resolveAssetUrl(asset.path);
                        }
                      }}
                    />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 bg-[#7a49a6] text-white p-1 rounded-full shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Asset Details */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-[#7a49a6] bg-purple-50 px-1.5 py-0.5 rounded block w-max">
                      {asset.category}
                    </span>
                    <span className="font-bold text-gray-900 text-xs block line-clamp-1 leading-tight group-hover:text-[#7a49a6]">
                      {asset.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono truncate block" title={asset.path}>
                      {asset.path}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="mt-2 w-full bg-gray-900 group-hover:bg-[#7a49a6] text-white text-[10px] font-bold py-1 px-2 uppercase tracking-wider transition-colors text-center"
                  >
                    Select This Image
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <span>
            Showing <strong>{filteredAssets.length}</strong> of {assets.length} public assets
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
