import { useState } from "react";
import { toast } from "sonner";
import { Key, Shield, Trash2, Monitor, LogOut, AlertTriangle, CheckCircle2, Info, Lock } from "lucide-react";
import { AUDIT_EVENTS, ACTIVE_SESSIONS } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/lgpd";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const sevStyles = {
  info: { bg: "bg-slate-50 text-slate-700 border-slate-200", icon: Info },
  warning: { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle },
  critical: { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertTriangle },
};

const SecurityAudit = () => {
  const { can } = useAuth();
  const [apiEncryption, setApiEncryption] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [retention, setRetention] = useState("180d");

  const handleToggle = (label, next, setter) => {
    if (label.includes("encryption") || label.includes("MFA")) {
      if (next === false && !can("delete")) {
        toast.error("Admin rights required", { description: `Disabling ${label} is restricted to admins.` });
        return;
      }
    }
    setter(next);
    toast.success(`${label} ${next ? "enabled" : "disabled"}`, { description: "Change recorded in the audit trail." });
  };

  const revokeSession = (id) => {
    toast.success("Session revoked", { description: `Session ${id} terminated and added to audit log.` });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Compliance summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div data-testid="compliance-card-lgpd" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-medium">LGPD compliance</span>
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight">Compliant</div>
          <p className="mt-1 text-xs text-slate-500">Last audited 12 days ago by external DPO.</p>
        </div>

        <div data-testid="compliance-card-retention" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-medium">Data retention</span>
            <Trash2 className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight">{retention}</div>
          <p className="mt-1 text-xs text-slate-500">Auto-purge runs nightly at 02:00 UTC.</p>
          <div className="mt-3 flex items-center gap-2">
            {["90d", "180d", "365d"].map((opt) => (
              <button
                key={opt}
                data-testid={`retention-${opt}`}
                onClick={() => {
                  setRetention(opt);
                  toast.success(`Retention window set to ${opt}`);
                }}
                className={cn(
                  "h-7 px-2.5 rounded-md text-[11px] font-medium transition-colors",
                  retention === opt ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div data-testid="compliance-card-sessions" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-medium">Active sessions</span>
            <Monitor className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight tabular-nums">{ACTIVE_SESSIONS.length}</div>
          <p className="mt-1 text-xs text-slate-500">Across 2 devices · 2 locations</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div data-testid="security-toggles" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Security controls</h3>
          <p className="text-xs text-slate-500 mt-0.5">System-wide policies. Changes are logged immutably.</p>

          <div className="mt-5 divide-y divide-slate-100">
            <div className="py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-900">API key encryption at rest</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">AES-256-GCM with quarterly key rotation.</p>
              </div>
              <div className="flex items-center gap-2">
                {!can("delete") && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                <Switch
                  data-testid="toggle-api-encryption"
                  checked={apiEncryption}
                  onCheckedChange={(v) => handleToggle("API key encryption", v, setApiEncryption)}
                />
              </div>
            </div>

            <div className="py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-900">Multi-factor authentication</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Required for all support agents. TOTP + WebAuthn supported.</p>
              </div>
              <div className="flex items-center gap-2">
                {!can("delete") && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                <Switch
                  data-testid="toggle-mfa"
                  checked={mfaRequired}
                  onCheckedChange={(v) => handleToggle("MFA enforcement", v, setMfaRequired)}
                />
              </div>
            </div>

            <div className="py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-slate-900">IP allow-listing</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Restrict console access to office network ranges.</p>
              </div>
              <Switch
                data-testid="toggle-ip-allowlist"
                checked={ipAllowlist}
                onCheckedChange={(v) => handleToggle("IP allow-list", v, setIpAllowlist)}
              />
            </div>
          </div>
        </div>

        <div data-testid="active-sessions-list" className="bg-white rounded-xl ring-1 ring-slate-200/70 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Active sessions</h3>
          <p className="text-xs text-slate-500 mt-0.5">Devices currently signed in with your credentials.</p>
          <ul className="mt-5 divide-y divide-slate-100">
            {ACTIVE_SESSIONS.map((s) => (
              <li key={s.id} className="py-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-slate-100 grid place-items-center text-slate-500">
                  <Monitor className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 truncate">{s.device}</span>
                    {s.current && <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">This device</Badge>}
                  </div>
                  <div className="text-xs text-slate-500">{s.location} · {s.ip} · {s.lastActive}</div>
                </div>
                <Button
                  data-testid={`revoke-${s.id}`}
                  size="sm"
                  variant="outline"
                  disabled={s.current}
                  onClick={() => revokeSession(s.id)}
                  className="h-8 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" /> Revoke
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Audit log */}
      <div data-testid="audit-log" className="bg-white rounded-xl ring-1 ring-slate-200/70 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Immutable audit trail</h3>
            <p className="text-xs text-slate-500 mt-0.5">All system and user actions · last 24h</p>
          </div>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Tamper-evident
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/70 border-b border-slate-200/70">
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-slate-500">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_EVENTS.map((e) => {
                const sev = sevStyles[e.severity];
                const SevIcon = sev.icon;
                return (
                  <tr key={e.id} data-testid={`audit-row-${e.id}`} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">{formatRelative(e.at)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{e.actor}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-900">{e.event}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{e.target}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{e.ip}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("text-[10px] inline-flex items-center gap-1", sev.bg)}>
                        <SevIcon className="h-3 w-3" /> {e.severity}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;
