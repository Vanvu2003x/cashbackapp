"use client";

import { ShoppingBag, Video, Tv, Flame, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformCardProps {
  name: string;
  cashback: string;
  icon: React.ElementType;
  iconBg: string;
  badgeVariant?: "shopee" | "tiktok" | "lazada" | "destructive" | "success";
  isNew?: boolean;
  onClick?: () => void;
}

function PlatformCard({
  name,
  cashback,
  icon: Icon,
  iconBg,
  badgeVariant = "success",
  isNew = false,
  onClick,
}: PlatformCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`group relative cursor-pointer border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
        isNew ? "ring-1 ring-rose-400" : ""
      }`}
    >
      {isNew && (
        <div className="absolute top-0 left-0 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-br-lg uppercase tracking-wider shadow-2xs z-10">
          HOT
        </div>
      )}

      <CardContent className="p-4 sm:p-5 flex flex-col justify-between space-y-3">
        {/* Top Row */}
        <div className="flex items-center justify-between pt-1">
          <div className={`w-11 h-11 rounded-2xl ${iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">Hoàn tiền</span>
            <Badge variant={badgeVariant} className="mt-0.5 font-bold">
              {cashback}
            </Badge>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h4>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function EcommercePlatformsGrid() {
  const handlePlatformClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-3 pt-1">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          Sàn Thương Mại Điện Tử
        </h3>
        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          Hoa hồng cao nhất
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <PlatformCard
          name="Shopee"
          cashback="Tới 40%"
          icon={ShoppingBag}
          iconBg="bg-gradient-to-tr from-orange-500 to-amber-500"
          badgeVariant="shopee"
          onClick={handlePlatformClick}
        />

        <PlatformCard
          name="Lazada"
          cashback="Tới 36%"
          icon={ShoppingBag}
          iconBg="bg-gradient-to-tr from-blue-600 to-indigo-600"
          badgeVariant="lazada"
          onClick={handlePlatformClick}
        />

        <PlatformCard
          name="TikTok Shop"
          cashback="5 - 25%"
          icon={Video}
          iconBg="bg-slate-900"
          badgeVariant="tiktok"
          onClick={handlePlatformClick}
        />

        <PlatformCard
          name="Shopee Live"
          cashback="Đặc Quyền"
          icon={Tv}
          iconBg="bg-gradient-to-tr from-rose-500 to-red-600"
          badgeVariant="destructive"
          isNew={true}
          onClick={handlePlatformClick}
        />
      </div>
    </section>
  );
}
