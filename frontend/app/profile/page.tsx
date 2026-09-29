"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bell, Camera, CheckCircle2, Crown, FileText, Headphones, History, LogIn, LogOut, ShieldCheck, UserRound, Users, WalletCards } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import toast from "react-hot-toast";

type User = { id: number; name?: string; email?: string; balance?: number; bankInfo?: string; role?: string; avatarUrl?: string | null };
type Vip = { currentVip: number; nextExp: number | null; bonusRate: number; availableBalance: number; pendingBalance: number; totalEarned: number };
type Referral = { referralCode?: string; totalReferred?: number; totalReferralEarnings?: number };
const money = (value: number | undefined) => new Intl.NumberFormat("vi-VN").format(value || 0) + "đ";
const getToken = () => typeof window === "undefined" ? null : (localStorage.getItem("token") || localStorage.getItem("auth_token"));

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [vip, setVip] = useState<Vip | null>(null);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("user"); let fallback: User = { id: 1 };
    if (stored) { try { fallback = JSON.parse(stored); } catch {} }
    const userId = fallback.id || 1; const currentToken = getToken();
    const headers = currentToken ? { Authorization: "Bearer " + currentToken } : undefined;
    const requests = currentToken ? [
      fetch("/api/auth/me", { headers }).then((r) => r.ok ? r.json() : null),
      fetch("/api/user/vip-status?userId=" + userId).then((r) => r.json()),
      fetch("/api/user/referral-stats?userId=" + userId).then((r) => r.json()),
    ] : [Promise.resolve(null), Promise.resolve({ success: true, data: { currentVip: 0, nextExp: null, bonusRate: 0, availableBalance: 0, pendingBalance: 0, totalEarned: 0 } }), Promise.resolve({ success: true, data: { totalReferred: 0 } })];
    Promise.all(requests).then(([me, vipResponse, referralResponse]) => {
      setIsGuest(!currentToken);
      setUser(me?.user || fallback);
      if (vipResponse?.success) setVip(vipResponse.data);
      if (referralResponse?.success) setReferral(referralResponse.data);
    }).catch(() => toast.error("Không thể tải thông tin tài khoản.")).finally(() => setLoading(false));
  }, []);
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("auth_token"); localStorage.removeItem("user"); window.location.href = "/login"; };
  const displayName = isGuest ? "Tài khoản" : (user?.name || "Người dùng");
  const membershipLabel = vip?.currentVip ? `VIP ${vip.currentVip}` : "Chưa kích hoạt";
  const menuRows = [
    { label: "Thông tin cá nhân", description: "Cập nhật tên, email, số điện thoại", icon: UserRound, tone: "pink", href: "#personal" },
    { label: "Tài khoản nhận thưởng", description: user?.bankInfo || "Liên kết ví, tài khoản ngân hàng", icon: WalletCards, tone: "orange", href: "/wallet" },
    { label: "VIP thành viên", description: "Xem quyền lợi và hạng thành viên", icon: Crown, tone: "silver", href: "/profile/vip" },
    { label: "Thông báo", description: "Quản lý thông báo và ưu đãi", icon: Bell, tone: "blue", href: "/notifications" },
    { label: "Bảo mật", description: "Đổi mật khẩu, xác thực 2 lớp", icon: ShieldCheck, tone: "green", href: "#security" },
    { label: "Hỗ trợ", description: "Trung tâm trợ giúp và liên hệ", icon: Headphones, tone: "purple", href: "#support" },
  ];
  if (isGuest) return <UserLayout><GuestProfile /></UserLayout>;
  return <UserLayout><div className="user-page profile-page">
    <div className="account-hero"><div className="account-head"><div className="account-identity"><div className="account-avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={38} />}<button className="account-camera" aria-label="Đổi ảnh đại diện"><Camera size={17} /></button></div><div><h1>{displayName}</h1><p>{user?.email || "Đăng nhập để đồng bộ tài khoản"}</p></div></div><a href="/profile/vip" className="account-vip-chip"><ShieldCheck size={20} /> <span>{membershipLabel}</span><ArrowRight size={18} /></a></div><div className="account-promo"><CheckCircle2 size={19} /><span>Càng mua sắm, càng nhận nhiều ưu đãi!</span></div><section className="account-stats"><div><span className="account-stat-icon green"><WalletCards size={20} /></span><span>Tổng đã nhận</span><strong>{money(vip?.totalEarned)}</strong></div><div><span className="account-stat-icon orange"><History size={20} /></span><span>Đang chờ</span><strong>{money(vip?.pendingBalance)}</strong></div><div><span className="account-stat-icon purple"><Users size={20} /></span><span>Bạn bè hợp lệ</span><strong>{referral?.totalReferred || 0}</strong></div></section></div>
    {isGuest && <div className="guest-account-notice"><div><strong>Bạn chưa đăng nhập</strong><span>Đăng nhập để lưu thông tin và nhận đầy đủ quyền lợi.</span></div><div className="guest-account-actions"><a href="/login?next=/profile" className="guest-login-action">Đăng nhập</a><a href="/register?next=/profile" className="guest-register-action">Đăng ký</a></div></div>}
    {loading ? <div className="loading-panel">Đang tải thông tin tài khoản...</div> : <div className="profile-grid">
      <div className="profile-main-column">
        <section className="account-menu-card">{menuRows.map(({ label, description, icon: Icon, tone, href }) => <a href={href} className="account-menu-row" key={label}><span className={`account-menu-icon ${tone}`}><Icon size={22} /></span><span><b>{label}</b><small>{description}</small></span><ArrowRight size={20} /></a>)}<button className="account-menu-row account-logout-row" onClick={logout}><span className="account-menu-icon pink"><LogOut size={22} /></span><span><b>Đăng xuất</b><small>Thoát khỏi tài khoản hiện tại</small></span><ArrowRight size={20} /></button></section>
      </div>
    </div>}
  </div></UserLayout>;
}

