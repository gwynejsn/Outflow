import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { registerApi } from '@/api/auth';
import type { UserCreateData } from '@/api/auth';

export function useRegister() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: UserCreateData) => registerApi(data),
    onSuccess: () => {
      navigate({ to: '/auth/login' });
    },
  });

  return {
    submitRegister: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
