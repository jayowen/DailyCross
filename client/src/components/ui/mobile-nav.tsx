import { Link, useLocation } from "wouter";

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around items-center py-2">
        <Link href="/">
          <a className={`flex flex-col items-center px-3 py-2 ${location === '/' ? 'text-accent' : 'text-gray-500'}`}>
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/sermons">
          <a className={`flex flex-col items-center px-3 py-2 ${location === '/sermons' ? 'text-accent' : 'text-gray-500'}`}>
            <span className="material-icons">menu_book</span>
            <span className="text-xs mt-1">Content</span>
          </a>
        </Link>
        <Link href="/community">
          <a className={`flex flex-col items-center px-3 py-2 ${location === '/community' ? 'text-accent' : 'text-gray-500'}`}>
            <span className="material-icons">groups</span>
            <span className="text-xs mt-1">Community</span>
          </a>
        </Link>
        <Link href="/my-growth">
          <a className={`flex flex-col items-center px-3 py-2 ${location === '/my-growth' ? 'text-accent' : 'text-gray-500'}`}>
            <span className="material-icons">person</span>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
