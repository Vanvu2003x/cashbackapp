"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gauge,
  PieChart,
  Layers,
  FileText,
  Lock,
  Bell,
  Search,
  User,
  Percent,
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  ShieldCheck,
  ChevronRight,
  Home,
  CheckCircle,
  HelpCircle,
  Package,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export default function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-coreui-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-coreui-theme", "light");
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const navSections = [
    {
      title: "",
      items: [
        { id: "overview", label: "Dashboard", icon: Gauge, badge: "NEW", badgeColor: "bg-cyan-500" },
      ],
    },
    {
      title: "UI ELEMENTS",
      items: [
        { id: "charts", label: "Charts & Analytics", icon: PieChart },
        { id: "components", label: "Components & Cards", icon: Layers },
      ],
    },
    {
      title: "SYSTEM & EXTRAS",
      items: [
        { id: "withdrawals", label: "Payout Requests", icon: Package, badge: "12", badgeColor: "bg-rose-500" },
        { id: "users", label: "User Management", icon: User },
        { id: "settings", label: "Platform Rates", icon: Layers },
      ],
    },
  ];

  const currentTabLabel =
    activeTab === "overview"
      ? "Dashboard Overview"
      : activeTab === "withdrawals"
      ? "Payout Requests"
      : activeTab === "users"
      ? "User Management"
      : "Platform Rates & Rules";

  return (
    <div className={`min-h-screen flex antialiased transition-colors duration-200 ${themeMode === "dark" ? "dark bg-[#1d222b] text-slate-100" : "bg-[#ebedef] text-[#212631]"}`}>
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* 1. CoreUI Sidebar - Fixed to Left, Full Height (top-0 bottom-0) */}
      <aside
        style={{ width: sidebarOpen ? "256px" : "80px" }}
        className={`fixed md:flex flex-col bg-[#212631] dark:bg-[#181b21] text-slate-300 left-0 top-0 bottom-0 z-50 space-y-4 transition-all duration-300 shadow-2xl overflow-hidden ${
          mobileOpen ? "translate-x-0 flex" : "-translate-x-full md:translate-x-0 hidden"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-[#1b1f28] dark:bg-[#14161b] border-b border-slate-700/50 h-[60px]">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-md shrink-0">
            C
          </div>
          {sidebarOpen && (
            <div className="leading-none flex flex-col">
              <span className="text-base font-black tracking-wider text-white flex items-center gap-1">
                CORE<span className="text-blue-400">UI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 whitespace-nowrap">
                React Admin Template
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="px-3 space-y-4 flex-1 overflow-y-auto">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {sidebarOpen && sec.title && (
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider px-3 mb-1.5 block">
                  {sec.title}
                </span>
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center ${
                      sidebarOpen ? "justify-between px-3.5" : "justify-center px-2"
                    } py-2.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {sidebarOpen && <span>{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <span className={`text-[9px] font-black text-white px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-blue-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-3 m-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
            <p className="font-bold text-white text-[11px]">CoreUI Free React</p>
            <p className="text-[10px] text-slate-400">Theme: {themeMode.toUpperCase()}</p>
          </div>
        )}
      </aside>

      {/* 2. Main Wrapper - Offset to the right of the Sidebar only on desktop */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 min-h-screen ml-0 w-full ${
          sidebarOpen ? "md:ml-[256px] md:w-[calc(100%-256px)]" : "md:ml-[80px] md:w-[calc(100%-80px)]"
        }`}
      >
        {/* Header - Inside the Wrapper (CoreUI standard) */}
        <header className="sticky top-0 z-40 bg-white dark:bg-[#2a303d] border-b border-[#d8dbe0] dark:border-[#323a49] px-4 md:px-6 h-[60px] flex items-center justify-between shadow-sm">
          {/* Left Toggles & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-9 w-9 text-slate-700 dark:text-slate-200"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex h-9 w-9 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold ml-2">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
              <span className="text-slate-900 dark:text-white font-bold">{currentTabLabel}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center relative">
              <Search className="h-3.5 w-3.5 absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search... (Ctrl /)"
                className="h-8 pl-8 pr-3 text-xs bg-slate-100 dark:bg-[#1d222b] border border-slate-200 dark:border-[#323a49] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 w-48"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={`Switch to ${themeMode === "light" ? "Dark" : "Light"} Mode`}
            >
              {themeMode === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
            </Button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-[#323a49] ml-1">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
