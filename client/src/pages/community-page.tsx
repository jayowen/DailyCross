import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ChurchCard } from "@/components/directory/church-card";
import { Input } from "@/components/ui/input";
import { Church } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ChurchDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [denominationFilter, setDenominationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  const { data: churches, isLoading } = useQuery<Church[]>({
    queryKey: ["/api/churches"],
  });

  // Get unique denominations and locations for filters
  const denominations = churches 
    ? Array.from(new Set(churches.filter(church => church.denomination).map(church => church.denomination)))
    : [];
    
  const locations = churches 
    ? Array.from(new Set(churches.map(church => {
        // Extract just the city, state part from the location
        const locationParts = church.location.split(",");
        return locationParts.length > 1 
          ? `${locationParts[0].trim()}, ${locationParts[1].trim()}`
          : church.location;
      })))
    : [];

  // Filter churches based on search term and filters
  const filteredChurches = churches?.filter(church => {
    // Search filter
    const searchMatch = searchTerm === "" || 
      church.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (church.description && church.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Denomination filter
    const denominationMatch = 
      denominationFilter === "all" || 
      church.denomination === denominationFilter;
    
    // Location filter
    const locationMatch = 
      locationFilter === "all" || 
      church.location.includes(locationFilter);
    
    return searchMatch && denominationMatch && locationMatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="font-merriweather text-2xl md:text-3xl font-bold mb-2">Church Directory</h1>
              <p className="text-gray-600 mb-6">Find and connect with DailyCross.com partnering churches in your area.</p>
              
              {/* Search and filters */}
              <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-grow">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <span className="material-icons text-base">search</span>
                      </span>
                      <Input
                        type="text"
                        placeholder="Search churches by name or description..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {denominations.length > 0 && (
                    <div className="w-full md:w-48">
                      <Select
                        value={denominationFilter}
                        onValueChange={setDenominationFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Denomination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Denominations</SelectItem>
                          {denominations.map((denomination, index) => (
                            <SelectItem key={index} value={denomination || ""}>
                              {denomination}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {locations.length > 0 && (
                    <div className="w-full md:w-48">
                      <Select
                        value={locationFilter}
                        onValueChange={setLocationFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {locations.map((location, index) => (
                            <SelectItem key={index} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Church listing */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                  <p className="mt-2 text-gray-600">Loading churches...</p>
                </div>
              ) : filteredChurches && filteredChurches.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredChurches.map((church) => (
                    <ChurchCard
                      key={church.id}
                      id={church.id}
                      name={church.name}
                      description={church.description}
                      location={church.location}
                      logoUrl={church.logoUrl}
                      denomination={church.denomination}
                      numberOfCampuses={church.numberOfCampuses}
                      leadPastorName={church.leadPastorName}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <span className="material-icons text-4xl text-gray-400 mb-2">church</span>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No churches found</h3>
                  <p className="text-gray-500">
                    {searchTerm || denominationFilter !== "all" || locationFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are no churches in the directory yet"}
                  </p>
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
