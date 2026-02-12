import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LocationSelector } from '../components/LocationSelector';
import { getLocationById } from '../services/mock/locations';
import { useAppStore } from '../store/useAppStore';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { theme } from '../utils/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Account'>;

const REWARD_GOAL = 200;

export function AccountScreen(_: Props) {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedLocationId = useAppStore((s) => s.selectedLocationId);
  const loyaltyStars = useAppStore((s) => s.loyaltyStars);
  const location = getLocationById(selectedLocationId);

  const progress = Math.min(loyaltyStars / REWARD_GOAL, 1);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <LocationSelector onPressChange={() => rootNavigation.navigate('LocationPicker')} />

        {/* Loyalty hero card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.starCircle}>
              <Text style={styles.starEmoji}>{'\u2B50'}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle}>{loyaltyStars} Stars</Text>
              <Text style={styles.heroSubtitle}>
                {REWARD_GOAL - loyaltyStars > 0
                  ? `${REWARD_GOAL - loyaltyStars} more to your next reward`
                  : 'Reward unlocked!'}
              </Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0</Text>
            <Text style={styles.progressLabel}>{REWARD_GOAL}</Text>
          </View>
        </Card>

        <SectionHeader title="Your Info" style={styles.sectionHeader} />

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>Demo User</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>demo@saltandyeast.com</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Favorite Location</Text>
            <Text style={styles.infoValue}>{location?.name ?? 'Not set'}</Text>
          </View>
        </Card>

        <SectionHeader title="Past Orders" style={styles.sectionHeader} />

        <Card>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{'\uD83E\uDDFE'}</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Your completed orders will appear here.</Text>
          </View>
        </Card>

        <SectionHeader title="Subscription" style={styles.sectionHeader} />

        <Card>
          <View style={styles.subRow}>
            <View style={styles.subBadge}>
              <Text style={styles.subBadgeText}>Coming Soon</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.subTitle}>Bread & Pastry Box</Text>
              <Text style={styles.subText}>
                Weekly or bi-weekly delivery of freshly baked goods.
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
  },
  // Loyalty hero
  heroCard: {
    backgroundColor: theme.colors.pine,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  starCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starEmoji: {
    fontSize: 22,
  },
  heroInfo: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 2,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.crust,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
  },
  // Sections
  sectionHeader: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 22,
    lineHeight: 26,
  },
  // Info card
  infoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 15,
    color: theme.colors.muted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.muted,
  },
  // Subscription
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subBadge: {
    backgroundColor: 'rgba(216,162,94,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.crustDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  subText: {
    marginTop: 2,
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 10,
  },
});
