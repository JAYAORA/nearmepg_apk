"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/data/auth-context";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    // Set up polling every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    
    // Mark as read when opening
    const unreadCount = notifications.filter((n) => !n.read).length;
    if (!isOpen && unreadCount > 0) {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (error) {
        console.error("Failed to mark notifications read:", error);
      }
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const content = (
                    <div className={`px-4 py-3 hover:bg-slate-50 transition-colors ${!notification.read ? "bg-amber-50/50" : ""}`}>
                      <p className="text-sm font-semibold text-slate-800 mb-0.5">
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-600 leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5">
                        {new Date(notification.createdAt).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );

                  return notification.actionUrl ? (
                    <Link key={notification.id} href={notification.actionUrl} onClick={() => setIsOpen(false)}>
                      {content}
                    </Link>
                  ) : (
                    <div key={notification.id}>{content}</div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
