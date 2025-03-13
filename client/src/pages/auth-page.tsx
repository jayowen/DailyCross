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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <AuthForm />
      </div>

      {/* Hero Section */}
      <div className="w-full md:w-1/2 bg-primary p-8 flex items-center justify-center text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-6">
            <span className="material-icons text-4xl mr-3">church</span>
            <h1 className="text-3xl font-merriweather font-bold">Four12</h1>
          </div>
          <h2 className="text-2xl font-merriweather mb-4">Equipping the Church</h2>
          <p className="mb-6 opacity-90">
            Join our community to access personalized spiritual content, connect with other believers, 
            and grow in your faith journey through sermons, Bible studies, and devotionals.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-white/10 rounded">
              <span className="material-icons mb-2">menu_book</span>
              <span className="text-sm font-medium">Spiritual Content</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/10 rounded">
              <span className="material-icons mb-2">groups</span>
              <span className="text-sm font-medium">Community</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/10 rounded">
              <span className="material-icons mb-2">volunteer_activism</span>
              <span className="text-sm font-medium">Prayer Requests</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/10 rounded">
              <span className="material-icons mb-2">star</span>
              <span className="text-sm font-medium">Growth Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
