"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Info, Filter, ArrowDownRight, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminConversions() {
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchData = () => {
    setLoading(true);
    let url = '/api/admin/conversions?limit=50';
    if (filter !== "ALL") url += "&status=" + filter;
    if (search) url += "&search=" + search;
    
    fetch(url)
      .then(r => r.json())
      .then(res => {
        if (res.success) setConversions(res.data);
        else toast.error("Lỗi lấy dữ liệu đối soát");
      })
      .catch(() => toast.error("Lỗi kết nối"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filter]); // Re-fetch when filter changes

  const handleApprove = async (id: string) => {
    if(!window.confirm(`XÁC NHẬN: Duyệt đơn hàng #${id}? Tiền sẽ được cộng vào Số dư Khả dụng của User.`)) return;
    
    const toastId = toast.loading("Đang xử lý giao dịch...");
    try {
      const res = await fetch('/api/admin/conversions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if(data.success) {
        toast.success(data.message, { id: toastId });
        fetchData(); // reload
      } else {
        toast.error(data.error || "Lỗi duyệt đơn", { id: toastId });
      }
    } catch(err) {
      toast.error("Lỗi kết nối", { id: toastId });
    }
  };

  const handleReject = async (id: string) => {
    if(!window.confirm(`CẢNH BÁO: Hủy đơn hàng #${id}? Đơn sẽ bị đánh dấu hủy và trừ khỏi Số dư chờ của User.`)) return;
    
    const toastId = toast.loading("Đang hủy đơn...");
    try {
      const res = await fetch('/api/admin/conversions/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if(data.success) {
        toast.success(data.message, { id: toastId });
        fetchData(); // reload
      } else {
        toast.error(data.error || "Lỗi hủy đơn", { id: toastId });
      }
    } catch(err) {
      toast.error("Lỗi kết nối", { id: toastId });
    }
  };

  const filtered = search ? conversions.filter(c => c.id.includes(search) || c.title?.includes(search)) : conversions;

  const totalPending = conversions.filter(c => c.status === 'PENDING').reduce((acc, c) => acc + (c.cashback || 0), 0);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Đối soát Đơn hàng</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Duyệt hoa hồng thủ công. Yêu cầu chính xác 100%.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: 10, left: 12 }} />
            <input 
              type="text" 
              placeholder="Tìm mã đơn..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              style={{ padding: '8px 16px 8px 36px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', width: 200, fontSize: 14 }}
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500 }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ đối soát</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Đã hủy</option>
            <option value="completed">Đã hoàn thành (Auto)</option>
          </select>
          <button 
            onClick={() => {
              toast.loading("Đang quét tự động...");
              fetch('/api/admin/trigger-sync-reports', { method: 'POST' })
                .then(r => r.json())
                .then(res => { toast.dismiss(); toast.success(res.message); fetchData(); })
                .catch(() => toast.error("Lỗi đồng bộ"));
            }}
            style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            Đồng bộ từ Shopee
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>TỔNG CHỜ ĐỐI SOÁT (HIỂN THỊ)</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', marginTop: 8 }}>{new Intl.NumberFormat('vi-VN').format(totalPending)} ₫</div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>MÃ ĐƠN & SẢN PHẨM</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>NGƯỜI DÙNG</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>GIÁ TRỊ</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>HOA HỒNG (CASHBACK)</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'center' }}>TRẠNG THÁI</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Không có đơn hàng nào</td></tr>
            ) : filtered.map((c, idx) => (
              <tr key={c.id + idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>#{c.id}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.title || "Đơn hàng Shopee"}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{c.User?.name || `User #${c.user_id}`}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{c.User?.email || ''}</div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: 14, fontWeight: 500, color: '#475569' }}>
                  {new Intl.NumberFormat('vi-VN').format(c.price || 0)} ₫
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>
                    +{new Intl.NumberFormat('vi-VN').format(c.cashback || 0)} ₫
                  </div>
                  <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>Tỷ lệ: {c.rate || "Auto"}</div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {c.status === 'PENDING' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#f59e0b', backgroundColor: '#fffbeb' }}>Chờ đối soát</span>}
                  {(c.status === 'APPROVED' || c.status === 'completed') && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5' }}>Đã duyệt</span>}
                  {c.status === 'REJECTED' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#ef4444', backgroundColor: '#fef2f2' }}>Đã hủy</span>}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {c.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleApprove(c.id)} style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#10b981', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Duyệt đơn (Cộng tiền)">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleReject(c.id)} style={{ background: '#fef2f2', border: '1px solid #ef4444', color: '#ef4444', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Hủy đơn (Đơn hoàn trả/lỗi)">
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Đã xử lý</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
