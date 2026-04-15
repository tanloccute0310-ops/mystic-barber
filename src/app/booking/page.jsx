'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore'; // Lộc chú ý đường dẫn này nhé

export default function BookingPage() {
  const router = useRouter();
  
  const cartItems = useCartStore((state) => state.cartItems);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [formData, setFormData] = useState({
    userName: '', phone: '', date: '', time: '', barber: 'Thợ bất kỳ'
  });

  const [paymentMethod, setPaymentMethod] = useState('store'); 
  const [showMoMoQR, setShowMoMoQR] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Bạn chưa chọn dịch vụ nào!");
      router.push('/services');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        services: cartItems.map(item => ({ name: item.name, price: item.price })),
        totalPrice: totalPrice,
        paymentMethod: paymentMethod 
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        if (paymentMethod === 'store') {
          alert("🎉 Đặt lịch thành công! Mystic Barber sẽ sớm liên hệ với bạn.");
          clearCart();
          router.push('/'); 
        } else if (paymentMethod === 'momo') {
          setCreatedBookingId(data.booking._id);
          setShowMoMoQR(true);
        }
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoMoSuccess = () => {
    clearCart();
    router.push(`/booking-success/${createdBookingId}`);
  };

  if (!mounted) return null;

  return (
    <div className="position-relative" style={{ backgroundColor: '#121212', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* --- PHẦN POPUP MÃ QR MOMO SẼ HIỆN Ở ĐÂY --- */}
      {showMoMoQR && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
          <div className="bg-dark p-4 rounded-4 text-center border border-warning shadow-lg" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 className="text-warning fw-bold mb-3">THANH TOÁN MOMO</h3>
            <p className="text-light mb-4">Quét mã QR bên dưới để thanh toán cọc <br/> <strong className="fs-4 text-danger">{totalPrice.toLocaleString('vi-VN')} k</strong></p>
            
            {/* ĐÃ FIX: Khung ảnh to, rõ ràng để chứa mã QR */}
            <div className="bg-white p-2 rounded mb-4 mx-auto d-flex justify-content-center align-items-center" style={{ width: '250px', height: '250px' }}>
              <img src="/images/qr-momo.jpg"   alt="MoMo QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> 
            </div>
            
            <p className="text-secondary small fst-italic mb-4">Nội dung CK: Thanh toan MYSTIC - SĐT của bạn</p>
            
            <button onClick={handleMoMoSuccess} className="btn btn-warning w-100 py-3 fw-bold fs-5">
              TÔI ĐÃ CHUYỂN KHOẢN
            </button>
          </div>
        </div>
      )}

      <div className="container py-5 mt-5">
        <h1 className="display-5 fw-bold text-warning mb-5 text-center border-bottom border-secondary pb-3">
          HOÀN TẤT ĐẶT LỊCH
        </h1>

        <div className="row g-5">
          <div className="col-lg-7">
            <div className="p-4 rounded shadow-sm" style={{ backgroundColor: '#191919', border: '1px solid #333' }}>
              <h4 className="text-light mb-4">Thông tin cá nhân & Thời gian</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary">Họ và Tên</label>
                  <input type="text" name="userName" required onChange={handleInputChange} className="form-control bg-dark text-light border-secondary" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary">Số điện thoại</label>
                  <input type="tel" name="phone" required onChange={handleInputChange} className="form-control bg-dark text-light border-secondary" />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary">Ngày cắt</label>
                    <input type="date" name="date" required onChange={handleInputChange} className="form-control bg-dark text-light border-secondary" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary">Giờ cắt</label>
                    <input type="time" name="time" required onChange={handleInputChange} className="form-control bg-dark text-light border-secondary" />
                  </div>
                </div>

                <hr className="border-secondary my-4" />

                <h5 className="text-light mb-3">Phương thức thanh toán</h5>
                <div className="mb-4">
                  <div className="form-check p-3 mb-2 rounded border border-secondary" style={{ backgroundColor: paymentMethod === 'store' ? '#2a2a2a' : '#121212' }}>
                    <input className="form-check-input ms-1 mt-0" type="radio" name="payment" id="payStore" 
                           checked={paymentMethod === 'store'} onChange={() => setPaymentMethod('store')} />
                    <label className="form-check-label ms-3 text-light fw-bold w-100 d-flex align-items-center" htmlFor="payStore" style={{ cursor: 'pointer' }}>
                      <i className="bi bi-shop text-warning me-3 fs-5"></i> Thanh toán tại cửa hàng
                    </label>
                  </div>
                  
                 <div className="form-check p-3 rounded border border-secondary d-flex align-items-center" style={{ backgroundColor: paymentMethod === 'momo' ? '#2a2a2a' : '#121212' }}>
                    <input className="form-check-input ms-1 mt-0" type="radio" name="payment" id="payMoMo" 
                           checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} />
                    <label className="form-check-label ms-3 text-light fw-bold w-100 d-flex align-items-center" htmlFor="payMoMo" style={{ cursor: 'pointer' }}>
                      {/* ĐÃ FIX: Chỗ này chỉ dùng Logo nhỏ của MoMo từ mạng, không dùng hình QR */}
                      <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo Logo" width="30" height="30" className="me-3 rounded" />
                      Thanh toán qua Ví MoMo
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={isLoading || cartItems.length === 0} className="btn btn-warning w-100 py-3 fw-bold fs-5 shadow-lg">
                  {isLoading ? 'ĐANG XỬ LÝ...' : (paymentMethod === 'momo' ? 'ĐẶT LỊCH & QUÉT MÃ QR' : 'XÁC NHẬN ĐẶT LỊCH')}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
             <div className="p-4 rounded shadow-lg sticky-top" style={{ backgroundColor: '#191919', border: '1px dashed #B8860B', top: '100px' }}>
              <h4 className="fw-bold text-light mb-4 border-bottom border-secondary pb-2">HÓA ĐƠN CỦA BẠN</h4>
              <ul className="list-unstyled mb-4">
                {cartItems.map(item => (
                  <li key={item._id} className="d-flex justify-content-between mb-3 text-secondary">
                    <span>{item.name}</span>
                    <span className="text-light fw-bold">{item.price.toLocaleString('vi-VN')}K</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between mt-4 pt-3 border-top border-secondary">
                <span className="fs-5 text-warning">TỔNG CỘNG:</span>
                <span className="fs-4 fw-bold text-warning">{totalPrice.toLocaleString('vi-VN')}K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}