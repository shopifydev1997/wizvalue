import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, ShieldCheck, Award } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';
import { resolveAssetUrl } from '../lib/imageAsset';

interface Milestone {
  year: string;
  description: string;
}

const PROUD_MILESTONES: Milestone[] = [
  {
    year: '2011',
    description: 'Cossmic Products Pvt Ltd is incorporated, taking over Cossmic.'
  },
  {
    year: '2012',
    description:
      'Palghar Plant starts production making WIZ brand and Aro for Metro. Also, in June 2012, start production for Caremate & Sach brand for FCL.'
  },
  {
    year: '2013',
    description: '‘SACH’ brand manufactured by us for FCL wins Product of the Year.'
  },
  {
    year: '2014',
    description:
      'Start production for Body wash for WiZ as well as Think Skin. June 2014: took Disney License to start co-branded products in Hand wash, Hand Sanitizer, Talcum Powder and Soaps.'
  },
  {
    year: '2015',
    description:
      'Acquired FDA License for manufacturing all External Preparations like Hand Sanitizers, Anti-Bacterials and Disinfectants.'
  },
  {
    year: '2016',
    description:
      'Acquired Birla plant for making wet wipes and started manufacturing Kara wet wipes for FCL.'
  },
  {
    year: '2017',
    description: 'Started Baby products like Baby wipes, Liquid Detergent and Cleansers.'
  },
  {
    year: '2018',
    description: 'Production Capacity Doubled with more automation.'
  }
];

const EXPERIENCE_STATS = [
  { value: '10', label: 'Years of experience' },
  { value: '9K', label: 'Happy customers' },
  { value: '20K', label: 'Products in stock' },
  { value: '4K', label: 'Score on ecommerce' }
];

const INHOUSE_BRANDS = [
  { name: 'Wiz Cleen', focus: 'Home & Surface Hygiene', to: '/category/floor-cleaner' },
  { name: 'Wiz Personal Care', focus: 'Everyday Skin & Hand Hygiene', to: '/category/handwash' },
  { name: 'Kara Wipes', focus: 'Soft Cleansing Wet Wipes', to: '/category/wet-wipes' },
  { name: 'Think Skin Body wash', focus: 'Nourishing Bath & Shower Care', to: '/category/bodywash' }
];

