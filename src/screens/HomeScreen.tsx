import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { getLocations } from '../services/mock/locations';
import type { RootStackParamList } from '../navigation/types';

const locations = getLocations();

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Salt & Yeast</Text>
          <Text style={styles.heroSubtitle}>Artisan bakery across Austin, TX.</Text>
        </View>

        <SectionHeader title="Locations" />
        {locations.map((loc) => (
          <Card key={loc.id} style={styles.cardSpacing}>
            <Text style={styles.locationName}>{loc.name}</Text>
            <Text style={styles.locationAddress}>{loc.address}</Text>
          </Card>
        ))}

        <View style={styles.actions}>
          <Button label="Browse Menu" onPress={() => navigation.navigate('Menu')} />
          <Button label="View Cart" variant="outline" onPress={() => navigation.navigate('Cart')} />
          <Button label="Account" variant="secondary" onPress={() => navigation.navigate('Account')} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  hero: {
    marginBottom: 28,
    borderRadius: 24,
    backgroundColor: '#4A2F1D',
    padding: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF7ED',
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#D8A25E',
  },
  cardSpacing: {
    marginBottom: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2F1D',
  },
  locationAddress: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(60,60,60,0.75)',
  },
  actions: {
    marginTop: 20,
    gap: 12,
    paddingBottom: 12,
  },
});
