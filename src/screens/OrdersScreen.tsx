import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useOrdersStore } from '../store/useOrdersStore';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { formatCurrency } from '../utils/currency';
import { theme } from '../utils/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Orders'>;

export function OrdersScreen(_: Props) {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const orderHistory = useOrdersStore((s) => s.orderHistory);
  const lastOrder = useOrdersStore((s) => s.lastOrder);

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      {lastOrder ? (
        <Card style={styles.lastOrderCard}>
          <Text style={styles.kicker}>Latest order</Text>
          <Text style={styles.lastOrderNumber}>#{lastOrder.orderId}</Text>
          <Text style={styles.lastOrderMeta}>{formatStatus(lastOrder.status)} · {lastOrder.pickupLabel}</Text>
          <Text style={styles.lastOrderTotal}>{formatCurrency(lastOrder.totalCents / 100)}</Text>
          <View style={styles.lastOrderAction}>
            <Button
              label="View Status"
              onPress={() => rootNavigation.navigate('OrderStatus', { orderId: lastOrder.orderId })}
            />
          </View>
        </Card>
      ) : null}

      {orderHistory.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Place your first pickup order to track status here.</Text>
        </View>
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable onPress={() => rootNavigation.navigate('OrderStatus', { orderId: item.orderId })}>
              <Card style={styles.orderCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.orderId}>#{item.orderId}</Text>
                  <Text style={styles.orderStatus}>{formatStatus(item.status)}</Text>
                </View>
                <Text style={styles.orderMeta}>{item.pickupLabel}</Text>
                <Text style={styles.orderTotal}>{formatCurrency(item.totalCents / 100)}</Text>
              </Card>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  lastOrderCard: {
    gap: 6,
  },
  kicker: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    color: theme.colors.mutedLight,
  },
  lastOrderNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  lastOrderMeta: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  lastOrderTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.cocoa,
  },
  lastOrderAction: {
    marginTop: 6,
  },
  emptyWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    padding: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  emptyText: {
    marginTop: 4,
    color: theme.colors.muted,
  },
  listContent: {
    paddingBottom: 20,
    gap: 10,
  },
  orderCard: {
    gap: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  orderStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pine,
  },
  orderMeta: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  orderTotal: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.cocoa,
  },
});
