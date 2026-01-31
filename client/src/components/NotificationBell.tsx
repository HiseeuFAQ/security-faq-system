import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

interface NotificationBellProps {
  userEmail: string;
}

export default function NotificationBell({ userEmail }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for unread notifications
  const { data: count = 0 } = trpc.notifications.unreadCount.useQuery(
    { userEmail },
    {
      refetchInterval: 10000, // Poll every 10 seconds
    }
  );

  useEffect(() => {
    setUnreadCount(count);
  }, [count]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <NotificationCenter
        userEmail={userEmail}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
