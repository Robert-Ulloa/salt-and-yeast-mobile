import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useOrdersStore } from '../store/useOrdersStore';
import { fetchOrderById } from '../services/api/bakeryApi';
import { getApiBaseUrl } from '../services/api/apiClient';
import type { RootStackParamList } from '../navigation/types';
import { formatCurrency } from '../utils/currency';
import { theme } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderStatus'>;

const progression: Array<'pending' | 'confirmed' | 'preparing' | 'ready'> = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
];

export function OrderStatusScreen({ route, navigation }: Props) {
  const orderId = route.params.orderId;
  const order = useOrdersStore((s) => s.orderHistory.find((entry) => entry.orderId === orderId) ?? null);
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);
  const saveOrder = useOrdersStore((s) => s.saveOrder);

  const currentStep = useMemo(() => {
    if (!order) return 0;
    const idx = progression.indexOf(order.status as (typeof progression)[number]);
    return idx === -1 ? 0 : idx;
  }, [order]);

  useEffect(() => {
    if (!order) return;

    const baseUrl = getApiBaseUrl();
    if (baseUrl) {
      const timer = setInterval(async () => {
        try {
          const latest = await fetchOrderById(orderId);
          saveOrder(latest);
        } catch {
          // Keep existing state if polling fails.
        }
      }, 8000);

      return () => clearInterval(timer);
    }

    if (order.status === 'ready' || order.status === 'completed' || order.status === 'canceled') {
      return;
    }

    const nextIndex = Math.min(currentStep + 1, progression.length - 1);
    const timeout = setTimeout(() => {
      updateOrderStatus(orderId, progression[nextIndex]);
    }, 4500);

    return () => clearTimeout(timeout);
  }, [currentStep, order, orderId, saveOrder, updateOrderStatus]);

  if (!order) {
    return (
      <ScreenContainer style={styles.container}>
        <Text style={styles.title}>Order not found</Text>
        <Button label="Back to Orders" onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Order Status</Text>

      <Card style={styles.summaryCard}>
        <Text style={styles.orderId}>#{order.orderId}</Text>
        <Text style={styles.status}>{formatStatus(order.status)}</Text>
        <Text style={styles.meta}>{order.pickupLabel}</Text>
        <Text style={styles.total}>{formatCurrency(order.totalCents / 100)}</Text>
      </Card>

      <Card style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Timeline</Text>
        {progression.map((step, index) => {
          const complete = index <= currentStep;
          return (
            <View key={step} style={styles.timelineRow}>
              <View style={[styles.dot, complete && styles.dotActive]} />
              <Text style={[styles.timelineText, complete && styles.timelineTextActive]}>{formatStatus(step)}</Text>
            </View>
          );
        })}
      </Card>

      <Button label="View All Orders" variant="outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })} />
    </ScreenContainer>
  );
}

function formatStatus(status: string) {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready for pickup';
    case 'completed':
      return 'Completed';
    case 'canceled':
      return 'Canceled';
    default:
      return status;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  summaryCard: {
    gap: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  status: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.pine,
  },
  meta: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  total: {
    fontSize: 17,
    color: theme.colors.cocoa,
    fontWeight: '800',
  },
  timelineCard: {
    gap: 10,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  dotActive: {
    backgroundColor: theme.colors.pine,
    borderColor: theme.colors.pine,
  },
  timelineText: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  timelineTextActive: {
    color: theme.colors.ink,
    fontWeight: '700',
  },
});
