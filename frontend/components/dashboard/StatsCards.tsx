"use client";

import { useEffect, useState } from "react";

export default function StatsCards() {
  const [statsData, setStatsData] = useState({
    totalEarned: 8690000,
    totalOrders: 0
  });

  useEffect(() => {
    fetch("/api/user/vip-status")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStatsData({
            totalEarned: json.data.totalEarned || 0,
            totalOrders: json.data.totalOrders || 0
          });
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      title: "Tổng Tích Lũy Đã Duyệt",
      value: `${statsData.totalEarned.toLocaleString("vi-VN")} ₫`,
      subtext: "Số tiền hoàn đã xác nhận từ Shopee",
      icon: "trending_up",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Đơn Hàng Đã Đã Thành Công",
      value: `${statsData.totalOrders} đơn`,
      subtext: "Số đơn hàng đã hoàn tiền thật",
      icon: "task_alt",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Trạng Thái Hệ Thống",
      value: "Đã Kết Nối",
      subtext: "Tự động đối soát lúc 3:00 AM",
      icon: "verified",
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <>
      {stats.map((item, index) => (
        <div
          key={index}
          className="md:col-span-4 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">{item.title}</span>
            <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{item.value}</h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-slate-400">info</span>
              {item.subtext}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
