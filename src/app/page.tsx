import React from 'react';

export default function HomePage() {
  return (
    <>
      <section 
        className="hero-section d-flex align-items-center"
        style={{
          minHeight: '80vh', 
          backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.9)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2074")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container text-center">
          <h1 className="display-2 fw-bold mb-3" style={{ color: '#B8860B', letterSpacing: '3px' }}>
            CRAFTING MYSTIQUE
          </h1>
          <p className="lead text-light mb-5 mx-auto" style={{ maxWidth: '600px' }}>
            Đánh thức phong cách quý ông với những đường cắt sắc lẹm trong không gian huyền bí. Chúng tôi không chỉ cắt tóc, chúng tôi kiến tạo nghệ thuật.
          </p>
          <a href="/booking" className="btn btn-mystic btn-lg px-5 py-3 fs-5">
            ĐẶT LỊCH CẮT NGAY
          </a>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: '#121212' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-uppercase tracking-widest" style={{ color: '#B8860B' }}>MYSTIC BARBER</h6>
            <h2 className="display-6 fw-bold text-light">DỊCH VỤ NỔI BẬT</h2>
            <div className="mx-auto mt-3" style={{ width: '60px', height: '3px', backgroundColor: '#B8860B' }}></div>
          </div>


          <div className="row g-4">

            <div className="col-md-4">

              <div className="card h-100 text-center border-0 p-4" style={{ backgroundColor: '#191919' }}>
                <div className="card-body">
                  <div className="mb-4">
                    <span style={{ fontSize: '3rem' }}>✂️</span>
                  </div>
                  <h4 className="card-title text-light mb-3">CLASSIC CUT</h4>
                  <p className="card-text text-secondary mb-4">
                    Cắt tóc tạo kiểu chuẩn form Âu, cạo viền sắc nét và vuốt sáp định hình phong cách.
                  </p>
                  <h5 style={{ color: '#B8860B' }}>Từ 150.000đ</h5>
                </div>
              </div>
            </div>

           
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 p-4" style={{ backgroundColor: '#191919' }}>
                <div className="card-body">
                  <div className="mb-4">
                    <span style={{ fontSize: '3rem' }}>🪒</span>
                  </div>
                  <h4 className="card-title text-light mb-3">HOT TOWEL SHAVE</h4>
                  <p className="card-text text-secondary mb-4">
                    Trải nghiệm cạo râu khăn nóng thư giãn hoàng gia, chăm sóc da mặt với tinh dầu cao cấp.
                  </p>
                  <h5 style={{ color: '#B8860B' }}>Từ 100.000đ</h5>
                </div>
              </div>
            </div>

            {/* Card Dịch vụ 3 */}
            <div className="col-md-4">
              <div className="card h-100 text-center border-0 p-4" style={{ backgroundColor: '#191919' }}>
                <div className="card-body">
                  <div className="mb-4">
                    <span style={{ fontSize: '3rem' }}>🧴</span>
                  </div>
                  <h4 className="card-title text-light mb-3">COLOR & PERM</h4>
                  <p className="card-text text-secondary mb-4">
                    Uốn tóc Premlock, uốn phồng chân tóc hoặc nhuộm màu thời trang siêu cá tính.
                  </p>
                  <h5 style={{ color: '#B8860B' }}>Từ 300.000đ</h5>
                </div>
              </div>
            </div>

          </div>
          
          <div className="text-center mt-5">
            <a href="/services" className="btn btn-outline-light px-4 py-2" style={{ borderColor: '#B8860B', color: '#B8860B' }}>
              XEM TOÀN BỘ BẢNG GIÁ
            </a>
          </div>
        </div>
      </section>
    </>
  );
}