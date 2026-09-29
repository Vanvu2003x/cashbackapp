"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronRight, CircleCheck, Gift, ShoppingBag } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import { getUserNotifications, UserNotification } from "@/lib/api";

const fallbackNotifications: UserNotification[] = [{ id: 1, type: "LINK_CREATED", title: "Tạo link thành công!", text: "Bạn đã tạo link nhận thưởng cho Shopee thành công.", body: "Bạn đã tạo link nhận thưởng cho Shopee thành công.", timeText: "5 phút trước", tone: "pink", read: false, createdAt: "" }, { id: 2, type: "ORDER_TRACKED", title: "Đơn hàng đã được ghi nhận", text: "Đơn hàng từ Shopee đã được ghi nhận.", body: "Đơn hàng từ Shopee đã được ghi nhận.", timeText: "30 phút trước", tone: "orange", read: false, createdAt: "" }, { id: 3, type: "CASHBACK_APPROVED", title: "Hoàn tiền đã được duyệt!", text: "Khoản hoàn tiền đã được cộng vào ví của bạn.", body: "Khoản hoàn tiền đã được cộng vào ví của bạn.", timeText: "2 giờ trước", tone: "green", read: true, createdAt: "" }];
const iconByType = { LINK_CREATED: Gift, ORDER_TRACKED: ShoppingBag, CASHBACK_APPROVED: CircleCheck };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>(fallbackNotifications);

  useEffect(() => {
    getUserNotifications().then((res) => {
      if (res.data.length) setNotifications(res.data);
    }).catch(() => setNotifications(fallbackNotifications));
  }, []);

  return <UserLayout><div className="user-page notifications-page"><span className="section-kicker"><Bell size={15} /> Cập nhật</span><h1 className="page-heading">Thông báo</h1><p className="page-lead">Cập nhật mới nhất từ CashBack Pro.</p><div className="notification-list">{notifications.map(({ id, title, text, timeText, type, tone }) => {
    const Icon = iconByType[type as keyof typeof iconByType] || Bell;
    return <article className={`notification-card ${tone}`} key={id}><span className="notification-icon"><Icon size={22} /></span><div><strong>{title}</strong><p>{text}</p><small>{timeText}</small></div><ChevronRight size={19} /></article>;
  })}</div></div></UserLayout>;
}
