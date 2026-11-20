import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Copy,
  CheckCircle2,
  Download,
  Share2,
  QrCode,
  Sparkles,
  Layers,
  Printer,
  Smartphone,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../types';

interface CatalogStoreHubProps {
  products: Product[];
  token?: string | null;
}

export default function CatalogStoreHub({ products, token }: CatalogStoreHubProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const catalogUrl = `${window.location.origin}/catalog`;
  const whatsappAdminPhone = '919919388211';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const promotionalWhatsAppBroadcast = `⚜️ *JORIQUE LUXURY ATELIER — NEW SEASON CATALOGUE*
_Where Comfort Meets Design_

We are pleased to unveil our curated digital lookbook featuring handcrafted Egyptian cotton bedsheets, tactile cushion covers, super-soft towels, and designer suites.

📖 *Browse Full Interactive Catalogue:*
${catalogUrl}

🚚 *Complimentary Express Delivery & Luxury Gift Packaging included on all orders.*

To place an order or customize dimensions for your residence, reply directly to this message or visit our atelier storefront.`;

  const metaCatalogExportUrl = `/api/products/export/meta-catalog.csv`;

  const inStockCount = products.filter((p) => Number(p.quantity || 0) > 0).length;
  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-[#1F1B18] border border-[#D4AF37]/30 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>Digital Atelier Storefront</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-serif tracking-wide text-[#F3EFE6] mb-2">
              JORIQUE Catalogue Store & WhatsApp Commerce
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Your high-aesthetic, mobile-first catalogue store is live for patrons, interior decorators, and WhatsApp leads. Customers can browse collections, filter by fabric, and submit orders directly to WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C29E30] text-black font-bold px-5 py-3 rounded-xl transition-all shadow-lg text-xs uppercase tracking-wider"
            >
              <ExternalLink size={15} />
              <span>Open Live Catalogue</span>
            </a>

            <button
              onClick={() => copyToClipboard(catalogUrl, 'catalog-url')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl transition-all border border-white/20 text-xs tracking-wider"
            >
              {copiedKey === 'catalog-url' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              <span>{copiedKey === 'catalog-url' ? 'Link Copied!' : 'Copy Catalogue Link'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-stone-400">Total Products</p>
            <p className="text-xl font-serif text-[#D4AF37] mt-0.5">{products.length} Designs</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-stone-400">In Stock Ready to Ship</p>
            <p className="text-xl font-serif text-emerald-400 mt-0.5">{inStockCount} Active</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-stone-400">Atelier Categories</p>
            <p className="text-xl font-serif text-white mt-0.5">{categoriesList.length} Categories</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-stone-400">WhatsApp Commerce</p>
            <p className="text-xl font-serif text-[#25D366] mt-0.5">Automated</p>
          </div>
        </div>
      </div>

      {/* 2-Column Command Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: WhatsApp Broadcast Copy Generator */}
        <div className="bg-card dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-[#25D366] border border-emerald-500/20">
                <Share2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-[#E8DCC4]">
                  WhatsApp Broadcast & Status Share
                </h3>
                <p className="text-xs text-secondary dark:text-white/60">
                  Pre-formatted promotional text with direct catalogue link to share with client lists or WhatsApp status.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-stone-50 dark:bg-black/40 border border-border/80 dark:border-[#2E2925] text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {promotionalWhatsAppBroadcast}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border/60 dark:border-[#2E2925]">
            <span className="text-[11px] text-secondary dark:text-white/50">
              Includes link to <code className="text-[#D4AF37]">/catalog</code>
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(promotionalWhatsAppBroadcast)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-all shadow-xs"
              >
                <Share2 size={13} />
                <span>Share to WhatsApp</span>
              </a>

              <button
                onClick={() => copyToClipboard(promotionalWhatsAppBroadcast, 'broadcast-text')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-primary dark:text-white transition-all border border-border/80 dark:border-white/10"
              >
                {copiedKey === 'broadcast-text' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copiedKey === 'broadcast-text' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Meta / WhatsApp Commerce Catalog CSV Feed */}
        <div className="bg-card dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Download size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-[#E8DCC4]">
                  Meta Commerce & WhatsApp Catalog CSV
                </h3>
                <p className="text-xs text-secondary dark:text-white/60">
                  Sync all products with Meta Commerce Manager & WhatsApp Business Catalog using standard feed format.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-black/30 border border-border/60 dark:border-[#2E2925] text-xs text-secondary dark:text-stone-300">
                <p className="font-semibold text-primary dark:text-white mb-1">How to sync with WhatsApp Business:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Download the generated <strong>Meta Catalog CSV</strong> below.</li>
                  <li>Go to <strong>Meta Commerce Manager</strong> &gt; Catalogs &gt; Data Sources.</li>
                  <li>Upload the CSV or provide the feed URL to sync products into WhatsApp shop cards.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border/60 dark:border-[#2E2925]">
            <span className="text-[11px] text-secondary dark:text-white/50">
              Auto-generated with live SKU, price & URLs
            </span>

            <a
              href={metaCatalogExportUrl}
              download="jorique-meta-catalog.csv"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary dark:bg-[#D4AF37] text-white dark:text-black hover:opacity-90 transition-all shadow-xs"
            >
              <Download size={14} />
              <span>Download Meta CSV Feed</span>
            </a>
          </div>
        </div>
      </div>

      {/* Card 3: In-Store Physical QR Code Tabletop Standee */}
      <div className="bg-card dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex-shrink-0">
              <QrCode size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-[#E8DCC4] mb-1">
                Boutique Tabletop QR Standee (Physical Store & Exhibition)
              </h3>
              <p className="text-xs text-secondary dark:text-white/60 max-w-xl">
                Place this QR code on your showroom desk, boutique billing counter, or exhibition booth. Patrons can scan with their phone camera to instantly browse the digital catalogue and place orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Live QR Code Preview via Google Charts API */}
            <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(catalogUrl)}`}
                alt="JORIQUE Catalogue QR Code"
                className="w-20 h-20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-primary dark:text-white border border-border/80 dark:border-white/10"
              >
                <Printer size={13} />
                <span>Print Standee</span>
              </button>

              <button
                onClick={() => copyToClipboard(catalogUrl, 'qr-url')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-primary dark:text-white border border-border/80 dark:border-white/10"
              >
                <Copy size={13} />
                <span>{copiedKey === 'qr-url' ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
