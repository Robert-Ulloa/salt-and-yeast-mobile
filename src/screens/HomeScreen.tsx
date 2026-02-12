import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { fetchLocations, fetchMenu } from '../services/api/bakeryApi';
import { useAppStore } from '../store/useAppStore';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { BakeryItem, Location } from '../types/menu';
import { theme } from '../utils/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const setOccasion = useAppStore((s) => s.setOccasion);
  const selectedOccasion = useAppStore((s) => s.occasion);
  const appHydrated = useAppStore((s) => s.hasHydrated);

  const [locations, setLocations] = useState<Location[]>([]);
  const [menuItems, setMenuItems] = useState<BakeryItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    setLoadingLocations(true);
    setLocationsError(null);

    try {
      const nextLocations = await fetchLocations();
      setLocations(nextLocations);
    } catch (error) {
      setLocationsError(error instanceof Error ? error.message : 'Failed to load locations.');
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  const loadMenu = useCallback(async () => {
    if (!selectedLocationId) {
      setMenuItems([]);
      setMenuError(null);
      setLoadingMenu(false);
      return;
    }

    setLoadingMenu(true);
    setMenuError(null);

    try {
      const nextItems = await fetchMenu(selectedLocationId);
      setMenuItems(nextItems);
    } catch (error) {
      setMenuError(error instanceof Error ? error.message : 'Failed to load menu.');
    } finally {
      setLoadingMenu(false);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (!appHydrated) return;
    if (!selectedLocationId) {
      rootNavigation.navigate('LocationPicker');
    }
  }, [appHydrated, selectedLocationId, rootNavigation]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const location = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId),
    [locations, selectedLocationId],
  );

  const featured = useMemo(() => {
    const seasonal = menuItems.filter((item) => item.tags?.includes('seasonal')).slice(0, 6);
    const bestSellers = menuItems
      .filter((item) => item.tags?.includes('bestSeller') || item.tags?.includes('popular'))
      .slice(0, 6);
    const weekendBrunch = menuItems
      .filter((item) => item.tags?.includes('weekend') || item.category === 'Brunch')
      .slice(0, 6);

    return { seasonal, bestSellers, weekendBrunch };
  }, [menuItems]);

  const hasError = Boolean(locationsError || menuError);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.locationBar} onPress={() => rootNavigation.navigate('LocationPicker')}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
            <Text style={styles.locationValue}>{location?.name ?? 'Choose location'}</Text>
            <Text style={styles.locationMeta}>{location?.hoursLabel ?? 'Location required to order'}</Text>
          </View>
          <Text style={styles.change}>Change</Text>
        </Pressable>

        <View style={styles.heroBlock}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Salt & Yeast</Text>
            <Text style={styles.heroSubtitle}>Artisan bakery. Pickup-first ordering.</Text>
            <View style={styles.heroCta}>
              <Button label="Order Now" onPress={() => navigation.navigate('Menu')} />
            </View>
          </View>
        </View>

        <SectionHeader title="Occasions" style={styles.sectionHeader} />
        <View style={styles.occasionRow}>
          {OCCASIONS.map((occ) => {
            const active = selectedOccasion === occ.key;
            return (
              <Pressable
                key={occ.key}
                onPress={() => setOccasion(active ? null : occ.key)}
                style={[styles.occasionChip, active && styles.occasionChipActive]}
              >
                <Text style={styles.occasionEmoji}>{occ.emoji}</Text>
                <Text style={[styles.occasionChipText, active && styles.occasionChipTextActive]}>
                  {occ.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {hasError ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{locationsError ?? menuError}</Text>
            <Button label="Retry" variant="outline" onPress={() => { loadLocations(); loadMenu(); }} />
          </View>
        ) : null}

        {loadingLocations || loadingMenu ? <HomeSkeleton /> : null}

        {!loadingMenu && !hasError && menuItems.length === 0 && selectedLocationId ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No menu items yet</Text>
            <Text style={styles.emptyText}>Try a different location.</Text>
          </View>
        ) : null}

        {!loadingMenu && !hasError && featured.bestSellers.length > 0 ? (
          <>
            <SectionHeader title="Best Sellers" style={styles.sectionHeader} />
            <FeaturedRow
              items={featured.bestSellers}
              onItemPress={(id) => rootNavigation.navigate('Item', { itemId: id })}
            />
          </>
        ) : null}

        {!loadingMenu && !hasError && featured.seasonal.length > 0 ? (
          <>
            <SectionHeader title="Seasonal" style={styles.sectionHeader} />
            <FeaturedRow
              items={featured.seasonal}
              onItemPress={(id) => rootNavigation.navigate('Item', { itemId: id })}
            />
          </>
        ) : null}

        {!loadingMenu && !hasError && featured.weekendBrunch.length > 0 ? (
          <>
            <SectionHeader title="Weekend Brunch" style={styles.sectionHeader} />
            <FeaturedRow
              items={featured.weekendBrunch}
              onItemPress={(id) => rootNavigation.navigate('Item', { itemId: id })}
            />
          </>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const OCCASIONS = [
  { key: 'brunch' as const, label: 'Brunch', emoji: '\u{1F373}' },
  { key: 'coffee' as const, label: 'Coffee', emoji: '\u{2615}' },
  { key: 'gifts' as const, label: 'Gifts', emoji: '\u{1F381}' },
  { key: 'catering' as const, label: 'Catering', emoji: '\u{1F370}' },
];

function FeaturedRow({
  items,
  onItemPress,
}: {
  items: BakeryItem[];
  onItemPress: (id: string) => void;
}) {
  return (
    <FlatList
      data={items}
      horizontal
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.featureRow}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable onPress={() => onItemPress(item.id)} style={styles.featureCard}>
          <Image source={{ uri: item.image }} style={styles.featureImage} resizeMode="cover" />
          <View style={styles.featureBody}>
            <Text style={styles.featureName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.featurePrice}>${item.price.toFixed(2)}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

function HomeSkeleton() {
  return (
    <View style={styles.skeletonWrap}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  locationBar: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: { flex: 1 },
  locationLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    color: theme.colors.mutedLight,
  },
  locationValue: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.ink,
    marginTop: 2,
  },
  locationMeta: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 2,
  },
  change: {
    color: theme.colors.cocoa,
    fontWeight: '700',
    fontSize: 14,
  },
  heroBlock: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    height: 200,
    ...theme.shadow.card,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 67, 51, 0.56)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 15,
    color: 'rgba(255,255,255,0.82)',
  },
  heroCta: {
    marginTop: 14,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 4,
    fontSize: 24,
    lineHeight: 28,
  },
  occasionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  occasionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  occasionChipActive: {
    borderColor: theme.colors.cocoa,
    backgroundColor: 'rgba(31,90,70,0.1)',
  },
  occasionEmoji: {
    fontSize: 16,
  },
  occasionChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  occasionChipTextActive: {
    color: theme.colors.cocoa,
  },
  errorWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    padding: 12,
    gap: 8,
  },
  errorText: {
    color: theme.colors.berry,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    padding: 14,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 14,
  },
  skeletonWrap: {
    gap: 8,
  },
  skeletonTitle: {
    height: 22,
    width: 150,
    borderRadius: 8,
    backgroundColor: 'rgba(31, 90, 70, 0.14)',
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonCard: {
    flex: 1,
    height: 120,
    borderRadius: 12,
    backgroundColor: 'rgba(31, 90, 70, 0.1)',
  },
  featureRow: {
    gap: 8,
    paddingBottom: 4,
  },
  featureCard: {
    width: 160,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    backgroundColor: theme.colors.bgSoft,
    overflow: 'hidden',
  },
  featureImage: {
    width: '100%',
    height: 96,
  },
  featureBody: {
    padding: 10,
  },
  featureName: {
    color: theme.colors.ink,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  featurePrice: {
    marginTop: 4,
    color: theme.colors.berry,
    fontWeight: '800',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 8,
  },
});
