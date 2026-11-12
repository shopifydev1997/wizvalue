import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';
import { ShieldCheck, Award, Factory, HeartHandshake, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../lib/storeService';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Us | WiZ Home Hygiene & Personal Care',
    description: 'Learn about WiZ (Gulshan Cosmetics Pvt Ltd), our FDA-approved GMP manufacturing plant in Palghar, Maharashtra, and our mission to provide affordable, hospital-grade hygiene to every Indian home.'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Hero */}
        <div className="bg-[#f4f7f5] border border-gray-200 p-8 sm:p-14 mb-12">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-2">
              Our Heritage &amp; Commitment
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Pure Hygiene, Thoughtfully Crafted for Indian Homes.
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
              WiZ is a premier home hygiene and personal care brand owned and manufactured by Gulshan Cosmetics Pvt Ltd. Driven by scientific formulation, stringent quality testing, and ethical responsibility, we deliver hospital-grade cleanliness and skin-loving care across India.
            </p>
          </div>
        </div>

        {/* 2-Column Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              From Factory Direct to Your Doorstep
            </h2>
            <p>
              Unlike mass commercial brands burdened by multi-layered distributor markups, WiZ operates on a manufacturer-direct philosophy. From our automated, hygienic facility in Waliv, Vasai (East), Palghar, Maharashtra, we control every phase of manufacturing — from reverse osmosis water purification and active botanical blending to automated sealing and quality assurance.
            </p>
            <p>
              Our flagship range spans anti-bacterial handwashes, alcohol-free wet wipes, multi-surface disinfectants, concentrated dishwash gels, enzyme-active laundry liquids, and cost-effective 1L refill pouches and 5L commercial cans.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-block bg-black hover:bg-[#7a49a6] text-white py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </div>

          <div className="aspect-[4/3] bg-gray-100 border border-gray-200 overflow-hidden">
            <img
              src={resolveAssetUrl('/assets/products/Lemon-Floor-Cleaner 1L.jpg')}
              alt="WiZ Laboratory Quality"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <ShieldCheck className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-2">99.9% Proven Protection</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Rigorous microbiology lab testing ensures verified bacterial and viral eradication on surfaces and skin.
            </p>
          </div>

          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <Factory className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-2">FDA Approved Facility</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Formulated under certified Good Manufacturing Practices (GMP) and approved by State Licensing Authorities.
            </p>
          </div>

          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <Award className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-2">Skin-Safe Ingredients</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              No harmful parabens, harsh bleaches, or toxic solvents. Safe for children, pets, and sensitive skin.
            </p>
          </div>

          <div className="p-6 border border-gray-200 bg-[#fafafa]">
            <HeartHandshake className="w-8 h-8 text-[#7a49a6] mb-3" />
            <h3 className="font-bold text-sm text-gray-900 mb-2">Eco-Conscious Packaging</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our 1L spout pouches and 5L commercial cans reduce virgin plastic consumption by up to 70%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
