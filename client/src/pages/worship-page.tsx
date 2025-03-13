import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ContentCard } from "@/components/dashboard/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Content } from "@shared/schema";

export default function WorshipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: content } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  // Filter content by worship type and search query
  const filterContent = (subType: string) => {
    let filtered = content?.filter(item => 
      item.type === 'worship' && 
      item.tags?.includes(subType)
    ) || [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Sample worship music data
  const musicSamples = [
    {
      id: 201,
      title: "Amazing Grace (Contemporary)",
      description: "A modern rendition of the classic hymn with full band arrangement.",
      type: "worship",
      duration: 5,
      thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["music"]
    },
    {
      id: 202,
      title: "How Great is Our God",
      description: "Live worship recording from the Sunday service featuring the church choir.",
      type: "worship",
      duration: 7,
      thumbnailUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["music"]
    },
    {
      id: 203,
      title: "In Christ Alone",
      description: "Acoustic worship song with lyrics for personal devotion time.",
      type: "worship",
      duration: 4,
      thumbnailUrl: "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["music"]
    }
  ];

  // Sample resources data
  const resourceSamples = [
    {
      id: 204,
      title: "Worship Planning Guide",
      description: "A comprehensive guide for planning meaningful worship services.",
      type: "worship",
      thumbnailUrl: "https://images.unsplash.com/photo-1543622748-5ee7237e8565?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["resources"]
    },
    {
      id: 205,
      title: "Songwriting Workshop",
      description: "Learn the fundamentals of writing worship songs with our music director.",
      type: "worship",
      duration: 45,
      thumbnailUrl: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["resources"]
    }
  ];

  // Sample training videos
  const trainingSamples = [
    {
      id: 206,
      title: "Acoustic Guitar Basics",
      description: "Learn foundational guitar techniques for worship leading.",
      type: "worship",
      duration: 25,
      thumbnailUrl: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["training"]
    },
    {
      id: 207,
      title: "Vocal Exercises for Worship Leaders",
      description: "Essential warm-up and technique exercises for vocalists.",
      type: "worship",
      duration: 18,
      thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["training"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="font-merriweather text-3xl md:text-4xl font-bold mb-2 text-gray-900">Worship</h1>
              <p className="text-gray-600 text-lg mb-6">Experience and engage with worship music, resources, and training materials.</p>
              
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search worship content..."
                  className="max-w-md bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="music" className="space-y-6">
                <TabsList className="bg-white border mb-4">
                  <TabsTrigger value="music" className="data-[state=active]:bg-primary data-[state=active]:text-white">Music</TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-white">Resources</TabsTrigger>
                  <TabsTrigger value="training" className="data-[state=active]:bg-primary data-[state=active]:text-white">Training</TabsTrigger>
                </TabsList>
                
                <TabsContent value="music" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(filterContent('music').length > 0 ? filterContent('music') : musicSamples).map((item) => (
                      <ContentCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        thumbnailUrl={item.thumbnailUrl}
                        type="worship"
                        duration={item.duration}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(filterContent('resources').length > 0 ? filterContent('resources') : resourceSamples).map((item) => (
                      <ContentCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        thumbnailUrl={item.thumbnailUrl}
                        type="worship"
                        duration={item.duration}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="training" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(filterContent('training').length > 0 ? filterContent('training') : trainingSamples).map((item) => (
                      <ContentCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        thumbnailUrl={item.thumbnailUrl}
                        type="worship"
                        duration={item.duration}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}