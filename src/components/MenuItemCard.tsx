import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BakeryItem } from '../types/menu';
import { PriceTag } from './ui/PriceTag';
import { theme } from '../utils/theme';

type Props = {
  item: BakeryItem;
  onPress: () => void;
  onQuickAdd?: () => void;
};

export function MenuItemCard({ item, onPress, onQuickAdd }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const showFallback = imageFailed || !item.image;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {showFallback ? (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>Salt & Yeast</Text>
        </View>
      ) : (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />
      )}
      <View style={styles.imageShade} />
      {item.tags?.length ? (
        <View style={styles.tagPill}>
          <Text style={styles.tagLabel}>{item.tags[0]}</Text>
        </View>
      ) : null}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.priceActions}>
            <PriceTag amount={item.price} />
            {onQuickAdd ? (
              <Pressable onPress={onQuickAdd} style={styles.quickAddBtn}>
                <Text style={styles.quickAddText}>+ Add</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(216,162,94,0.35)',
    backgroundColor: theme.colors.card,
    ...theme.shadow.card,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: '100%',
    height: 198,
  },
  imageFallback: {
    width: '100%',
    height: 198,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6DACA',
  },
  imageFallbackText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.cocoa,
  },
  imageShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 140,
    height: 58,
    backgroundColor: 'rgba(17, 10, 6, 0.15)',
  },
  tagPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 247, 237, 0.92)',
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    color: theme.colors.cocoa,
  },
  body: {
    gap: 9,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  quickAddBtn: {
    borderRadius: 999,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  quickAddText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.cocoa,
  },
  name: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.ink,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 23,
    color: theme.colors.muted,
  },
});
