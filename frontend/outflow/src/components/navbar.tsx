import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, LogOut, User as UserIcon, ShieldAlert, Sparkles, LayoutDashboard, ShieldCheck, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from '@tanstack/react-router';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('outflow_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('outflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const activeNotificationsCount = notifications?.length || 0;

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Branding Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
              Outflow
            </span>
          </Link>

          {isAuthenticated && isAdmin && (
            <Badge variant="purple" className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px]" asChild>
              <Link to="/admin/users" className='flex items-center justify-center gap-2'>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> ADMIN PORTAL
              </Link>
            </Badge>
          )}
        </div>

        {/* Right Nav Controls */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to={isAdmin ? "/admin/users" : "/dashboard"}>
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  <span>{isAdmin ? "Admin Portal" : "Dashboard"}</span>
                </Button>
              </Link>

              {/* Notifications Bell */}
              {!isAdmin && (
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-800">
                    <Bell className="h-5 w-5 text-slate-300" />
                    {activeNotificationsCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg shadow-rose-500/40 animate-pulse">
                        {activeNotificationsCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-indigo-500" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-400 animate-pulse" />
                )}
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border border-indigo-500/30">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover border border-border text-popover-foreground" align="end" forceMount>
                  <div className="px-3.5 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[11px] leading-none text-muted-foreground mt-0.5">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="w-full flex items-center cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground">
                          <LayoutDashboard className="mr-2 h-4 w-4 text-indigo-500" />
                          <span>My Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="w-full flex items-center cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground">
                          <UserIcon className="mr-2 h-4 w-4 text-purple-500" />
                          <span>Account Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/users" className="w-full flex items-center cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground">
                        <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="gradient" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
