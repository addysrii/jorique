import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] grid lg:grid-cols-[1fr_1.05fr] transition-colors duration-300">
      <section className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6585611/pexels-photo-6585611.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="JORIQUE bedding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/45 dark:bg-black/60 backdrop-blur-[1px]" />
        <Link
          to="/"
          className="absolute top-10 left-10 text-white text-sm font-semibold tracking-[0.25em] uppercase"
        >
          JORIQUE
        </Link>
      </section>

      <section className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden inline-block text-primary dark:text-white text-sm font-semibold tracking-[0.25em] uppercase mb-12"
          >
            JORIQUE
          </Link>

          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-4">
              Account Access
            </p>
            <h1 className="text-3xl font-light text-primary dark:text-white tracking-wide mb-3">{title}</h1>
            <p className="text-sm text-secondary dark:text-white/60 leading-relaxed">{subtitle}</p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
