"use client";

import { useState } from "react";
import { Users, Search, Award, Wallet, ShieldCheck, MoreVertical, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserItem {
  id: string;
  name: string;
  email: string;
  vipLevel: number;
  totalEarnings: number;
  availableBalance: number;
  joinDate: string;
  status: "Active" | "Banned";
}

export default function UserManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "USR-001",
      name: "Nguyễn Văn An",
      email: "an.nguyen@gmail.com",
      vipLevel: 3,
      totalEarnings: 8450000,
      availableBalance: 1250000,
      joinDate: "12/01/2026",
      status: "Active",
    },
    {
      id: "USR-002",
      name: "Trần Thị Bình",
      email: "binh.tran@gmail.com",
      vipLevel: 1,
      totalEarnings: 1200000,
      availableBalance: 500000,
      joinDate: "05/02/2026",
      status: "Active",
    },
    {
      id: "USR-003",
      name: "Phạm Minh Cường",
      email: "cuong.pham@yahoo.com",
      vipLevel: 5,
      totalEarnings: 24500000,
      availableBalance: 3400000,
      joinDate: "10/11/2025",
      status: "Active",
    },
    {
      id: "USR-004",
      name: "Lê Thị Dung",
      email: "dung.le@hotmail.com",
      vipLevel: 2,
      totalEarnings: 3100000,
      availableBalance: 0,
      joinDate: "20/03/2026",
      status: "Banned",
    },
  ]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-slate-200/80">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Quản Lý Thành Viên
          </CardTitle>
          <CardDescription>Theo dõi danh sách người dùng, cấp VIP và số dư hoàn tiền</CardDescription>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm tên, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">ID & Tên Thành Viên</th>
                <th className="p-3.5">Cấp Độ VIP</th>
                <th className="p-3.5">Tổng Hoàn Tích Lũy</th>
                <th className="p-3.5">Số Dư Hiện Tại</th>
                <th className="p-3.5">Ngày Tham Gia</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="warning" className="gap-1 font-bold">
                      <Award className="h-3 w-3" /> VIP {user.vipLevel}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                    {user.totalEarnings.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-3.5 font-black text-blue-600">
                    {user.availableBalance.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-3.5 text-slate-500">{user.joinDate}</td>
                  <td className="p-3.5">
                    {user.status === "Active" ? (
                      <Badge variant="success">Hoạt động</Badge>
                    ) : (
                      <Badge variant="destructive">Khóa</Badge>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(user.id)}
                      className={`h-7 text-[11px] font-bold ${
                        user.status === "Active"
                          ? "text-rose-600 hover:bg-rose-50 border-rose-200"
                          : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      {user.status === "Active" ? "Khóa TK" : "Mở Khóa"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
