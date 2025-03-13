import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { AchievementBadge } from "@/components/dashboard/achievement-badge";
import { Achievement } from "@shared/schema";

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/user-achievements"],
  });

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="font-merriweather text-primary text-lg font-bold mb-3">My Profile</h3>
          <div className="flex items-center p-2 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <div className="font-medium">{user?.displayName}</div>
              <div className="text-xs text-gray-500">{user?.church || 'No church specified'}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-merriweather text-primary text-lg font-bold mb-3">My Growth</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="material-icons text-accent mr-2 text-sm">star</span>
              <span>{`Level ${user?.level} Disciple`}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>{`Progress to Level ${(user?.level || 0) + 1}`}</span>
                <span>{`${user?.levelProgress || 0}%`}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent rounded-full h-2" 
                  style={{ width: `${user?.levelProgress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-merriweather text-primary text-lg font-bold mb-3">My Achievements</h3>
          <div className="grid grid-cols-3 gap-2">
            {achievements?.map((achievement) => (
              <AchievementBadge 
                key={achievement.id}
                name={achievement.name}
                icon={achievement.icon}
                unlocked={true}
              />
            ))}
            {achievements?.length === 0 && (
              <div className="col-span-3 text-sm text-gray-500 text-center py-2">
                No achievements yet
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-merriweather text-primary text-lg font-bold mb-3">Quick Links</h3>
          <nav className="space-y-2">
            <Link href="/events">
              <a className="flex items-center text-sm hover:text-secondary transition-colors">
                <span className="material-icons mr-2 text-sm">calendar_today</span>
                <span>Church Events</span>
              </a>
            </Link>
            <Link href="/volunteer">
              <a className="flex items-center text-sm hover:text-secondary transition-colors">
                <span className="material-icons mr-2 text-sm">local_offer</span>
                <span>Volunteer Opportunities</span>
              </a>
            </Link>
            <Link href="/saved">
              <a className="flex items-center text-sm hover:text-secondary transition-colors">
                <span className="material-icons mr-2 text-sm">favorite</span>
                <span>Saved Content</span>
              </a>
            </Link>
            <Link href="/settings">
              <a className="flex items-center text-sm hover:text-secondary transition-colors">
                <span className="material-icons mr-2 text-sm">settings</span>
                <span>Settings</span>
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}
