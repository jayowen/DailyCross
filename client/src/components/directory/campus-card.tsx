import { Card, CardContent } from "@/components/ui/card";

export interface CampusCardProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceSchedule: string[] | null;
}

export function CampusCard({
  name,
  address,
  city,
  state,
  zipCode,
  serviceSchedule
}: CampusCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <div className="flex items-start mb-4">
          <span className="material-icons text-gray-500 mr-2 mt-0.5">location_on</span>
          <div>
            <p className="text-gray-700">{address}</p>
            <p className="text-gray-700">{city}, {state} {zipCode}</p>
          </div>
        </div>
        
        {serviceSchedule && serviceSchedule.length > 0 && (
          <div className="flex items-start">
            <span className="material-icons text-gray-500 mr-2 mt-0.5">schedule</span>
            <div>
              <p className="text-gray-700 font-medium mb-1">Service Times:</p>
              <ul className="text-gray-600 space-y-1">
                {serviceSchedule.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}