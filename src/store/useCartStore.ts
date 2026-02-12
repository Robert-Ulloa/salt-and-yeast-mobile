import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BakeryItem } from '../types/menu';

export type CartLine = {
  item: BakeryItem;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  hasHydrated: boolean;
  addItem: (item: BakeryItem) => void;
  removeItem: (itemId: string) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  clear: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hasHydrated: false,

      addItem: (item) => {
        const existing = get().lines.find((l) => l.item.id === item.id);
        if (existing) {
          set((s) => ({
            lines: s.lines.map((l) =>
              l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l,
            ),
          }));
          return;
        }
        set((s) => ({ lines: [...s.lines, { item, quantity: 1 }] }));
      },

      removeItem: (itemId) => {
        set((s) => ({ lines: s.lines.filter((l) => l.item.id !== itemId) }));
      },

      increment: (itemId) => {
        set((s) => ({
          lines: s.lines.map((l) =>
            l.item.id === itemId ? { ...l, quantity: l.quantity + 1 } : l,
          ),
        }));
      },

      decrement: (itemId) => {
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.item.id === itemId ? { ...l, quantity: l.quantity - 1 } : l,
            )
            .filter((l) => l.quantity > 0),
        }));
      },

      clear: () => set({ lines: [] }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),

      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0),
    }),
    {
      name: 'salt-yeast-cart-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
