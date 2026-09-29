import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | CashBack Pro",
  description: "Đăng nhập vào hệ thống hoàn tiền CashBack Pro để theo dõi doanh thu và rút tiền.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
