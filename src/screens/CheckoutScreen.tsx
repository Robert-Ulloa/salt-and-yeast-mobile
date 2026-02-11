import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PriceTag } from '../components/ui/PriceTag';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../utils/currency';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const TAX_RATE = 0.0825;

export function CheckoutScreen({ navigation }: Props) {
  const itemCount = useCartStore((s) => s.itemCount)();
  const subtotal = useCartStore((s) => s.subtotal)();
  const clear = useCartStore((s) => s.clear);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <ScreenContainer style={styles.container}>
      <Card style={styles.card}>
        <Row label="Items" value={String(itemCount)} />
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Estimated Tax" value={formatCurrency(tax)} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <PriceTag amount={total} size="lg" />
        </View>
        <Text style={styles.note}>Demo checkout only - no real payment.</Text>
      </Card>

      <View style={styles.actions}>
        <Button
          label="Place Mock Order"
          onPress={() => {
            clear();
            navigation.navigate('Home');
          }}
        />
        <Button label="Back to Cart" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 16,
    color: 'rgba(60,60,60,0.75)',
  },
  rowValue: {
    fontSize: 16,
    color: '#3C3C3C',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(216,162,94,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2F1D',
  },
  note: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(60,60,60,0.6)',
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
});
