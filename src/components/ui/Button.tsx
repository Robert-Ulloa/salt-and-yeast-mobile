import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

const containerByVariant: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: '#D8A25E' },
  secondary: { backgroundColor: '#4A2F1D' },
  outline: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(74,47,29,0.2)' },
};

const textByVariant: Record<Variant, TextStyle> = {
  primary: { color: '#4A2F1D' },
  secondary: { color: '#FFF7ED' },
  outline: { color: '#4A2F1D' },
};

export function Button({ label, onPress, variant = 'primary', disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, containerByVariant[variant], disabled && styles.disabled]}
    >
      <Text style={[styles.text, textByVariant[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
