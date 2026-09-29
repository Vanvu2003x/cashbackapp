"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu,
  Bell
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { title: "Tổng quan", path: "/admin", icon: LayoutDashboard },
    { title: "Người dùng", path: "/admin/users", icon: Users },
    { title: "Đơn hàng (Conversions)", path: "/admin/conversions", icon: ShoppingCart },
    { title: "Rút tiền", path: "/admin/withdrawals", icon: CreditCard },
    { title: "Cài đặt hệ thống", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ 
        width: sidebarOpen ? 260 : 80, 
        backgroundColor: '#0f172a', 
        color: 'white',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        zIndex: 50
      }}>
        {/* Logo Area */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          padding: sidebarOpen ? '0 24px' : '0',
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#0b1120'
        }}>
          {sidebarOpen ? (
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CASHBACK ADMIN
            </h1>
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(to right, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: sidebarOpen ? '12px 24px' : '12px 0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  backgroundColor: isActive ? '#1e293b' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '4px solid #10b981' : '4px solid transparent',
                  color: isActive ? '#10b981' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  gap: sidebarOpen ? 16 : 0
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
                title={!sidebarOpen ? item.title : undefined}
              >
                <Icon size={20} />
                {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.title}</span>}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#ef4444',
              cursor: 'pointer',
              gap: sidebarOpen ? 12 : 0,
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e21a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            title={!sidebarOpen ? "Đăng xuất" : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 600 }}>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOPBAR */}
        <div style={{ 
          height: 64, 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Menu size={20} />
            </button>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#334155' }}>
              Dashboard Management
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', border: '2px solid white' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>Adminstrator</div>
                <div style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Super Admin</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                A
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
