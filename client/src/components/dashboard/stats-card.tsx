import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
}

export function StatsCard({ title, value, icon, iconColor }: StatsCardProps) {
  return (
    <Card className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="flex items-center">
        <span className={`material-icons text-${iconColor} mr-1`}>{icon}</span>
        <span className="text-xl font-bold">{value}</span>
      </div>
    </Card>
  );
}
