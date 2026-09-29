import type { Metadata } from "next";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import RootClientWrapper from "@/components/layout/RootClientWrapper";

export const metadata: Metadata = {
  title: {
    default: "CashBack Pro - Hoàn tiền mua sắm Shopee lên đến 15%",
    template: "%s | CashBack Pro"
  },
  description: "Nền tảng hoàn tiền (cashback) khi mua sắm trên Shopee, Lazada, TikTok Shop. Dán link nhận ngay hoa hồng cao nhất hệ mặt trời.",
  keywords: ["hoàn tiền shopee", "cashback shopee", "kiếm tiền online", "mã giảm giá shopee", "shopee affiliate", "addlivetag"],
  openGraph: {
    title: "CashBack Pro - Rút gọn link, nhận hoàn tiền cực khủng",
    description: "Nhận lại đến 15% số tiền đã mua sắm trên Shopee, Lazada. Tham gia hệ thống Cashback ngay hôm nay!",
    url: "https://cashbackpro.vn",
    siteName: "CashBack Pro",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CashBack Pro - Hoàn tiền Shopee",
    description: "Hoàn tiền cực nhanh khi mua sắm qua CashBack Pro.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
