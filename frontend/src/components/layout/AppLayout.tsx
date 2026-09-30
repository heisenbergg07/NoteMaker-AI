import type { ReactNode } from "react";

import Sidebar from "./Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
