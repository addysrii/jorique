import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'JORIQUE — Where Comfort Meets Design | Luxury Home Textiles & Apparel';
const DEFAULT_DESCRIPTION =
  'Discover heirloom-quality organic linen, luxury bedsheets, plush towels, and tailored apparel thoughtfully crafted for modern sanctuaries.';
const DEFAULT_KEYWORDS =
  'JORIQUE, luxury bedding, organic linen, duvet cover, designer bedsheets, mulberry silk, Egyptian cotton, home textiles, everyday luxury India';
const DEFAULT_IMAGE = 'https://jorique.in/images/hero.png';
const SITE_NAME = 'JORIQUE';
const BASE_URL = 'https://jorique.in';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  structuredData,
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title
      ? title.includes('JORIQUE')
        ? title
        : `${title} | JORIQUE`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to safely set or create meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to safely set canonical link
    const canonicalUrl = canonical || `${BASE_URL}${location.pathname}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMetaTag('name', 'title', formattedTitle);

    // 3. Open Graph Tags
    const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_IN');

    // 4. Twitter Card Tags
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:title', formattedTitle);
    setMetaTag('property', 'twitter:description', description);
    setMetaTag('property', 'twitter:image', fullImageUrl);
    setMetaTag('property', 'twitter:url', canonicalUrl);

    // 5. Inject Structured Data (Schema.org JSON-LD)
    const scriptId = 'jorique-structured-data';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up injected structured data when component unmounts
      const scriptToClean = document.getElementById(scriptId);
      if (scriptToClean) {
        scriptToClean.remove();
      }
    };
  }, [title, description, keywords, canonical, image, type, noindex, structuredData, location.pathname]);

  return null;
}
