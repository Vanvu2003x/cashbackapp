"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Package, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [latestConversions, setLatestConversions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(r => r.json())
      .then(res => { if(res.success) setData(res.data); })
      .catch(console.error);
    
    fetch('/api/admin/conversions?limit=5')
      .then(r => r.json())
      .then(res => { if(res.success) setLatestConversions(res.data); })
      .catch(console.error);
  }, []);

  const stats = [
    { title: "Tổng Người Dùng", value: data?.totalUsers || "...", change: "+12.5%", isPositive: true, icon: Users, color: "#3b82f6", bg: "#eff6ff" },
    { title: "Đơn Hàng Hoàn Tiền", value: data?.totalOrders || "...", change: "+24.1%", isPositive: true, icon: ShoppingCart, color: "#10b981", bg: "#ecfdf5" },
    { title: "Tổng Hoa Hồng", value: data ? new Intl.NumberFormat('vi-VN').format(data.totalEarned) + " ₫" : "...", change: "+10.2%", isPositive: true, icon: DollarSign, color: "#f59e0b", bg: "#fffbeb" },
    { title: "Chờ Rút Tiền", value: data ? new Intl.NumberFormat('vi-VN').format(data.pendingWithdrawals) + " ₫" : "...", change: "-2.4%", isPositive: false, icon: TrendingUp, color: "#8b5cf6", bg: "#f5f3ff" },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Tổng quan hệ thống</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Theo dõi hiệu suất và chỉ số của CashBack Pro.</p>
        </div>
        <div>
          <select style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500, color: '#334155' }}>
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.title}
                  </p>
                  <h3 style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
                    {stat.value}
                  </h3>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT ACTIVITY & CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        
        {/* Recent Orders Table */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Giao dịch đối soát mới nhất</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '12px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Mã ĐH</th>
                <th style={{ padding: '12px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Người dùng</th>
                <th style={{ padding: '12px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Giá trị</th>
                <th style={{ padding: '12px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
                {latestConversions.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Chưa có giao dịch nào</td></tr>
                ) : latestConversions.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>#{c.id}</td>
                    <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569' }}>{c.User?.name || "User"}</td>
                    <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{new Intl.NumberFormat('vi-VN').format(c.price || 0)} ₫</td>
                    <td style={{ padding: '16px 24px' }}>
                      {c.status === 'PENDING' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#f59e0b', backgroundColor: '#fffbeb' }}>Chờ đối soát</span>}
                      {(c.status === 'APPROVED' || c.status === 'completed') && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5' }}>Đã duyệt</span>}
                      {c.status === 'REJECTED' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#ef4444', backgroundColor: '#fef2f2' }}>Đã hủy</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>

        {/* Quick Actions / System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Hành động nhanh</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => window.location.href = '/admin/withdrawals'} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><CreditCard size={18} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Duyệt lệnh rút tiền</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Xử lý yêu cầu rút tiền</div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  toast.loading('Đang kích hoạt đồng bộ...');
                  fetch('/api/admin/trigger-sync-reports', { method: 'POST' })
                    .then(r => r.json())
                    .then(res => {
                      toast.dismiss();
                      if(res.success) toast.success(res.message);
                      else toast.error(res.error);
                    });
                }}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><Package size={18} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Đồng bộ đơn Shopee</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Quét đối soát đơn THẬT</div>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
