import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Lock, Mail, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/hooks/useRegister';
import type { UserCreateData } from '@/api/auth';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const { submitRegister, isLoading, isError, error } = useRegister();
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
    watch,
  } = useForm<UserCreateData & { confirmPassword?: string }>();

  const passwordVal = watch('password');

  const onSubmit = async (data: UserCreateData & { confirmPassword?: string }) => {
    setApiError(null);
    try {
      const payload: UserCreateData = {
        password: data.password,
        role: 'USER', // Default role for standard signup
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };
      await submitRegister(payload);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Registration failed. Email might already be taken.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background Accent Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Card ref={cardRef} className="w-full max-w-md glass-card border border-border/40 shadow-2xl relative z-10 register-card overflow-hidden">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm font-medium">
            Join Outflow to track your subscription expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(apiError || isError) && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex items-center gap-2 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{apiError || (error as any)?.response?.data?.message || 'Registration failed'}</span>
              </div>
            )}

            {/* Name Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  placeholder="John"
                  className={errors.firstName ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-rose-500 font-medium">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  placeholder="Doe"
                  className={errors.lastName ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-rose-500 font-medium">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                  placeholder="john@example.com"
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
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&)'
                    }
                  })}
                  placeholder="••••••••"
                  className={`pl-9 ${errors.password ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === passwordVal || 'Passwords do not match',
                  })}
                  placeholder="••••••••"
                  className={`pl-9 ${errors.confirmPassword ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
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
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
