import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ContentCard } from "@/components/dashboard/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Content } from "@shared/schema";

export default function SermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: content } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  // Filter content by type and search query
  const filterContent = (type: string) => {
    let filtered = content?.filter(item => item.type === type) || [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
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

  // Sample sermon data if none exists
  const sermonSamples = [
    {
      id: 1,
      title: "Finding Peace in Troubled Times",
      description: "Pastor Michael Johnson explores how to maintain spiritual calm during life's storms.",
      type: "sermon",
      duration: 32,
      thumbnailUrl: getThumbnailByType('sermon')
    },
    {
      id: 2,
      title: "The Power of Prayer",
      description: "Learn how consistent prayer can transform your life and relationship with God.",
      type: "sermon",
      duration: 28,
      thumbnailUrl: getThumbnailByType('sermon')
    },
    {
      id: 3,
      title: "Living with Purpose",
      description: "Discover God's unique purpose for your life and how to fulfill it each day.",
      type: "sermon",
      duration: 35,
      thumbnailUrl: getThumbnailByType('sermon')
    }
  ];

  // Sample Bible study data if none exists
  const bibleStudySamples = [
    {
      id: 4,
      title: "The Book of James: Faith in Action",
      description: "A 5-part study on living out your faith through practical actions and wisdom.",
      type: "biblestudy",
      parts: 5,
      thumbnailUrl: getThumbnailByType('biblestudy')
    },
    {
      id: 5,
      title: "Understanding the Psalms",
      description: "Explore the richness and depth of the Psalms in this 3-part series.",
      type: "biblestudy",
      parts: 3,
      thumbnailUrl: getThumbnailByType('biblestudy')
    }
  ];

  // Sample devotional data if none exists
  const devotionalSamples = [
    {
      id: 6,
      title: "Morning Reflections: Psalms of Praise",
      description: "Start your day with inspiration from the Psalms and guided prayer practices.",
      type: "devotional",
      duration: 10,
      thumbnailUrl: getThumbnailByType('devotional')
    },
    {
      id: 7,
      title: "Daily Bread: Finding Strength",
      description: "A week-long devotional on finding God's strength in life's challenges.",
      type: "devotional",
      duration: 15,
      thumbnailUrl: getThumbnailByType('devotional')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="font-merriweather text-2xl md:text-3xl font-bold mb-4">Spiritual Content</h1>
              <p className="text-gray-600 mb-4">Browse sermons, Bible studies, and devotionals to grow your faith.</p>
              
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search for content..."
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="sermons">
                <TabsList className="mb-4">
                  <TabsTrigger value="sermons">Sermons</TabsTrigger>
                  <TabsTrigger value="biblestudy">Bible Studies</TabsTrigger>
                  <TabsTrigger value="devotional">Devotionals</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sermons">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(filterContent('sermon').length > 0 ? filterContent('sermon') : sermonSamples).map((sermon) => (
                      <ContentCard
                        key={sermon.id}
                        title={sermon.title}
                        description={sermon.description}
                        thumbnailUrl={sermon.thumbnailUrl || getThumbnailByType('sermon')}
                        type="sermon"
                        duration={sermon.duration}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="biblestudy">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(filterContent('biblestudy').length > 0 ? filterContent('biblestudy') : bibleStudySamples).map((study) => (
                      <ContentCard
                        key={study.id}
                        title={study.title}
                        description={study.description}
                        thumbnailUrl={study.thumbnailUrl || getThumbnailByType('biblestudy')}
                        type="biblestudy"
                        parts={study.parts}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="devotional">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(filterContent('devotional').length > 0 ? filterContent('devotional') : devotionalSamples).map((devotional) => (
                      <ContentCard
                        key={devotional.id}
                        title={devotional.title}
                        description={devotional.description}
                        thumbnailUrl={devotional.thumbnailUrl || getThumbnailByType('devotional')}
                        type="devotional"
                        duration={devotional.duration}
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
