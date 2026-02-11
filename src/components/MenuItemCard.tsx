import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BakeryItem } from '../types/menu';
import { PriceTag } from './ui/PriceTag';

type Props = {
  item: BakeryItem;
  onPress: () => void;
};

export function MenuItemCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <PriceTag amount={item.price} />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(216,162,94,0.35)',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 176,
  },
  body: {
    gap: 8,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#4A2F1D',
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(60,60,60,0.7)',
  },
});
