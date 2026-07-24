import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  useAdminSubscriptions,
  useCreateAdminSubscription,
  useUpdateAdminSubscription,
  useDeleteAdminSubscription
} from '@/hooks/useSubscriptions';
import type { Subscription } from '@/hooks/useSubscriptions';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Clock,
  Tv,
  Music,
  Gamepad2,
  Newspaper,
  Film,
  Loader2,
  AlertTriangle,
  Layers,
  Search
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { parseLocalDateTime } from '@/lib/utils';

export const Route = createFileRoute('/_user/admin/subscriptions')({
  component: AdminSubscriptionsPage,
});

interface SubscriptionFormInput {
  email: string; // Associated user email
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  category: 'GAME' | 'MUSIC' | 'VIDEO_STREAM' | 'NEWS' | 'ENTERTAINMENT';
  expiresAt: string;
}

const CATEGORIES = ['GAME', 'MUSIC', 'VIDEO_STREAM', 'NEWS', 'ENTERTAINMENT'] as const;
const CYCLES = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'] as const;

function AdminSubscriptionsPage() {
  const { data: subscriptions = [], isLoading, isError } = useAdminSubscriptions();
  const { data: users = [] } = useAdminUsers();

  const createMutation = useCreateAdminSubscription();
  const updateMutation = useUpdateAdminSubscription();
  const deleteMutation = useDeleteAdminSubscription();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubscriptionFormInput>();

  const openAddModal = () => {
    setEditingSubscription(null);
    setErrorMsg(null);
    reset({
      email: users[0]?.email || '',
      title: '',
      description: '',
      price: 0,
      imageUrl: '',
      cycle: 'MONTHLY',
      category: 'ENTERTAINMENT',
      expiresAt: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subscription) => {
    setEditingSubscription(sub);
    setErrorMsg(null);
    const parsedDate = parseLocalDateTime(sub.expiresAt);
    const dateOnly = parsedDate ? parsedDate.split('T')[0] : '';
    reset({
      email: '', // Email not needed for editing a specific subscription ID
      title: sub.title,
      description: sub.description,
      price: sub.price,
      imageUrl: sub.imageUrl || '',
      cycle: sub.cycle,
      category: sub.category,
      expiresAt: dateOnly,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: SubscriptionFormInput) => {
    const formattedExpiresAt = `${data.expiresAt}T00:00:00`;
    setErrorMsg(null);
    try {
      if (editingSubscription) {
        await updateMutation.mutateAsync({
          id: editingSubscription.id,
          title: data.title,
          description: data.description,
          price: Number(data.price),
          imageUrl: data.imageUrl,
          cycle: data.cycle,
          category: data.category,
          expiresAt: formattedExpiresAt,
        });
      } else {
        await createMutation.mutateAsync({
          email: data.email,
          title: data.title,
          description: data.description,
          price: Number(data.price),
          imageUrl: data.imageUrl,
          cycle: data.cycle,
          category: data.category,
          expiresAt: formattedExpiresAt,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Subscription save failed', err);
      const serverMessage = err.response?.data?.title || err.response?.data?.message || err.message;
      setErrorMsg(serverMessage || 'An unexpected error occurred while saving the subscription.');
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription? This action is permanent.')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete subscription', err);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'GAME': return <Gamepad2 className="w-4 h-4" />;
      case 'MUSIC': return <Music className="w-4 h-4" />;
      case 'VIDEO_STREAM': return <Tv className="w-4 h-4" />;
      case 'NEWS': return <Newspaper className="w-4 h-4" />;
      case 'ENTERTAINMENT': return <Film className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GAME': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'MUSIC': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'VIDEO_STREAM': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'NEWS': return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
      case 'ENTERTAINMENT': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-border gap-6 text-sm">
        <Link
          to="/admin/users"
          className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/subscriptions"
          className="pb-3 border-b-2 border-indigo-500 font-semibold text-indigo-400"
        >
          Global Subscriptions
        </Link>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          System Subscriptions ({subscriptions.length})
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 bg-background border-border text-sm"
            />
          </div>

          <Button variant="gradient" size="sm" className="gap-1.5" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Create Subscription
          </Button>
        </div>
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
          <h3 className="font-bold text-foreground text-lg">Failed to retrieve subscriptions</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Verify the admin endpoints on the Spring Boot backend.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubscriptions.map((sub) => (
            <Card key={sub.id} className="glass-card border-border flex flex-col justify-between hover:border-indigo-500/25 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className={`p-3 h-12 w-12 rounded-xl flex items-center justify-center border-2 ${getCategoryColor(sub.category)}`}>
                      {getCategoryIcon(sub.category)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground leading-none">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{sub.description || 'No description'}</p>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider mt-2 font-mono">
                        {sub.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400"
                      onClick={() => openEditModal(sub)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-400"
                      onClick={() => handleDeleteSubscription(sub.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Price: <strong className="text-foreground">${sub.price.toFixed(2)}/{sub.cycle.replace('LY', '').toLowerCase()}</strong></span>
                  <span>Expires: <strong className="text-foreground">{new Date(parseLocalDateTime(sub.expiresAt)).toLocaleDateString()}</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                {editingSubscription ? 'Edit Subscription' : 'Create Subscription'}
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
              {/* User Selection (Hidden when editing a subscription directly) */}
              {!editingSubscription && (
                <div className="space-y-1">
                  <Label htmlFor="email">Assign to Member</Label>
                  <select
                    id="email"
                    {...register('email', { required: 'Please select a member' })}
                    className="w-full bg-background border border-border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground h-10"
                  >
                    {users.map(u => (
                      <option key={u.email} value={u.email} className="bg-background text-foreground">
                        {u.firstName} {u.lastName} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Netflix, AWS..."
                  {...register('title', { required: 'Title is required' })}
                  className={errors.title ? 'border-rose-500' : ''}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Billing details..."
                  {...register('description')}
                />
              </div>

              {/* Price & Cycle */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="9.99"
                    {...register('price', { required: 'Price is required' })}
                    className={errors.price ? 'border-rose-500' : ''}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cycle">Cycle</Label>
                  <select
                    id="cycle"
                    {...register('cycle', { required: true })}
                    className="w-full bg-background border border-border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground h-10"
                  >
                    {CYCLES.map(c => <option key={c} value={c} className="bg-background text-foreground">{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Category & Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    {...register('category', { required: true })}
                    className="w-full bg-background border border-border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground h-10"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-background text-foreground">{c.replace('_', ' ')}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="expiresAt">Expiration Date</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    {...register('expiresAt', { required: 'Date is required' })}
                    className={errors.expiresAt ? 'border-rose-500' : ''}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://logo.png"
                  {...register('imageUrl')}
                />
              </div>

              {/* Submit Buttons */}
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
                  {editingSubscription ? 'Save Changes' : 'Assign Subscription'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
