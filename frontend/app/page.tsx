"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bell, ChevronRight, Clock3, Crown, Gift, Link2, ShoppingBag, UserRound, WalletCards } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import LinkConverter from "@/components/dashboard/LinkConverter";
import { DashboardData, getUserDashboard, UserProduct } from "@/lib/api";

const fallbackProducts: UserProduct[] = [{ id: 1, platform: "SHOPEE", platformName: "Shopee", title: "Tai nghe Bluetooth Baseus Bowie E5", name: "Tai nghe Bluetooth Baseus Bowie E5", priceText: "590.000đ", cashbackText: "29.500đ", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }, { id: 2, platform: "SHOPEE", platformName: "Shopee", title: "Toner cấp ẩm Some By Mi 150ml", name: "Toner cấp ẩm Some By Mi 150ml", priceText: "320.000đ", cashbackText: "16.000đ", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }, { id: 3, platform: "SHOPEE", platformName: "Shopee", title: "Giày Nike Air Force 1 Mid '07", name: "Giày Nike Air Force 1 Mid '07", priceText: "2.890.000đ", cashbackText: "144.500đ", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }];
const fallbackStats = [{ label: "Đã nhận", valueText: "0đ", icon: WalletCards, tone: "green" }, { label: "Đang chờ", valueText: "0đ", icon: Clock3, tone: "orange" }, { label: "Thành viên thường", valueText: "Chưa kích hoạt", icon: Crown, tone: "gray" }, { label: "Bạn bè hợp lệ", valueText: "0", icon: UserRound, tone: "purple" }];
const statIcon = { received: WalletCards, pending: Clock3, vip: Crown, friends: UserRound };
const shortcuts = [{ label: "Dán link", icon: Link2, href: "#link-converter", tone: "pink" }, { label: "Sản phẩm", icon: ShoppingBag, href: "/products", tone: "orange" }, { label: "Thông báo", icon: Bell, href: "/notifications", tone: "blue" }, { label: "Tài khoản", icon: UserRound, href: "/profile", tone: "purple" }];

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    getUserDashboard().then((res) => setDashboard(res.data)).catch(() => setDashboard(null));
  }, []);

  const stats = dashboard?.stats.map((item) => ({ ...item, icon: statIcon[item.key as keyof typeof statIcon] || WalletCards })) || fallbackStats;
  const products = dashboard?.recentProducts?.length ? dashboard.recentProducts.slice(0, 3) : fallbackProducts;
  const unread = dashboard?.unreadNotifications || 0;

  return <UserLayout><div className="home-v2">
    <LinkConverter compact />
    <div className="platform-cards"><a href="#link-converter" className="platform-card shopee-card"><span className="platform-logo"><img src="/images/shopee-logo.svg" alt="" /></span><span><b>Shopee</b><small>Mua sắm, nhận hoàn tiền</small></span><ChevronRight size={20} /></a><a href="#link-converter" className="platform-card tiktok-card"><span className="platform-logo"><img src="/images/logott3d.png" alt="" /></span><span><b>TikTok Shop</b><small>Mua sắm, nhận hoàn tiền</small></span><ChevronRight size={20} /></a></div>
    <div className="stats-strip">{stats.map(({ label, valueText, icon: Icon, tone }) => <div key={label} className={`stat-cell ${tone}`}><span className={`stat-icon ${tone}`}><Icon size={20} /></span><small>{label}</small><strong>{valueText}</strong></div>)}</div>
    <div className="shortcut-grid">{shortcuts.map(({ label, icon: Icon, href, tone }) => <a href={href} key={label}><span className={`shortcut-icon ${tone}`}><Icon size={22} />{label === "Thông báo" && unread > 0 && <i className="shortcut-badge">{unread}</i>}</span><b>{label}</b></a>)}</div>
    <div className="section-heading"><h2>Sản phẩm gần đây</h2><a href="/products">Xem tất cả <ChevronRight size={17} /></a></div>
    <div className="product-grid">{products.map((product) => <article className="product-card" key={product.id || product.name}><div className="product-photo"><img src={product.image || product.imageUrl || "/images/sp3d.png"} alt={product.name} /><span>{product.platformName === "TikTok Shop" ? "♪" : "S"}</span></div><h3>{product.name}</h3><strong>{product.priceText}</strong><div><Gift size={15} /> Hoàn {product.cashbackText}</div></article>)}</div>
    <div className="invite-strip"><img className="invite-art" src="/images/referral-gift-generated.png" alt="" aria-hidden="true" /><div><b>Mời bạn bè, cùng nhận thưởng</b><span>Mỗi người bạn hoàn thành giao dịch sẽ được tính thưởng</span></div><a href="/profile">Mời ngay <ArrowRight size={14} strokeWidth={2.5} /></a></div>
  </div></UserLayout>;
}
