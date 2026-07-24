import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useNotifications, useClearNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Bell,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Loader2
} from 'lucide-react';

export const Route = createFileRoute('/_user/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [filterType, setFilterType] = useState<'ALL' | 'EXPIRED' | 'NEARING_EXPIRATION'>('ALL');
  const queryParam = filterType === 'ALL' ? undefined : filterType;

  const { data: notifications = [], isLoading, isError, refetch } = useNotifications(queryParam);
  const clearMutation = useClearNotifications();

  const handleClearAll = async () => {
    try {
      await clearMutation.mutateAsync();
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Notification Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">Activity Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay on top of upcoming renewals and expired billing cycles.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleClearAll}
            disabled={clearMutation.isPending}
            className="gap-2 shadow-lg shadow-rose-950/10"
          >
            {clearMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear Feed
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border gap-6 text-sm">
        <button
          onClick={() => setFilterType('ALL')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${filterType === 'ALL' ? 'text-indigo-500 border-indigo-500' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilterType('NEARING_EXPIRATION')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${filterType === 'NEARING_EXPIRATION' ? 'text-amber-500 border-amber-500' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
        >
          Nearing Expiration
        </button>
        <button
          onClick={() => setFilterType('EXPIRED')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${filterType === 'EXPIRED' ? 'text-rose-500 border-rose-500' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
        >
          Expired
        </button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse h-20 border-border" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 border border-rose-500/20 rounded-2xl bg-rose-500/5 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-bold text-foreground text-lg">Failed to retrieve notifications</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Please make sure the backend scheduler or service is active.
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto animate-pulse" />
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-base">You are all caught up!</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              No pending subscription alerts found. We check for updates automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const isExpired = notif.expirationType === 'EXPIRED';
            return (
              <Card
                key={notif.id}
                className={`glass-panel border-l-4 transition-all hover:bg-slate-900/10 ${isExpired ? 'border-l-rose-500 border-border/40' : 'border-l-amber-500 border-border/40'}`}
              >
                <CardContent className="p-5 flex items-start gap-4 justify-between">
                  <div className="flex gap-4">
                    <div className={`mt-0.5 p-2 rounded-xl border flex-shrink-0 ${isExpired ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                      {isExpired ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> System alert
                        </span>
                        <span className="text-slate-600 font-mono text-[9px]">•</span>
                        <Badge
                          className={`text-[9px] font-semibold px-1.5 py-0.5 pointer-events-none rounded ${isExpired ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                        >
                          {notif.expirationType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
