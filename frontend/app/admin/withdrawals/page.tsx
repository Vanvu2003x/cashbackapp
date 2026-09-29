"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, XCircle, Search, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchData = () => {
    setLoading(true);
    let url = '/api/admin/withdrawals?limit=50';
    if (filter !== "ALL") url += "&status=" + filter;
    
    fetch(url)
      .then(r => r.json())
      .then(res => {
        if (res.success) setWithdrawals(res.data);
      })
      .catch(() => toast.error("Lỗi lấy dữ liệu rút tiền"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleApprove = async (id: number) => {
    if(!window.confirm(`XÁC NHẬN: Bạn đã chuyển khoản cho lệnh rút #${id} này?`)) return;
    
    const toastId = toast.loading("Đang duyệt lệnh...");
    try {
      const res = await fetch('/api/admin/withdrawals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if(data.success) {
        toast.success(data.message, { id: toastId });
        fetchData();
      } else toast.error(data.error || "Lỗi", { id: toastId });
    } catch(err) {
      toast.error("Lỗi kết nối", { id: toastId });
    }
  };

  const handleReject = async (id: number) => {
    if(!window.confirm(`CẢNH BÁO: Hủy lệnh rút #${id}? Tiền sẽ được cộng lại vào ví khả dụng của User.`)) return;
    
    const toastId = toast.loading("Đang hủy lệnh...");
    try {
      const res = await fetch('/api/admin/withdrawals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if(data.success) {
        toast.success(data.message, { id: toastId });
        fetchData();
      } else toast.error(data.error || "Lỗi", { id: toastId });
    } catch(err) {
      toast.error("Lỗi kết nối", { id: toastId });
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Quản lý Rút tiền</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Duyệt các yêu cầu rút tiền về tài khoản ngân hàng của User.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500 }}
          >
            <option value="ALL">Tất cả lệnh</option>
            <option value="PENDING">Đang chờ chuyển khoản</option>
            <option value="APPROVED">Đã chuyển thành công</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>MÃ LỆNH</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>NGƯỜI DÙNG</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>THÔNG TIN NGÂN HÀNG</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>SỐ TIỀN RÚT</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'center' }}>TRẠNG THÁI</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Không có yêu cầu rút tiền nào</td></tr>
            ) : withdrawals.map((w, idx) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  #WD-{w.id.toString().padStart(4, '0')}
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>
                    {new Date(w.created_at).toLocaleString('vi-VN')}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{w.User?.name || 'User'}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{w.User?.email}</div>
                  <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 4 }}>Ví khả dụng: {new Intl.NumberFormat('vi-VN').format(w.User?.available_balance || 0)} ₫</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                    {w.bank_info || "Chưa cập nhật thông tin"}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ef4444' }}>
                    {new Intl.NumberFormat('vi-VN').format(w.amount)} ₫
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {w.status === 'PENDING' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#f59e0b', backgroundColor: '#fffbeb' }}>Đang chờ</span>}
                  {w.status === 'APPROVED' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5' }}>Đã chuyển</span>}
                  {w.status === 'REJECTED' && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#ef4444', backgroundColor: '#fef2f2' }}>Đã từ chối</span>}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {w.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleApprove(w.id)} style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#10b981', padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600 }}>
                        <CheckCircle size={16} /> Duyệt
                      </button>
                      <button onClick={() => handleReject(w.id)} style={{ background: '#fef2f2', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600 }}>
                        <XCircle size={16} /> Từ chối
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Không có thao tác</span>
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
