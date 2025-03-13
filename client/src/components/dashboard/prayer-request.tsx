import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

interface PrayerRequestProps {
  id: number;
  userId: number;
  userName: string;
  userInitials: string;
  content: string;
  timeAgo: string;
  prayerCount: number;
  commentCount: number;
  userHasPrayed?: boolean;
}

export function PrayerRequest({
  id,
  userId,
  userName,
  userInitials,
  content,
  timeAgo,
  prayerCount,
  commentCount,
  userHasPrayed = false,
}: PrayerRequestProps) {
  const { user } = useAuth();
  const [hasPrayed, setHasPrayed] = useState(userHasPrayed);
  const [prayers, setPrayers] = useState(prayerCount);

  const prayMutation = useMutation({
    mutationFn: async () => {
      const newCount = hasPrayed ? prayers - 1 : prayers + 1;
      await apiRequest("POST", `/api/prayer-requests/${id}/pray`, { count: newCount });
      return newCount;
    },
    onSuccess: (newCount) => {
      setPrayers(newCount);
      setHasPrayed(!hasPrayed);
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-requests"] });
    },
  });

  const handlePrayClick = () => {
    if (user) {
      prayMutation.mutate();
    }
  };

  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="flex items-start mb-2">
        <Avatar className="w-8 h-8 mr-2 mt-1">
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <span className="font-medium mr-2">{userName}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="text-sm mt-1">{content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pl-10">
        <div className="flex items-center space-x-2">
          <button 
            className={`flex items-center text-sm ${hasPrayed ? 'text-secondary' : 'text-gray-500 hover:text-secondary'} transition-colors`}
            onClick={handlePrayClick}
            disabled={prayMutation.isPending}
          >
            <span className="material-icons text-sm mr-1">favorite</span>
            <span>{prayers} praying</span>
          </button>
          <button className="flex items-center text-sm text-gray-500 hover:text-secondary transition-colors">
            <span className="material-icons text-sm mr-1">chat_bubble_outline</span>
            <span>{commentCount} comments</span>
          </button>
        </div>
        <Button
          variant="link"
          className={`text-sm font-medium p-0 h-auto ${hasPrayed ? 'text-secondary' : 'text-gray-500 hover:text-secondary'}`}
          onClick={handlePrayClick}
          disabled={prayMutation.isPending}
        >
          {hasPrayed ? "I'm Praying" : "I'm Praying"}
        </Button>
      </div>
    </div>
  );
}
