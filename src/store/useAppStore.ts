import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Occasion = 'brunch' | 'coffee' | 'gifts' | 'catering' | null;

type AppState = {
  selectedLocationId: string | null;
  pickupMode: 'asap' | 'scheduled';
  scheduledPickupTime: string | null;
  occasion: Occasion;
  loyaltyStars: number;
  hasHydrated: boolean;
  setLocation: (locationId: string) => void;
  setPickupMode: (mode: 'asap' | 'scheduled') => void;
  setScheduledPickupTime: (time: string | null) => void;
  setOccasion: (occasion: Occasion) => void;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedLocationId: null,
      pickupMode: 'asap',
      scheduledPickupTime: null,
      occasion: null,
      loyaltyStars: 175,
      hasHydrated: false,
      setLocation: (locationId) => set({ selectedLocationId: locationId }),
      setPickupMode: (mode) => set({ pickupMode: mode }),
      setScheduledPickupTime: (time) => set({ scheduledPickupTime: time }),
      setOccasion: (occasion) => set({ occasion }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'salt-yeast-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLocationId: state.selectedLocationId,
        pickupMode: state.pickupMode,
        scheduledPickupTime: state.scheduledPickupTime,
        occasion: state.occasion,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
