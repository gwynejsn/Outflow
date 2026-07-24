import { useEffect } from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_user/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate({ to: '/dashboard' });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return null; // Let the parent user layout show the loading spinner
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-bounce">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Access Denied</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You do not have administrative privileges to access this portal. If you think this is a mistake, contact your database manager.
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/dashboard' })}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Tab Header/Navigation */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Controls</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global management portal for users and subscriptions.
          </p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
