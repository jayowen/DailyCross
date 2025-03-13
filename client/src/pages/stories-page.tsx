import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ContentCard } from "@/components/dashboard/content-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Content } from "@shared/schema";

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: content } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  // Filter stories content
  const filteredStories = content
    ? content
        .filter(item => item.type === 'story')
        .filter(item => 
          !searchQuery || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  // Sample story data if none exists
  const storySamples = [
    {
      id: 101,
      title: "Finding Faith in Darkness",
      description: "A powerful testimony of how one person found hope through their darkest moments.",
      type: "story",
      thumbnailUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 102,
      title: "From Addiction to Freedom",
      description: "John's journey from substance abuse to a renewed life through faith and community.",
      type: "story",
      thumbnailUrl: "https://images.unsplash.com/photo-1508247967583-7d982ea01526?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 103,
      title: "Healing Through Prayer",
      description: "After doctors gave up hope, Sarah experienced a miraculous recovery that transformed her faith.",
      type: "story",
      thumbnailUrl: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 104,
      title: "Reunited by Grace",
      description: "A family torn apart for decades finds healing and reunification through forgiveness.",
      type: "story",
      thumbnailUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 105,
      title: "Called to Serve",
      description: "How a life-changing mission trip inspired Maria to dedicate her life to helping others.",
      type: "story",
      thumbnailUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbafc3f4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 106,
      title: "Lost and Found",
      description: "A prodigal son story of wandering from faith and the journey back home.",
      type: "story",
      thumbnailUrl: "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const displayStories = filteredStories.length > 0 ? filteredStories : storySamples;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="font-merriweather text-3xl md:text-4xl font-bold mb-2 text-gray-900">Stories</h1>
                  <p className="text-gray-600 text-lg">Real testimonies of faith, transformation, and God's work in people's lives.</p>
                </div>
                
                <div className="hidden md:block">
                  <Button className="bg-primary hover:bg-primary/90">
                    <span className="material-icons mr-2">add</span>
                    Share Your Story
                  </Button>
                </div>
              </div>
              
              <div className="relative mb-8">
                <Input
                  type="search"
                  placeholder="Search stories..."
                  className="bg-white pr-10 rounded-lg border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayStories.map((story) => (
                  <ContentCard
                    key={story.id}
                    title={story.title}
                    description={story.description}
                    thumbnailUrl={story.thumbnailUrl}
                    type="story"
                  />
                ))}
              </div>
              
              <div className="md:hidden mt-8 flex justify-center">
                <Button className="bg-primary hover:bg-primary/90 w-full">
                  <span className="material-icons mr-2">add</span>
                  Share Your Story
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}