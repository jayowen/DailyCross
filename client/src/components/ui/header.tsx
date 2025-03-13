import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-gray-900 text-white shadow-md border-b border-amber-700/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-amber-600">military_tech</span>
          <h1 className="text-xl font-merriweather font-bold text-amber-50">DailyCross.com</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10">
          <Link href="/">
            <a className={`font-inter font-medium ${location === '/' ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-500 transition-colors'}`}>
              Home
            </a>
          </Link>
          <Link href="/stories">
            <a className={`font-inter font-medium ${location === '/stories' ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-500 transition-colors'}`}>
              Stories
            </a>
          </Link>
          <Link href="/sermons">
            <a className={`font-inter font-medium ${location === '/sermons' ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-500 transition-colors'}`}>
              Sermons
            </a>
          </Link>
          <Link href="/worship">
            <a className={`font-inter font-medium ${location === '/worship' ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-500 transition-colors'}`}>
              Worship
            </a>
          </Link>
          <Link href="/podcasts">
            <a className={`font-inter font-medium ${location === '/podcasts' ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-500 transition-colors'}`}>
              Podcasts
            </a>
          </Link>
          <Link href="/community">
            <a className={`font-inter font-medium ${location === '/community' ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-500 transition-colors'}`}>
              Church Directory
            </a>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-300 hover:text-amber-500 transition-colors">
            <span className="material-icons">notifications</span>
            <span className="bg-amber-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -mt-2 -ml-1">3</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 outline-none hover:bg-transparent">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center border border-amber-500/30">
                    <span className="text-amber-50 text-sm font-semibold">
                      {user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline font-medium text-gray-300">{user?.displayName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-900 border border-amber-700/30" align="end">
              <DropdownMenuItem asChild className="focus:bg-gray-800 focus:text-amber-500">
                <Link href="/my-growth">
                  <a className="cursor-pointer flex w-full text-gray-300 hover:text-amber-500">My Profile</a>
                </Link>
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem asChild className="focus:bg-gray-800 focus:text-amber-500">
                  <Link href="/admin">
                    <a className="cursor-pointer flex w-full text-gray-300 hover:text-amber-500">Admin Dashboard</a>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-gray-800 focus:text-amber-500 text-gray-300 hover:text-amber-500">
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
