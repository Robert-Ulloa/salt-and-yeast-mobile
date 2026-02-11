import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';

export function AccountScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SY</Text>
        </View>
        <Text style={styles.name}>Demo User</Text>
        <Text style={styles.email}>demo@saltandyeast.com</Text>
      </View>

      <SectionHeader title="Account" />
      <Card style={styles.spacing}>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.subtitle}>No orders yet.</Text>
      </Card>
      <Card style={styles.spacing}>
        <Text style={styles.title}>Favorite Location</Text>
        <Text style={styles.subtitle}>Downtown Austin</Text>
      </Card>
      <Card>
        <Text style={styles.title}>Payment Methods</Text>
        <Text style={styles.subtitle}>Demo mode - no payment integration.</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  hero: {
    marginBottom: 24,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: '#4A2F1D',
    padding: 24,
  },
  avatar: {
    marginBottom: 12,
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#D8A25E',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A2F1D',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF7ED',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: '#D8A25E',
  },
  spacing: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: '#3C3C3C',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(60,60,60,0.6)',
  },
});
