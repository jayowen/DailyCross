import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ContentCard } from "@/components/dashboard/content-card";
import { PrayerRequest } from "@/components/dashboard/prayer-request";
import { DiscussionItem } from "@/components/dashboard/discussion-item";
import { EventItem } from "@/components/dashboard/event-item";
import { Button } from "@/components/ui/button";
import { Content, PrayerRequest as PrayerRequestType, Discussion, Event } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: content } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  const { data: prayerRequests } = useQuery<PrayerRequestType[]>({
    queryKey: ["/api/prayer-requests"],
  });

  const { data: discussions } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Function to format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Helper function to get a mock thumbnail URL
  const getThumbnailByType = (type: string) => {
    switch(type) {
      case 'sermon':
        return 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
      case 'biblestudy':
        return 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
      case 'devotional':
        return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
      default:
        return 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
    }
  };

  // Get user from a userId (mock data since we don't have a full user list)
  const getUserName = (userId: number) => {
    const mockUsers = [
      { id: 1, name: "Sarah Mitchell", initials: "SM" },
      { id: 2, name: "James Thompson", initials: "JT" },
      { id: 3, name: "Lisa Johnson", initials: "LJ" },
      { id: 4, name: "Pastor Mike", initials: "PM" },
      { id: 5, name: "Robert Chen", initials: "RC" },
    ];
    
    const mockUser = mockUsers.find(u => u.id === userId) || 
                     { name: user?.displayName || "Unknown User", initials: "UN" };
    
    return mockUser;
  };

  // Get category label and color for discussions
  const getCategoryInfo = (category: string) => {
    const categories = {
      "Spiritual Disciplines": { color: "accent" as const, label: "Spiritual Disciplines" },
      "Sermon Discussion": { color: "secondary" as const, label: "Sermon Discussion" },
      "Resources": { color: "success" as const, label: "Resources" },
    };
    
    return categories[category as keyof typeof categories] || 
          { color: "accent" as const, label: category };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-5xl mx-auto">
            {/* Welcome Section */}
            <section className="mb-8">
              <div className="p-6 bg-gray-900 rounded-lg text-white border border-amber-700/20 shadow-md mb-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-amber-50">
                  Welcome to Four12, {user?.displayName.split(' ')[0]}!
                </h1>
                <p className="text-gray-300">Continue your spiritual journey where you left off.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button className="bg-gray-800 hover:bg-gray-700 text-amber-50 rounded-md px-4 py-2 text-sm font-medium flex items-center border border-amber-700/20 transition-colors">
                    <span className="material-icons mr-1 text-sm text-amber-500">play_arrow</span>
                    Continue Today's Reading
                  </Button>
                  <Button className="bg-amber-600 text-white rounded-md px-4 py-2 text-sm font-medium flex items-center hover:bg-amber-500 transition-colors">
                    <span className="material-icons mr-1 text-sm">explore</span>
                    Find New Content
                  </Button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  title="Daily Streak"
                  value="14 days"
                  icon="local_fire_department"
                  iconColor="accent"
                />
                <StatsCard
                  title="Prayer Requests"
                  value={`${prayerRequests?.length || 0} new`}
                  icon="forum"
                  iconColor="secondary"
                />
                <StatsCard
                  title="Bible Plan"
                  value={`${user?.levelProgress || 0}% complete`}
                  icon="menu_book"
                  iconColor="success"
                />
                <StatsCard
                  title="Church Interactions"
                  value="5 connections"
                  icon="groups"
                  iconColor="accent"
                />
              </div>
            </section>
            
            {/* Recommended Content Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-header">Recommended For You</h2>
                <Link href="/sermons">
                  <a className="text-amber-600 text-sm font-medium hover:text-amber-500 transition-colors">View All</a>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content && content.length > 0 ? (
                  content.slice(0, 3).map((item) => (
                    <ContentCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      thumbnailUrl={item.thumbnailUrl || getThumbnailByType(item.type)}
                      type={item.type as "sermon" | "biblestudy" | "devotional"}
                      duration={item.duration}
                      parts={item.parts}
                    />
                  ))
                ) : (
                  // Default content if none exists yet
                  <>
                    <ContentCard
                      title="Finding Peace in Troubled Times"
                      description="Pastor Michael Johnson explores how to maintain spiritual calm during life's storms."
                      thumbnailUrl={getThumbnailByType('sermon')}
                      type="sermon"
                      duration={32}
                    />
                    <ContentCard
                      title="The Book of James: Faith in Action"
                      description="A 5-part study on living out your faith through practical actions and wisdom."
                      thumbnailUrl={getThumbnailByType('biblestudy')}
                      type="biblestudy"
                      parts={5}
                    />
                    <ContentCard
                      title="Morning Reflections: Psalms of Praise"
                      description="Start your day with inspiration from the Psalms and guided prayer practices."
                      thumbnailUrl={getThumbnailByType('devotional')}
                      type="devotional"
                      duration={10}
                    />
                  </>
                )}
              </div>
            </section>
            
            {/* Church Directory Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-header">Church Directory Activity</h2>
                <Link href="/community">
                  <a className="text-amber-600 text-sm font-medium hover:text-amber-500 transition-colors">View All</a>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Prayer Requests Column */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-amber-700/10 pb-1">Prayer Requests</h3>
                    <Button className="bg-amber-600 text-white rounded-md px-3 py-1 text-sm font-medium hover:bg-amber-500 transition-colors flex items-center">
                      <span className="material-icons text-sm mr-1">add</span>
                      New Request
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {prayerRequests && prayerRequests.length > 0 ? (
                      prayerRequests.slice(0, 3).map((request) => {
                        const userInfo = getUserName(request.userId);
                        return (
                          <PrayerRequest
                            key={request.id}
                            id={request.id}
                            userId={request.userId}
                            userName={userInfo.name}
                            userInitials={userInfo.initials}
                            content={request.content}
                            timeAgo={getTimeAgo(request.createdAt)}
                            prayerCount={request.prayerCount}
                            commentCount={request.commentCount}
                          />
                        );
                      })
                    ) : (
                      // Default prayer requests if none exist yet
                      <>
                        <PrayerRequest
                          id={1}
                          userId={1}
                          userName="Sarah Mitchell"
                          userInitials="SM"
                          content="Please pray for my mother who is scheduled for surgery next week. We're hopeful but anxious about the procedure."
                          timeAgo="2 hours ago"
                          prayerCount={24}
                          commentCount={8}
                        />
                        <PrayerRequest
                          id={2}
                          userId={2}
                          userName="James Thompson"
                          userInitials="JT"
                          content="Praising God for a new job opportunity! Please pray that I make a positive impact in my new workplace."
                          timeAgo="Yesterday"
                          prayerCount={32}
                          commentCount={12}
                          userHasPrayed={true}
                        />
                      </>
                    )}
                    
                    <Link className="block text-center text-amber-600 hover:text-amber-500 transition-colors text-sm font-medium py-2" href="/community">
                      View All Prayer Requests
                    </Link>
                  </div>
                </div>
                
                {/* Discussion Forums Column */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-amber-700/10 pb-1">Active Discussions</h3>
                    <button className="text-amber-600 hover:text-amber-500 transition-colors">
                      <span className="material-icons">more_horiz</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {discussions && discussions.length > 0 ? (
                      discussions.slice(0, 3).map((discussion) => {
                        const userInfo = getUserName(discussion.userId);
                        const categoryInfo = getCategoryInfo(discussion.category);
                        return (
                          <DiscussionItem
                            key={discussion.id}
                            title={discussion.title}
                            category={categoryInfo.label}
                            categoryColor={categoryInfo.color}
                            replyCount={discussion.replyCount}
                            author={userInfo.name}
                            timeAgo={getTimeAgo(discussion.createdAt)}
                          />
                        );
                      })
                    ) : (
                      // Default discussions if none exist yet
                      <>
                        <DiscussionItem
                          title="How do you maintain a consistent prayer life?"
                          category="Spiritual Disciplines"
                          categoryColor="accent"
                          replyCount={18}
                          author="Lisa Johnson"
                          timeAgo="2 days ago"
                        />
                        <DiscussionItem
                          title="Sunday's sermon discussion: Faith and Works"
                          category="Sermon Discussion"
                          categoryColor="secondary"
                          replyCount={24}
                          author="Pastor Mike"
                          timeAgo="3 days ago"
                        />
                        <DiscussionItem
                          title="Book recommendations for new believers?"
                          category="Resources"
                          categoryColor="success"
                          replyCount={9}
                          author="Robert Chen"
                          timeAgo="5 days ago"
                        />
                      </>
                    )}
                    
                    <Link className="block text-center text-amber-600 hover:text-amber-500 transition-colors text-sm font-medium py-2" href="/community">
                      View All Discussions
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Upcoming Events Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-header">Upcoming Church Events</h2>
                <a href="#" className="text-amber-600 text-sm font-medium hover:text-amber-500 transition-colors">Calendar View</a>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="space-y-4">
                  {events && events.length > 0 ? (
                    events.map((event, index) => (
                      <EventItem
                        key={event.id}
                        date={new Date(event.date)}
                        title={event.title}
                        description={event.description}
                        startTime={event.startTime}
                        endTime={event.endTime}
                        location={event.location}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No upcoming events scheduled
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
