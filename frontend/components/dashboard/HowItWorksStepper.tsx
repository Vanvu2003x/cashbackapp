"use client";

import React from "react";
import CIcon from "@coreui/icons-react";
import { cilLink, cilCart, cilInbox, cilWallet } from "@coreui/icons";

export default function HowItWorksStepper() {
  const steps = [
    { id: 1, title: "Dán link", icon: cilLink, delayClass: "step-1" },
    { id: 2, title: "Mua ngay", icon: cilCart, delayClass: "step-2" },
    { id: 3, title: "Đặt hàng", icon: cilInbox, delayClass: "step-3" },
    { id: 4, title: "Hoàn tiền", icon: cilWallet, delayClass: "step-4" },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; opacity: 1; }
          25% { width: 33.33%; opacity: 1; }
          50% { width: 66.66%; opacity: 1; }
          75% { width: 100%; opacity: 1; }
          90% { width: 100%; opacity: 1; }
          95% { opacity: 0; width: 100%; }
          100% { width: 0%; opacity: 0; }
        }
        .animate-progress-fill {
          animation: fillProgress 6s linear infinite;
        }

        @keyframes stepActivate1 {
          0%, 95% { background-color: #10b981; color: white; box-shadow: 0 4px 12px rgba(16,185,129,0.35); }
          96%, 100% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
        }
        @keyframes stepActivate2 {
          0%, 24% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
          25%, 95% { background-color: #10b981; color: white; box-shadow: 0 4px 12px rgba(16,185,129,0.35); }
          96%, 100% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
        }
        @keyframes stepActivate3 {
          0%, 49% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
          50%, 95% { background-color: #10b981; color: white; box-shadow: 0 4px 12px rgba(16,185,129,0.35); }
          96%, 100% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
        }
        @keyframes stepActivate4 {
          0%, 74% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
          75%, 95% { background-color: #10b981; color: white; box-shadow: 0 4px 12px rgba(16,185,129,0.35); }
          96%, 100% { background-color: #f1f5f9; color: #94a3b8; box-shadow: none; }
        }

        @keyframes textActivate1 { 0%, 95% { color: #10b981; } 96%, 100% { color: #64748b; } }
        @keyframes textActivate2 { 0%, 24% { color: #64748b; } 25%, 95% { color: #10b981; } 96%, 100% { color: #64748b; } }
        @keyframes textActivate3 { 0%, 49% { color: #64748b; } 50%, 95% { color: #10b981; } 96%, 100% { color: #64748b; } }
        @keyframes textActivate4 { 0%, 74% { color: #64748b; } 75%, 95% { color: #10b981; } 96%, 100% { color: #64748b; } }

        @keyframes pingActivate1 { 0%, 95% { opacity: 0.3; transform: scale(1.3); } 96%, 100% { opacity: 0; transform: scale(1); } }
        @keyframes pingActivate2 { 0%, 24% { opacity: 0; transform: scale(1); } 25%, 95% { opacity: 0.3; transform: scale(1.3); } 96%, 100% { opacity: 0; transform: scale(1); } }
        @keyframes pingActivate3 { 0%, 49% { opacity: 0; transform: scale(1); } 50%, 95% { opacity: 0.3; transform: scale(1.3); } 96%, 100% { opacity: 0; transform: scale(1); } }
        @keyframes pingActivate4 { 0%, 74% { opacity: 0; transform: scale(1); } 75%, 95% { opacity: 0.3; transform: scale(1.3); } 96%, 100% { opacity: 0; transform: scale(1); } }

        .step-bg-1 { animation: stepActivate1 6s linear infinite; }
        .step-bg-2 { animation: stepActivate2 6s linear infinite; }
        .step-bg-3 { animation: stepActivate3 6s linear infinite; }
        .step-bg-4 { animation: stepActivate4 6s linear infinite; }

        .step-text-1 { animation: textActivate1 6s linear infinite; }
        .step-text-2 { animation: textActivate2 6s linear infinite; }
        .step-text-3 { animation: textActivate3 6s linear infinite; }
        .step-text-4 { animation: textActivate4 6s linear infinite; }

        .step-ping-1 { animation: pingActivate1 6s linear infinite alternate; }
        .step-ping-2 { animation: pingActivate2 6s linear infinite alternate; }
        .step-ping-3 { animation: pingActivate3 6s linear infinite alternate; }
        .step-ping-4 { animation: pingActivate4 6s linear infinite alternate; }
        
        .glow-head {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 10px;
          background: white;
          border-radius: 50%;
          filter: blur(4px);
          opacity: 0.8;
        }
      `}</style>
      
      <div style={{ padding: '20px 16px' }}>
        <h4 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
          4 Bước Nhận Hoàn Tiền
        </h4>
        
        {/* Steps container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', padding: '0 8px' }}>
          
          {/* Background Grey Line */}
          <div style={{ position: 'absolute', top: 16, left: 38, right: 38, height: 3, borderRadius: 4, background: '#f1f5f9', zIndex: 0 }} />
          
          {/* Animated Green Line */}
          <div style={{ position: 'absolute', top: 16, left: 38, right: 38, height: 3, borderRadius: 4, zIndex: 0, overflow: 'hidden' }}>
             <div className="animate-progress-fill" style={{ position: 'relative', height: '100%', background: '#10b981', borderRadius: 4, boxShadow: '0 0 8px rgba(16,185,129,0.4)' }}>
                <div className="glow-head" />
             </div>
          </div>
          
          {steps.map((step) => (
            <div key={step.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 60 }}>
              <div
                className={`step-bg-${step.id}`}
                style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
              >
                {/* Ping Ring */}
                <div className={`step-ping-${step.id}`} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #10b981' }} />
                
                <CIcon icon={step.icon} style={{ width: 14, height: 14, position: 'relative', zIndex: 1 }} />
              </div>
              <span
                className={`step-text-${step.id}`}
                style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
