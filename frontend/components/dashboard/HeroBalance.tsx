"use client";

import { useEffect, useState } from "react";
import { Wallet, ArrowUpRight, CheckCircle2, X, Building2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroBalance() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [balance, setBalance] = useState(1250000);

  useEffect(() => {
    fetch("/api/user/vip-status")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.availableBalance !== undefined) {
          setBalance(json.data.availableBalance);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Card
        onClick={() => setShowWithdrawModal(true)}
        className="group relative cursor-pointer overflow-hidden border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wallet className="h-5 w-5" />
            </div>
            <Badge
              variant="success"
              className="group-hover:bg-emerald-600 group-hover:text-white transition-colors gap-1"
            >
              <span>Rút tiền</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Badge>
          </div>

          {/* Amount Value */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {balance.toLocaleString("vi-VN")}
              </span>
              <span className="text-xs font-bold text-blue-600">₫</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Số dư khả dụng</p>
          </div>

          {/* Bottom tip */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sẵn sàng rút
            </span>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                Rút Tiền Về Ngân Hàng
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowWithdrawModal(false)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-center space-y-1">
              <p className="text-xs text-slate-500 font-medium">Số tiền rút khả dụng</p>
              <p className="text-2xl font-black text-blue-600">{balance.toLocaleString("vi-VN")} ₫</p>
            </div>

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Tiền sẽ được chuyển thẳng vào tài khoản ngân hàng liên kết của bạn trong vòng <strong className="text-slate-900">5 phút</strong>.
            </p>

            <Button
              onClick={() => {
                alert("Đã gửi yêu cầu rút tiền thành công!");
                setShowWithdrawModal(false);
              }}
              className="w-full h-11 text-xs font-bold gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Xác Nhận Rút Tiền</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
