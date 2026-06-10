import { NavLink } from "react-router-dom";
import { LayoutDashboard, Inbox, Users, ShieldCheck, ChevronsLeft, ChevronsRight, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { to: "/tickets", label: "Ticket Queue", icon: Inbox, testId: "nav-tickets", badge: 12 },
  { to: "/customers", label: "Customer Directory", icon: Users, testId: "nav-customers" },
  { to: "/security", label: "Security & Audit", icon: ShieldCheck, testId: "nav-security" },
];

const Sidebar = ({ collapsed, onToggle, mobileOpen = false, onCloseMobile }) => {
  return (
    <aside
      data-testid="app-sidebar"
      className={cn(
        // Mobile: fixed slide-in drawer. Desktop (lg+): sticky column.
        "fixed lg:sticky inset-y-0 left-0 top-0 h-screen shrink-0 bg-slate-50/95 lg:bg-slate-50/60 backdrop-blur lg:backdrop-blur-0 border-r border-slate-200/70 flex flex-col z-50",
        "transition-transform duration-300 ease-out lg:transition-[width]",
        // Width: on mobile always full drawer (260px). On desktop toggled.
        collapsed ? "w-[260px] lg:w-[72px]" : "w-[260px] lg:w-[248px]",
        // Slide visibility
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/70">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className={cn("leading-tight", collapsed && "lg:hidden")}>
            <div className="text-sm font-semibold text-slate-900 tracking-tight">CRJ Systems</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Helpdesk</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            data-testid="sidebar-close-mobile"
            onClick={onCloseMobile}
            className="lg:hidden h-7 w-7 grid place-items-center rounded-md text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Desktop collapse toggle */}
          <button
            data-testid="sidebar-toggle"
            onClick={onToggle}
            className="hidden lg:grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <TooltipProvider delayDuration={collapsed ? 60 : 9999}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const link = (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={item.testId}
                onClick={onCloseMobile}
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
                <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
                {item.badge != null && (
                  <span className={cn(
                    "ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold",
                    collapsed && "lg:hidden"
                  )}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
            return collapsed ? (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" className="hidden lg:block">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              link
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="border-t border-slate-200/70 px-3 py-3">
        <div className={cn("rounded-lg bg-white ring-1 ring-slate-200/80 px-3 py-2.5", collapsed && "lg:hidden")}>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            LGPD Compliant
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-snug">
            Data masking, audit trail and key encryption are active.
          </p>
        </div>
        {collapsed && (
          <div className="hidden lg:block h-2 w-2 mx-auto rounded-full bg-emerald-500 animate-pulse-dot" />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