function GuestProfile() {
  return <div className="user-page profile-page guest-profile-page">
    <section className="guest-account-hero">
      <div className="guest-account-intro">
        <div className="guest-account-art" aria-hidden="true"><UserRound size={64} strokeWidth={1.8} /></div>
        <div className="guest-account-copy">
          <h1>Tài khoản của bạn</h1>
          <p>Đăng nhập để trải nghiệm nhiều tính năng hơn.</p>
        </div>
      </div>
      <a href="/login?next=/profile" className="guest-account-promo"><Crown size={23} /><strong>Càng mua sắm, càng nhận nhiều ưu đãi!</strong><ArrowRight size={20} /></a>
      <section className="guest-account-stats" aria-label="Tổng quan tài khoản">
        <div><span className="guest-stat-icon green"><WalletCards size={24} /></span><span>Tổng đã nhận</span><strong>0đ</strong></div>
        <div><span className="guest-stat-icon orange"><History size={24} /></span><span>Đang chờ</span><strong>0đ</strong></div>
        <div><span className="guest-stat-icon purple"><Users size={24} /></span><span>Bạn bè hợp lệ</span><strong>0</strong></div>
      </section>
    </section>
    <section className="guest-account-cta">
      <div><h2>Bạn chưa đăng nhập</h2><p>Đăng nhập để lưu thông tin và nhận đầy đủ quyền lợi.</p></div>
      <div className="guest-account-actions"><a href="/login?next=/profile" className="guest-login-action"><LogIn size={18} />Đăng nhập</a><a href="/register?next=/profile" className="guest-register-action">Đăng ký</a></div>
    </section>
    <section className="guest-account-history"><div className="guest-history-icon"><FileText size={42} /><span><ArrowRight size={18} /></span></div><p>Đăng nhập để xem lịch sử đơn hàng...</p></section>
  </div>;
}
