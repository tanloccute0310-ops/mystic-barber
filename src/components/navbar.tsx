'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import CartBadge from '../components/CartBadge'; // <-- IMPORT COMPONENT GIỎ HÀNG VÀO ĐÂY

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string, avatar:string } | null>(null);

  useEffect(() => {
    // @ts-ignore
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error("Lỗi đăng xuất", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg mystic-nav py-3" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand mystic-brand" href="/">
          MYSTIC BARBER
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className={`nav-link mystic-link ${pathname === '/' ? 'active' : ''}`} href="/">Trang Chủ</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link mystic-link ${pathname === '/services' ? 'active' : ''}`} href="/services">Dịch Vụ</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link mystic-link dropdown-toggle" href="/barbers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Đội Ngũ
              </Link>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link className="dropdown-item" href="/barbers#danir">Master Danir</Link></li>
                <li><Link className="dropdown-item" href="/barbers#john">Senior John</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" href="#">Tuyển dụng</Link></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center ms-lg-4 mt-3 mt-lg-0 gap-3">
            
            {/* THÊM GIỎ HÀNG VÀO ĐÂY (Nằm trước User và Nút Đặt Lịch) */}
            <CartBadge />

            {user ? (
            <div className="dropdown">
                <button 
                className="btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-decoration-none shadow-none" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                >
                  <img 
                  // Dùng thẳng 1 ảnh mặc định. Em nhớ tải 1 ảnh đặt tên là default-avatar.png để vào thư mục public/images/ nhé
                  src="/images/default avatar.webp" 
                  alt="Avatar" 
                  className="rounded-circle border border-warning"
                  style={{ width: '40px', height: '40px', objectFit: 'cover', backgroundColor: '#222' }}
                  // Mẹo: Đề phòng em chưa kịp tải ảnh, nó sẽ hiển thị tạm 1 cái ảnh icon xịn xò trên mạng
                  onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                />
                <span className="text-white d-none d-md-block" style={{ fontSize: '0.9rem' }}>
                    {user.name}
                </span>
                </button>
                
                <ul className="dropdown-menu dropdown-menu-end mt-2 dropdown-menu-dark shadow" style={{ backgroundColor: '#1e1e1e', border: '1px solid #B8860B' }}>
                <li>
                    <Link className="dropdown-item py-2" href="/profile">
                    <i className="bi bi-person me-2"></i> Hồ sơ cá nhân
                    </Link>
                </li>
                <li>
                    <Link className="dropdown-item py-2" href="/booking-history">
                    <i className="bi bi-calendar-check me-2"></i> Lịch hẹn của tôi
                    </Link>
                </li>
                <li><hr className="dropdown-divider border-secondary" /></li>
                <li>
                    <button className="dropdown-item text-danger py-2 fw-bold" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                    </button>
                </li>
                </ul>
            </div>
            ) : (
            <Link className="nav-link mystic-link m-0" href="/login" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                ĐĂNG NHẬP
            </Link>
            )}

            <Link className="btn btn-mystic" href="/booking">
              ĐẶT LỊCH NGAY
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}