import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { fetchLocations } from '../services/api/bakeryApi';
import { useAppStore } from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';
import type { Location } from '../types/menu';
import { theme } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationPicker'>;

export function LocationPickerScreen({ navigation }: Props) {
  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const setLocation = useAppStore((s) => s.setLocation);

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextLocations = await fetchLocations();
      setLocations(nextLocations);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to load locations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Choose your bakery</Text>
      <Text style={styles.subtitle}>Menus and pickup times are location-specific.</Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.colors.cocoa} />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Retry" variant="outline" onPress={loadLocations} />
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const active = selectedLocationId === item.id;
            return (
              <Pressable
                onPress={() => setLocation(item.id)}
                style={[styles.locationCard, active && styles.locationCardActive]}
              >
                <Image source={{ uri: item.image }} style={styles.locationImage} resizeMode="cover" />
                <View style={styles.locationBody}>
                  <View style={styles.nameRow}>
                    <Text style={styles.locationName}>{item.name}</Text>
                    {item.isOpenNow ? (
                      <View style={styles.openBadge}>
                        <Text style={styles.openBadgeText}>Open</Text>
                      </View>
                    ) : (
                      <View style={styles.closedBadge}>
                        <Text style={styles.closedBadgeText}>Closed</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.locationInfo}>{item.address}</Text>
                  <Text style={styles.locationInfo}>{item.hoursLabel}</Text>
                  {item.isOpenNow ? (
                    <Text style={styles.eta}>Pickup in ~{item.pickupEtaMins} min</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      <Button
        label="Continue"
        disabled={!selectedLocationId}
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  errorWrap: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    padding: 12,
    gap: 8,
  },
  errorText: {
    color: theme.colors.berry,
    fontWeight: '600',
    fontSize: 14,
  },
  locationCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    overflow: 'hidden',
  },
  locationCardActive: {
    borderColor: theme.colors.pine,
    borderWidth: 2,
  },
  locationImage: {
    width: '100%',
    height: 120,
  },
  locationBody: {
    padding: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  openBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(88,181,140,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  openBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.pine,
  },
  closedBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(138,28,74,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  closedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.berry,
  },
  locationInfo: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  eta: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.pine,
  },
});
