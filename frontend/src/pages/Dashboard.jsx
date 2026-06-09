import { ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, Star, CheckCircle2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { KPIS, TICKET_TRENDS, TICKETS, AGENTS, CUSTOMERS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/lgpd";
import { Badge } from "@/components/ui/badge";

const KpiCard = ({ label, value, suffix, delta, deltaDirection, icon: Icon, accent, footer, testId }) => {
  const positive = deltaDirection === "up";
  return (
    <div data-testid={testId} className="group relative bg-white rounded-xl ring-1 ring-slate-200/70 p-5 hover:ring-slate-300/80 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-medium">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight tabular-nums">{value}</span>
            {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
          </div>
        </div>
        <div className={cn("h-9 w-9 rounded-lg grid place-items-center", accent)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className={cn(
          "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
          positive ? "text-emerald-600" : "text-rose-600"
        )}>
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(delta)}% MoM
        </div>
        <span className="text-[11px] text-slate-400">{footer}</span>
      </div>
    </div>
  );
};

const priorityColors = {
  High: "#e11d48",   // rose-600
  Medium: "#f59e0b", // amber-500
  Low: "#10b981",    // emerald-500
};

const CHART_MARGIN = { top: 8, right: 8, left: -16, bottom: 0 };
const AXIS_TICK = { fontSize: 10, fill: "#64748b" };
const CHART_CURSOR = { stroke: "#cbd5e1", strokeDasharray: "3 3" };

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-white ring-1 ring-slate-200 shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold text-slate-900 mb-1.5">{label}</div>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-600">{p.dataKey}</span>
            <span className="ml-auto font-semibold text-slate-900 tabular-nums">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const recentTickets = TICKETS.slice(0, 5);
  const agentLoad = AGENTS.map((a) => ({
    ...a,
    load: TICKETS.filter((t) => t.assignedTo === a.id && t.status !== "Resolved").length,
  }));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* KPI Row */}
      <div data-testid="dashboard-kpi-row" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          testId="kpi-active-tickets"
          label="Active Tickets"
          value={KPIS.activeTickets.value}
          delta={KPIS.activeTickets.moM}
          deltaDirection={KPIS.activeTickets.direction}
          icon={AlertTriangle}
          accent="bg-rose-50 text-rose-600"
          footer={`${KPIS.activeTickets.breached} breached SLA`}
        />
        <KpiCard
          testId="kpi-first-response"
          label="First Response · avg"
          value={KPIS.firstResponseMin.value}
          suffix="min"
          delta={KPIS.firstResponseMin.moM}
          deltaDirection={KPIS.firstResponseMin.direction}
          icon={Clock}
          accent="bg-indigo-50 text-indigo-600"
          footer="goal · 15.0 min"
        />
        <KpiCard
          testId="kpi-csat"
          label="Customer Satisfaction"
          value={KPIS.csat.value}
          suffix="/ 5.0"
          delta={KPIS.csat.moM}
          deltaDirection={KPIS.csat.direction}
          icon={Star}
          accent="bg-amber-50 text-amber-600"
          footer="1,284 surveys · 30d"
        />
        <KpiCard
          testId="kpi-resolution-rate"
          label="Resolution Rate"
          value={KPIS.resolutionRate.value}
          suffix="%"
          delta={KPIS.resolutionRate.moM}
          deltaDirection={KPIS.resolutionRate.direction}
          icon={CheckCircle2}
          accent="bg-emerald-50 text-emerald-600"
          footer="within SLA window"
        />
      </div>

      {/* Chart + side panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div data-testid="ticket-volume-chart" className="xl:col-span-2 bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Ticket volume by priority</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 14 days · all channels</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {Object.entries(priorityColors).map(([k, c]) => (
                <span key={k} className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TICKET_TRENDS} margin={CHART_MARGIN}>
                <defs>
                  {Object.entries(priorityColors).map(([k, c]) => (
                    <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
                <Area type="monotone" dataKey="Low" stroke={priorityColors.Low} strokeWidth={2} fill="url(#g-Low)" />
                <Area type="monotone" dataKey="Medium" stroke={priorityColors.Medium} strokeWidth={2} fill="url(#g-Medium)" />
                <Area type="monotone" dataKey="High" stroke={priorityColors.High} strokeWidth={2} fill="url(#g-High)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent load */}
        <div data-testid="agent-workload" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Agent workload</h3>
          <p className="text-xs text-slate-500 mt-0.5">Open + In Progress tickets</p>
          <ul className="mt-5 space-y-4">
            {agentLoad.map((a) => {
              const pct = Math.min((a.load / 6) * 100, 100);
              return (
                <li key={a.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <img src={a.avatar} className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200" alt={a.name} />
                      <span className="text-slate-900 font-medium">{a.name}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 text-slate-500">T{a.tier}</Badge>
                    </div>
                    <span className="text-slate-500 tabular-nums">{a.load} open</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        a.load >= 5 ? "bg-rose-500" : a.load >= 3 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Recent activity */}
      <div data-testid="recent-activity" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent ticket activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Most recently updated · top 5</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {recentTickets.map((t) => {
            const c = CUSTOMERS.find((x) => x.id === t.customerId);
            const a = AGENTS.find((x) => x.id === t.assignedTo);
            return (
              <div key={t.id} className="py-3 flex items-center gap-4">
                <span className="font-mono text-[11px] text-slate-500 w-20 tabular-nums">{t.id}</span>
                <span className="text-sm text-slate-900 flex-1 truncate">{t.subject}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] border",
                    t.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-200" :
                    t.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  {t.priority}
                </Badge>
                <span className="text-xs text-slate-500 hidden md:block w-40 truncate">{c?.company}</span>
                <div className="hidden md:flex items-center gap-1.5 w-32">
                  <img src={a?.avatar} className="h-5 w-5 rounded-full object-cover" alt={a?.name} />
                  <span className="text-xs text-slate-600 truncate">{a?.name}</span>
                </div>
                <span className="text-[11px] text-slate-400 w-16 text-right">{formatRelative(t.updatedAt)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
