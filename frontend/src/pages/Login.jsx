import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Sparkles, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Invalid email format");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Signed in · MFA verified");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("helena@nimbus.support");
    setPassword("Tier2!2026");
    toast.message("Demo credentials filled", { description: "Click Sign in to continue." });
  };

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col px-6 py-10 sm:px-12 lg:px-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 tracking-tight">Nimbus</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Helpdesk Console</div>
          </div>
        </div>

        <div className="flex-1 grid place-items-center">
          <div className="w-full max-w-sm animate-fade-in-up">
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Sign in to your console</h1>
            <p className="mt-2 text-sm text-slate-500">
              Tier 2 access with LGPD-grade controls and audit logging.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-slate-700">Work email</Label>
                <Input
                  id="email"
                  data-testid="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-10"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    data-testid="login-password-input"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="h-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle password visibility"
                    data-testid="login-toggle-password"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                data-testid="login-submit-button"
                disabled={loading}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white"
              >
                {loading ? "Verifying…" : (<><span>Sign in</span><ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>

              <button
                type="button"
                onClick={fillDemo}
                data-testid="login-fill-demo"
                className="w-full text-xs text-slate-500 hover:text-slate-900 transition-colors"
              >
                Use demo credentials →
              </button>
            </form>

            <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Protected by MFA, IP allow-listing and full audit trail.
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">© 2026 Nimbus Support, Inc.</div>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:block relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.18]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/95 to-indigo-950/40" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            All systems operational
          </div>

          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-[10px] uppercase tracking-[0.16em] text-slate-300">
              <Lock className="h-3 w-3" /> LGPD · ISO 27001 · SOC 2 Type II
            </div>
            <h2 className="text-4xl font-semibold text-white tracking-tight leading-[1.1]">
              The helpdesk built for teams who treat data like trust.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Field-level masking, immutable audit trail, and granular role policies — designed for B2B SaaS support at scale.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { k: "98.4%", l: "CSAT avg" },
                { k: "14.2m", l: "First reply" },
                { k: "12k+", l: "Tickets/mo" },
              ].map((s) => (
                <div key={s.l} className="rounded-md bg-white/[0.03] ring-1 ring-white/10 px-3 py-3">
                  <div className="text-lg font-semibold text-white tracking-tight">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            &ldquo;Nimbus replaced three tools and gave compliance the audit trail they begged us for.&rdquo;
            <div className="text-slate-400 mt-1">— Daniel Pereira · Head of Support, Atlas Banking</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
