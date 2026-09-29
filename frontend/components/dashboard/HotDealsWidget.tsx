"use client";

export default function HotDealsWidget() {
  const deals = [
    {
      id: 1,
      title: "Chuột Gaming SIDOTECH W1 RGB Silent",
      platform: "Shopee",
      platformIcon: "shopping_bag",
      price: "163.200 ₫",
      cashback: "24.480 ₫ (15%)",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80",
      link: "https://shopee.vn/product/1106380974/25700894039"
    },
    {
      id: 2,
      title: "Combo Kem Tẩy Lông Ollie Vùng Kín An Toàn",
      platform: "Shopee",
      platformIcon: "shopping_bag",
      price: "145.000 ₫",
      cashback: "29.000 ₫ (20%)",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80",
      link: "https://shopee.vn/product/1479703260/50011861586"
    },
    {
      id: 3,
      title: "Bàn Phím Cơ Không Dây Bluetooth Dual-Mode",
      platform: "TikTok Shop",
      platformIcon: "movie",
      price: "589.000 ₫",
      cashback: "88.350 ₫ (15%)",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80",
      link: "https://tiktok.com"
    }
  ];

  return (
    <div className="md:col-span-12 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-symbols-outlined text-xl font-bold">local_fire_department</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Hot Deals Hoa Hồng Cao Hàng Đầu
            </h3>
            <p className="text-xs text-slate-500">Các sản phẩm đang thưởng chiết khấu khủng trong ngày</p>
          </div>
        </div>

        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 hidden sm:inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">percent</span>
          Chiết khấu tới 20%
        </span>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {deals.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all flex items-center gap-3.5 group cursor-pointer"
            onClick={() => window.open(item.link, "_blank")}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200 bg-white"
            />
            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                {item.title}
              </h4>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-slate-400">{item.platformIcon}</span>
                <span>{item.price}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 block">
                🎁 Hoàn {item.cashback}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
