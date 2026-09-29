"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import { getUserProducts, UserProduct } from "@/lib/api";

const fallbackItems: UserProduct[] = [{ id: 1, platform: "SHOPEE", platformName: "Shopee", title: "Tai nghe Bluetooth Baseus Bowie E5", name: "Tai nghe Bluetooth Baseus Bowie E5", priceText: "590.000đ", cashbackText: "29.500đ", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }, { id: 2, platform: "SHOPEE", platformName: "Shopee", title: "Toner cấp ẩm Some By Mi 150ml", name: "Toner cấp ẩm Some By Mi 150ml", priceText: "320.000đ", cashbackText: "16.000đ", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }, { id: 3, platform: "SHOPEE", platformName: "Shopee", title: "Giày Nike Air Force 1 Mid '07", name: "Giày Nike Air Force 1 Mid '07", priceText: "2.890.000đ", cashbackText: "144.500đ", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }, { id: 4, platform: "SHOPEE", platformName: "Shopee", title: "Máy xay sinh tố mini", name: "Máy xay sinh tố mini", priceText: "490.000đ", cashbackText: "24.500đ", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80", imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80", canonicalUrl: "#" }];

export default function ProductsPage() {
  const [items, setItems] = useState<UserProduct[]>(fallbackItems);

  useEffect(() => {
    getUserProducts(24).then((res) => {
      if (res.data.length) setItems(res.data);
    }).catch(() => setItems(fallbackItems));
  }, []);

  return <UserLayout><div className="user-page products-page"><div className="page-topline"><div><span className="section-kicker"><ShoppingBag size={15} /> Khám phá</span><h1 className="page-heading">Sản phẩm hoàn tiền</h1><p className="page-lead">Chọn sản phẩm, mua như bình thường và nhận lại tiền.</p></div></div><div className="product-grid products-grid-large">{items.map((item) => <article className="product-card" key={item.id || item.name}><div className="product-photo"><img src={item.image || item.imageUrl || "/images/sp3d.png"} alt={item.name} /><Heart className="product-heart" size={19} /></div><h3>{item.name}</h3><strong>{item.priceText}</strong><div>Hoàn {item.cashbackText} <ArrowRight size={13} /></div></article>)}</div></div></UserLayout>;
}
