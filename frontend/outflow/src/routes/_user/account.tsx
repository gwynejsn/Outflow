import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, User as UserIcon, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/api/client';

export const Route = createFileRoute('/_user/account')({
  component: AccountPage,
});

interface AccountFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

function AccountPage() {
  const { user, updateUser, token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AccountFormInput>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data: AccountFormInput) => {
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: user?.role, // Preserve existing role
        ...(data.password ? { password: data.password } : {}),
      };

      const response = await apiClient.put('/user/account/update', payload);
      updateUser(response.data);
      setSuccessMsg('Account details updated successfully!');
      reset({
        ...data,
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update account details. Username or email might be taken.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Profile Settings
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">Manage Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your public profile, contact information, and security settings.
        </p>
      </div>

      <Card className="glass-panel border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Profile Information</CardTitle>
          <CardDescription>
            Change your names and email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {successMsg && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm animate-fade-in">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First and Last Name (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
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
                  className={`pl-9 ${errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Security Section Divider */}
            <div className="border-t border-border pt-6 mt-6">
              <h3 className="font-bold text-foreground text-base">Change Password</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Leave these fields blank if you do not want to update your password.
              </p>
            </div>

            {/* Password and Confirm Password (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    {...register('password', {
                      validate: (val) => {
                        if (!val) return true;
                        if (val.length < 8) {
                          return 'Password must be at least 8 characters';
                        }
                        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                        if (!regex.test(val)) {
                          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
                        }
                        return true;
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                      validate: (value) => !passwordVal || value === passwordVal || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    className={`pl-9 ${errors.confirmPassword ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                variant="gradient"
                size="lg"
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto font-semibold min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
