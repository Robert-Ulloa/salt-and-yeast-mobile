import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PriceTag } from '../components/ui/PriceTag';
import { LocationSelector } from '../components/LocationSelector';
import { useCartStore } from '../store/useCartStore';
import { useAppStore } from '../store/useAppStore';
import { getCachedLocationById } from '../services/api/bakeryApi';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { theme } from '../utils/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Cart'>;

const mockSlots = ['Today · 12:15 PM', 'Today · 12:30 PM', 'Today · 12:45 PM'];

export function CartScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal)();
  const removeItem = useCartStore((s) => s.removeItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const clear = useCartStore((s) => s.clear);

  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const pickupMode = useAppStore((s) => s.pickupMode);
  const scheduledPickupTime = useAppStore((s) => s.scheduledPickupTime);
  const setPickupMode = useAppStore((s) => s.setPickupMode);
  const setScheduledPickupTime = useAppStore((s) => s.setScheduledPickupTime);

  const location = getCachedLocationById(selectedLocationId);
  const etaLabel = pickupMode === 'scheduled'
    ? scheduledPickupTime ?? 'Select a time'
    : location
      ? `ASAP · ${location.pickupEtaMins}-${location.pickupEtaMins + 6} min`
      : 'Location required';

  return (
    <ScreenContainer style={styles.container}>
      <LocationSelector onPressChange={() => rootNavigation.navigate('LocationPicker')} />

      <Card style={styles.metaCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.metaTitle}>Pickup</Text>
          {lines.length > 0 ? (
            <Pressable
              onPress={() =>
                Alert.alert('Clear cart?', 'This removes all items from your cart.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: clear },
                ])
              }
            >
              <Text style={styles.clearText}>Clear cart</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.metaText}>{location?.name ?? 'Choose location'}</Text>
        <Text style={styles.metaSub}>{etaLabel}</Text>

        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeChip, pickupMode === 'asap' && styles.modeChipActive]}
            onPress={() => {
              setPickupMode('asap');
              setScheduledPickupTime(null);
            }}
          >
            <Text style={[styles.modeChipText, pickupMode === 'asap' && styles.modeChipTextActive]}>ASAP</Text>
          </Pressable>
          <Pressable
            style={[styles.modeChip, pickupMode === 'scheduled' && styles.modeChipActive]}
            onPress={() => setPickupMode('scheduled')}
          >
            <Text style={[styles.modeChipText, pickupMode === 'scheduled' && styles.modeChipTextActive]}>Schedule pickup</Text>
          </Pressable>
        </View>

        {pickupMode === 'scheduled' ? (
          <View style={styles.slotRow}>
            {mockSlots.map((slot) => (
              <Pressable
                key={slot}
                onPress={() => setScheduledPickupTime(slot)}
                style={[styles.slotChip, scheduledPickupTime === slot && styles.slotChipActive]}
              >
                <Text style={[styles.slotChipText, scheduledPickupTime === slot && styles.slotChipTextActive]}>{slot}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Card>

      {lines.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Build your order from this location’s menu.</Text>
          <View style={styles.emptyButtonWrap}>
            <Button label="Browse Menu" onPress={() => navigation.navigate('Menu')} />
          </View>
        </View>
      ) : (
        <FlatList
          data={lines}
          keyExtractor={(line) => line.item.id}
          renderItem={({ item: line }) => (
            <Card style={styles.lineCard}>
              <View style={styles.rowBetween}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{line.item.name}</Text>
                  <PriceTag amount={line.item.price * line.quantity} size="sm" />
                </View>
                <View style={styles.qtyRow}>
                  <Pressable onPress={() => decrement(line.item.id)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></Pressable>
                  <Text style={styles.qtyValue}>{line.quantity}</Text>
                  <Pressable onPress={() => increment(line.item.id)} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
                </View>
              </View>
              <Pressable onPress={() => removeItem(line.item.id)} style={styles.removeBtn}><Text style={styles.removeText}>Remove</Text></Pressable>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.stickyFooter}>
        <View style={styles.rowBetween}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <PriceTag amount={subtotal} />
        </View>
        <Button
          label="Checkout"
          onPress={() => rootNavigation.navigate('Checkout')}
          disabled={lines.length === 0 || !selectedLocationId}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  metaCard: {
    marginBottom: 10,
  },
  metaTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: theme.colors.mutedLight,
    fontWeight: '700',
    marginBottom: 4,
  },
  clearText: {
    color: theme.colors.berry,
    fontSize: 12,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  metaSub: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 2,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  modeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modeChipActive: {
    backgroundColor: theme.colors.cocoa,
    borderColor: theme.colors.cocoa,
  },
  modeChipText: {
    fontWeight: '700',
    fontSize: 13,
    color: theme.colors.cocoa,
  },
  modeChipTextActive: {
    color: theme.colors.cream,
  },
  slotRow: {
    marginTop: 10,
    gap: 6,
  },
  slotChip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: theme.colors.bg,
  },
  slotChipActive: {
    borderColor: theme.colors.pine,
    backgroundColor: 'rgba(31,75,67,0.08)',
  },
  slotChipText: {
    color: theme.colors.ink,
    fontWeight: '600',
    fontSize: 13,
  },
  slotChipTextActive: {
    color: theme.colors.pine,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  emptyButtonWrap: {
    marginTop: 18,
    width: '100%',
  },
  lineCard: {
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
  qtyBtnText: {
    color: theme.colors.cocoa,
    fontWeight: '800',
    fontSize: 18,
  },
  qtyValue: {
    width: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: theme.colors.ink,
  },
  removeBtn: {
    marginTop: 8,
  },
  removeText: {
    color: theme.colors.berry,
    fontWeight: '600',
    fontSize: 13,
  },
  stickyFooter: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    padding: 12,
    gap: 10,
  },
  subtotalLabel: {
    color: theme.colors.ink,
    fontWeight: '700',
    fontSize: 15,
  },
});
