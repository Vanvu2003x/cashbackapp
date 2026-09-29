"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const continueAsGuest = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next === "/link" ? "/" : next || "/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
            if (data.user?.role === "ADMIN") {
              router.push("/admin");
            } else {
              const next = new URLSearchParams(window.location.search).get("next");
              router.push(next || "/");
            }
          }, 1000);
      } else {
        toast.error(data.error || "Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      toast.error("Lỗi kết nối đến Server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.screen}>
      <section className={styles.brand}>
        <Link href="/" className={styles.logo} aria-label="Về trang chủ CashBack Plus">
          <img src="/images/cashbackplus-mark.png" alt="" />
          <span className={styles.wordmark}><strong>CashBack</strong><b>+</b><small>Mua sắm thông minh · Hoàn tiền thật</small></span>
        </Link>
        <button type="button" className={styles.backButton} onClick={continueAsGuest}>
          <ArrowLeft size={18} />
          Xem tiếp
        </button>
      </section>

      <section className={styles.hero}>
        <span className={styles.kicker}><Sparkles size={14} /> Chào mừng trở lại</span>
        <h1><span>Đăng nhập</span> nhận thưởng</h1>
        <p>Theo dõi hoàn tiền, đơn hàng và ưu đãi thành viên của bạn trong một chỗ.</p>
      </section>

      <section className={styles.card} aria-label="Form đăng nhập">
        <form className={styles.form} onSubmit={handleLogin}>
          <label className={styles.field} htmlFor="email">
            <span>Email</span>
            <div className={styles.input}>
              <Mail size={20} />
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
          </label>

          <label className={styles.field} htmlFor="password">
            <span>Mật khẩu</span>
            <div className={styles.input}>
              <LockKeyhole size={20} />
              <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          <div className={styles.row}>
            <label className={styles.check} htmlFor="remember-me">
              <input id="remember-me" name="remember-me" type="checkbox" />
              <span>Nhớ mật khẩu</span>
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); toast("Chức năng đang được phát triển!"); }}>
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" disabled={loading} className={styles.primary}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className={styles.divider}><span>Hoặc tiếp tục với</span></div>

        <button type="button" onClick={() => toast("Chức năng đang được cấu hình với Google!")} className={styles.google}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Đăng nhập bằng Google
        </button>

        <p className={styles.switch}>
          Chưa có tài khoản? <Link href="/register">Tạo tài khoản mới</Link>
        </p>
      </section>
    </main>
  );
}
