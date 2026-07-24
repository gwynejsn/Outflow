import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useLogin';
import type { LoginCredentials } from '@/api/auth';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import gsap from 'gsap';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const { submitLogin, isLoading, isError, error } = useLogin();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate({ to: '/admin/users' });
      } else {
        navigate({ to: '/dashboard' });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit = async (data: LoginCredentials) => {
    setApiError(null);
    try {
      await submitLogin(data);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background Accent Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <Card ref={cardRef} className="w-full max-w-md border-border shadow-2xl backdrop-blur-xl bg-slate-900/40">
        <CardHeader className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center gap-2 mx-auto px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Welcome Back
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to Outflow
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to manage your subscription outflow
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert Box */}
          {(apiError || isError) && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{apiError || (error as any)?.response?.data?.message || 'Authentication failed'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="name@example.com"
                  className={`pl-9 ${errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  placeholder="••••••••"
                  className={`pl-9 ${errors.password ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="gradient"
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/register"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
