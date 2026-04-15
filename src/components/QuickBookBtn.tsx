'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore'; // Lộc chú ý đường dẫn nhé

export default function QuickBookBtn({ svc, className, style }: { svc: any, className?: string, style?: React.CSSProperties }) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleQuickBook = () => {
    // 1. Nhét dịch vụ này vào giỏ hàng
    addToCart({
      _id: svc._id,
      name: svc.name,
      price: svc.price,
      image: svc.image
    });
    
    // 2. Tức tốc bế khách hàng sang trang chốt đơn
    router.push('/booking');
  };

  return (
    <button 
      onClick={handleQuickBook} 
      className={className}
      style={style}
    >
      <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
      ĐẶT LỊCH NHANH
    </button>
  );
}