import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampusCard } from "@/components/directory/campus-card";
import { Church, Campus } from "@shared/schema";

export default function ChurchDetailPage() {
  const { id } = useParams();
  const churchId = parseInt(id);
  const [activeTab, setActiveTab] = useState("about");
  
  // Fetch church details
  const { data: church, isLoading: churchLoading } = useQuery<Church>({
    queryKey: [`/api/churches/${churchId}`],
    enabled: !isNaN(churchId),
  });
  
  // Fetch church campuses
  const { data: campuses, isLoading: campusesLoading } = useQuery<Campus[]>({
    queryKey: [`/api/churches/${churchId}/campuses`],
    enabled: !isNaN(churchId),
  });
  
  const isLoading = churchLoading || campusesLoading;
  
  if (isNaN(churchId)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex">
          <Sidebar />
          <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <span className="material-icons text-4xl text-gray-400 mb-2">error_outline</span>
                <h3 className="text-lg font-medium text-gray-700 mb-1">Invalid church ID</h3>
                <p className="text-gray-500 mb-4">The church ID you're looking for doesn't exist.</p>
                <Link href="/community">
                  <Button variant="outline">Back to Church Directory</Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              <p className="ml-2 text-gray-600">Loading church details...</p>
            </div>
          ) : church ? (
            <div className="max-w-5xl mx-auto">
              {/* Church header */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-1/3 lg:w-1/4">
                  {church.logoUrl ? (
                    <img 
                      src={church.logoUrl} 
                      alt={`${church.name} logo`} 
                      className="w-full rounded-lg shadow-sm object-cover aspect-square"
                    />
                  ) : (
                    <div className="w-full rounded-lg shadow-sm flex items-center justify-center aspect-square bg-gray-800 text-white">
                      <span className="text-5xl font-bold">{church.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <div>
                      <h1 className="font-merriweather text-2xl md:text-3xl font-bold">{church.name}</h1>
                      {church.denomination && (
                        <p className="text-gray-500 mb-4">{church.denomination}</p>
                      )}
                    </div>
                    <Link href="/community">
                      <Button variant="outline" className="mt-4 md:mt-0">
                        <span className="material-icons mr-1 text-sm">arrow_back</span>
                        Back to Directory
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start">
                      <span className="material-icons text-gray-500 mr-2 mt-0.5">location_on</span>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-800">{church.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="material-icons text-gray-500 mr-2 mt-0.5">person</span>
                      <div>
                        <p className="text-sm text-gray-500">Lead Pastor</p>
                        <p className="text-gray-800">{church.leadPastorName}</p>
                      </div>
                    </div>
                    
                    {church.websiteUrl && (
                      <div className="flex items-start">
                        <span className="material-icons text-gray-500 mr-2 mt-0.5">language</span>
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a href={church.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                            {church.websiteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {church.streamingUrl && (
                      <div className="flex items-start">
                        <span className="material-icons text-gray-500 mr-2 mt-0.5">live_tv</span>
                        <div>
                          <p className="text-sm text-gray-500">Live Streaming</p>
                          <a href={church.streamingUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                            Watch Online
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {church.streamingDays && church.streamingDays.length > 0 && church.streamingTimes && church.streamingTimes.length > 0 && (
                    <div className="flex items-start mb-4">
                      <span className="material-icons text-gray-500 mr-2 mt-0.5">schedule</span>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Streaming Times</p>
                        <div className="flex flex-wrap gap-2">
                          {church.streamingDays.map((day, i) => (
                            <div key={i} className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-800">
                              {day} {church.streamingTimes && church.streamingTimes[i % church.streamingTimes.length]}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-4 w-full sm:w-auto justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="campuses">
                    Campuses ({campuses?.length || church.numberOfCampuses || 0})
                  </TabsTrigger>
                  <TabsTrigger value="pastor">Lead Pastor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">About {church.name}</h2>
                    <p className="text-gray-700 whitespace-pre-line">{church.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="campuses">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Church Campuses</h2>
                    </div>
                    
                    {campuses && campuses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campuses.map((campus) => (
                          <CampusCard
                            key={campus.id}
                            name={campus.name}
                            address={campus.address}
                            city={campus.city}
                            state={campus.state}
                            zipCode={campus.zipCode}
                            serviceSchedule={campus.serviceSchedule}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No campus information available.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="pastor">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {church.leadPastorImageUrl ? (
                        <div className="w-full md:w-1/4">
                          <img 
                            src={church.leadPastorImageUrl} 
                            alt={church.leadPastorName} 
                            className="w-full rounded-lg shadow-sm object-cover aspect-square"
                          />
                        </div>
                      ) : null}
                      
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold mb-1">{church.leadPastorName}</h2>
                        <p className="text-gray-500 mb-4">Lead Pastor</p>
                        
                        {church.leadPastorBio ? (
                          <p className="text-gray-700 whitespace-pre-line">{church.leadPastorBio}</p>
                        ) : (
                          <p className="text-gray-500">No biographical information available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <span className="material-icons text-4xl text-gray-400 mb-2">church</span>
                <h3 className="text-lg font-medium text-gray-700 mb-1">Church not found</h3>
                <p className="text-gray-500 mb-4">The church you're looking for doesn't exist or has been removed.</p>
                <Link href="/community">
                  <Button variant="outline">Back to Church Directory</Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}