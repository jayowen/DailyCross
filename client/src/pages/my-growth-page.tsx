import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AchievementBadge } from "@/components/dashboard/achievement-badge";
import { Achievement } from "@shared/schema";

export default function MyGrowthPage() {
  const { user } = useAuth();
  
  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/user-achievements"],
  });

  const { data: allAchievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  // Mock data for tracking spiritual disciplines
  const spiritualDisciplines = [
    { name: "Bible Reading", progress: 85, streak: 14 },
    { name: "Prayer", progress: 70, streak: 8 },
    { name: "Church Attendance", progress: 100, streak: 4 },
    { name: "Community Engagement", progress: 65, streak: 3 },
  ];

  // Recent activities (could be fetched from backend in a real implementation)
  const recentActivities = [
    { activity: "Completed a devotional", date: "Today", icon: "menu_book" },
    { activity: "Prayed for 3 prayer requests", date: "Yesterday", icon: "volunteer_activism" },
    { activity: "Joined a discussion", date: "2 days ago", icon: "forum" },
    { activity: "Attended Sunday service", date: "5 days ago", icon: "church" },
    { activity: "Started a Bible reading plan", date: "1 week ago", icon: "auto_stories" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="font-merriweather text-2xl md:text-3xl font-bold mb-4">My Spiritual Growth</h1>
              <p className="text-gray-600 mb-6">Track your journey, achievements, and spiritual disciplines.</p>
              
              {/* Level and Progress */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>My Level</CardTitle>
                  <CardDescription>Your spiritual growth journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mr-4">
                      <span className="material-icons text-white text-2xl">star</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Level {user?.level} Disciple</h3>
                      <p className="text-sm text-gray-600">Keep growing in your faith!</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {(user?.level || 0) + 1}</span>
                      <span>{user?.levelProgress || 0}%</span>
                    </div>
                    <Progress value={user?.levelProgress || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Achievements */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>My Achievements</CardTitle>
                  <CardDescription>Badges earned on your spiritual journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {allAchievements?.map((achievement) => {
                      const isUnlocked = achievements?.some(a => a.id === achievement.id);
                      return (
                        <AchievementBadge 
                          key={achievement.id}
                          name={achievement.name}
                          icon={achievement.icon}
                          unlocked={!!isUnlocked}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">How to earn more achievements:</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="material-icons text-accent mr-2 text-sm">book</span>
                        <span>Scripture Reader: Read at least 10 Bible passages</span>
                      </li>
                      <li className="flex items-start">
                        <span className="material-icons text-success mr-2 text-sm">groups</span>
                        <span>Community Builder: Participate in at least 5 discussions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="material-icons text-secondary mr-2 text-sm">volunteer_activism</span>
                        <span>Prayer Warrior: Pray for at least 20 prayer requests</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Spiritual Disciplines */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Spiritual Disciplines</CardTitle>
                  <CardDescription>Track your habits and consistency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spiritualDisciplines.map((discipline, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <span className="font-medium">{discipline.name}</span>
                            {discipline.streak > 0 && (
                              <span className="ml-2 text-xs bg-accent text-white rounded-full px-2 py-0.5 flex items-center">
                                <span className="material-icons text-xs mr-1">local_fire_department</span>
                                {discipline.streak} days
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{discipline.progress}%</span>
                        </div>
                        <Progress value={discipline.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions and growth steps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${index % 2 === 0 ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                          <span className="material-icons text-sm">{activity.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{activity.activity}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
