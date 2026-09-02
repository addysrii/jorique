import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0D0B0A] border-t border-border dark:border-[#2E2925] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="text-sm font-semibold tracking-[0.25em] uppercase text-primary dark:text-[#F5F2EB]">
            JORIQUE
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 w-full md:w-auto text-center px-2">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'About', href: '/about' },
              { label: 'Reviews', href: '/reviews' },
              { label: 'Scan QR', href: '/scan' },
              { label: 'Connect', href: '/connect' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs font-medium tracking-wider sm:tracking-widest uppercase text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#D4AF37] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/thejorique"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#D4AF37] transition-colors duration-200"
            >
              <Instagram size={17} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.facebook.com/people/Thejorique/61591612536766"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#D4AF37] transition-colors duration-200"
            >
              <Facebook size={17} strokeWidth={1.5} />
            </a>
            <a
              href="mailto:care@jorique.in"
              aria-label="Email"
              className="p-2 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#D4AF37] transition-colors duration-200"
            >
              <Mail size={17} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border dark:border-[#2E2925] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-secondary dark:text-white/50 tracking-wide">
            &copy; {new Date().getFullYear()} JORIQUE. All rights reserved.
          </p>
          <p className="text-xs text-secondary/60 dark:text-white/40 tracking-wide">
            Where Comfort Meets Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}
