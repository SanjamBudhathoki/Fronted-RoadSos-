import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import socket from "../services/socket";

const NotificationContext = createContext();

export const NotificationProvider = ({
  children,
}) => {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    socket.on("sos-updated", (data) => {
      let message = "";

      switch (data.status) {
        case "ACCEPTED":
          message =
            "Your SOS has been accepted by a provider.";
          break;

        case "ON_THE_WAY":
          message =
            "Provider is on the way.";
          break;

        case "ARRIVED":
          message =
            "Provider has arrived.";
          break;

        case "COMPLETED":
          message =
            "SOS request completed.";
          break;

        default:
          message =
            `SOS status changed to ${data.status}`;
      }

      setNotifications((prev) => [
        {
          id: Date.now(),
          message,
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("sos-updated");
    };
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);