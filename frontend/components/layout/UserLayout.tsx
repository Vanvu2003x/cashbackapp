"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./BottomNavigation";
import UserHeader from "./UserHeader";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <div className={`user-shell ${pathname === "/profile" ? "profile-shell" : ""}`}>
    <UserHeader />
    <main className="user-main">{children}</main>
    <BottomNavigation />
  </div>;
}
