import { Card } from "@/components/ui/card";

export interface ContentCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  type: "sermon" | "biblestudy" | "devotional" | "story" | "worship" | "podcast";
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
        return "bg-primary";
      case "biblestudy":
        return "bg-gray-800";
      case "devotional":
        return "bg-gray-700";
      case "story":
        return "bg-gray-900";
      case "worship":
        return "bg-amber-700";
      case "podcast":
        return "bg-zinc-800";
      default:
        return "bg-gray-800";
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
      case "story":
        return "Story";
      case "worship":
        return "Worship";
      case "podcast":
        return "Podcast";
      default:
        return type;
    }
  };

  const getDetailsIcon = () => {
    switch (type) {
      case "sermon":
      case "devotional":
      case "podcast":
      case "worship":
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
      case "podcast":
        return (
          <button className="text-amber-600 hover:text-amber-500 transition-colors">
            <span className="material-icons">play_circle</span>
          </button>
        );
      case "worship":
        return (
          <button className="text-amber-600 hover:text-amber-500 transition-colors">
            <span className="material-icons">headphones</span>
          </button>
        );
      case "story":
        return (
          <button className="text-amber-600 hover:text-amber-500 transition-colors">
            <span className="material-icons">visibility</span>
          </button>
        );
      case "biblestudy":
        return (
          <button className="text-amber-600 hover:text-amber-500 transition-colors">
            <span className="material-icons">arrow_forward</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-40 bg-gray-200 relative">
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
          }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <span className={`text-white text-xs font-medium ${getTypeColor()} rounded-full px-2 py-1`}>
            {getTypeLabel()}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-merriweather font-bold text-lg mb-1 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          {getDetailsIcon()}
          {getActionIcon()}
        </div>
      </div>
    </Card>
  );
}
