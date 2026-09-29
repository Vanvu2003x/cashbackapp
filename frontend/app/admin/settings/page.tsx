"use client";

import { useState, useEffect } from "react";
import { Settings, Percent, Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    cashback_base_rate: "50",
    min_withdrawal_amount: "50000"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(res => {
        if(res.success) setSettings(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading("Đang lưu cài đặt...");
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if(data.success) {
        toast.success(data.message, { id: toastId });
      } else toast.error(data.error || "Lỗi", { id: toastId });
    } catch(err) {
      toast.error("Lỗi kết nối", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Cài đặt Hệ thống</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Cấu hình tỷ lệ hoa hồng, thanh toán và các thông số kỹ thuật.</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 32, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={20} color="#3b82f6" /> Cấu hình Hoa hồng (Cashback)
        </h2>

        <div style={{ display: 'grid', gap: 24 }}>
          {/* Base Rate */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>
              Tỷ lệ chiết khấu cho Khách (Base Rate)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 200 }}>
                <input 
                  type="number" 
                  value={settings.cashback_base_rate}
                  onChange={e => setSettings({...settings, cashback_base_rate: e.target.value})}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, fontWeight: 600, paddingRight: 40 }}
                />
                <Percent size={18} color="#94a3b8" style={{ position: 'absolute', right: 12, top: 12 }} />
              </div>
              <span style={{ fontSize: 14, color: '#64748b' }}>% trên tổng hoa hồng Shopee trả (VD: Đặt 50% thì hoa hồng gốc 8% khách sẽ nhận 4%)</span>
            </div>
          </div>

          {/* Min Withdrawal */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>
              Hạn mức rút tiền tối thiểu
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 200 }}>
                <input 
                  type="number" 
                  value={settings.min_withdrawal_amount}
                  onChange={e => setSettings({...settings, min_withdrawal_amount: e.target.value})}
                  style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, fontWeight: 600, paddingLeft: 40 }}
                />
                <span style={{ position: 'absolute', left: 12, top: 12, fontWeight: 'bold', color: '#94a3b8' }}>₫</span>
              </div>
              <span style={{ fontSize: 14, color: '#64748b' }}>Số tiền ít nhất để User có thể tạo lệnh rút (Mặc định: 50.000đ)</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{ padding: '12px 24px', borderRadius: 8, backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px -1px rgba(16,185,129,0.2)' }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}
