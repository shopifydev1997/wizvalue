import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  light?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, light = false, className = '' }) => {
  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://wizcare.in';

  // Generate Schema.org BreadcrumbList JSON-LD
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: currentHost
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.path ? { item: `${currentHost}${item.path}` } : {})
      }))
    ]
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={className || "py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <ol
        className={`flex items-center space-x-2 text-xs overflow-x-auto no-scrollbar ${
          light ? 'text-white/80' : 'text-gray-500'
        }`}
      >
        <li>
          <Link
            to="/"
            className={`flex items-center transition-colors ${
              light ? 'hover:text-white' : 'hover:text-[#7a49a6]'
            }`}
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight
                className={`w-3 h-3 shrink-0 ${light ? 'text-white/50' : 'text-gray-400'}`}
              />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className={`transition-colors whitespace-nowrap ${
                    light ? 'hover:text-white' : 'hover:text-[#7a49a6]'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`font-semibold truncate max-w-xs ${
                    light ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
