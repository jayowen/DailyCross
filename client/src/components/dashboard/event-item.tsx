import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface EventItemProps {
  date: Date;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  onAddToCalendar?: () => void;
}

export function EventItem({
  date,
  title,
  description,
  startTime,
  endTime,
  location,
  onAddToCalendar,
}: EventItemProps) {
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  const getColorClass = (index: number) => {
    const colors = ["bg-secondary bg-opacity-10", "bg-accent bg-opacity-10", "bg-success bg-opacity-10"];
    const textColors = ["text-secondary", "text-accent", "text-success"];
    return {
      bg: colors[index % colors.length],
      text: textColors[index % textColors.length]
    };
  };

  const colorClass = getColorClass(day % 3);

  return (
    <div className="flex items-start border-b border-gray-100 pb-4">
      <div className={`min-w-[60px] ${colorClass.bg} rounded-lg p-2 text-center mr-4`}>
        <div className="text-xs text-gray-600 uppercase font-medium">{month}</div>
        <div className={`text-xl font-bold ${colorClass.text}`}>{day}</div>
      </div>
      <div className="flex-grow">
        <h3 className="font-merriweather font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center text-xs text-gray-500">
          <span className="material-icons text-sm mr-1">schedule</span>
          <span className="mr-3">{startTime} - {endTime}</span>
          <span className="material-icons text-sm mr-1">location_on</span>
          <span>{location}</span>
        </div>
      </div>
      <Button 
        className="bg-secondary text-white rounded-full px-3 py-1 text-sm font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap"
        onClick={onAddToCalendar}
      >
        Add to Calendar
      </Button>
    </div>
  );
}
