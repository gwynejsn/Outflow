import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Subscription {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  category: 'GAME' | 'MUSIC' | 'VIDEO_STREAM' | 'NEWS' | 'ENTERTAINMENT';
  createdAt: string;
  expiresAt: string;
}

export interface UserSubscriptionCreateData {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  category: 'GAME' | 'MUSIC' | 'VIDEO_STREAM' | 'NEWS' | 'ENTERTAINMENT';
  expiresAt: string;
}

export interface AdminSubscriptionCreateData extends UserSubscriptionCreateData {
  email: string;
}

export interface SubscriptionUpdateData {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  category: 'GAME' | 'MUSIC' | 'VIDEO_STREAM' | 'NEWS' | 'ENTERTAINMENT';
  expiresAt: string;
}

// User Hooks
export function useUserSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ['user-subscriptions'],
    queryFn: async () => {
      const response = await apiClient.get<Subscription[]>('/user/subscriptions');
      return response.data;
    },
  });
}

export function useCreateUserSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserSubscriptionCreateData) => {
      const response = await apiClient.post<Subscription>('/user/subscriptions/create', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
}

export function useUpdateUserSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubscriptionUpdateData) => {
      const response = await apiClient.put<Subscription>('/user/subscriptions/update', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
}

// Admin Hooks
export function useAdminSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const response = await apiClient.get<Subscription[]>('/admin/subscriptions');
      return response.data;
    },
  });
}

export function useCreateAdminSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AdminSubscriptionCreateData) => {
      const response = await apiClient.post<Subscription>('/admin/subscriptions/create', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
}

export function useUpdateAdminSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubscriptionUpdateData) => {
      const response = await apiClient.put<Subscription>('/admin/subscriptions/update', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
}

export function useDeleteAdminSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/subscriptions/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
}

export function useDeleteUserSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/user/subscriptions/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
}
