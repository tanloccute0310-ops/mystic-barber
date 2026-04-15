import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cartItems: any[];
  addToCart: (service: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (service) => set((state) => {
        const isExist = state.cartItems.find(item => item._id === service._id);
        if (isExist) return state;
        return { cartItems: [...state.cartItems, service] };
      }),

      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(item => item._id !== id)
      })),

      clearCart: () => set({ cartItems: [] }),

      totalPrice: () => {
        return get().cartItems.reduce((sum, item) => sum + item.price, 0);
      },
    }),
    { name: 'mystic-cart-storage' } // Tự động lưu vào localStorage cho Lộc luôn
  )
);