'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../store/useCartStore';

export default function CartBadge() {
  const cartItems = useCartStore((state) => state.cartItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Link href="/Cart" className="position-relative text-decoration-none ms-3 me-3 d-flex align-items-center">
      <img 
        src="/images/barber-bg.jpg" /* Thay đổi tên file này cho đúng với tên ảnh của Lộc */
        alt="Giỏ hàng" 
        style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
      />
      {mounted && cartItems.length > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm border border-dark" 
          style={{ fontSize: '0.75rem', transform: 'translate(-30%, -30%)' }}
        >
          {cartItems.length}
        </span>
      )}
    </Link>
  );
}