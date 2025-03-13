import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { AchievementBadge } from "@/components/dashboard/achievement-badge";
import { Achievement } from "@shared/schema";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/user-achievements"],
  });

  // Helper function to check if a path is active
  const isActive = (path: string) => location === path;

  // Navigation sections
  const mainNav = [
    { path: "/", icon: "home", label: "Home" },
    { path: "/my-growth", icon: "person", label: "My Growth" },
    { path: "/community", icon: "groups", label: "Church Directory" }
  ];

  const contentNav = [
    { path: "/stories", icon: "auto_stories", label: "Stories" },
    { path: "/sermons", icon: "menu_book", label: "Sermons" },
    { path: "/worship", icon: "music_note", label: "Worship" },
    { path: "/podcasts", icon: "podcasts", label: "Podcasts" }
  ];

  return (
    <aside className="hidden md:block w-64 bg-gray-900 border-r border-amber-700/30 min-h-screen overflow-y-auto">
      <div className="p-6 sticky top-0">
        {/* User Profile */}
        <div className="mb-8">
          <div className="flex items-center p-3 bg-gray-800 rounded-lg mb-3 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-amber-700 flex items-center justify-center border border-amber-600/30">
              <span className="text-amber-50 font-semibold">
                {user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <div className="font-medium text-amber-50">{user?.displayName}</div>
              <div className="text-xs text-gray-400">{user?.church || 'Member'}</div>
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-gray-300">
            <div className="flex items-center">
              <span className="material-icons text-amber-600 mr-2 text-sm">star</span>
              <span>{`Level ${user?.level} Disciple`}</span>
            </div>
            <div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-amber-600 rounded-full h-2" 
                  style={{ width: `${user?.levelProgress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">Main Navigation</h3>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`flex items-center py-2 px-3 text-sm rounded-md ${
                  isActive(item.path) 
                    ? 'bg-gray-800 text-amber-500 font-medium' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-amber-500'
                } transition-colors`}>
                  <span className="material-icons mr-3 text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="mb-8">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-semibold">Content</h3>
          <nav className="space-y-1">
            {contentNav.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`flex items-center py-2 px-3 text-sm rounded-md ${
                  isActive(item.path) 
                    ? 'bg-gray-800 text-amber-500 font-medium' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-amber-500'
                } transition-colors`}>
                  <span className="material-icons mr-3 text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Links */}
        <div className="mb-6">
          <Accordion type="single" collapsible defaultValue="achievements">
            <AccordionItem value="achievements" className="border-b-0">
              <AccordionTrigger className="py-2 text-gray-300 hover:text-amber-500">
                <div className="flex items-center">
                  <span className="material-icons mr-2 text-[18px] text-amber-600">emoji_events</span>
                  <span className="text-sm font-medium">My Achievements</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {achievements?.map((achievement) => (
                    <AchievementBadge 
                      key={achievement.id}
                      name={achievement.name}
                      icon={achievement.icon}
                      unlocked={true}
                    />
                  ))}
                  {achievements?.length === 0 && (
                    <div className="col-span-3 text-sm text-gray-400 text-center py-2">
                      No achievements yet
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <div className="pt-4 border-t border-gray-700">
            <Link href="/admin">
              <a className="flex items-center py-2 px-3 text-sm rounded-md text-gray-300 hover:bg-gray-800 hover:text-amber-500 transition-colors">
                <span className="material-icons mr-3 text-[18px]">admin_panel_settings</span>
                <span>Admin Dashboard</span>
              </a>
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <div className="pt-4">
          <button 
            onClick={() => logoutMutation.mutate()} 
            className="flex items-center py-2 px-3 text-sm rounded-md text-gray-300 hover:bg-gray-800 hover:text-amber-500 transition-colors w-full text-left"
          >
            <span className="material-icons mr-3 text-[18px]">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
