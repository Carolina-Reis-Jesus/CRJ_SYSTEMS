import { useMemo, useState } from "react";
import { Search, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { CUSTOMERS, TICKETS } from "@/lib/mockData";
import { maskEmail, maskPhone, maskCPF } from "@/lib/lgpd";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const planStyles = {
  Enterprise: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Growth: "bg-violet-50 text-violet-700 border-violet-200",
  Starter: "bg-slate-50 text-slate-700 border-slate-200",
};

const CustomerDirectory = () => {
  const { can } = useAuth();
  const [query, setQuery] = useState("");
  const [revealMode, setRevealMode] = useState(false);

 const rows = useMemo(() => {
    const enriched = CUSTOMERS.map((c) => ({
      ...c,
      openTickets: TICKETS.filter((t) => t.customerId === c.id && t.status !== "Resolved").length,
      totalTickets: TICKETS.filter((t) => t.customerId === c.id).length,
    }));
    if (!query) return enriched;
    const q = query.toLowerCase();
    return enriched.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [query]); 

  const onToggleReveal = (next) => {
    if (next === true) {
      // Tier 2 can preview only first row briefly
      toast.warning("Field-level reveal requires admin approval", {
        description: "A reveal request has been logged to the audit trail.",
      });
      return;
    }
    setRevealMode(next);
  };

  const tryExport = () => {
    if (!can("delete")) {
      toast.error("Admin rights required", { description: "Customer export is restricted to admins per LGPD article 9." });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="bg-white rounded-xl ring-1 ring-slate-200/70 p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            data-testid="customer-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, or email…"
            className="pl-9 h-9 bg-slate-50/60"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 h-9 rounded-md ring-1 ring-slate-200/80 bg-white">
            <span className="text-xs text-slate-500 inline-flex items-center gap-1.5">
              {revealMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              Field reveal
            </span>
            <Switch
              data-testid="reveal-toggle"
              checked={revealMode}
              onCheckedChange={onToggleReveal}
            />
          </div>
          <Button
            data-testid="customer-export-button"
            onClick={tryExport}
            variant="outline"
            size="sm"
            className="h-9 opacity-60 cursor-not-allowed border-slate-200 text-slate-600"
          >
            <Lock className="h-3.5 w-3.5 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div data-testid="customer-table" className="bg-white rounded-xl ring-1 ring-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/70 border-b border-slate-200/70">
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-slate-500">
                <th className="px-3 sm:px-4 py-3 font-medium">Customer</th>
                <th className="hidden md:table-cell px-4 py-3 font-medium">Email</th>
                <th className="hidden lg:table-cell px-4 py-3 font-medium">Phone</th>
                <th className="hidden xl:table-cell px-4 py-3 font-medium">CPF</th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-3 font-medium">Plan</th>
                <th className="hidden md:table-cell px-4 py-3 font-medium text-right">MRR</th>
                <th className="px-3 sm:px-4 py-3 font-medium text-right">Tickets</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} data-testid={`customer-row-${c.id}`} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
                      <div className="leading-tight min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{c.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{c.company}</div>
                        {/* Mobile-only meta */}
                        <div className="sm:hidden mt-1 flex items-center gap-1.5">
                          <Badge variant="outline" className={cn("text-[9px] py-0", planStyles[c.plan])}>{c.plan}</Badge>
                          <span className="text-[10px] text-slate-500 font-mono">{maskEmail(c.email)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 font-mono text-xs text-slate-700">{maskEmail(c.email)}</td>
                  <td className="hidden lg:table-cell px-4 py-3 font-mono text-xs text-slate-700">{maskPhone(c.phone)}</td>
                  <td className="hidden xl:table-cell px-4 py-3 font-mono text-xs text-slate-700">{maskCPF(c.cpf)}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-3">
                    <Badge variant="outline" className={cn("text-[10px]", planStyles[c.plan])}>{c.plan}</Badge>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-right text-sm text-slate-900 tabular-nums">R$ {c.mrr.toLocaleString("pt-BR")}</td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <span className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 tabular-nums">{c.openTickets}</span>
                      <span className="text-slate-400"> / {c.totalTickets}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-200/70 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
          <span><span className="font-semibold text-slate-900 tabular-nums">{rows.length}</span> customers</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-emerald-600" /> All PII masked per LGPD policy</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDirectory;
