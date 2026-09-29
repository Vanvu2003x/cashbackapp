"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock3, History as HistoryIcon, XCircle } from "lucide-react";
import Link from "next/link";
import UserLayout from "@/components/layout/UserLayout";

type Conversion = { id: string; platform?: string; title?: string; price?: number; cashback?: number; status?: string; created_at?: string };
const money = (value: number | undefined) => new Intl.NumberFormat("vi-VN").format(value || 0) + " ₫";
const date = (value?: string) => value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Chưa có ngày";
const statusInfo = (status?: string) => { const key = (status || "PENDING").toUpperCase(); if (key === "APPROVED" || key === "COMPLETED") return { label: "Đã duyệt", className: "status-approved", icon: CheckCircle2 }; if (key === "REJECTED") return { label: "Từ chối", className: "status-rejected", icon: XCircle }; return { label: "Đang xác nhận", className: "status-pending", icon: Clock3 }; };

export default function HistoryPage() {
  const [items, setItems] = useState<Conversion[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let userId = 1; const stored = localStorage.getItem("user"); if (stored) { try { userId = JSON.parse(stored).id || 1; } catch {} } fetch("/api/user/conversions?userId=" + userId).then((r) => r.json()).then((json) => { if (json.success) setItems(json.data || []); else setError(json.error || "Không thể tải lịch sử."); }).catch(() => setError("Không thể kết nối đến máy chủ.")).finally(() => setLoading(false)); }, []);
  return <UserLayout><div className="user-page"><div className="page-topline"><div><span className="section-kicker"><HistoryIcon size={15} /> Theo dõi mua sắm</span><h1 className="page-heading">Lịch sử đơn hàng</h1><p className="page-lead">Các đơn hàng và khoản hoàn được ghi nhận từ link của bạn.</p></div><Link href="/" className="primary-action page-top-action">Tạo link mới <ArrowUpRight size={16} /></Link></div><section className="history-panel">{loading ? <div className="loading-panel">Đang tải lịch sử đơn hàng...</div> : error ? <div className="inline-message error-message">{error}</div> : items.length === 0 ? <div className="empty-panel page-empty"><div className="empty-icon"><HistoryIcon size={22} /></div><strong>Chưa có đơn hàng nào</strong><span>Hãy tạo link hoàn tiền trước khi đặt hàng.</span></div> : <div className="history-list">{items.map((item) => { const status = statusInfo(item.status); const StatusIcon = status.icon; return <article className="history-item" key={item.id}><div className="history-item-icon"><HistoryIcon size={19} /></div><div className="history-item-main"><div className="history-item-title"><strong>{item.title || "Đơn hàng"}</strong><span className={"status-badge " + status.className}><StatusIcon size={13} /> {status.label}</span></div><span className="muted-line">{item.platform || "Sàn mua sắm"} · {date(item.created_at)}</span></div><div className="history-item-money"><strong>+{money(item.cashback)}</strong><span>Đơn {money(item.price)}</span></div></article>; })}</div>}</section></div></UserLayout>;
}
