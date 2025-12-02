'use client';

import { useState, useCallback } from 'react';
import { useNotification } from '@/shared/notifications/NotificationContext';

interface RequestOptions {
  successMessage?: string;
  errorMessage?: string;
}

type ApiFunction<T = unknown> = () => Promise<T>;

export function useApi<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const request = useCallback(
    async (apiCall: ApiFunction<T>, options: RequestOptions = {}): Promise<T | null> => {
      const { successMessage, errorMessage } = options;
      setLoading(true);
      
      try {
        const result = await apiCall();
        if (successMessage) {
          showNotification({ message: successMessage, type: 'success' });
        }
        return result;
      } catch (error: unknown) {
        //Here I had to fix the error message that AI generated, because I needed to show the error message from the API first
        //and then show the error message default in case of an unknown error
        const message = (error as Error)?.message || errorMessage || 'An error occurred';
        showNotification({ message, type: 'error' });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  return { request, loading };
}
