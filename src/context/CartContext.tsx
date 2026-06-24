"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, selectedSize?: string, quantity?: number) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, selectedSize: string | undefined, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
}
