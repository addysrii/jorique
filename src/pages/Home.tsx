import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import HandcraftedFloralBackground from '../components/HandcraftedFloralBackground';

// Flagship 3-Column Core Collections Hero & Philosophy Bar (Essential • Signature • Luxe)
import FlagshipCollectionsHero from '../components/home/FlagshipCollectionsHero';

// Flagship 2-Column Duo: Souvenir & Hospitality + Brand Strip
import FlagshipDuoBeyond from '../components/home/FlagshipDuoBeyond';

// 3D Isometric Atelier Catalogue Lookbook (Matching User Reference Image)
import Isometric3DCatalogue from '../components/home/Isometric3DCatalogue';

// Product Exhibition Gallery
import ProductExhibitionSection from '../components/home/ProductExhibitionSection';

// Homepage Discovery Sections
import ExploreByCategorySection from '../components/home/ExploreByCategorySection';
import JoriqueExperienceSection from '../components/home/JoriqueExperienceSection';
import CustomerStoriesSection from '../components/home/CustomerStoriesSection';

export default function Home() {
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://jorique.in/#organization',
        name: 'JORIQUE',
        url: 'https://jorique.in/',
        logo: 'https://jorique.in/favicon.svg',
        description:
          'Heirloom-quality organic linen, luxury bedsheets, plush towels, and tailored essentials crafted for modern sanctuaries.',
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://jorique.in/#website',
        url: 'https://jorique.in/',
        name: 'JORIQUE',
        publisher: { '@id': 'https://jorique.in/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://jorique.in/shop?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] overflow-hidden transition-colors duration-500 selection:bg-[#C6A96B]/30">
      <SEO
        title="JORIQUE — Where Comfort Meets Design | Luxury Home Textiles & Apparel"
        description="Discover heirloom-quality organic linen, luxury bedsheets, plush towels, and tailored essentials thoughtfully crafted for modern sanctuaries."
        keywords="JORIQUE, luxury bedding, organic linen, designer bedsheets, mulberry silk, Egyptian cotton, home textiles, everyday luxury India"
        canonical="https://jorique.in/"
        image="/images/hero.png"
        structuredData={homeStructuredData}
      />

      {/* Top Navbar with Collections, About, The JORIQUE Experience, Contact, Search, Bag & COMFORT LIVES HERE */}
      <Navbar />

      {/* Artisanal Floral & Botanical Background Tapestry */}
      <HandcraftedFloralBackground variant="subtle" showFloatingPetals={false} />

      {/* ─────────────────────────────────────────────────────────────
          1. FLAGSHIP 3-COLUMN CORE COLLECTIONS HERO & PHILOSOPHY BAR
          (Essential • Signature • Luxe)
          + "Comfort is a feeling. And a more beautiful way of living."
      ───────────────────────────────────────────────────────────── */}
      <FlagshipCollectionsHero />

      {/* ─────────────────────────────────────────────────────────────
          2. FLAGSHIP 2-COLUMN DUO: SOUVENIR & HOSPITALITY
          (Souvenir • Hospitality)
          + "JORIQUE — Where Comfort Meets Design | Socials | A MORE CONSCIOUS TOMORROW —"
      ───────────────────────────────────────────────────────────── */}
      <FlagshipDuoBeyond />

      {/* ─────────────────────────────────────────────────────────────
          3. 3D ISOMETRIC ATELIER CATALOGUE LOOKBOOK
          Exact Match to User Reference Mockup with 3D Page Flip Animation
      ───────────────────────────────────────────────────────────── */}
      <Isometric3DCatalogue />

      {/* ─────────────────────────────────────────────────────────────
          4. PRODUCT EXHIBITION SALON
          Curated Exhibition of Tactile Form & Craft with Category Wings
      ───────────────────────────────────────────────────────────── */}
      {/* <ProductExhibitionSection /> */}

      {/* ─────────────────────────────────────────────────────────────
          5. EXPLORE BY CATEGORY
          Bedding • Cushion Covers • Towels • Table Linen • Women's Suits
      ───────────────────────────────────────────────────────────── */}
      <ExploreByCategorySection />

      {/* ─────────────────────────────────────────────────────────────
          6. THE JORIQUE EXPERIENCE
          Sanctuary living feature with high-resolution bedroom photography
      ───────────────────────────────────────────────────────────── */}
      {/* <JoriqueExperienceSection /> */}

      {/* ─────────────────────────────────────────────────────────────
          7. CUSTOMER STORIES
          Minimalist, restrained review quote card
      ───────────────────────────────────────────────────────────── */}
      {/* <CustomerStoriesSection /> */}

      {/* ─────────────────────────────────────────────────────────────
          8. FOOTER
          Brand navigation, social channels, and legal policies
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}