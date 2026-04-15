"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // --- LOGIC RẼ NHÁNH QUAN TRỌNG ---
        const userRole = data.user.role;

        if (userRole === "admin" || userRole === "staff") {
          // Nếu là Admin hoặc Nhân viên -> Vào trang quản trị
          window.location.href = "/admin"; 
        } else {
          // Nếu là Khách hàng bình thường -> Vào trang cá nhân
          window.location.href = "/profile";
        }
        
        // Dùng window.location.href thay cho router.push để 
        // đảm bảo Middleware nhận diện Cookie mới ngay lập tức
      } else {
        setError(data.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center" 
      style={{ 
        backgroundColor: "#121212", 
        minHeight: "100vh",
        backgroundImage: "radial-gradient(circle at center, #1a1a1a 0%, #000 100%)" 
      }}
    >
      <div className="card bg-dark border-secondary shadow-lg p-4" style={{ width: "100%", maxWidth: "450px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-warning text-uppercase mb-1" style={{ letterSpacing: '2px' }}>
            Mystic Barber
          </h2>
          <p className="text-secondary small">Đăng nhập để tiếp tục trải nghiệm</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small border-0 text-center mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small">Email đăng nhập</label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary py-2"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small">Mật khẩu</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary py-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-warning w-100 py-2 fw-bold mb-3 shadow"
            style={{ letterSpacing: '1px' }}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : "ĐĂNG NHẬP"}
          </button>

          <div className="text-center mt-3">
            <p className="text-secondary small mb-0">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-warning text-decoration-none fw-bold">
                Đăng ký ngay
              </Link>
            </p>
            <Link href="/" className="text-secondary d-block mt-3 small text-decoration-none hover-warning">
              ← Quay về trang chủ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}