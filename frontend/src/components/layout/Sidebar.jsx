import { NavLink } from "react-router-dom";
import { LayoutDashboard, Inbox, Users, ShieldCheck, ChevronsLeft, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { to: "/tickets", label: "Ticket Queue", icon: Inbox, testId: "nav-tickets", badge: 12 },
  { to: "/customers", label: "Customer Directory", icon: Users, testId: "nav-customers" },
  { to: "/security", label: "Security & Audit", icon: ShieldCheck, testId: "nav-security" },
];

const Sidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      data-testid="app-sidebar"
      className={cn(
        "sticky top-0 h-screen shrink-0 bg-slate-50/60 border-r border-slate-200/70 flex flex-col transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/70">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900 tracking-tight">Nimbus</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Helpdesk</div>
            </div>
          )}
        </div>
        <button
          data-testid="sidebar-toggle"
          onClick={onToggle}
          className="h-7 w-7 grid place-items-center rounded-md text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <TooltipProvider delayDuration={collapsed ? 60 : 9999}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const link = (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={item.testId}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-indigo-600 shadow-[0_1px_0_rgba(15,23,42,0.04)] ring-1 ring-slate-200/80"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge != null && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
            return collapsed ? (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              link
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="border-t border-slate-200/70 px-3 py-3">
        {!collapsed ? (
          <div className="rounded-lg bg-white ring-1 ring-slate-200/80 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              LGPD Compliant
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-snug">
              Data masking, audit trail and key encryption are active.
            </p>
          </div>
        ) : (
          <div className="h-2 w-2 mx-auto rounded-full bg-emerald-500 animate-pulse-dot" />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
