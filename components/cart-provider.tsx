'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalMinor: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  addProduct: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'fruteo-cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (!existing) return [...current, item];
      return current.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, entry.stock) }
          : entry,
      );
    });
    setOpen(true);
  }, []);

  const addProduct = useCallback(
    (product: Product, quantity = 1) =>
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price_minor: product.price_minor,
        currency: product.currency,
        image_url: product.image_url,
        quantity,
        stock: product.stock,
      }),
    [addItem],
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((entry) =>
          entry.id === id
            ? { ...entry, quantity: Math.max(0, Math.min(quantity, entry.stock)) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotalMinor: items.reduce((sum, item) => sum + item.price_minor * item.quantity, 0),
      open,
      setOpen,
      addItem,
      addProduct,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, open, addItem, addProduct, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider missing');
  return context;
}
