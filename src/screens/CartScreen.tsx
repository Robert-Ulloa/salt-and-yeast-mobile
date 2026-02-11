import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PriceTag } from '../components/ui/PriceTag';
import { useCartStore } from '../store/useCartStore';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal)();
  const removeItem = useCartStore((s) => s.removeItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);

  return (
    <ScreenContainer style={styles.container}>
      {lines.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
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
                  <Pressable onPress={() => decrement(line.item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </Pressable>
                  <Text style={styles.qtyValue}>{line.quantity}</Text>
                  <Pressable onPress={() => increment(line.item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable onPress={() => removeItem(line.item.id)} style={styles.removeBtn}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </Card>
          )}
          ListFooterComponent={<View style={{ height: 8 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <View style={styles.rowBetween}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <PriceTag amount={subtotal} />
        </View>
        <Button label="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} disabled={lines.length === 0} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(60,60,60,0.65)',
  },
  lineCard: {
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2F1D',
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A2F1D',
    lineHeight: 22,
  },
  qtyValue: {
    width: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2F1D',
  },
  removeBtn: {
    marginTop: 10,
  },
  removeText: {
    fontSize: 14,
    color: '#8A1C4A',
  },
  footer: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(216,162,94,0.3)',
    paddingTop: 12,
    paddingBottom: 16,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2F1D',
  },
});
