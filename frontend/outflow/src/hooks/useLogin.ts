import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { loginApi } from '@/api/auth';
import type { LoginCredentials } from '@/api/auth';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: async (data) => {
      await login(data.jwt);
      navigate({ to: '/dashboard' });
    },
  });

  return {
    submitLogin: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
