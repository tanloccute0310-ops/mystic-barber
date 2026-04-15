'use client'; 
import React, { useState } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp! Vui lòng kiểm tra lại.");
      return; 
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: fullName, 
          phone, 
          email, 
          password 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }
      alert(`Đăng ký thành công!\nChào mừng ${fullName} đến với Mystic Barber! Vui lòng đăng nhập.`);
      router.push(`/login?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121212', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7"> 
            <div className="card border-0 shadow-lg p-4 p-sm-5" style={{ backgroundColor: '#191919', borderRadius: '12px' }}>
              <div className="text-center mb-5">
                <h2 className="fw-bold" style={{ color: '#B8860B', letterSpacing: '1px' }}>TẠO TÀI KHOẢN</h2>
                <p className="text-secondary mt-2">Trở thành thành viên của Mystic Barber để nhận nhiều ưu đãi</p>
              </div>

              {/* Hiển thị lỗi nếu có */}
              {error && <div className="alert alert-danger py-2 mb-4 text-center">{error}</div>}

              <form onSubmit={handleRegister}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-light">Họ và Tên *</label>
                    <input 
                      type="text" 
                      className="form-control bg-dark text-light border-secondary py-2" 
                      placeholder="VD: Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      className="form-control bg-dark text-light border-secondary py-2" 
                      placeholder="VD: 0909 123 456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-light">Email *</label>
                  <input 
                    type="email" 
                    className="form-control bg-dark text-light border-secondary py-2" 
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-light">Mật khẩu *</label>
                    <input 
                      type="password" 
                      className="form-control bg-dark text-light border-secondary py-2" 
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-light">Xác nhận mật khẩu *</label>
                    <input 
                      type="password" 
                      className="form-control bg-dark text-light border-secondary py-2" 
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-100 py-3 fw-bold mb-4 fs-5" 
                  style={{ backgroundColor: '#B8860B', color: '#121212' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
                </button>
                
                <div className="text-center text-secondary">
                  Đã có tài khoản? <Link href="/login" className="fw-bold text-decoration-none" style={{ color: '#B8860B' }}>Đăng nhập tại đây</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}