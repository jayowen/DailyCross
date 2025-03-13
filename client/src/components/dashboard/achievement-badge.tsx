interface AchievementBadgeProps {
  name: string;
  icon: string;
  unlocked: boolean;
}

export function AchievementBadge({ name, icon, unlocked }: AchievementBadgeProps) {
  const badgeClass = unlocked
    ? icon === "book" 
      ? "bg-secondary" 
      : icon === "groups" 
        ? "bg-success" 
        : "bg-accent"
    : "bg-gray-300";

  return (
    <div className={`flex flex-col items-center ${!unlocked && "opacity-50"}`}>
      <div className={`w-10 h-10 rounded-full ${badgeClass} flex items-center justify-center mb-1`}>
        <span className="material-icons text-white text-sm">{icon}</span>
      </div>
      <span className="text-xs text-center">{name}</span>
    </div>
  );
}
