import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | CashBack Pro",
  description: "Tạo tài khoản CashBack Pro hoàn toàn miễn phí để bắt đầu nhận hoàn tiền Shopee.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
