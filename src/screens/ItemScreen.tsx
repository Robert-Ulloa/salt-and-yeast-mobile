import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { PriceTag } from '../components/ui/PriceTag';
import { getMenuItemById } from '../services/mock/menu';
import { useCartStore } from '../store/useCartStore';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Item'>;

type CoffeeSize = 'short' | 'tall' | 'grande' | 'venti';

export function ItemScreen({ route, navigation }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const item = getMenuItemById(route.params.itemId);
  const isCoffee = item?.category === 'Coffee';

  const [selectedSize, setSelectedSize] = useState<CoffeeSize>('grande');
  const [extraShot, setExtraShot] = useState(false);
  const [oatMilk, setOatMilk] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return (
      <ScreenContainer style={styles.centered}>
        <Text style={styles.notFound}>Item not found</Text>
      </ScreenContainer>
    );
  }

  const totalPrice = useMemo(() => {
    if (!isCoffee) return item.price;
    const sizeDelta =
      selectedSize === 'short' ? -0.4 : selectedSize === 'tall' ? 0 : selectedSize === 'grande' ? 0.75 : 1.5;
    const addonDelta = (extraShot ? 0.9 : 0) + (oatMilk ? 0.75 : 0);
    return Math.max(item.price + sizeDelta + addonDelta, 0);
  }, [item.price, selectedSize, extraShot, oatMilk, isCoffee]);

  const handleAddToCart = () => {
    const cartItem = isCoffee
      ? {
          ...item,
          id: `${item.id}-${selectedSize}-${extraShot ? 'shot' : 'no'}-${oatMilk ? 'oat' : 'reg'}`,
          name: `${item.name} (${selectedSize})`,
          price: totalPrice,
        }
      : item;
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }
    navigation.navigate('MainTabs', { screen: 'Cart' });
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.body}>
          <Text style={styles.category}>{item.category.toUpperCase()}</Text>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <PriceTag amount={totalPrice} size="lg" />

          {item.tags && item.tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Coffee-only customization */}
          {isCoffee ? (
            <>
              <Text style={styles.customizeTitle}>Size</Text>
              <View style={styles.optionRow}>
                {(['short', 'tall', 'grande', 'venti'] as const).map((size) => (
                  <Button
                    key={size}
                    label={size}
                    variant={selectedSize === size ? 'primary' : 'outline'}
                    onPress={() => setSelectedSize(size)}
                  />
                ))}
              </View>
              <Text style={styles.customizeTitle}>Add-ons</Text>
              <View style={styles.optionRow}>
                <Button
                  label={extraShot ? 'Extra Shot +$0.90' : 'Extra Shot +$0.90'}
                  variant={extraShot ? 'secondary' : 'outline'}
                  onPress={() => setExtraShot((s) => !s)}
                />
                <Button
                  label={oatMilk ? 'Oat Milk +$0.75' : 'Oat Milk +$0.75'}
                  variant={oatMilk ? 'secondary' : 'outline'}
                  onPress={() => setOatMilk((s) => !s)}
                />
              </View>
            </>
          ) : null}

          {/* Quantity selector */}
          <Text style={styles.customizeTitle}>Quantity</Text>
          <View style={styles.qtyRow}>
            <Button
              label="-"
              variant="outline"
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Button
              label="+"
              variant="outline"
              onPress={() => setQuantity((q) => q + 1)}
            />
          </View>

          <Button
            label={`Add to Cart · $${(totalPrice * quantity).toFixed(2)}`}
            onPress={handleAddToCart}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  notFound: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.ink,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  body: {
    marginTop: -18,
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: theme.colors.bgSoft,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  category: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '700',
    color: theme.colors.crustDeep,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    color: theme.colors.ink,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 16,
    lineHeight: 23,
    color: theme.colors.muted,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(201,168,76,0.24)',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.cocoa,
    textTransform: 'capitalize',
  },
  customizeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.ink,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.ink,
    minWidth: 30,
    textAlign: 'center',
  },
});
