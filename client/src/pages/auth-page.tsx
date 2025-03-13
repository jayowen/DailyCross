import { useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  const { user, isLoading } = useAuth();

  // Redirect to home if already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950">
      {/* Hero Section */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center text-white relative overflow-hidden">
        {/* Decorative diagonal gold line */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-amber-600/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-amber-600/50"></div>
          <div className="absolute -top-10 -left-10 w-[400px] h-[400px] rounded-full bg-amber-600/5 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-[300px] h-[300px] rounded-full bg-amber-600/5 blur-3xl"></div>
        </div>
        
        <div className="max-w-md relative z-10">
          <div className="flex items-center mb-8">
            <span className="material-icons text-amber-600 text-5xl mr-3">church</span>
            <div>
              <h1 className="text-4xl font-merriweather font-bold">DailyCross.com</h1>
              <div className="h-1 w-24 bg-amber-600 mt-2"></div>
            </div>
          </div>
          <h2 className="text-2xl font-merriweather mb-4">Equipping the Church</h2>
          <p className="mb-8 text-gray-300 leading-relaxed">
            Join our platform to access personalized spiritual content, connect with other churches, 
            and grow in your faith journey through sermons, Bible studies, and devotionals.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-amber-600/50 transition-colors">
              <span className="material-icons text-amber-600 mb-3">menu_book</span>
              <span className="text-sm font-medium">Spiritual Content</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-amber-600/50 transition-colors">
              <span className="material-icons text-amber-600 mb-3">church</span>
              <span className="text-sm font-medium">Church Directory</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-amber-600/50 transition-colors">
              <span className="material-icons text-amber-600 mb-3">volunteer_activism</span>
              <span className="text-sm font-medium">Prayer Requests</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-amber-600/50 transition-colors">
              <span className="material-icons text-amber-600 mb-3">star</span>
              <span className="text-sm font-medium">Growth Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gray-900 relative">
        {/* Decorative diagonal gold line */}
        <div className="absolute top-0 right-0 w-1 h-full bg-amber-600/50"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-600/10"></div>
        
        <AuthForm />
      </div>
    </div>
  );
}
