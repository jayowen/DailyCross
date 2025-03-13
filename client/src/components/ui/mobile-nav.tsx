import { Link, useLocation } from "wouter";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function MobileNav() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  // Helper function to check if a route is active
  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", icon: "home", label: "Home" },
    { path: "/stories", icon: "auto_stories", label: "Stories" },
    { path: "/sermons", icon: "menu_book", label: "Sermons" },
    { path: "/worship", icon: "music_note", label: "Worship" },
    { path: "/podcasts", icon: "podcasts", label: "Podcasts" }
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="md:hidden bg-gray-900 border-t border-amber-700/30 fixed bottom-0 left-0 right-0 z-40">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={`flex flex-col items-center px-2 py-2 ${isActive(item.path) ? 'text-amber-500' : 'text-gray-300'}`}>
                <span className="material-icons text-[20px]">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          ))}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center px-2 py-2 text-gray-300 hover:text-amber-500">
                <span className="material-icons text-[20px]">more_horiz</span>
                <span className="text-xs mt-1">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] pt-0 rounded-t-xl bg-gray-900 border-t border-amber-700/30">
              <div className="pt-6 pb-12">
                <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center mr-3 border border-amber-600/30">
                      <span className="text-amber-50 font-semibold">
                        {user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-50">{user?.displayName}</h3>
                      <p className="text-sm text-gray-400">{user?.church || 'Member'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Link href="/podcasts">
                    <a onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-amber-500 transition-colors">
                      <span className="material-icons text-amber-600 mb-2">podcasts</span>
                      <span className="text-sm">Podcasts</span>
                    </a>
                  </Link>
                  <Link href="/community">
                    <a onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-amber-500 transition-colors">
                      <span className="material-icons text-amber-600 mb-2">groups</span>
                      <span className="text-sm">Community</span>
                    </a>
                  </Link>
                  <Link href="/my-growth">
                    <a onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-amber-500 transition-colors">
                      <span className="material-icons text-amber-600 mb-2">person</span>
                      <span className="text-sm">Profile</span>
                    </a>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <a onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-amber-500 transition-colors">
                        <span className="material-icons text-amber-600 mb-2">admin_panel_settings</span>
                        <span className="text-sm">Admin</span>
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
