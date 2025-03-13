import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ContentCard } from "@/components/dashboard/content-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Content } from "@shared/schema";

export default function PodcastsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: content } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  // Filter podcasts content
  const filteredPodcasts = content
    ? content
        .filter(item => item.type === 'podcast')
        .filter(item => 
          selectedCategory === "all" || item.tags?.includes(selectedCategory)
        )
        .filter(item => 
          !searchQuery || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  // Sample podcast data if none exists
  const podcastSamples = [
    {
      id: 301,
      title: "Faith in Action",
      description: "Practical discussions on living out faith in everyday situations with host Pastor Mike.",
      type: "podcast",
      duration: 35,
      thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["teaching"]
    },
    {
      id: 302,
      title: "Scripture Unpacked",
      description: "Deep dive biblical analysis and interpretation of challenging passages.",
      type: "podcast",
      duration: 42,
      thumbnailUrl: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["teaching"]
    },
    {
      id: 303,
      title: "Young Adults Roundtable",
      description: "Open discussions on faith challenges and victories facing young Christians today.",
      type: "podcast",
      duration: 38,
      thumbnailUrl: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["discussion"]
    },
    {
      id: 304,
      title: "Faith & Culture",
      description: "Exploring the intersection of Christian faith and contemporary culture.",
      type: "podcast",
      duration: 45,
      thumbnailUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["culture"]
    },
    {
      id: 305,
      title: "Walk with the Spirit",
      description: "Personal stories of spiritual growth and following the Holy Spirit's guidance.",
      type: "podcast",
      duration: 29,
      thumbnailUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["testimonies"]
    },
    {
      id: 306,
      title: "Global Church Insights",
      description: "Interviews with Christian leaders from around the world sharing local church perspectives.",
      type: "podcast",
      duration: 50,
      thumbnailUrl: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      tags: ["interviews"]
    }
  ];

  const displayPodcasts = filteredPodcasts.length > 0 
    ? filteredPodcasts 
    : podcastSamples.filter(p => 
        selectedCategory === "all" || p.tags?.includes(selectedCategory)
      );

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "teaching", label: "Biblical Teaching" },
    { value: "discussion", label: "Group Discussions" },
    { value: "culture", label: "Faith & Culture" },
    { value: "testimonies", label: "Testimonies" },
    { value: "interviews", label: "Interviews" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="font-merriweather text-3xl md:text-4xl font-bold mb-2 text-gray-900">Podcasts</h1>
                  <p className="text-gray-600 text-lg">Listen to insightful conversations and teachings on faith and life.</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Button className="bg-primary hover:bg-primary/90">
                    <span className="material-icons mr-2">podcasts</span>
                    Subscribe
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      type="search"
                      placeholder="Search podcasts..."
                      className="w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPodcasts.map((podcast) => (
                  <ContentCard
                    key={podcast.id}
                    title={podcast.title}
                    description={podcast.description}
                    thumbnailUrl={podcast.thumbnailUrl}
                    type="podcast"
                    duration={podcast.duration}
                  />
                ))}
              </div>
              
              {displayPodcasts.length === 0 && (
                <div className="text-center py-16">
                  <span className="material-icons text-gray-400 text-5xl mb-4">podcasts</span>
                  <h3 className="text-xl font-semibold mb-2">No podcasts found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}