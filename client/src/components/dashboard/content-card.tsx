import { Card } from "@/components/ui/card";

export interface ContentCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  type: "sermon" | "biblestudy" | "devotional";
  duration?: number;
  parts?: number;
  onClick?: () => void;
}

export function ContentCard({
  title,
  description,
  thumbnailUrl,
  type,
  duration,
  parts,
  onClick,
}: ContentCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case "sermon":
        return "bg-accent";
      case "biblestudy":
        return "bg-secondary";
      case "devotional":
        return "bg-success";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "sermon":
        return "Sermon";
      case "biblestudy":
        return "Bible Study";
      case "devotional":
        return "Devotional";
      default:
        return type;
    }
  };

  const getDetailsIcon = () => {
    switch (type) {
      case "sermon":
      case "devotional":
        return (
          <div className="flex items-center text-xs text-gray-500">
            <span className="material-icons text-sm mr-1">schedule</span>
            <span>{duration} min</span>
          </div>
        );
      case "biblestudy":
        return (
          <div className="flex items-center text-xs text-gray-500">
            <span className="material-icons text-sm mr-1">collections_bookmark</span>
            <span>{parts} parts</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionIcon = () => {
    switch (type) {
      case "sermon":
      case "devotional":
        return (
          <button className="text-secondary hover:text-accent transition-colors">
            <span className="material-icons">play_circle</span>
          </button>
        );
      case "biblestudy":
        return (
          <button className="text-secondary hover:text-accent transition-colors">
            <span className="material-icons">arrow_forward</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-40 bg-gray-200 relative">
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <span className={`text-white text-xs font-medium ${getTypeColor()} rounded-full px-2 py-1`}>
            {getTypeLabel()}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-merriweather font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          {getDetailsIcon()}
          {getActionIcon()}
        </div>
      </div>
    </Card>
  );
}
