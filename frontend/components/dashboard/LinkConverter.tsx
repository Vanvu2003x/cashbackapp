"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clipboard, Link2, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { resolveUserProduct } from "@/lib/api";

type RecentLink = { url: string; platform: string; createdAt: number };
type ProductData = { affiliateUrl?: string; productName?: string; title?: string; productImage?: string; image?: string | null; price?: string | number | null; rawPrice?: number; estimatedCommission?: string; cashbackText?: string; shopName?: string | null };

const recentKey = "cashback_recent_links";
const getPlatform = (url: string) => url.toLowerCase().includes("tiktok") ? "TikTok Shop" : url.toLowerCase().includes("lazada") ? "Lazada" : "Shopee";
const hasLoginToken = () => typeof window !== "undefined" && Boolean(localStorage.getItem("token") || localStorage.getItem("auth_token"));

export default function LinkConverter({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState("");
  const [recent, setRecent] = useState<RecentLink[]>([]);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ProductData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { try { setRecent(JSON.parse(localStorage.getItem(recentKey) || "[]")); } catch { setRecent([]); } }, []);
  const platform = useMemo(() => inputUrl ? getPlatform(inputUrl) : "Shopee" , [inputUrl]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const url = inputUrl.trim();
    setError(""); setResult(null);
    if (!url) return setError("Dán link sản phẩm để bắt đầu.");
    if (!hasLoginToken()) {
      router.push("/login?next=/link");
      return;
    }
    setChecking(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const json = await resolveUserProduct(url);
      if (!json.success || !json.data?.affiliateUrl) throw new Error("Link chưa sẵn sàng");
      setResult({ ...json.data.product, affiliateUrl: json.data.affiliateUrl });
      const next = [{ url, platform: getPlatform(url), createdAt: Date.now() }, ...recent.filter((item) => item.url !== url)].slice(0, 5);
      setRecent(next); localStorage.setItem(recentKey, JSON.stringify(next));
    } catch (cause) {
      setError(cause instanceof DOMException && cause.name === "AbortError" ? "Shopee phản hồi hơi lâu, bạn thử lại nhé." : "Link này chưa lấy được thông tin. Bạn thử link khác nhé.");
    } finally { window.clearTimeout(timer); setChecking(false); }
  };

  const paste = async () => { try { const value = await navigator.clipboard.readText(); if (value) setInputUrl(value); } catch { setError("Bạn hãy dán link trực tiếp vào ô nhé."); } };
  const clearRecent = () => { setRecent([]); localStorage.removeItem(recentKey); };
  const goCreateLink = () => router.push(hasLoginToken() ? "/link" : "/login?next=/link");

  const compactCopyStyle = compact ? { fontSize: 20, lineHeight: 1.08 } : undefined;
  const compactLeadStyle = compact ? { margin: "7px 0 11px", fontSize: 10, lineHeight: 1.45 } : undefined;
  return <section className={`link-hero ${compact ? "link-hero-compact" : ""}`} id="link-converter" style={compact ? { position: "relative", minHeight: 155, padding: "15px 13px 14px" } : undefined}>
    {compact && <><img className="home-hero-art" style={{ position: "absolute", right: -12, top: 2, width: 142, height: 142, objectFit: "contain", zIndex: 0 }} src="/images/home-hero-generated.png" alt="" aria-hidden="true" /><span className="hero-bubble">Hoàn tiền<br />thật dễ dàng!</span></>}
    <div className="link-hero-copy" style={compact ? { position: "relative", zIndex: 1, maxWidth: "67%" } : undefined}><span className="hero-gradient-title" style={compactCopyStyle}>Dán link</span> <strong style={compactCopyStyle}>nhận thưởng</strong><p style={compactLeadStyle}>Hỗ trợ Shopee và TikTok Shop<br />Mua sắm như bình thường, nhận hoàn tiền tự động!</p></div>
    {compact ? <button type="button" className="gradient-action hero-cta-link" style={{ width: "58%", minHeight: 37, padding: "0 8px", fontSize: 12, gap: 5 }} onClick={goCreateLink}><Link2 size={16} /> Dán link ngay <ArrowRight size={16} /></button> : <form className="link-form" onSubmit={submit}>
      <div className={`link-input-shell ${error ? "has-error" : ""}`}><Link2 size={24} /><input value={inputUrl} onChange={(event) => setInputUrl(event.target.value)} placeholder="Dán link sản phẩm Shopee hoặc TikTok Shop" aria-label="Link sản phẩm" /><button type="button" onClick={() => setInputUrl("")} aria-label="Xóa link" className={inputUrl ? "visible" : "hidden"}><X size={20} /></button><button type="button" className="clipboard-button" onClick={paste} aria-label="Dán link"><Clipboard size={20} /></button></div>
      <button className="gradient-action" disabled={checking} type="submit">{checking ? <LoaderCircle className="spin" size={21} /> : <Link2 size={21} />}{checking ? "Đang lấy thông tin" : "Dán link ngay"}<ArrowRight size={21} /></button>
      {error && <p className="link-error" role="alert">{error}</p>}
    </form>}
    {result && <div className="link-result"><div><Check size={18} /> Đã lấy được thông tin sản phẩm</div><strong>{result.productName || result.title || "Sản phẩm Shopee"}</strong><span>{result.estimatedCommission || result.cashbackText || "Hoàn tiền được tính tự động khi đơn hàng thành công"}</span></div>}
    {!compact && <div className="recent-links"><div className="recent-heading"><h2>Link gần đây</h2>{recent.length > 0 && <button onClick={clearRecent}>Xóa hết</button>}</div>{recent.length === 0 ? <p className="recent-empty">Các link bạn vừa kiểm tra sẽ được lưu trên thiết bị này.</p> : <div className="recent-list">{recent.map((item) => <button key={item.url} onClick={() => setInputUrl(item.url)}><span className={`platform-mark ${item.platform === "TikTok Shop" ? "tiktok" : "shopee"}`}>{item.platform === "TikTok Shop" ? "♪" : "S"}</span><span>{item.url}</span><ArrowRight size={18} /></button>)}</div>}</div>}
    {!compact && <span className="hero-platform-note">Được hỗ trợ: <b>{platform}</b></span>}
  </section>;
}
