import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export interface ChurchCardProps {
  id: number;
  name: string;
  description: string;
  location: string;
  logoUrl: string | null;
  denomination: string | null;
  numberOfCampuses: number | null;
  leadPastorName: string;
}

export function ChurchCard({
  id,
  name,
  description,
  location,
  logoUrl,
  denomination,
  numberOfCampuses,
  leadPastorName
}: ChurchCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-200 flex-shrink-0">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${name} logo`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <span className="text-2xl font-bold">{name.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              {denomination && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {denomination}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{description.length > 120 ? description.substring(0, 120) + "..." : description}</p>
            <div className="flex flex-wrap gap-4 mb-3 text-sm">
              <div className="flex items-center">
                <span className="material-icons text-gray-500 mr-1 text-base">location_on</span>
                <span className="text-gray-700">{location}</span>
              </div>
              {numberOfCampuses && numberOfCampuses > 0 && (
                <div className="flex items-center">
                  <span className="material-icons text-gray-500 mr-1 text-base">apartment</span>
                  <span className="text-gray-700">{numberOfCampuses} {numberOfCampuses === 1 ? "Campus" : "Campuses"}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="material-icons text-gray-500 mr-1 text-base">person</span>
                <span className="text-gray-700">{leadPastorName}</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Link href={`/church/${id}`}>
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}