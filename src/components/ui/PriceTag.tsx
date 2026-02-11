import { StyleSheet, Text } from 'react-native';
import { formatCurrency } from '../../utils/currency';

type Props = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
};

export function PriceTag({ amount, size = 'md' }: Props) {
  return <Text style={[styles.base, size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md]}>{formatCurrency(amount)}</Text>;
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '700',
    color: '#8A1C4A',
  },
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 28,
  },
});
