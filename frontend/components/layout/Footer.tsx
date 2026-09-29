import Link from "next/link";
import { ShieldCheck, FileText, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-white tracking-tight">AFFILIATE<span className="text-blue-500">HUB</span></span>
          <span className="text-xs text-slate-400">
            © 2026. Nền tảng hoàn tiền & tiếp thị liên kết thông minh.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-300">
          <Link className="hover:text-blue-400 transition-colors flex items-center gap-1" href="#">
            <ShieldCheck className="h-3.5 w-3.5" />
            Bảo Mật
          </Link>
          <Link className="hover:text-blue-400 transition-colors flex items-center gap-1" href="#">
            <FileText className="h-3.5 w-3.5" />
            Điều Khoản
          </Link>
          <Link className="hover:text-blue-400 transition-colors flex items-center gap-1" href="#">
            <Headphones className="h-3.5 w-3.5" />
            Hỗ Trợ Đối Tác
          </Link>
        </nav>
      </div>
    </footer>
  );
}
