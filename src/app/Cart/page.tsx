'use client';
import { useCartStore } from '../../store/useCartStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  const total = totalPrice();
  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', paddingTop: '100px' }}>
      <div className="container">
        <h1 className="display-5 fw-bold text-warning mb-5">GIỎ HÀNG DỊCH VỤ</h1>
        
        <div className="row g-5">
          <div className="col-lg-8">
            {cartItems.length === 0 ? (
              <div className="text-center py-5 border border-secondary rounded">
                <p className="text-secondary fs-4">Giỏ hàng của bạn đang trống.</p>
                <Link href="/services" className="btn btn-warning">XEM CÁC DỊCH VỤ NGAY</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="d-flex align-items-center bg-dark p-3 mb-3 rounded border border-secondary">
                  <img src={item.image} width="80" height="80" className="rounded object-fit-cover me-4" />
                  <div className="flex-grow-1">
                    <h5 className="mb-0 fw-bold">{item.name}</h5>
                    <span className="text-warning">{item.price.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="btn btn-outline-danger btn-sm">Xóa</button>
                </div>
              ))
            )}
          </div>

          <div className="col-lg-4">
            <div className="p-4 rounded border border-warning" style={{ backgroundColor: '#191919' }}>
              <h4 className="fw-bold text-light mb-4 text-center">TỔNG KẾT HÓA ĐƠN</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng dịch vụ:</span>
                <span className="fw-bold">{total.toLocaleString('vi-VN')} VND</span>
              </div>
              <Link href="/booking" className="btn btn-warning w-100 py-3 fw-bold mb-3 shadow">
                Đặt lịch ngay 
              </Link>
              <p className="small text-secondary text-center italic">* Quý khách thanh toán cọc để chúng tôi ưu tiên giữ chỗ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}