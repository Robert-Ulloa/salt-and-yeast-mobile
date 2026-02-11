import { SectionList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuItemCard } from '../components/MenuItemCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { getMenuSections } from '../services/mock/menu';
import type { RootStackParamList } from '../navigation/types';
import type { BakeryItem } from '../types/menu';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const sections = getMenuSections().map((s) => ({
  key: s.id,
  title: s.title,
  data: s.items,
}));

export function MenuScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item: BakeryItem) => item.id}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onPress={() => navigation.navigate('Item', { itemId: item.id })} />
        )}
        renderSectionHeader={({ section }) => <SectionHeader title={section.title} style={styles.sectionHeader} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    marginTop: 16,
  },
});
