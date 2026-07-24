import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useAdminUsers, useCreateAdminUser, useUpdateAdminUser, useDeleteAdminUser } from '@/hooks/useAdminUsers';
import type { User } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Shield,
  X,
  Sparkles,
  Loader2,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/_user/admin/users')({
  component: AdminUsersPage,
});

interface UserFormInput {
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

function AdminUsersPage() {
  const { data: users = [], isLoading, isError } = useAdminUsers();
  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormInput>();

  const openAddModal = () => {
    setEditingUser(null);
    setErrorMsg(null);
    reset({
      firstName: '',
      lastName: '',
      email: '',
      role: 'USER',
      password: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setErrorMsg(null);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: UserFormInput) => {
    setErrorMsg(null);
    try {
      if (editingUser) {
        await updateMutation.mutateAsync({
          id: editingUser.id, // ID acts as the key
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          ...(data.password ? { password: data.password } : {}),
        });
      } else {
        await createMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          password: data.password || '',
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save user', err);
      const serverMessage = err.response?.data?.title || err.response?.data?.message || err.message;
      setErrorMsg(serverMessage || 'An unexpected error occurred while saving the user.');
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}? This action is permanent.`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-border gap-6 text-sm">
        <Link
          to="/admin/users"
          className="pb-3 border-b-2 border-indigo-500 font-semibold text-indigo-400"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/subscriptions"
          className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
        >
          Global Subscriptions
        </Link>
      </div>

      {/* Action Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Active Members ({users.length})
        </h2>
        <Button variant="gradient" size="sm" className="gap-1.5" onClick={openAddModal}>
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse h-32 border-border" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 border border-rose-500/20 rounded-2xl bg-rose-500/5 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-bold text-foreground text-lg">Failed to retrieve users list</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Ensure the Spring Boot backend runs locally and you are authorized.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((u) => {
            const isSystemAdmin = u.role === 'ADMIN';
            return (
              <Card key={u.id} className="glass-card border-border hover:border-indigo-500/25 transition-all">
                <CardContent className="p-6 flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className={`p-3 h-12 w-12 rounded-xl flex items-center justify-center border-2 ${isSystemAdmin ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                      {isSystemAdmin ? <Shield className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground leading-none">
                        {u.firstName} {u.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                      
                      <Badge
                        variant={isSystemAdmin ? 'purple' : 'indigo'}
                        className="mt-2 text-[9px] font-mono tracking-wider"
                      >
                        {u.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400"
                      onClick={() => openEditModal(u)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-400"
                      onClick={() => handleDeleteUser(u.id, u.email)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                {editingUser ? 'Edit Member' : 'Add Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs animate-shake">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Save Failed</span>
                    <p className="text-muted-foreground leading-normal">{errorMsg}</p>
                  </div>
                </div>
              )}
              {/* Names (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register('firstName', { required: 'Required' })}
                    className={errors.firstName ? 'border-rose-500' : ''}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register('lastName', { required: 'Required' })}
                    className={errors.lastName ? 'border-rose-500' : ''}
                  />
                </div>
              </div>



              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className={errors.email ? 'border-rose-500' : ''}
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  {...register('role', { required: true })}
                  className="w-full bg-background border border-border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground h-10"
                >
                  <option value="USER" className="bg-background text-foreground">USER</option>
                  <option value="ADMIN" className="bg-background text-foreground">ADMIN</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">
                  {editingUser ? 'New Password (Optional)' : 'Password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: !editingUser ? 'Password is required' : false,
                    validate: (val) => {
                      if (editingUser && !val) return true;
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
                  className={errors.password ? 'border-rose-500' : ''}
                />
                {errors.password && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingUser ? 'Save Settings' : 'Create Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
