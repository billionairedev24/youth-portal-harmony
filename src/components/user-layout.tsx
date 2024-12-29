import { Navbar } from "./navbar";

export function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-gold-100/30 to-gold-200/20 dark:from-gold-900 dark:via-gold-800/30 dark:to-gold-700/20">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}