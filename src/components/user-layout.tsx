
import { Navbar } from "./navbar";

export function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-gold-100/30 to-gold-200/20 dark:from-gold-950 dark:via-gold-900/30 dark:to-gold-800/20 transition-all duration-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-300/10 dark:bg-gold-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-200/20 dark:bg-gold-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gold-100/10 dark:bg-gold-800/10 rounded-full blur-2xl"></div>
      </div>
      
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 animate-fade-in relative z-10">
        {children}
      </main>
    </div>
  );
}
