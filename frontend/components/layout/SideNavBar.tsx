"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Link,
  Wallet,
  History,
  Award,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SideNavBarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function SideNavBar({ mobileOpen = false, onCloseMobile }: SideNavBarProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Tổng Quan", icon: LayoutDashboard },
    { id: "converter", label: "Tạo Link Chiết Khấu", icon: Link, badge: "Hot" },
    { id: "wallet", label: "Ví Tiền & Rút Tiền", icon: Wallet },
    { id: "history", label: "Lịch Sử Đơn Hàng", icon: History },
    { id: "vip", label: "Đặc Quyền VIP", icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-all duration-300 animate-in fade-in-50"
        />
      )}

      {/* Navigation Sidebar */}
      <aside
        className={`fixed md:flex flex-col w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800 p-4 left-0 top-[57px] bottom-0 z-40 space-y-6 transition-transform duration-300 shadow-sm ${
          mobileOpen ? "translate-x-0 flex" : "-translate-x-full md:translate-x-0 hidden"
        }`}
      >
        {/* Navigation Links */}
        <div className="space-y-1.5 flex-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider px-3 mb-3 block">
            Điều Hướng Hệ Thống
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold border border-blue-200/80 dark:border-blue-900/50 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Support Box Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/60 dark:to-slate-800 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Hỗ Trợ 24/7</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Bạn cần hỗ trợ chuyển đổi link hoặc rút tiền hoàn tác?
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white dark:bg-slate-900 hover:bg-blue-50 hover:text-blue-600 font-bold text-xs h-8 border-slate-200 shadow-2xs gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            <span>Chat CSKH</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
