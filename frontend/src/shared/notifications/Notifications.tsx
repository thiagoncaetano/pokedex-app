"use client";

import React from "react";
import { useNotification } from "./NotificationContext";

const typeStyles: Record<string, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export const Notifications: React.FC = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center space-y-2 px-4">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`w-full max-w-sm rounded-xl border px-4 py-3 shadow-sm ${
            typeStyles[n.type] ?? typeStyles.info
          }`}
        >
          {n.title && (
            <p className="text-sm font-semibold mb-0.5">
              {n.title}
            </p>
          )}
          <p className="text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
};
