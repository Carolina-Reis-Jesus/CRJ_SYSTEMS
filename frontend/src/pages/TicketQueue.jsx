import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ShieldAlert, Lock } from "lucide-react";
import { toast } from "sonner";
import { TICKETS, CUSTOMERS, AGENTS } from "@/lib/mockData";
import { formatRelative } from "@/lib/lgpd";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TicketDetailSheet from "@/components/tickets/TicketDetailSheet";
import { useAuth } from "@/context/AuthContext";

const priorityStyles = {
  High: "bg-rose-50 text-rose-700 border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const statusStyles = {
  Open: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "In Progress": "bg-violet-50 text-violet-700 border-violet-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const TicketQueue = () => {
  const { can } = useAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [selected, setSelected] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const rows = useMemo(() => {
    const enriched = TICKETS.map((t) => ({
      ...t,
      customer: CUSTOMERS.find((c) => c.id === t.customerId),
      agent: AGENTS.find((a) => a.id === t.assignedTo),
    }));
    let r = enriched.filter((t) => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.customer?.company.toLowerCase().includes(q) ||
          t.customer?.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
    const cmp = {
      updated_desc: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      updated_asc: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      priority: (a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]),
    }[sortBy];
    return r.sort(cmp);
  }, [query, statusFilter, priorityFilter, sortBy]);

  const openTicket = (t) => {
    setSelected(t);
    setSheetOpen(true);
  };

  const tryBulkDelete = () => {
    if (!can("delete")) {
      toast.error("Admin rights required", { description: "Your role 'Support Specialist (Tier 2)' cannot delete tickets in bulk." });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Filter toolbar */}
      <div data-testid="ticket-toolbar" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            data-testid="ticket-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticket ID, subject, customer, or company…"
            className="pl-9 h-9 bg-slate-50/60 border-slate-200/70"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="filter-status" className="h-9 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger data-testid="filter-priority" className="h-9 w-[140px] text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger data-testid="filter-sort" className="h-9 w-[170px] text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_desc">Newest first</SelectItem>
              <SelectItem value="updated_asc">Oldest first</SelectItem>
              <SelectItem value="priority">By priority</SelectItem>
            </SelectContent>
          </Select>

          <Button
            data-testid="bulk-delete-button"
            onClick={tryBulkDelete}
            variant="outline"
            size="sm"
            className="h-9 opacity-60 cursor-not-allowed border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Lock className="h-3.5 w-3.5 mr-1.5" /> Bulk delete
          </Button>
        </div>
      </div>

      {/* Table */}
      <div data-testid="ticket-table" className="bg-white rounded-xl ring-1 ring-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/70 border-b border-slate-200/70">
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-slate-500">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr
                  key={t.id}
                  data-testid={`ticket-row-${t.id}`}
                  onClick={() => openTicket(t)}
                  className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums">{t.id}</span>
                      {t.sla.breached && (
                        <span title="SLA breached" className="text-rose-500">
                          <ShieldAlert className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle max-w-[340px]">
                    <span className="text-sm text-slate-900 truncate block">{t.subject}</span>
                    <span className="text-[11px] text-slate-500">{t.category} · {t.channel}</span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <img src={t.customer?.avatar} alt={t.customer?.name} className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200" />
                      <div className="leading-tight">
                        <div className="text-sm text-slate-900">{t.customer?.name}</div>
                        <div className="text-[11px] text-slate-500">{t.customer?.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <Badge variant="outline" className={cn("text-[10px]", priorityStyles[t.priority])}>{t.priority}</Badge>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <Badge variant="outline" className={cn("text-[10px]", statusStyles[t.status])}>{t.status}</Badge>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <img src={t.agent?.avatar} alt={t.agent?.name} className="h-6 w-6 rounded-full object-cover" />
                      <span className="text-sm text-slate-700">{t.agent?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-right text-xs text-slate-500 tabular-nums">{formatRelative(t.updatedAt)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    No tickets match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-200/70 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
          <span data-testid="ticket-count"><span className="font-semibold text-slate-900 tabular-nums">{rows.length}</span> of {TICKETS.length} tickets</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3" /> LGPD masking applied</span>
        </div>
      </div>

      <TicketDetailSheet ticket={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

export default TicketQueue;
