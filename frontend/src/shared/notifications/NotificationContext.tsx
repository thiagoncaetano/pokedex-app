"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type Notification = {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
};

type NotificationContextValue = {
  notifications: Notification[];
  showNotification: (input: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (input: Omit<Notification, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const notification: Notification = { id, ...input };
      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        removeNotification(id);
      }, 3000);
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return ctx;
}
