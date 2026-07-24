import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface NotificationItem {
  id: string;
  expirationType: 'EXPIRED' | 'NEARING_EXPIRATION';
  message: string;
  subscriptionId: string;
}

export function useNotifications(expirationType?: 'EXPIRED' | 'NEARING_EXPIRATION') {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications', expirationType],
    queryFn: async () => {
      const params = expirationType ? { expirationType } : {};
      const response = await apiClient.get<NotificationItem[]>('/user/notifications', { params });
      return response.data;
    },
    // Poll every 30 seconds for new alerts (optional, but nice)
    refetchInterval: 30000,
  });
}

export function useClearNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get<string>('/user/notifications/clear');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
