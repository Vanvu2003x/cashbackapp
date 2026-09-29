"use client";

import React from "react";
import CIcon from "@coreui/icons-react";
import { cilLightbulb, cilMagnifyingGlass, cilLink, cilCart, cilHistory } from "@coreui/icons";

const stepColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export default function InstructionsCard() {
  const instructions = [
    {
      title: "Tìm sản phẩm",
      icon: cilMagnifyingGlass,
      text: "Tìm sản phẩm hoặc nhà hàng bạn muốn mua trên ứng dụng. Nhấn chia sẻ & chọn sao chép đường dẫn.",
    },
    {
      title: "Chuyển đổi Link",
      icon: cilLink,
      text: 'Mở hệ thống CashBack Pro, dán đường dẫn vừa copy vào ô "Tạo Link Hoàn Tiền" và bấm chuyển link.',
    },
    {
      title: "Đặt hàng thanh toán",
      icon: cilCart,
      text: "Hệ thống tự động mở lại ứng dụng mua sắm (Shopee, TikTok...). Thêm hàng vào giỏ và thanh toán bình thường.",
    },
    {
      title: "Chờ ghi nhận",
      icon: cilHistory,
      text: "Sau khi thanh toán thành công, chờ 1 - 5 ngày để giao dịch được ghi nhận và theo dõi tại lịch sử.",
    },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px' }}>
        <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CIcon icon={cilLightbulb} style={{ width: 16, height: 16, color: '#f59e0b' }} />
          </span>
          Hướng Dẫn Nhận Hoàn Tiền
        </h4>
        <p style={{ margin: '0 0 0 38px', fontSize: 13, color: '#94a3b8', lineHeight: 1.4 }}>
          Chỉ với 4 thao tác đơn giản để được hoàn tiền mỗi ngày.
        </p>
      </div>

      {/* Steps */}
      <div style={{ padding: '4px 16px 20px', position: 'relative' }}>
        {instructions.map((item, index) => {
          const color = stepColors[index];
          const isLast = index === instructions.length - 1;
          return (
            <div key={index} style={{ display: 'flex', gap: 14, position: 'relative' }}>
              {/* Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                {/* Node */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: color + '14', border: `2px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.3s',
                }}>
                  <CIcon icon={item.icon} style={{ width: 14, height: 14, color }} />
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div style={{ width: 2, flex: 1, background: '#f1f5f9', borderRadius: 2, minHeight: 16 }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16, paddingTop: 4 }}>
                <h6 style={{ margin: '0 0 4px', fontSize: 13.5, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.3 }}>
                  <span style={{ color, fontWeight: 900 }}>Bước {index + 1}:</span>
                  {item.title}
                </h6>
                <p style={{ margin: 0, fontSize: 12.5, color: '#64748b', lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
