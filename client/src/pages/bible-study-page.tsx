import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ContentCard } from "@/components/dashboard/content-card";
import { Content } from "@shared/schema";

export default function BibleStudyPage() {
  const { data: bibleStudies } = useQuery<Content[]>({
    queryKey: ["/api/content/biblestudy"],
  });

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
        return 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
    }
  };

  // Sample Bible study data if none exists
  const bibleStudySamples = [
    {
      id: 1,
      title: "The Book of James: Faith in Action",
      description: "A 5-part study on living out your faith through practical actions and wisdom.",
      type: "biblestudy",
      parts: 5,
      thumbnailUrl: getThumbnailByType('biblestudy')
    },
    {
      id: 2,
      title: "Understanding the Psalms",
      description: "Explore the richness and depth of the Psalms in this 3-part series.",
      type: "biblestudy",
      parts: 3,
      thumbnailUrl: getThumbnailByType('biblestudy')
    },
    {
      id: 3,
      title: "The Sermon on the Mount",
      description: "Study Jesus's most famous teaching and its radical implications for our lives today.",
      type: "biblestudy",
      parts: 6,
      thumbnailUrl: getThumbnailByType('biblestudy')
    },
    {
      id: 4,
      title: "Romans: The Gospel Explained",
      description: "Dive deep into Paul's masterful explanation of the gospel and its implications.",
      type: "biblestudy",
      parts: 8,
      thumbnailUrl: getThumbnailByType('biblestudy')
    },
    {
      id: 5,
      title: "Genesis: Beginnings",
      description: "Explore how the first book of the Bible sets the stage for God's redemptive story.",
      type: "biblestudy",
      parts: 4,
      thumbnailUrl: getThumbnailByType('biblestudy')
    },
    {
      id: 6,
      title: "The Parables of Jesus",
      description: "Understand the profound spiritual truths in Jesus's memorable stories.",
      type: "biblestudy",
      parts: 5,
      thumbnailUrl: getThumbnailByType('biblestudy')
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
              <h1 className="font-merriweather text-2xl md:text-3xl font-bold mb-4">Bible Studies</h1>
              <p className="text-gray-600 mb-6">Deepen your understanding of God's Word through our multi-part Bible studies.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(bibleStudies && bibleStudies.length > 0 ? bibleStudies : bibleStudySamples).map((study) => (
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
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
