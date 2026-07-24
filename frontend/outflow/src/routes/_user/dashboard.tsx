import { useState, useEffect, useRef } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import gsap from 'gsap';
import { useUserSubscriptions, useCreateUserSubscription, useUpdateUserSubscription, useDeleteUserSubscription } from '@/hooks/useSubscriptions';
import type { Subscription } from '@/hooks/useSubscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Plus,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Tv,
  Music,
  Gamepad2,
  Newspaper,
  Film,
  X,
  Edit2,
  AlertTriangle,
  Loader2,
  Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { parseLocalDateTime } from '@/lib/utils';

export const Route = createFileRoute('/_user/dashboard')({
  component: DashboardPage,
});

interface SubscriptionFormInput {
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

function DashboardPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate({ to: '/admin/users' });
    }
  }, [isAdmin, navigate]);

  const { data: subscriptions = [], isLoading, isError } = useUserSubscriptions();
  const createMutation = useCreateUserSubscription();
  const updateMutation = useUpdateUserSubscription();
  const deleteMutation = useDeleteUserSubscription();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        console.error("Failed to delete subscription:", err);
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCycle, setSelectedCycle] = useState<string>('ALL');

  // GSAP Refs
  const metricsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Metrics summary animation on load completion
  useEffect(() => {
    if (!isLoading && metricsRef.current) {
      gsap.fromTo(metricsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [isLoading]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SubscriptionFormInput>();

  const openAddModal = () => {
    setEditingSubscription(null);
    setErrorMsg(null);
    reset({
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
    // Format LocalDateTime string (YYYY-MM-DDTHH:MM:SS) to (YYYY-MM-DD) for date picker
    const parsedDate = parseLocalDateTime(sub.expiresAt);
    const dateOnly = parsedDate ? parsedDate.split('T')[0] : '';
    reset({
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
    // Append dummy time for backend LocalDateTime (YYYY-MM-DDTHH:MM:SS)
    const formattedExpiresAt = `${data.expiresAt}T00:00:00`;
    setErrorMsg(null);

    try {
      if (editingSubscription) {
        await updateMutation.mutateAsync({
          id: editingSubscription.id,
          ...data,
          price: Number(data.price),
          expiresAt: formattedExpiresAt,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          price: Number(data.price),
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

  // Metric calculation helpers
  const getNormalizedMonthlyCost = (sub: Subscription) => {
    switch (sub.cycle) {
      case 'WEEKLY': return (sub.price * 52) / 12;
      case 'MONTHLY': return sub.price;
      case 'QUARTERLY': return sub.price / 3;
      case 'YEARLY': return sub.price / 12;
      default: return sub.price;
    }
  };

  const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + getNormalizedMonthlyCost(sub), 0);

  const getDaysRemaining = (expiresAtStr: any) => {
    const parsedDate = parseLocalDateTime(expiresAtStr);
    const expireDate = new Date(parsedDate);
    const today = new Date();
    // Zero out times
    expireDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeSubscriptions = subscriptions.filter(sub => getDaysRemaining(sub.expiresAt) >= 0);
  const expiringSoonCount = subscriptions.filter(sub => {
    const days = getDaysRemaining(sub.expiresAt);
    return days >= 0 && days <= 7;
  }).length;

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

  // Search & Filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || sub.category === selectedCategory;
    const matchesCycle = selectedCycle === 'ALL' || sub.cycle === selectedCycle;
    return matchesSearch && matchesCategory && matchesCycle;
  });

  // Subscription card grid animation on items mount/update
  useEffect(() => {
    if (filteredSubscriptions.length > 0 && gridRef.current) {
      gsap.fromTo(gridRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }
      );
    }
  }, [filteredSubscriptions.length]);

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Dashboard Overview
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">Subscription Outflow</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor, organize, and forecast your recurring software and media expenditures.
          </p>
        </div>
        <Button variant="gradient" size="lg" className="gap-2 shadow-lg shadow-indigo-500/10" onClick={openAddModal}>
          <Plus className="w-5 h-5" /> Add Subscription
        </Button>
      </div>

      {/* Metrics Summary Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse h-28 border-border" />
          ))}
        </div>
      ) : (
        <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card border-border shadow-xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Outflow</span>
                <h3 className="text-2xl font-bold text-foreground">${totalMonthlyCost.toFixed(2)}</h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border shadow-xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Services</span>
                <h3 className="text-2xl font-bold text-foreground">{activeSubscriptions.length}</h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
                <DollarSign className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border shadow-xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiring in 7 Days</span>
                <h3 className="text-2xl font-bold text-foreground">{expiringSoonCount}</h3>
              </div>
              <div className={`p-3.5 rounded-2xl border shadow-inner ${expiringSoonCount > 0 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse' : 'bg-muted border-border text-muted-foreground'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border shadow-xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Yearly Outflow</span>
                <h3 className="text-2xl font-bold text-foreground">${(totalMonthlyCost * 12).toFixed(2)}</h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="glass-panel border-border shadow-md">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground font-semibold uppercase">Category:</Label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground font-semibold uppercase">Cycle:</Label>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground"
              >
                <option value="ALL">All Cycles</option>
                {CYCLES.map(cyc => (
                  <option key={cyc} value={cyc}>{cyc}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Cards Listing */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse h-48 border-border" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 space-y-4 border border-rose-500/20 rounded-2xl bg-rose-500/5">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-bold text-foreground text-lg">Failed to load subscriptions</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            We ran into an error communicating with the local API. Verify the Spring Boot application is running on port 8080.
          </p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-bold text-foreground text-lg">No subscriptions found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
            Try tweaking your filters or create a new subscription to get started.
          </p>
          <Button variant="outline" className="mt-4" onClick={openAddModal}>
            Add First Subscription
          </Button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => {
            const daysLeft = getDaysRemaining(sub.expiresAt);
            const isExpired = daysLeft < 0;
            const isNearing = daysLeft >= 0 && daysLeft <= 7;

            return (
              <Card key={sub.id} className="glass-card hover:-translate-y-1 transition-all border-border/50 group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${getCategoryColor(sub.category)}`}>
                          {getCategoryIcon(sub.category)}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-base tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                            {sub.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                            {sub.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Expiration Badge */}
                      {isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : isNearing ? (
                        <Badge variant="warning" className="animate-pulse">
                          {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                        </Badge>
                      ) : (
                        <Badge variant="success">{daysLeft}d left</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {sub.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border/50">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-extrabold text-foreground">
                        ${sub.price.toFixed(2)}
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider ml-1">
                          /{sub.cycle.replace('LY', '').toLowerCase()}
                        </span>
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Expires: {new Date(parseLocalDateTime(sub.expiresAt)).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Panel */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] text-slate-500 italic">
                        Norm. ${getNormalizedMonthlyCost(sub).toFixed(2)}/mo
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400"
                          onClick={() => openEditModal(sub)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
                          onClick={() => handleDelete(sub.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Subscription Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
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
              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Netflix, Spotify, AWS..."
                  {...register('title', { required: 'Title is required' })}
                  className={errors.title ? 'border-rose-500' : ''}
                />
                {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Family sharing plan, Cloud infra..."
                  {...register('description')}
                />
              </div>

              {/* Price & Cycle (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="9.99"
                    {...register('price', { required: 'Price is required', min: 0 })}
                    className={errors.price ? 'border-rose-500' : ''}
                  />
                  {errors.price && <p className="text-xs text-rose-500 font-medium">{errors.price.message}</p>}
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

              {/* Category & Expiration (Grid) */}
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
                  <Label htmlFor="expiresAt">Renewal Date</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    {...register('expiresAt', { required: 'Date is required' })}
                    className={errors.expiresAt ? 'border-rose-500' : ''}
                  />
                  {errors.expiresAt && <p className="text-xs text-rose-500 font-medium">{errors.expiresAt.message}</p>}
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <Label htmlFor="imageUrl">Icon/Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/logo.png"
                  {...register('imageUrl')}
                />
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
                  {editingSubscription ? 'Save Changes' : 'Create Subscription'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
