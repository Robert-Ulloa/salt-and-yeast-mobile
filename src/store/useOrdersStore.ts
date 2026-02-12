import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CreateOrderResponse } from '../services/api/types';

type StoredOrder = CreateOrderResponse;

type OrdersState = {
  lastOrder: StoredOrder | null;
  orderHistory: StoredOrder[];
  hasHydrated: boolean;
  saveOrder: (order: StoredOrder) => void;
  updateOrderStatus: (orderId: string, status: StoredOrder['status']) => void;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      lastOrder: null,
      orderHistory: [],
      hasHydrated: false,
      saveOrder: (order) =>
        set((state) => {
          const withoutCurrent = state.orderHistory.filter((existing) => existing.orderId !== order.orderId);
          return {
            lastOrder: order,
            orderHistory: [order, ...withoutCurrent].slice(0, 25),
          };
        }),
      updateOrderStatus: (orderId, status) =>
        set((state) => {
          const nextHistory = state.orderHistory.map((order) =>
            order.orderId === orderId ? { ...order, status } : order,
          );
          const nextLastOrder =
            state.lastOrder?.orderId === orderId ? { ...state.lastOrder, status } : state.lastOrder;

          return {
            orderHistory: nextHistory,
            lastOrder: nextLastOrder,
          };
        }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'salt-yeast-orders-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastOrder: state.lastOrder,
        orderHistory: state.orderHistory,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
