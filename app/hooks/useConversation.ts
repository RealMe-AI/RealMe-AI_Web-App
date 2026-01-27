import { useState, useCallback } from 'react';
import { baseUrl } from '../lib/baseUrl';

interface UpdateConversationParams {
  title?: string;
  lastMessage?: string;
  updatedAt?: string;
}

export const useConversation = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConversation = useCallback(
    async (conversationId: number, updates: UpdateConversationParams) => {
      setIsUpdating(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found');
        setIsUpdating(false);
        return false;
      }

      try {
        const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          throw new Error(`Failed to update conversation: ${res.status}`);
        }

        setIsUpdating(false);
        return true;
      } catch (err) {
        console.error('Error updating conversation:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsUpdating(false);
        return false;
      }
    },
    []
  );

  return {
    updateConversation,
    isUpdating,
    error,
  };
};