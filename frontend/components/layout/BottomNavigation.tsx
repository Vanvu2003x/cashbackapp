"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Home, Link2, ShoppingBag, UserRound } from "lucide-react";
import { getUserNotifications } from "@/lib/api";
import styles from "./BottomNavigation.module.css";

const items = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/products", label: "Sản phẩm", icon: ShoppingBag },
  { href: "/link", label: "Dán link", icon: Link2 },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/profile", label: "Tài khoản", icon: UserRound },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getUserNotifications().then((res) => setUnread(res.unreadCount || 0)).catch(() => setUnread(0));
  }, []);

  return <nav className={styles.bar} aria-label="Điều hướng ứng dụng">
    {items.map(({ href, label, icon: Icon }) => {
      const active = pathname === href;
      const primary = href === "/link";
      return <Link key={href} href={href} aria-current={active ? "page" : undefined}
        className={`${styles.item} ${active ? styles.active : ""} ${primary ? styles.primary : ""}`}>
        <span className={styles.icon}><Icon size={primary ? 26 : 23} strokeWidth={active ? 2.3 : 1.8} aria-hidden="true" />{href === "/notifications" && unread > 0 && <i className={styles.badge}>{unread}</i>}</span>
        <span className={styles.label}>{label}</span>
      </Link>;
    })}
  </nav>;
}
