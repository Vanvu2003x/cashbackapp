"use client";

import UserLayout from "@/components/layout/UserLayout";
import LinkConverter from "@/components/dashboard/LinkConverter";

export default function LinkPage() {
  return <UserLayout><div className="user-page link-page"><div className="page-topline"><div><span className="section-kicker">Cashback Pro</span><h1 className="page-heading">Dán link nhận thưởng</h1><p className="page-lead">Dán link sản phẩm để lấy thông tin hoàn tiền tự động.</p></div></div><LinkConverter /></div></UserLayout>;
}
