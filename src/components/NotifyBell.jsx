import React, { useState } from "react";
import { Bell } from "lucide-react";

import {
  useNotifications,
} from "../context/NotificationContext";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative"
      >
        <Bell className="h-6 w-6" />

        {unreadCount > 0 && (
          <span
            className="absolute -top-2 -right-2
            bg-red-500 text-white text-xs
            rounded-full h-5 w-5 flex
            items-center justify-center"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
          absolute right-0 mt-3
          w-80 bg-white border
          rounded-xl shadow-lg
          z-50"
        >
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">
              Notifications
            </h3>

            <button
              onClick={
                markAllAsRead
              }
              className="text-blue-500 text-sm"
            >
              Mark all
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              No notifications
            </p>
          ) : (
            notifications.map(
              (notification) => (
                <div
                  key={
                    notification.id
                  }
                  onClick={() =>
                    markAsRead(
                      notification.id
                    )
                  }
                  className={`
                    p-3 border-b cursor-pointer
                    hover:bg-gray-50
                    ${
                      !notification.read
                        ? "bg-blue-50"
                        : ""
                    }
                  `}
                >
                  <p className="text-sm">
                    {
                      notification.message
                    }
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                      notification.createdAt
                    ).toLocaleTimeString()}
                  </p>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;