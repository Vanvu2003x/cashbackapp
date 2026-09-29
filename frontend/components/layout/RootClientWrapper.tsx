"use client";

import { usePathname } from "next/navigation";

export default function RootClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#202020] dark:bg-black">
      <div className="app-frame w-full max-w-[390px] min-h-screen bg-white dark:bg-slate-950 relative shadow-2xl overflow-x-hidden flex flex-col text-slate-900 dark:text-slate-100">
        {children}
      </div>
    </div>
  );
}
