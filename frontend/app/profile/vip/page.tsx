"use client";

import { ArrowLeft, ArrowRight, BadgeCheck, Check, Crown, Headphones, Link2, ShoppingBag, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import UserLayout from "@/components/layout/UserLayout";
import { getUserDashboard, type DashboardData } from "@/lib/api";

const money = (value = 0) => new Intl.NumberFormat("vi-VN").format(value) + "đ";
const tiers = [
  { key: "SILVER", label: "VIP Bạc", rate: "+2%", threshold: "0đ", tone: "silver", icon: Crown },
  { key: "GOLD", label: "VIP Vàng", rate: "+4%", threshold: "5.000.000đ", tone: "gold", icon: Crown },
  { key: "DIAMOND", label: "VIP Kim Cương", rate: "+6%", threshold: "15.000.000đ", tone: "diamond", icon: BadgeCheck },
];

export default function VipPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  useEffect(() => { getUserDashboard().then((res) => setDashboard(res.data)).catch(() => undefined); }, []);
  const membership = dashboard?.membership;
  const earned = dashboard?.user.totalEarned || 0;
  const nextExp = membership?.nextExp || 5000000;
  const progress = Math.min(100, nextExp ? (earned / nextExp) * 100 : 100);
  return <UserLayout><div className="user-page vip-page">
    <div className="vip-backline"><a href="/profile"><ArrowLeft size={20} /> Tài khoản</a></div>
    <div className="vip-title"><div><span className="section-kicker"><Crown size={15} /> Thành viên</span><h1><em>VIP</em> thành viên</h1><p>Mua sắm càng nhiều - Hoàn tiền càng cao</p></div></div>
    <section className="vip-hero-banner"><div><b>Cấp VIP cao hơn</b><strong>Nhận hoàn tiền nhiều hơn</strong><p>Tận hưởng đặc quyền thành viên với nhiều ưu đãi hấp dẫn!</p></div><div className="vip-hero-art" aria-hidden="true"><Crown size={74} /></div></section>
    <section className="vip-current-card"><div className="vip-current-icon"><Crown size={38} /></div><div className="vip-current-copy"><span>Cấp độ hiện tại</span><strong>{membership?.label || "VIP Bạc"}</strong><b>Hoàn tiền +{membership?.bonusRate || 2}%</b></div><a href="#benefits">Xem đặc quyền <ArrowRight size={18} /></a></section>
    <section className="vip-progress"><div className="vip-progress-heading"><b>Tiến độ lên hạng tiếp theo</b><strong>Còn {money(Math.max(0, nextExp - earned))}</strong></div><div className="vip-progress-track"><span style={{ width: `${progress}%` }} /></div><div className="vip-progress-meta"><b>{money(earned)}</b><span>/ {money(nextExp)}</span><small>Chi tiêu tích lũy trong 90 ngày</small></div></section>
    <section className="vip-tier-grid">{tiers.map(({ label, rate, threshold, tone, icon: Icon, key }) => <article className={`vip-tier-card ${tone} ${membership?.key === key ? "current" : ""}`} key={key}><span className="vip-tier-icon"><Icon size={32} /></span><strong>{label}</strong><small>Hoàn tiền</small><b>{rate}</b><span>Chi tiêu từ</span><em>{threshold}</em>{membership?.key === key && <mark><Check size={14} /> Cấp hiện tại</mark>}</article>)}</section>
    <section className="vip-benefits" id="benefits"><div className="section-title-row"><h2>Quyền lợi thành viên VIP</h2><a href="#benefits">Xem tất cả <ArrowRight size={16} /></a></div><div className="benefit-grid"><div><span className="benefit-icon pink"><Link2 size={20} /></span><span>Hoàn tiền tăng<br />+2%</span></div><div><span className="benefit-icon orange"><Tag size={20} /></span><span>Ưu đãi độc quyền<br />thành viên</span></div><div><span className="benefit-icon purple"><Users size={20} /></span><span>Tham gia sự kiện<br />VIP</span></div><div><span className="benefit-icon blue"><Headphones size={20} /></span><span>Hỗ trợ ưu tiên<br />24/7</span></div></div></section>
    <section className="vip-gift-strip"><span className="vip-gift-icon"><ShoppingBag size={36} /></span><div><b>Cấp VIP càng cao</b><strong>Hoàn tiền càng nhiều</strong><p>Mỗi cấp độ VIP mang đến tỷ lệ hoàn tiền cao hơn cùng nhiều đặc quyền hấp dẫn.</p></div></section>
  </div></UserLayout>;
}
