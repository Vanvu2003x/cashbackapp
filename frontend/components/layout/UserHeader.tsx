"use client";

import { useEffect, useState } from "react";
import { Bell, Home, Link2, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getUserNotifications } from "@/lib/api";

type CurrentUser = { name?: string; email?: string; role?: string; avatarUrl?: string | null };

const navigation = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/products", label: "Sản phẩm", icon: ShoppingBag },
  { href: "/link", label: "Dán link", icon: Link2 },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/profile", label: "Tài khoản", icon: UserRound },
];

export default function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getUserNotifications().then((res) => setUnread(res.unreadCount || 0)).catch(() => setUnread(0));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    toast.success("Đã đăng xuất");
    router.push("/login");
  };

  return <header className="user-header">
    <button className="brand-button" onClick={() => router.push("/")} aria-label="Về trang chủ CashBack Plus">
      <img className="brand-mark" src="/images/cashbackplus-mark.png" alt="" />
      <span className="brand-wordmark"><strong>CashBack</strong><b>+</b><small>Mua sắm thông minh · Hoàn tiền thật</small></span>
    </button>
    <nav className="desktop-navigation" aria-label="Điều hướng chính">
      {navigation.map(({ href, label }) => <button key={href} className={pathname === href ? "active" : ""} onClick={() => router.push(href)}>{label}</button>)}
    </nav>
    <div className="header-actions">
      <button className="icon-button notification-button" onClick={() => router.push("/notifications")} aria-label="Thông báo">
        <Bell size={18} />
        {unread > 0 && <span className="header-notification-count">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {user ? <div className="profile-menu-wrap">
        <button className="profile-button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-label="Mở tài khoản">
          <span className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : (user.name || user.email || "U").charAt(0).toUpperCase()}</span>
        </button>
        {profileOpen && <div className="profile-menu">
          <div className="profile-menu-heading"><strong>{user.name || "Người dùng"}</strong><span>{user.email}</span></div>
          <button onClick={() => { setProfileOpen(false); router.push("/profile"); }}><UserRound size={16} /> Hồ sơ cá nhân</button>
          <button onClick={logout} className="danger"><LogOut size={16} /> Đăng xuất</button>
        </div>}
      </div> : <button className="profile-button guest-profile" onClick={() => router.push("/login")} aria-label="Đăng nhập"><UserRound size={22} strokeWidth={2} /></button>}
    </div>
  </header>;
}
