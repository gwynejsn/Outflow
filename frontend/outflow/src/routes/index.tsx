import { createRoute, Link } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bell,
  Zap,
  TrendingUp,
  CheckCircle2,
  Tv,
  HeartPulse,
  Sun,
  Moon,
  LayoutDashboard,
  Plus
} from 'lucide-react';

import { useTheme } from '#/components/theme-provider';
import { useAuth } from '#/context/AuthContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

function LandingPage() {
  const { theme, setTheme } = useTheme();

  // 1. Get auth state (replace with your app's actual auth hook or state)
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      <Button
        className="flex p-2 m-5"
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Top Hero Section */}
      <section className="relative pt-8 md:pt-16 text-center space-y-8 max-w-4xl mx-auto">
        {/* Glow Accent background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Subscription Management
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          {isAuthenticated ? (
            <>
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {user?.name || 'Subscriber'}
              </span>
            </>
          ) : (
            <>
              Take Complete Control of Your{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Subscription Outflow
              </span>
            </>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {isAuthenticated
            ? "Your subscriptions are active and monitored. Head over to your dashboard to review upcoming renewals or log new expenses."
            : "Never get surprised by unexpected auto-renewals again. Outflow monitors expiration dates, normalizes monthly expenses, and sends automated multi-channel alerts."}
        </p>

        {/* 2. Conditional CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isAuthenticated ? (
            <>
              <Button variant="gradient" size="lg" className="gap-2 text-base font-semibold shadow-xl shadow-indigo-500/25" asChild>
                <Link to="/dashboard" className='flex items-center justify-center gap-2'>
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="gradient" size="lg" className="gap-2 text-base font-semibold shadow-xl shadow-indigo-500/25" asChild>
                <Link to="/auth/register">
                  Get Started Free
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="gap-2 text-base font-medium" asChild>
                <Link to="/auth/login">
                  Sign In to Account
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Feature Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Automated Email Alerts
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> In-App Notification Feed
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400" /> JWT Stateless Security
          </span>
        </div>
      </section>

      {/* Interactive Subscription Cards Demo Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="purple">LIVE DEMO PREVIEW</Badge>
          <h2 className="text-3xl font-extrabold text-foreground">Track Every Service Effortlessly</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            From streaming apps to cloud infrastructure, organize subscriptions by cycle and category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <Card className="glass-card hover:-translate-y-1 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base">Netflix Premium</h4>
                    <Badge variant="blue" className="mt-1">MONTHLY</Badge>
                  </div>
                </div>
                <Badge variant="success">25 days left</Badge>
              </div>
              <p className="text-xs text-muted-foreground">4K Ultra HD streaming plan shared with family.</p>
              <div className="flex justify-between items-baseline pt-2 border-t border-border">
                <span className="text-xl font-bold text-foreground">$19.99<span className="text-xs text-muted-foreground">/mo</span></span>
                <span className="text-xs text-muted-foreground">Renews Aug 15</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="glass-card hover:-translate-y-1 transition-all border-amber-500/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base">Spotify Duo</h4>
                    <Badge variant="purple" className="mt-1">YEARLY</Badge>
                  </div>
                </div>
                <Badge variant="warning" className="animate-pulse">2 days left</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Ad-free music streaming for two accounts.</p>
              <div className="flex justify-between items-baseline pt-2 border-t border-border">
                <span className="text-xl font-bold text-foreground">$149.00<span className="text-xs text-muted-foreground">/yr</span></span>
                <span className="text-xs text-muted-foreground">Renews Jul 23</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="glass-card hover:-translate-y-1 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base">Gym Membership</h4>
                    <Badge variant="default" className="mt-1">MONTHLY</Badge>
                  </div>
                </div>
                <Badge variant="destructive">Expired</Badge>
              </div>
              <p className="text-xs text-muted-foreground">24/7 fitness club access with sauna access.</p>
              <div className="flex justify-between items-baseline pt-2 border-t border-border">
                <span className="text-xl font-bold text-foreground">$45.00<span className="text-xs text-muted-foreground">/mo</span></span>
                <span className="text-xs text-muted-foreground">Expired Jul 18</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400">CORE CAPABILITIES</Badge>
          <h2 className="text-3xl font-extrabold text-foreground">Designed for Clarity & Financial Security</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-panel">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Dual-Channel Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Automated daily scheduled jobs scan for upcoming expirations and dispatch both email warnings and in-app feed updates.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Normalized Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Automatically calculates normalized monthly recurring expenses across daily, weekly, monthly, and yearly cycles.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">
                Fine-grained permissions separate standard user dashboards from administrative user & global subscription controls.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Bottom CTA Banner Customization */}
      <section className="p-10 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-slate-500/10 dark:from-indigo-900/60 dark:via-purple-900/60 dark:to-slate-900/80 border border-indigo-500/20 dark:border-indigo-500/30 text-center space-y-6 max-w-4xl mx-auto shadow-2xl backdrop-blur-2xl">
        <h2 className="text-3xl font-extrabold text-foreground">
          {isAuthenticated ? "Ready to Check Your Analytics?" : "Ready to Stop Subscription Waste?"}
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          {isAuthenticated
            ? "View your normalized monthly spend calculations and track active renewals directly in your portal."
            : "Join Outflow today. Set up your active subscriptions in seconds and start receiving renewal reminders."}
        </p>
        <div className="flex justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <Button variant="gradient" size="lg" className="gap-2" asChild>
              <Link to="/dashboard" className='flex items-center justify-center gap-2'>
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="gradient" size="lg" className="gap-2" asChild>
              <Link to="/auth/register">
                Create Free Account
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
