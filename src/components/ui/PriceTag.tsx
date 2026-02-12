import { StyleSheet, Text } from 'react-native';
import { formatCurrency } from '../../utils/currency';
import { theme } from '../../utils/theme';

type Props = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
};

export function PriceTag({ amount, size = 'md' }: Props) {
  return (
    <Text
      style={[
        styles.base,
        size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md,
      ]}
    >
      {formatCurrency(amount)}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '800',
    color: theme.colors.pineDark,
    letterSpacing: 0.3,
  },
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 19,
  },
  lg: {
    fontSize: 34,
  },
});
