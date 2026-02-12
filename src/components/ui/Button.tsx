import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../utils/theme';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

const containerByVariant: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: theme.colors.crust },
  secondary: { backgroundColor: theme.colors.cocoa },
  outline: {
    backgroundColor: theme.colors.bgSoft,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
};

const textByVariant: Record<Variant, TextStyle> = {
  primary: { color: theme.colors.ink },
  secondary: { color: theme.colors.cream },
  outline: { color: theme.colors.ink },
};

export function Button({ label, onPress, variant = 'primary', disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        containerByVariant[variant],
        variant === 'primary' ? theme.shadow.button : null,
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[styles.text, textByVariant[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
