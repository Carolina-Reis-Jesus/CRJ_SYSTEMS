import { Search, Bell, LogOut, Command } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Topbar = ({ title, subtitle }) => {
  const { user, logout } = useAuth();

  return (
    <header
      data-testid="app-topbar"
      className="h-16 sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200/70 flex items-center justify-between px-6"
    >
      <div className="min-w-0">
        <h1 data-testid="page-title" className="text-base font-semibold text-slate-900 tracking-tight truncate">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md bg-slate-50 ring-1 ring-slate-200/80 text-sm text-slate-500 w-72">
          <Search className="h-4 w-4" />
          <span className="text-slate-400">Search tickets, customers…</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
            <Command className="h-3 w-3" /> K
          </span>
        </div>

        <button
          data-testid="topbar-notifications"
          className="relative h-9 w-9 grid place-items-center rounded-md ring-1 ring-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button data-testid="topbar-user" className="flex items-center gap-2.5 pl-1 pr-2 h-9 rounded-full ring-1 ring-slate-200/80 hover:bg-slate-50 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">{user?.initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold text-slate-900">{user?.name}</span>
                <span className="text-[10px] text-slate-500">{user?.role}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Role</span>
              <Badge variant="outline" className="text-[10px] font-medium border-indigo-200 bg-indigo-50 text-indigo-700">
                Tier {user?.tier}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="logout-menu-item" onClick={logout} className="text-rose-600 focus:text-rose-700">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
