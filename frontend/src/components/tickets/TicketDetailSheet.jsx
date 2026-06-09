import { useState } from "react";
import { toast } from "sonner";
import { Lock, Send, Clock, ShieldAlert, MessageSquare, History, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { CUSTOMERS, AGENTS } from "@/lib/mockData";
import { maskEmail, maskPhone, maskCPF, formatRelative } from "@/lib/lgpd";
import { cn } from "@/lib/utils";

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

const TicketDetailSheet = ({ ticket, open, onOpenChange }) => {
  const { can } = useAuth();
  const [note, setNote] = useState("");
  const [localNotes, setLocalNotes] = useState([]);

  if (!ticket) return null;
  const customer = CUSTOMERS.find((c) => c.id === ticket.customerId);
  const agent = AGENTS.find((a) => a.id === ticket.assignedTo);
  const allNotes = [...(ticket.notes || []), ...localNotes];

  const submitNote = () => {
    if (!note.trim()) {
      toast.error("Cannot post an empty internal note");
      return;
    }
    if (note.trim().length < 5) {
      toast.error("Internal notes must be at least 5 characters");
      return;
    }
    setLocalNotes((n) => [
      ...n,
      { id: `local-${Date.now()}`, author: "Helena Marques", at: new Date().toISOString(), body: note.trim() },
    ]);
    setNote("");
    toast.success("Internal note added", { description: "Visible only to support staff." });
  };

  const tryDelete = () => {
    if (!can("delete")) {
      toast.error("Admin rights required", { description: "Your role 'Support Specialist (Tier 2)' cannot delete tickets." });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-5 border-b border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[11px] text-slate-500">{ticket.id}</span>
            <Badge variant="outline" className={cn("text-[10px]", statusStyles[ticket.status])}>{ticket.status}</Badge>
            <Badge variant="outline" className={cn("text-[10px]", priorityStyles[ticket.priority])}>{ticket.priority} priority</Badge>
            {ticket.sla.breached && (
              <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200 inline-flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> SLA breached
              </Badge>
            )}
          </div>
          <SheetTitle className="text-lg text-slate-900 leading-snug pr-8">{ticket.subject}</SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Opened {formatRelative(ticket.createdAt)} · channel {ticket.channel} · category {ticket.category}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-slate-200/70 bg-slate-50/40">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-2">Customer</p>
            <div className="flex items-center gap-2.5">
              <img src={customer?.avatar} className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200" alt={customer?.name} />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">{customer?.name}</div>
                <div className="text-xs text-slate-500">{customer?.company} · {customer?.plan}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-mono text-slate-700">{maskEmail(customer?.email)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-mono text-slate-700">{maskPhone(customer?.phone)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CPF</span>
                <span className="font-mono text-slate-700">{maskCPF(customer?.cpf)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-2">Assigned to</p>
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9">
                <AvatarImage src={agent?.avatar} alt={agent?.name} />
                <AvatarFallback className="text-[10px]">{agent?.initials}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">{agent?.name}</div>
                <div className="text-xs text-slate-500">Tier {agent?.tier} · Support</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">First reply</span>
                <span className="text-slate-700">14m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">SLA deadline</span>
                <span className={cn("font-medium", ticket.sla.breached ? "text-rose-600" : "text-emerald-600")}>
                  {ticket.sla.breached ? `${Math.abs(ticket.sla.dueIn)}m overdue` : `${ticket.sla.dueIn}m left`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-700">{formatRelative(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <Tabs defaultValue="conversation" className="px-6 py-4">
            <TabsList className="bg-slate-100/70 h-9">
              <TabsTrigger value="conversation" data-testid="tab-conversation" className="text-xs"><MessageSquare className="h-3.5 w-3.5 mr-1.5" />Conversation</TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history" className="text-xs"><History className="h-3.5 w-3.5 mr-1.5" />Audit history</TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes" className="text-xs"><FileText className="h-3.5 w-3.5 mr-1.5" />Internal notes</TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="mt-4">
              <div className="rounded-lg ring-1 ring-slate-200/70 bg-white p-4">
                <div className="flex items-start gap-3">
                  <img src={customer?.avatar} className="h-8 w-8 rounded-full object-cover" alt={customer?.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{customer?.name}</span>
                      <span className="text-[11px] text-slate-400">· {formatRelative(ticket.createdAt)}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-lg ring-1 ring-slate-200/70 bg-white p-4">
                <Textarea
                  data-testid="ticket-reply-textarea"
                  placeholder="Reply to customer…"
                  className="border-0 resize-none focus-visible:ring-0 p-0 min-h-[72px]"
                />
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> End-to-end encrypted · audit logged
                  </div>
                  <Button data-testid="ticket-send-reply" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Send reply
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <ol className="relative border-l border-slate-200 pl-5 space-y-4">
                {ticket.history.map((h) => (
                  <li key={h.id} className="relative">
                    <span className={cn(
                      "absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-2 ring-white",
                      h.actorType === "system" ? "bg-amber-500" :
                      h.actorType === "agent" ? "bg-indigo-500" : "bg-slate-400"
                    )} />
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-1.5 py-0",
                        h.actorType === "system" ? "border-amber-200 bg-amber-50 text-amber-700" :
                        h.actorType === "agent" ? "border-indigo-200 bg-indigo-50 text-indigo-700" :
                        "border-slate-200 bg-slate-50 text-slate-700"
                      )}>{h.actorType}</Badge>
                      <span className="font-medium text-slate-900">{h.actor}</span>
                      <span className="text-slate-400">· {formatRelative(h.at)}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-0.5">{h.action}</p>
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-3">
              <div className="rounded-lg ring-1 ring-slate-200/70 bg-white p-3">
                <Textarea
                  data-testid="ticket-note-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add an internal note (visible to support team only)…"
                  className="border-0 resize-none focus-visible:ring-0 p-0 min-h-[64px] text-sm"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> Internal only
                  </span>
                  <Button data-testid="ticket-note-submit" onClick={submitNote} size="sm" variant="outline">
                    Post note
                  </Button>
                </div>
              </div>

              {allNotes.length === 0 && (
                <p className="text-xs text-slate-500 italic px-1">No internal notes yet. Add the first one above.</p>
              )}
              {allNotes.slice().reverse().map((n) => (
                <div key={n.id} className="rounded-lg ring-1 ring-amber-200/60 bg-amber-50/40 p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-900">{n.author}</span>
                    <span className="text-slate-400">· {formatRelative(n.at)}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{n.body}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-6 py-4 border-t border-slate-200/70 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-500">Auto-saved · all actions are audit-logged</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="ticket-resolve-button">Mark resolved</Button>
            <Button
              data-testid="ticket-delete-button"
              onClick={tryDelete}
              variant="outline"
              size="sm"
              className="opacity-60 cursor-not-allowed border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketDetailSheet;
