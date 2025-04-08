
import { AuthForm } from "@/components/auth/auth-form";

export default function Index() {
  console.log("Rendering Index page");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold-50 via-gold-100/30 to-gold-200/20 dark:from-gold-900 dark:via-gold-800/30 dark:to-gold-700/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/placeholder.svg" alt="Youth Group Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gold-900 dark:text-gold-100 mb-2">Youth Group</h1>
          <p className="text-gold-600 dark:text-gold-400">Welcome to our community</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
