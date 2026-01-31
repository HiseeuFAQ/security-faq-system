import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Trash2, CheckCircle, AlertCircle, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationCenterProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  userEmail,
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const { language } = useLanguage();
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  // Fetch notifications
  const { data: notifications = [], refetch: refetchNotifications } =
    trpc.notifications.list.useQuery(
      { userEmail },
      { enabled: isOpen }
    );

  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery(
    { userEmail },
    { enabled: isOpen }
  );

  // Mark as read mutation
  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetchNotifications();
    },
  });

  // Mark all as read mutation
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      refetchNotifications();
      toast.success(
        language === "en"
          ? "All notifications marked as read"
          : "所有通知已标记为已读"
      );
    },
  });

  // Delete notification mutation
  const deleteNotification = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      refetchNotifications();
      setSelectedNotification(null);
      toast.success(
        language === "en" ? "Notification deleted" : "通知已删除"
      );
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "feedback_submitted":
        return <Mail className="h-5 w-5 text-blue-600" />;
      case "auto_reply_sent":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "status_updated":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      feedback_submitted: {
        en: "Feedback Submitted",
        zh: "反馈已提交",
      },
      auto_reply_sent: {
        en: "Auto-Reply Sent",
        zh: "自动回复已发送",
      },
      status_updated: {
        en: "Status Updated",
        zh: "状态已更新",
      },
    };
    return labels[type]?.[language] || type;
  };

  const unreadNotifications = notifications.filter(
    (n: any) => n.isRead === "false"
  );
  const readNotifications = notifications.filter(
    (n: any) => n.isRead === "true"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {language === "en" ? "Notifications" : "通知"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="unread" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="unread">
              {language === "en" ? "Unread" : "未读"} ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="all">
              {language === "en" ? "All" : "全部"} ({notifications.length})
            </TabsTrigger>
          </TabsList>

          {/* Unread Tab */}
          <TabsContent value="unread" className="flex-1 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">
                  {language === "en"
                    ? "No unread notifications"
                    : "没有未读通知"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {unreadNotifications.map((notification: any) => (
                  <Card
                    key={notification.id}
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setSelectedNotification(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">
                          {language === "en"
                            ? notification.titleEn
                            : notification.titleZh}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge className="bg-blue-600 text-xs">
                        {language === "en" ? "New" : "新"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all" className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">
                  {language === "en"
                    ? "No notifications yet"
                    : "暂无通知"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {notifications.map((notification: any) => (
                  <Card
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      notification.isRead === "false"
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedNotification(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">
                          {language === "en"
                            ? notification.titleEn
                            : notification.titleZh}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {notification.isRead === "false" && (
                        <Badge className="bg-blue-600 text-xs">
                          {language === "en" ? "New" : "新"}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Selected Notification Detail */}
        {selectedNotification && (
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">
                  {getNotificationTypeLabel(selectedNotification.type)}
                </Badge>
                {selectedNotification.isRead === "false" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      markAsRead.mutate({
                        notificationId: selectedNotification.id,
                      })
                    }
                    disabled={markAsRead.isPending}
                  >
                    {language === "en" ? "Mark as read" : "标记为已读"}
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {language === "en"
                  ? selectedNotification.contentEn
                  : selectedNotification.contentZh}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  deleteNotification.mutate({
                    notificationId: selectedNotification.id,
                  })
                }
                disabled={deleteNotification.isPending}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {language === "en" ? "Delete" : "删除"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedNotification(null)}
                className="flex-1"
              >
                {language === "en" ? "Close" : "关闭"}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {unreadNotifications.length > 0 && (
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllAsRead.mutate({ userEmail })}
              disabled={markAllAsRead.isPending}
              className="w-full"
            >
              {language === "en"
                ? "Mark all as read"
                : "标记全部为已读"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
