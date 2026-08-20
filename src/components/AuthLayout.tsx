import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background grid lg:grid-cols-[1fr_1.05fr]">
      <section className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6585611/pexels-photo-6585611.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="JORIQUE bedding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/45" />
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
            className="lg:hidden inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-12"
          >
            JORIQUE
          </Link>

          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
              Account
            </p>
            <h1 className="text-3xl font-light text-primary tracking-wide mb-3">{title}</h1>
            <p className="text-sm text-secondary leading-relaxed">{subtitle}</p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
