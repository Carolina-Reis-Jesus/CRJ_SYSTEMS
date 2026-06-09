import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Operational overview · last 30 days" },
  "/tickets": { title: "Ticket Queue", subtitle: "Live support pipeline" },
  "/customers": { title: "Customer Directory", subtitle: "LGPD-masked customer records" },
  "/security": { title: "Security & Audit", subtitle: "Access controls and compliance trail" },
};

const AppShell = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const meta = TITLES[location.pathname] || { title: "CRJ Systems", subtitle: "" };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
