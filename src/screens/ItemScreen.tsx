import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { PriceTag } from '../components/ui/PriceTag';
import { getMenuItemById } from '../services/mock/menu';
import { useCartStore } from '../store/useCartStore';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Item'>;

export function ItemScreen({ route, navigation }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const item = getMenuItemById(route.params.itemId);

  if (!item) {
    return (
      <ScreenContainer style={styles.centered}>
        <Text style={styles.notFound}>Item not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.body}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <PriceTag amount={item.price} size="lg" />

          {item.tags && item.tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <Button
            label="Add to Cart"
            onPress={() => {
              addItem(item);
              navigation.navigate('Cart');
            }}
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
    color: '#4A2F1D',
  },
  image: {
    width: '100%',
    height: 288,
  },
  body: {
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A2F1D',
  },
  description: {
    fontSize: 16,
    color: 'rgba(60,60,60,0.75)',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(201,168,76,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2F1D',
    textTransform: 'capitalize',
  },
});
