'use client'; // Đây là Client Component
import { useCartStore } from '../store/useCartStore';

export default function AddToCartBtn({ svc, className, style }: { svc: any, className?: string, style?: React.CSSProperties; }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button 
      onClick={() => {
        addToCart(svc);
        alert(`Đã thêm ${svc.name} vào giỏ hàng!`); // Thông báo tạm thời
      }} 
      className={className || "btn btn-warning btn-sm fw-bold"}
    >
      THÊM VÀO GIỎ +
    </button>
  );
}