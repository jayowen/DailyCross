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
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons mr-2">church</span>
          <h1 className="text-xl font-merriweather font-bold">Four12</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/">
            <a className={`font-inter font-medium ${location === '/' ? 'text-accent' : 'hover:text-accent transition-colors'}`}>
              Home
            </a>
          </Link>
          <Link href="/sermons">
            <a className={`font-inter font-medium ${location === '/sermons' ? 'text-accent' : 'hover:text-accent transition-colors'}`}>
              Sermons
            </a>
          </Link>
          <Link href="/community">
            <a className={`font-inter font-medium ${location === '/community' ? 'text-accent' : 'hover:text-accent transition-colors'}`}>
              Community
            </a>
          </Link>
          <Link href="/bible-study">
            <a className={`font-inter font-medium ${location === '/bible-study' ? 'text-accent' : 'hover:text-accent transition-colors'}`}>
              Bible Study
            </a>
          </Link>
          <Link href="/my-growth">
            <a className={`font-inter font-medium ${location === '/my-growth' ? 'text-accent' : 'hover:text-accent transition-colors'}`}>
              My Growth
            </a>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-white hover:text-accent transition-colors">
            <span className="material-icons">notifications</span>
            <span className="bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -mt-2 -ml-1">3</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 outline-none">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline font-medium">{user?.displayName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem asChild>
                <Link href="/my-growth">
                  <a className="cursor-pointer flex w-full">My Profile</a>
                </Link>
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <a className="cursor-pointer flex w-full">Admin Dashboard</a>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
