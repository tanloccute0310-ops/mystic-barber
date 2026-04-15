import React from 'react';
import { Metadata } from 'next';

// Tối ưu SEO cho trang Đội ngũ
export const metadata: Metadata = {
  title: "Đội Ngũ Thợ Cắt - Mystic Barber",
  description: "Gặp gỡ những tay kéo vàng chuẩn Âu tại Mystic Barber.",
};

export default function BarbersPage() {
  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', paddingBottom: '64px' }}>
      
      {/* --- PHẦN 1: HEADER TRANG ĐỘI NGŨ --- */}
      <div className="py-5 text-center" style={{ backgroundColor: '#191919', borderBottom: '1px solid #B8860B' }}>
        <div className="container mt-4">
          <h1 className="display-4 fw-bold text-light" style={{ letterSpacing: '2px' }}>ĐỘI NGŨ MYSTIC</h1>
          <p className="lead text-secondary mt-3">Những nghệ nhân thầm lặng kiến tạo nên phong cách của bạn</p>
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH THỢ CẮT (LƯỚI GRID) --- */}
      <div className="container mt-5 pt-4">
        {/* row g-5: Tạo hàng và khoảng cách (gap) lớn giữa các thẻ */}
        <div className="row g-5">
          
          {/* --- THỢ SỐ 1 --- */}
          {/* col-md-6 col-lg-4: Tablet hiện 2 thẻ/hàng, PC hiện 3 thẻ/hàng */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 text-center border-0" style={{ backgroundColor: '#191919', borderRadius: '12px' }}>
             
              <div className="pt-4">
                <img 
                  src="/images/thợ 1.png" 
                  alt="Master Danir" 
                  className="rounded-circle"
                  style={{ width: '160px', height: '160px', objectFit: 'cover', border: '3px solid #B8860B' }}
                />
              </div>
              <div className="card-body px-4 pb-4">
                <h3 className="text-light fw-bold mt-2">Master Danir</h3>
                <h6 style={{ color: '#B8860B', letterSpacing: '1px' }}>GIÁM ĐỐC SÁNG TẠO</h6>
                <div className="mb-3 mt-2" style={{ color: '#B8860B' }}>
                  ★ ★ ★ ★ ★ <span className="text-secondary" style={{ fontSize: '0.9rem' }}>(124)</span>
                </div>
                <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
                  Hơn 10 năm kinh nghiệm tu nghiệp tại Anh. Bậc thầy của những đường kéo Classic chuẩn mực và kỹ thuật cạo khăn nóng hoàng gia.
                </p>
                {/* Nút Đặt lịch trỏ thẳng về trang booking kèm theo tên thợ (dùng query string) */}
                <a href="/booking?barber=danir" className="btn btn-outline-light w-100 py-2" style={{ borderColor: '#B8860B', color: '#B8860B' }}>
                  CHỌN DANIR
                </a>
              </div>
            </div>
          </div>

          {/* --- THỢ SỐ 2 --- */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 text-center border-0" style={{ backgroundColor: '#191919', borderRadius: '12px' }}>
              <div className="pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=300&h=300" 
                  alt="Senior John" 
                  className="rounded-circle"
                  style={{ width: '160px', height: '160px', objectFit: 'cover', border: '3px solid #333' }}
                />
              </div>
              <div className="card-body px-4 pb-4">
                <h3 className="text-light fw-bold mt-2">Senior John</h3>
                <h6 className="text-secondary" style={{ letterSpacing: '1px' }}>CHUYÊN GIA TẠO KIỂU</h6>
                <div className="mb-3 mt-2" style={{ color: '#B8860B' }}>
                  ★ ★ ★ ★ ★ <span className="text-secondary" style={{ fontSize: '0.9rem' }}>(98)</span>
                </div>
                <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
                  Sở trường là các hiệu ứng Fade mờ dần siêu sắc nét và các màu nhuộm khói lạnh mang đậm chất đường phố.
                </p>
                <a href="/booking?barber=john" className="btn btn-outline-light w-100 py-2" style={{ borderColor: '#B8860B', color: '#B8860B' }}>
                  CHỌN JOHN
                </a>
              </div>
            </div>
          </div>

          {/* --- THỢ SỐ 3 --- */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 text-center border-0" style={{ backgroundColor: '#191919', borderRadius: '12px' }}>
              <div className="pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=300&h=300" 
                  alt="Barber Mike" 
                  className="rounded-circle"
                  style={{ width: '160px', height: '160px', objectFit: 'cover', border: '3px solid #333' }}
                />
              </div>
              <div className="card-body px-4 pb-4">
                <h3 className="text-light fw-bold mt-2">Barber Mike</h3>
                <h6 className="text-secondary" style={{ letterSpacing: '1px' }}>CHUYÊN VIÊN HOÁ CHẤT</h6>
                <div className="mb-3 mt-2" style={{ color: '#B8860B' }}>
                  ★ ★ ★ ★ ☆ <span className="text-secondary" style={{ fontSize: '0.9rem' }}>(65)</span>
                </div>
                <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
                  Người trị những mái tóc cứng đầu nhất. Chuyên các dòng Premlock uốn con sâu và tạo kiểu phục hồi tóc hư tổn.
                </p>
                <a href="/booking?barber=mike" className="btn btn-outline-light w-100 py-2" style={{ borderColor: '#B8860B', color: '#B8860B' }}>
                  CHỌN MIKE
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}