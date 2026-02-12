import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PriceTag } from '../components/ui/PriceTag';
import { LocationSelector } from '../components/LocationSelector';
import { useCartStore } from '../store/useCartStore';
import { useAppStore } from '../store/useAppStore';
import { useOrdersStore } from '../store/useOrdersStore';
import type { RootStackParamList } from '../navigation/types';
import { createOrder, createQuote, getCachedLocationById } from '../services/api/bakeryApi';
import type { QuoteResponse } from '../services/api/types';
import { formatCurrency } from '../utils/currency';
import { theme } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export function CheckoutScreen({ navigation }: Props) {
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const pickupMode = useAppStore((s) => s.pickupMode);
  const scheduledPickupTime = useAppStore((s) => s.scheduledPickupTime);
  const occasion = useAppStore((s) => s.occasion);
  const saveOrder = useOrdersStore((s) => s.saveOrder);

  const location = getCachedLocationById(selectedLocationId);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const quoteLines = useMemo(
    () =>
      lines.map((line) => ({
        itemId: line.item.id,
        name: line.item.name,
        quantity: line.quantity,
        unitPriceCents: Math.round(line.item.price * 100),
      })),
    [lines],
  );

  const loadQuote = useCallback(async () => {
    if (!selectedLocationId || quoteLines.length === 0) {
      setQuote(null);
      setQuoteError(null);
      return;
    }

    setLoadingQuote(true);
    setQuoteError(null);

    try {
      const nextQuote = await createQuote({
        locationId: selectedLocationId,
        pickupMode,
        scheduledPickupTime,
        occasion,
        lines: quoteLines,
      });
      setQuote(nextQuote);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'Failed to load order summary.');
    } finally {
      setLoadingQuote(false);
    }
  }, [occasion, pickupMode, quoteLines, scheduledPickupTime, selectedLocationId]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const canPlaceOrder =
    Boolean(selectedLocationId) &&
    quoteLines.length > 0 &&
    !loadingQuote &&
    !quoteError &&
    !placingOrder;

  const handlePlaceOrder = async () => {
    if (!selectedLocationId || quoteLines.length === 0) return;

    setOrderError(null);
    setPlacingOrder(true);

    try {
      const order = await createOrder({
        locationId: selectedLocationId,
        pickupMode,
        scheduledPickupTime,
        occasion,
        contact: {
          name: 'Demo User',
          email: 'demo@saltandyeast.com',
          phone: '(512) 555-0101',
        },
        lines: quoteLines,
      });

      saveOrder(order);
      clear();
      navigation.navigate('OrderStatus', { orderId: order.orderId });
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const pickupTimeLabel =
    quote?.pickupLabel ??
    (pickupMode === 'scheduled' ? scheduledPickupTime ?? 'Select in cart' : 'ASAP');

  return (
    <ScreenContainer style={styles.container}>
      <LocationSelector onPressChange={() => navigation.navigate('LocationPicker')} />

      <Card style={styles.card}>
        <Text style={styles.kicker}>Pickup Details</Text>
        <Row label="Location" value={location?.name ?? 'Choose location'} />
        <Row label="Pickup Time" value={pickupTimeLabel} />
        <Row label="Method" value="Pickup" />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.kicker}>Contact</Text>
        <Row label="Name" value="Demo User" />
        <Row label="Email" value="demo@saltandyeast.com" />
        <Row label="Phone" value="(512) 555-0101" />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.kicker}>Order Summary</Text>
        <Row label="Items" value={String(itemCount)} />

        {loadingQuote ? (
          <View style={styles.quoteLoadingRow}>
            <ActivityIndicator color={theme.colors.cocoa} />
            <Text style={styles.quoteLoadingText}>Calculating total...</Text>
          </View>
        ) : quoteError ? (
          <View style={styles.quoteErrorWrap}>
            <Text style={styles.errorText}>{quoteError}</Text>
            <Button label="Retry" variant="outline" onPress={loadQuote} />
          </View>
        ) : (
          <>
            <Row label="Subtotal" value={formatCurrency((quote?.subtotalCents ?? 0) / 100)} />
            <Row label="Estimated Tax" value={formatCurrency((quote?.taxCents ?? 0) / 100)} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <PriceTag amount={(quote?.totalCents ?? 0) / 100} size="lg" />
            </View>
          </>
        )}
      </Card>

      {orderError ? <Text style={styles.errorText}>{orderError}</Text> : null}

      <Button label={placingOrder ? 'Placing Order...' : 'Place Order'} onPress={handlePlaceOrder} disabled={!canPlaceOrder} />
      <Text style={styles.note}>Demo mode: no real payment is processed.</Text>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 10,
  },
  card: {
    gap: 10,
  },
  kicker: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    color: theme.colors.mutedLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 15,
    color: theme.colors.muted,
  },
  rowValue: {
    fontSize: 15,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  quoteLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quoteLoadingText: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  quoteErrorWrap: {
    gap: 8,
    alignItems: 'flex-start',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  errorText: {
    color: theme.colors.berry,
    fontSize: 13,
    fontWeight: '600',
  },
  note: {
    textAlign: 'center',
    color: theme.colors.mutedLight,
    fontSize: 12,
    marginTop: -2,
  },
});
