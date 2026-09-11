import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const whatsappUrl =
    'https://wa.me/919026260421?text=' +
    encodeURIComponent('Hello JORIQUE Concierge, I would like to inquire about your collections.');

  return (
    <footer className="bg-[#FAF7F2] dark:bg-[#100E0D] border-t border-[#E8DFD3] dark:border-[#2E2925] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-16 space-y-12">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E8DFD3] dark:border-[#2E2925]">
          <div className="space-y-1">
            <Link
              to="/"
              className="font-mainlogo text-2xl lg:text-3xl tracking-[0.20em] uppercase text-primary dark:text-[#FCFAF7] font-normal"
            >
              JORIQUE
            </Link>
            <p className="font-serif italic text-sm font-semibold brand-tagline text-[#8A847D] dark:text-[#C6A96B]">
              Where Comfort Meets Design
            </p>
          </div>

          {/* Primary Editorial Nav */}
          <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3">
            {[
              { label: 'Collections', href: '/#collections' },
              { label: 'About', href: '/about' },
              { label: 'The JORIQUE Experience', href: '/#experience' },
              { label: 'Contact', href: '/connect' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium tracking-[0.15em] uppercase text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#C6A96B] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/thejorique"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
            >
              <Instagram size={15} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.facebook.com/people/Thejorique/61591612536766"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
            >
              <Facebook size={15} strokeWidth={1.5} />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Concierge"
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
            >
              <MessageCircle size={15} strokeWidth={1.5} />
            </a>
            <a
              href="mailto:care@jorique.in"
              aria-label="Email Concierge"
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
            >
              <Mail size={15} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Legal & Policy Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 text-xs text-secondary dark:text-white/60">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            {[
              { label: 'Privacy Policy', href: '/return-policy#privacy' },
              { label: 'Terms & Conditions', href: '/return-policy#terms' },
              { label: 'Shipping Policy', href: '/return-policy#shipping' },
              { label: 'Returns Policy', href: '/return-policy' },
            ].map((policy) => (
              <Link
                key={policy.label}
                to={policy.href}
                className="hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
              >
                {policy.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('jorique_intro_seen');
                window.dispatchEvent(new CustomEvent('jorique:replay-intro'));
              }}
              className="text-xs text-[#C6A96B] hover:text-[#851C25] dark:hover:text-[#E5C158] font-medium tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>✦</span> Replay Brand Intro
            </button>
            <p className="tracking-widest font-mono text-[11px]">
              &copy; {new Date().getFullYear()} JORIQUE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
