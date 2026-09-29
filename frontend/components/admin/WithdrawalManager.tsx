"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Clock, Search, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface WithdrawalItem {
  id: string;
  userName: string;
  userPhone: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function WithdrawalManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<WithdrawalItem[]>([
    {
      id: "WD-10029",
      userName: "Nguyễn Văn An",
      userPhone: "0987***321",
      bankName: "MBBank",
      accountNumber: "999988887777",
      amount: 1250000,
      requestDate: "27/08/2026 18:40",
      status: "Pending",
    },
    {
      id: "WD-10028",
      userName: "Trần Thị Bình",
      userPhone: "0912***456",
      bankName: "Vietcombank",
      accountNumber: "1012345678",
      amount: 500000,
      requestDate: "27/08/2026 17:15",
      status: "Pending",
    },
    {
      id: "WD-10027",
      userName: "Phạm Minh Cường",
      userPhone: "0903***789",
      bankName: "Techcombank",
      accountNumber: "190345678901",
      amount: 3400000,
      requestDate: "27/08/2026 14:00",
      status: "Approved",
    },
    {
      id: "WD-10026",
      userName: "Lê Thị Dung",
      userPhone: "0934***112",
      bankName: "VPBank",
      accountNumber: "123456789",
      amount: 800000,
      requestDate: "26/08/2026 21:10",
      status: "Rejected",
    },
  ]);

  const handleAction = (id: string, newStatus: "Approved" | "Rejected") => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-slate-200/80">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            Quản Lý Yêu Cầu Rút Tiền
          </CardTitle>
          <CardDescription>Xử lý chuyển khoản cho người dùng hệ thống</CardDescription>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo tên, ID, NH..."
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
                <th className="p-3.5">Mã Yêu Cầu</th>
                <th className="p-3.5">Người Dùng</th>
                <th className="p-3.5">Ngân Hàng & STK</th>
                <th className="p-3.5">Số Tiền Rút</th>
                <th className="p-3.5">Thời Gian</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{req.id}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-200">{req.userName}</div>
                    <div className="text-[11px] text-slate-400">{req.userPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-blue-600">{req.bankName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{req.accountNumber}</div>
                  </td>
                  <td className="p-3.5 font-black text-slate-900 dark:text-slate-100 text-sm">
                    {req.amount.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-3.5 text-slate-500">{req.requestDate}</td>
                  <td className="p-3.5">
                    {req.status === "Pending" && (
                      <Badge variant="warning" className="gap-1">
                        <Clock className="h-3 w-3" /> Đang chờ
                      </Badge>
                    )}
                    {req.status === "Approved" && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Đã duyệt
                      </Badge>
                    )}
                    {req.status === "Rejected" && (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" /> Từ chối
                      </Badge>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {req.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleAction(req.id, "Approved")}
                          className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 font-bold px-2.5"
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(req.id, "Rejected")}
                          className="h-7 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200 px-2.5"
                        >
                          Từ chối
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">Đã xử lý</span>
                    )}
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
