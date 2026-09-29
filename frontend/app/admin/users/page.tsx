"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Edit, Lock, Unlock, Mail, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setUsers(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.id && u.id.toString().includes(search))
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Quản lý Người dùng</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Xem danh sách, phân quyền và quản lý tài khoản thành viên.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: 10, left: 12 }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm user (tên, email, id)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 16px 8px 36px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', width: 280, fontSize: 14 }}
            />
          </div>
          <button style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: '#0f172a', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Thêm User
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>ID / User</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Tổng hoàn (EXP)</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Số dư ví</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Ngày tham gia</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Trạng thái</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>Không tìm thấy người dùng nào</td></tr>
            ) : filteredUsers.map((u, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{u.name || 'Người dùng'}</div>
                      <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>ID: #{u.id}</span> • <span>{u.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                  {new Intl.NumberFormat('vi-VN').format(u.total_earned)} ₫
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>{new Intl.NumberFormat('vi-VN').format(u.available_balance)} ₫</div>
                  <div style={{ fontSize: 12, color: '#f59e0b' }}>Chờ: {new Intl.NumberFormat('vi-VN').format(u.pending_balance)} ₫</div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569' }}>
                  {new Date(u.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5' }}>
                    Hoạt động
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => toast.success('Đang phát triển tính năng sửa')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }} title="Chỉnh sửa">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => toast.error('Đang phát triển tính năng khóa')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, marginLeft: 8 }} title="Khóa tài khoản">
                    <Lock size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
