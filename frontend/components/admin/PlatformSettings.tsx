"use client";

import { useState } from "react";
import { Sliders, Save, Percent, ShieldCheck, Check, Building2, Zap, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PlatformSettings() {
  const [shopeeRate, setShopeeRate] = useState("40");
  const [tiktokRate, setTiktokRate] = useState("25");
  const [lazadaRate, setLazadaRate] = useState("36");
  const [minWithdraw, setMinWithdraw] = useState("50000");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Platform Rates Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Sliders className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Cấu Hình Tỷ Lệ Hoàn Tiền Theo Sàn
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Điều chỉnh phần trăm hoàn tiền tối đa hiển thị cho người dùng hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Shopee */}
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-orange-700 dark:text-orange-400">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shopee Affiliate</span>
                </div>
                <Badge variant="shopee">Shopee</Badge>
              </div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">
                Tỷ lệ hoàn tiền tối đa (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={shopeeRate}
                  onChange={(e) => setShopeeRate(e.target.value)}
                  className="bg-white dark:bg-slate-900 font-extrabold text-base pr-8 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
                />
                <Percent className="h-4 w-4 absolute right-3 top-3 text-slate-400" />
              </div>
            </div>

            {/* TikTok Shop */}
            <div className="p-4 rounded-2xl bg-slate-900/10 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900 dark:text-white">
                  <Zap className="h-4 w-4 text-rose-500" />
                  <span>TikTok Shop</span>
                </div>
                <Badge variant="tiktok">TikTok</Badge>
              </div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">
                Tỷ lệ hoàn tiền tối đa (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={tiktokRate}
                  onChange={(e) => setTiktokRate(e.target.value)}
                  className="bg-white dark:bg-slate-900 font-extrabold text-base pr-8 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
                />
                <Percent className="h-4 w-4 absolute right-3 top-3 text-slate-400" />
              </div>
            </div>

            {/* Lazada */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-blue-700 dark:text-blue-400">
                  <Building2 className="h-4 w-4" />
                  <span>Lazada Affiliate</span>
                </div>
                <Badge variant="lazada">Lazada</Badge>
              </div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">
                Tỷ lệ hoàn tiền tối đa (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={lazadaRate}
                  onChange={(e) => setLazadaRate(e.target.value)}
                  className="bg-white dark:bg-slate-900 font-extrabold text-base pr-8 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
                />
                <Percent className="h-4 w-4 absolute right-3 top-3 text-slate-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Limits Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Quy Định Hạn Mức Rút Tiền
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Cài đặt ngưỡng rút tiền tối thiểu cho mỗi lần tạo yêu cầu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Số tiền rút tối thiểu (VNĐ)
            </label>
            <Input
              type="number"
              value={minWithdraw}
              onChange={(e) => setMinWithdraw(e.target.value)}
              className="bg-white dark:bg-slate-900 font-mono text-base text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
            />
          </div>

          <Button type="submit" className="h-11 px-6 text-xs font-bold gap-2">
            {saved ? <Check className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
            <span>{saved ? "Đã Lưu Cấu Hình Thành Công" : "Lưu Thay Đổi Cấu Hình"}</span>
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
