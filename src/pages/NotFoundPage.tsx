import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export const NotFoundPage: React.FC = () => {
  useSEO({
    title: '404 Page Not Found | WiZ Care',
    noIndex: true
  });

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <span className="text-6xl font-black text-[#7a49a6] block mb-2">404</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-xs text-gray-500 mb-8 leading-relaxed">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="bg-black hover:bg-[#7a49a6] text-white py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            to="/shop"
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Shop All Products
          </Link>
        </div>
      </div>
    </div>
  );
};
