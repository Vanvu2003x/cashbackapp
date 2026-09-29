"use client";

import { useState } from "react";
import { Menu, X, Bell, User, Sparkles, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopNavBarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function TopNavBar({ onToggleMobileMenu, isMobileMenuOpen }: TopNavBarProps) {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 px-4 md:px-8 py-2.5 flex items-center justify-between shadow-xs">
      {/* Left: Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMobileMenu}
          className="md:hidden h-9 w-9 rounded-xl border-slate-200 text-slate-700"
          title="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 transition-transform hover:scale-105">
            <Percent className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="leading-none flex flex-col">
            <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              AFFILIATE<span className="text-blue-600">HUB</span>
              <Badge variant="default" className="text-[10px] uppercase font-bold py-0.5 px-1.5 bg-indigo-50 text-indigo-700 border-indigo-200">
                PRO v2.0
              </Badge>
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick VIP Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-300/40 rounded-full text-amber-700 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>VIP Level 3 (8%)</span>
        </div>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={() => setHasUnread(false)}
          title="Notification Center"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1.5 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
