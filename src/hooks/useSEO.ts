import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  noIndex?: boolean;
}

export function useSEO({
  title,
  description = 'WiZ Home Hygiene & Personal Care - Premium disinfectants, wet wipes, handwash, dishwash, and personal care products with direct WhatsApp and marketplace order options.',
  canonicalUrl,
  image = 'public/assets/products/Orange Wet Wipes.jpg',
  noIndex = false
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const brandSuffix = ' | WiZ Home Hygiene & Personal Care';
    const finalTitle = title ? (title.includes('WiZ') ? title : `${title}${brandSuffix}`) : 'WiZ Home Hygiene & Personal Care | Official Website';
    document.title = finalTitle;

    // Helper to update or create a meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 2. Meta description
    setMetaTag('name', 'description', description);

    // 3. Robots directive
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. OpenGraph tags
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:type', 'website');
    if (canonicalUrl) {
      setMetaTag('property', 'og:url', canonicalUrl);
    }

    // 5. Twitter cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 6. Canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const currentUrl = canonicalUrl || window.location.href;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

  }, [title, description, canonicalUrl, image, noIndex]);
}
