import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuItemCard } from '../components/MenuItemCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LocationSelector } from '../components/LocationSelector';
import { fetchMenu } from '../services/api/bakeryApi';
import { useCartStore } from '../store/useCartStore';
import { useAppStore } from '../store/useAppStore';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { BakeryItem, MenuCategory } from '../types/menu';
import { theme } from '../utils/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Menu'>;

const categories = ['All', 'Pastries', 'Bread', 'Brunch', 'Coffee', 'Gifts'] as const;

export function MenuScreen(_: Props) {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const selectedOccasion = useAppStore((s) => s.occasion);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');
  const [menuItems, setMenuItems] = useState<BakeryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const loadMenu = useCallback(async () => {
    if (!selectedLocationId) {
      setMenuItems([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextItems = await fetchMenu(selectedLocationId);
      setMenuItems(nextItems);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to load menu.');
    } finally {
      setLoading(false);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  if (!selectedLocationId) {
    return (
      <ScreenContainer style={styles.centered}>
        <Text style={styles.emptyTitle}>Pick a location first</Text>
        <Pressable onPress={() => rootNavigation.navigate('LocationPicker')} style={styles.linkBtn}>
          <Text style={styles.linkText}>Choose location</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const categoryFilter = selectedCategory === 'All' ? 'All' : (selectedCategory as MenuCategory);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = menuItems.filter((item) => {
    const categoryOk = categoryFilter === 'All' || item.category === categoryFilter;
    const queryOk =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery);
    return categoryOk && queryOk;
  });

  const sections = (['Pastries', 'Bread', 'Brunch', 'Coffee', 'Gifts'] as const)
    .map((cat) => ({
      key: cat.toLowerCase(),
      title: cat,
      data: filteredItems.filter((item) => item.category === cat),
    }))
    .filter((section) => section.data.length > 0);

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

  const featuredOccasionItems = useMemo(() => {
    if (!selectedOccasion) return featured.bestSellers;
    if (selectedOccasion === 'brunch') return featured.weekendBrunch;
    if (selectedOccasion === 'coffee') return menuItems.filter((i) => i.category === 'Coffee').slice(0, 6);
    if (selectedOccasion === 'gifts') return menuItems.filter((i) => i.category === 'Gifts').slice(0, 6);
    return menuItems.slice(0, 6);
  }, [featured.bestSellers, featured.weekendBrunch, menuItems, selectedOccasion]);

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item: BakeryItem) => item.id}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onPress={() => rootNavigation.navigate('Item', { itemId: item.id })}
            onQuickAdd={() => addItem(item)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderWrap}>
            <SectionHeader title={section.title} style={styles.sectionHeader} />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.headerBlock}>
              <LocationSelector onPressChange={() => rootNavigation.navigate('LocationPicker')} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search menu"
                placeholderTextColor={theme.colors.mutedLight}
                style={styles.searchInput}
              />
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.categoryRow}
                renderItem={({ item }) => {
                  const active = selectedCategory === item;
                  return (
                    <Pressable
                      onPress={() => setSelectedCategory(item)}
                      style={[styles.categoryChip, active && styles.categoryChipActive]}
                    >
                      <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{item}</Text>
                    </Pressable>
                  );
                }}
              />
            </View>

            {error ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{error}</Text>
                <ButtonRow label="Retry" onPress={loadMenu} />
              </View>
            ) : null}

            {loading ? <MenuSkeleton /> : null}

            {!loading && !error ? (
              <View style={styles.featuredBlock}>
                <SectionHeader title="Seasonal" style={styles.featureHeader} />
                <FeatureRow items={featured.seasonal} onItemPress={(id) => rootNavigation.navigate('Item', { itemId: id })} />
                <SectionHeader title="Best Sellers" style={styles.featureHeader} />
                <FeatureRow items={featuredOccasionItems} onItemPress={(id) => rootNavigation.navigate('Item', { itemId: id })} />
                <SectionHeader title="Weekend Brunch" style={styles.featureHeader} />
                <FeatureRow items={featured.weekendBrunch} onItemPress={(id) => rootNavigation.navigate('Item', { itemId: id })} />
              </View>
            ) : null}
          </>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyResultsWrap}>
              <Text style={styles.noResultsTitle}>No items found</Text>
              <Text style={styles.noResults}>Try a different search or category.</Text>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

function ButtonRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.retryBtn}>
      <Text style={styles.retryText}>{label}</Text>
    </Pressable>
  );
}

function FeatureRow({
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

function MenuSkeleton() {
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
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  headerBlock: {
    paddingTop: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.colors.ink,
    marginBottom: 10,
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 6,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.cocoa,
    borderColor: theme.colors.cocoa,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.cocoa,
  },
  categoryChipTextActive: {
    color: theme.colors.cream,
  },
  featuredBlock: {
    marginTop: 14,
    marginBottom: 6,
    gap: 4,
  },
  featureHeader: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 6,
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
  sectionHeaderWrap: {
    marginTop: 14,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 26,
    lineHeight: 30,
  },
  emptyResultsWrap: {
    alignItems: 'center',
    marginTop: 26,
  },
  noResultsTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  noResults: {
    textAlign: 'center',
    color: theme.colors.muted,
    marginTop: 6,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 10,
  },
  linkBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkText: {
    color: theme.colors.cocoa,
    fontWeight: '700',
  },
  errorWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgSoft,
    padding: 12,
    gap: 8,
    marginTop: 10,
  },
  errorText: {
    color: theme.colors.berry,
    fontSize: 14,
    fontWeight: '600',
  },
  retryBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: theme.colors.cocoa,
    fontWeight: '700',
    fontSize: 13,
  },
  skeletonWrap: {
    marginTop: 10,
    gap: 8,
  },
  skeletonTitle: {
    height: 22,
    width: 160,
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
});
