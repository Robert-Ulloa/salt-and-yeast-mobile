import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getCachedLocationById } from '../services/api/bakeryApi';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../utils/theme';

type Props = {
  onPressChange: () => void;
};

export function LocationSelector({ onPressChange }: Props) {
  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const location = getCachedLocationById(selectedLocationId);

  return (
    <Pressable onPress={onPressChange} style={styles.row}>
      <View>
        <Text style={styles.label}>Pickup Location</Text>
        <Text style={styles.value}>📍 {location?.name ?? 'Choose location'}</Text>
      </View>
      <Text style={styles.change}>Change</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    color: theme.colors.mutedLight,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  change: {
    color: theme.colors.cocoa,
    fontWeight: '700',
  },
});
