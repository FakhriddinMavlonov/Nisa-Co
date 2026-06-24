"use client";

import { useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types";

const CART_KEY = "nisa_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const addItem = useCallback(
    (product: Product, selectedSize?: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.selectedSize === selectedSize
        );

        let updated: CartItem[];
        if (existing) {
          updated = prev.map((i) =>
            i.product.id === product.id && i.selectedSize === selectedSize
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          updated = [...prev, { product, selectedSize, quantity }];
        }

        saveCart(updated);
        return updated;
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, selectedSize?: string) => {
    setItems((prev) => {
      const updated = prev.filter(
        (i) => !(i.product.id === productId && i.selectedSize === selectedSize)
      );
      saveCart(updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, selectedSize: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, selectedSize);
        return;
      }
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.product.id === productId && i.selectedSize === selectedSize
            ? { ...i, quantity }
            : i
        );
        saveCart(updated);
        return updated;
      });
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  };
}
