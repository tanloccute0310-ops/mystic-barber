import React from 'react';
import Link from 'next/link';
import { connectDB } from '../../lib/mongodb'; 
import Booking from '../../models/Booking';
import { notFound } from 'next/navigation';

// Hàm lấy dữ liệu trực tiếp từ DB bằng ID đơn hàng
async function getBookingDetail(id: string) {
  try {
    await connectDB();
    const booking = await Booking.findById(id).lean();
    if (!booking) return null;
    return JSON.parse(JSON.stringify(booking)); // Ép kiểu dữ liệu an toàn
  } catch (error) {
    console.error("Lỗi khi lấy hóa đơn:", error);
    return null;
  }
}

export default async function BookingSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingDetail(id);

  // Nếu không tìm thấy hóa đơn, đá văng ra trang 404
  if (!booking) {
    return notFound();
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container d-flex justify-content-center">
        
        {/* Tấm vé điện tử (Ticket) */}
        <div className="card border-0 shadow-lg" style={{ backgroundColor: '#191919', maxWidth: '500px', width: '100%', borderRadius: '20px', overflow: 'hidden' }}>
          
          {/* Phần Header của vé */}
          <div className="bg-warning text-dark text-center py-4 px-3 position-relative">
            <div className="mb-2">
              <i className="bi bi-check-circle-fill display-4"></i>
            </div>
            <h3 className="fw-bold mb-0">ĐẶT LỊCH THÀNH CÔNG</h3>
            <p className="mb-0 fw-bold mt-1">
              {booking.paymentMethod === 'momo' ? 'Đã thanh toán cọc (MoMo)' : 'Thanh toán tại quầy'}
            </p>
            
            {/* Hiệu ứng cắt lẹm 2 bên rìa của vé */}
            <div className="position-absolute bg-dark rounded-circle" style={{ width: '40px', height: '40px', bottom: '-20px', left: '-20px' }}></div>
            <div className="position-absolute bg-dark rounded-circle" style={{ width: '40px', height: '40px', bottom: '-20px', right: '-20px' }}></div>
          </div>

          {/* Phần Nội dung của vé */}
          <div className="card-body p-4 text-light" style={{ borderTop: '2px dashed #B8860B' }}>
            <div className="text-center mb-4 mt-2">
              <p className="text-secondary small mb-1">Mã hóa đơn</p>
              <h5 className="text-warning text-uppercase" style={{ letterSpacing: '2px' }}>#{booking._id.substring(0, 8)}</h5>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <p className="text-secondary small mb-0">Khách hàng</p>
                <p className="fw-bold fs-5 mb-0">{booking.userName}</p>
              </div>
              <div className="col-6 text-end">
                <p className="text-secondary small mb-0">Điện thoại</p>
                <p className="fw-bold fs-5 mb-0">{booking.phone}</p>
              </div>
            </div>

            <div className="row mb-4 p-3 rounded" style={{ backgroundColor: '#2a2a2a' }}>
              <div className="col-6">
                <p className="text-secondary small mb-1"><i className="bi bi-calendar-event text-warning me-2"></i>Ngày hẹn</p>
                <p className="fw-bold mb-0">{booking.date}</p>
              </div>
              <div className="col-6 text-end">
                <p className="text-secondary small mb-1"><i className="bi bi-clock text-warning me-2"></i>Giờ hẹn</p>
                <p className="fw-bold mb-0">{booking.time}</p>
              </div>
            </div>

            <p className="text-secondary small mb-2 border-bottom border-secondary pb-2">Dịch vụ đã chọn (Barber: {booking.barber})</p>
            <ul className="list-unstyled mb-4">
              {booking.services.map((svc: any, idx: number) => (
                <li key={idx} className="d-flex justify-content-between mb-2">
                  <span>{svc.name}</span>
                  <span className="fw-bold text-light">{svc.price.toLocaleString('vi-VN')}K</span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '2px solid #333' }}>
              <span className="text-secondary">TỔNG THANH TOÁN</span>
              <span className="fs-3 fw-bold text-warning">{booking.totalPrice.toLocaleString('vi-VN')} K</span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="card-footer bg-transparent border-0 pb-4 px-4 text-center">
            <p className="text-secondary small fst-italic mb-4">
              Vui lòng đến đúng giờ để Mystic Barber phục vụ bạn tốt nhất. Xin cảm ơn!
            </p>
            <div className="d-flex gap-2">
              <Link href="/" className="btn btn-outline-secondary w-50 py-2">
                Trang Chủ
              </Link>
              <Link href="/profile" className="btn btn-warning w-50 py-2 fw-bold text-dark">
                Xem Lịch Sử
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}