export const AboutPage: React.FC = () => {
  const [factoryImgError, setFactoryImgError] = useState(false);
  const [founderImgError, setFounderImgError] = useState(false);
  const [certImgError, setCertImgError] = useState(false);

  useSEO({
    title: 'About Us | WiZ Value — Cossmic Products Pvt Ltd',
    description:
      'Welcome to WiZ Value, backed by Cossmic Products Pvt Ltd since 1978. Discover our 4 in-house brands, manufacturing heritage, proud milestones, certifications, and founder Reetesh Dhingra’s mission.'
  });

  return (
    <div className="bg-white min-h-screen pb-24 font-['Poppins',sans-serif] text-gray-800">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Section 1: The Company (Editorial Split Hero) */}
      <section className="w-full bg-[#faf7fd] border-b border-[#ecdcf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-3">
                  <span>Cossmic Products Pvt Ltd</span>
                  <span aria-hidden="true">·</span>
                  <span>Trusted Since 1978</span>
                  <span aria-hidden="true">·</span>
                  <span>4 Inhouse Brands</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-[1.15] text-balance">
                  The Company
                </h1>

                <div className="mt-6 space-y-4 text-[14.5px] sm:text-[15.5px] text-gray-700 leading-[1.8]">
                  <p>
                    Welcome to WiZ Value. Your favourite personal care and hygiene brand now has upgraded to 4 inhouse brands; <strong className="font-semibold text-gray-900">Wiz Cleen</strong>, <strong className="font-semibold text-gray-900">Wiz Personal Care</strong>, <strong className="font-semibold text-gray-900">Kara Wipes</strong> and <strong className="font-semibold text-gray-900">Think Skin Body wash</strong>. WiZ Value secures good hygiene for all while guaranteeing highest quality products at an affordable price.
                  </p>
                  <p>
                    Our parent company, <strong className="font-semibold text-gray-900">Cossmic Products Pvt Ltd</strong> has been a trusted manufacturer of personal and home care products since 1978, with all our products being manufactured at our own factory, we keep account of quality control measures to deliver high quality products to meet our customers&apos; diverse set of healthcare needs.
                  </p>
                </div>
              </div>

              {/* 4 Inhouse Brands Grid */}
              <div className="mt-8 pt-6 border-t border-[#e8d9f5]">
                <p className="text-xs font-semibold text-gray-900 mb-3">
                  Our 4 Inhouse Brands
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INHOUSE_BRANDS.map((brand) => (
                    <Link
                      key={brand.name}
                      to={brand.to}
                      className="group border border-[#e6d6f3] bg-white hover:border-[#7a49a6] px-4 py-3 flex items-center justify-between transition-colors"
                    >
                      <div className="min-w-0">
                        <span className="block text-[13px] font-semibold text-gray-900 group-hover:text-[#7a49a6] truncate transition-colors">
                          {brand.name}
                        </span>
                        <span className="block text-[11px] text-gray-500 truncate mt-0.5">
                          {brand.focus}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#7a49a6] shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Factory Photography */}
            <div className="lg:col-span-6 flex">
              <figure className="w-full border border-[#e6d6f3] bg-white overflow-hidden flex flex-col">
                <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] bg-gray-100">
                  {!factoryImgError ? (
                    <img
                      src={resolveAssetUrl('/assets/about-factory.jpg')}
                      alt="Cossmic Products Pvt Ltd modern manufacturing facility"
                      referrerPolicy="no-referrer"
                      onError={() => setFactoryImgError(true)}
                      className="w-full h-full object-cover lg:absolute lg:inset-0"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-[#f4f1f8] text-gray-600 p-8 text-center">
                      <Factory className="w-10 h-10 text-[#7a49a6] mb-3" />
                      <p className="text-sm font-semibold text-gray-900">
                        Cossmic Products Pvt Ltd Manufacturing Plant
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        In-house quality-controlled personal and home care production since 1978
                      </p>
                    </div>
                  )}
                </div>
                <figcaption className="px-5 py-3.5 border-t border-gray-100 bg-white flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                  <span className="font-medium text-gray-900">
                    In-House Manufacturing &amp; Quality Control Facility
                  </span>
                  <span className="text-gray-500">Cossmic Products Pvt Ltd</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Experience (Full-Width 4-Column Metric Strip) */}
      <section aria-labelledby="experience-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-medium text-[#7a49a6] tracking-wide mb-1">
              By the Numbers
            </p>
            <h2
              id="experience-heading"
              className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight"
            >
              Our Experience
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-gray-500 max-w-md">
            Factory-direct hygiene, personal care, and household formulations trusted nationwide.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border border-gray-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {EXPERIENCE_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`p-6 sm:p-8 flex flex-col justify-between ${
                idx % 2 === 1 ? 'border-l border-gray-200 sm:border-l-0' : ''
              } ${idx >= 2 ? 'lg:border-t-0' : ''}`}
            >
              <span className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#7a49a6] tracking-tight tabular-nums leading-none">
                {stat.value}
              </span>
              <span className="mt-3 text-xs sm:text-sm font-medium text-gray-700">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Founder Message & Portrait Spotlight */}
      <section aria-labelledby="founder-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="border border-[#e8d9f5] bg-[#faf7fd] p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Founder Portrait */}
            <div className="lg:col-span-4">
              <div className="aspect-[3/4] max-w-sm mx-auto lg:max-w-none border border-[#e3d2f1] bg-white overflow-hidden">
                {!founderImgError ? (
                  <img
                    src={resolveAssetUrl('/assets/aistudio/Reetesh-Sir_d49db45c.jpg')}
                    alt="Reetesh Dhingra, Founder of WiZ Value and Cossmic Products Pvt Ltd"
                    referrerPolicy="no-referrer"
                    onError={() => setFounderImgError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#f3eef9] p-8 text-center">
                    <Award className="w-10 h-10 text-[#7a49a6] mb-3" />
                    <p className="text-base font-semibold text-gray-900">Reetesh Dhingra</p>
                    <p className="text-xs text-gray-600 mt-1">Founder · WiZ Value</p>
                  </div>
                )}
              </div>
            </div>

            {/* Founder Message */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a49a6] tracking-wide mb-4">
                <span>Founder&apos;s Note</span>
                <span aria-hidden="true">·</span>
                <span>Factory Direct Promise</span>
              </div>

              <h2 id="founder-heading" className="sr-only">
                Founder&apos;s Message from Reetesh Dhingra
              </h2>

              <blockquote className="text-lg sm:text-xl lg:text-[23px] font-medium text-gray-900 leading-[1.65] tracking-tight text-balance">
                &ldquo;Welcome to WiZ Value! As the founder, I&rsquo;m thrilled to offer you handwash, bodywash, wipes, and home care products straight from the factory outlet at unbeatable prices. Our mission is to enhance your beauty and wellness with exceptional quality and savings. Thank you for choosing us!&rdquo;
              </blockquote>

              <div className="mt-8 pt-6 border-t border-[#e5d4f3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-lg sm:text-xl font-semibold text-[#7a49a6] tracking-tight">
                    Reetesh Dhingra
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5">
                    Founder · WiZ Value &amp; Cossmic Products Pvt Ltd
                  </p>
                </div>

                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#7a49a6] text-white px-6 py-3 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Shop Factory Direct</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Proud Milestones (2011 - 2018) */}
      <section aria-labelledby="milestones-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="text-xs font-medium text-[#7a49a6] tracking-wide mb-2">
              2011 — 2018
            </p>
            <h2
              id="milestones-heading"
              className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight text-balance"
            >
              Proud Milestones
            </h2>
            <p className="mt-4 text-sm text-gray-600 leading-[1.75]">
              Built on Cossmic&apos;s manufacturing legacy since 1978, every milestone expanded our licensing, formulation capabilities, plant automation, and nationwide retail reach.
            </p>
            <div className="mt-6 border border-gray-200 bg-[#fafafa] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                <Factory className="w-4 h-4 text-[#7a49a6]" />
                <span>Automated Multi-Plant Scale</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                From Palghar manufacturing to Birla wet-wipe integration and FDA-licensed external formulations.
              </p>
            </div>
          </div>

          {/* Right Chronological Ledger */}
          <div className="lg:col-span-8 border border-gray-200 bg-white divide-y divide-gray-200">
            {PROUD_MILESTONES.map((item) => (
              <div
                key={item.year}
                className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline hover:bg-[#faf7fd]/40 transition-colors"
              >
                <div className="sm:col-span-2">
                  <span className="font-mono text-lg sm:text-xl font-semibold text-[#7a49a6] tabular-nums">
                    {item.year}
                  </span>
                </div>
                <div className="sm:col-span-10">
                  <p className="text-[14px] sm:text-[15px] text-gray-700 leading-[1.75]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Our Certifications — Clean, Cruelty Free Beauty */}
      <section aria-labelledby="certifications-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="border-t border-gray-200 pt-14 sm:pt-16">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-medium text-[#7a49a6] tracking-wide mb-2">
              Our Certifications
            </p>
            <h2
              id="certifications-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight text-balance"
            >
              Clean, Cruelty Free Beauty
            </h2>
            <p className="mt-4 text-[14.5px] sm:text-[15.5px] text-gray-700 leading-[1.8]">
              The standard for beauty was always pure, fresh, seasonal and natural. Across all our products, we control the conception, formulation, manufacturing and sale of our products, thereby ensuring quality &amp; purity across all pillars. We use this philosophy to produce our line of treatments and our certifications attest to this.
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-4 sm:p-8">
            {!certImgError ? (
              <img
                src={resolveAssetUrl('/assets/about-certifications-partners.jpg')}
                alt="Certifications including Cruelty Free, ISO 22716 GMP, Make in India, ISO 14001:2015, FDA Approved, Dermatologically Tested, Made Safe, and retail partners Big Bazaar, MyGlamm, Reliance Retail, Metro, Bayroute, Deepak Fertilisers, Spencer's, and Kara"
                referrerPolicy="no-referrer"
                onError={() => setCertImgError(true)}
                className="w-full h-auto object-contain mx-auto"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                {[
                  'Cruelty Free',
                  'ISO 22716 GMP',
                  'Make in India',
                  'ISO 14001:2015 Certified',
                  'FDA Approved',
                  'Dermatologically Tested',
                  'Made Safe',
                  'Trusted Retail Partners'
                ].map((cert) => (
                  <div
                    key={cert}
                    className="border border-gray-200 bg-[#fafafa] p-4 flex items-center gap-2 text-xs font-medium text-gray-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#7a49a6] shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
