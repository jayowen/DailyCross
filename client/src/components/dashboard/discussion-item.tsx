import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

interface DiscussionItemProps {
  title: string;
  category: string;
  categoryColor: "accent" | "secondary" | "success";
  replyCount: number;
  author: string;
  timeAgo: string;
  onClick?: () => void;
}

export function DiscussionItem({
  title,
  category,
  categoryColor,
  replyCount,
  author,
  timeAgo,
  onClick,
}: DiscussionItemProps) {
  const getCategoryClasses = () => {
    switch (categoryColor) {
      case "accent":
        return "bg-accent/10 text-accent";
      case "secondary":
        return "bg-secondary/10 text-secondary";
      case "success":
        return "bg-success/10 text-success";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <a 
      href="#" 
      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
    >
      <h4 className="font-medium text-primary mb-1">{title}</h4>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className={`${getCategoryClasses()} rounded-full px-2 py-1 text-xs font-medium`}>
          {category}
        </Badge>
        <span className="text-xs text-gray-500">{replyCount} replies</span>
      </div>
      <div className="flex items-center text-xs text-gray-500">
        <span>Started by {author} • {timeAgo}</span>
      </div>
    </a>
  );
}
