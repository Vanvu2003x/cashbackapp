"use client";

import { useEffect, useState } from "react";
import { Star, Award, X, Sparkles, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GamificationCard() {
  const [vipData, setVipData] = useState<{
    currentLevel: number;
    title: string;
    bonusRate: number;
    currentExp: number;
    nextLevel: number | null;
    nextLevelTitle: string | null;
    nextMinExp: number;
    expToNext: number;
    rewardNextCash: number;
    progressPercent: number;
    allVipLevels?: any[];
  } | null>(null);

  const [showLevelsModal, setShowLevelsModal] = useState(false);

  useEffect(() => {
    fetch("/api/user/vip-status")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setVipData(json.data);
        }
      })
      .catch(() => {});
  }, []);

  if (!vipData) {
    return (
      <Card className="border-slate-200/80 min-h-[140px] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  return (
    <>
      <Card
        onClick={() => setShowLevelsModal(true)}
        className="group relative cursor-pointer overflow-hidden border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Star className="h-5 w-5 fill-white" />
            </div>
            <Badge variant="warning" className="group-hover:bg-amber-500 group-hover:text-white transition-colors">
              +{vipData.bonusRate}% HH
            </Badge>
          </div>

          {/* Title & Level */}
          <div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {vipData.title}
              </span>
              <Badge variant="outline" className="text-[10px] font-bold text-amber-700 bg-amber-50 border-amber-200">
                VIP {vipData.currentLevel}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {vipData.currentExp.toLocaleString()} / {vipData.nextMinExp.toLocaleString()} EXP
            </p>
          </div>

          {/* Progress Bar */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${vipData.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Tiến trình lên cấp</span>
              <span className="font-bold text-amber-600">{vipData.progressPercent}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal VIP Table */}
      {showLevelsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-indigo-600" />
                <span>Mức Thưởng Các Cấp VIP</span>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLevelsModal(false)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {(vipData.allVipLevels || []).map((lvl: any) => {
                const isCurrent = lvl.level === vipData.currentLevel;
                return (
                  <div
                    key={lvl.level}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 text-xs transition-all ${
                      isCurrent
                        ? "bg-indigo-50/70 border-indigo-200 font-semibold"
                        : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={isCurrent ? "default" : "secondary"}
                          className="text-[10px] py-0 px-1.5"
                        >
                          VIP {lvl.level}
                        </Badge>
                        <h4 className="font-bold text-slate-900 truncate">{lvl.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {lvl.minExp.toLocaleString("vi-VN")} EXP • Thưởng +{lvl.bonusRatePercent}%
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">Thưởng</span>
                      <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200 block">
                        +{lvl.rewardCash.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setShowLevelsModal(false)}
              className="w-full h-10 text-xs font-bold"
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
