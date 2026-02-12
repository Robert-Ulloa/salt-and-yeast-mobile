import { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../utils/theme';

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function ScreenContainer({ children, style }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.bgAccent} />
      <View style={styles.bgAccentSoft} />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  bgAccent: {
    position: 'absolute',
    top: -180,
    right: -90,
    width: 340,
    height: 340,
    borderRadius: 999,
    backgroundColor: 'rgba(231, 200, 77, 0.24)',
  },
  bgAccentSoft: {
    position: 'absolute',
    top: 120,
    left: -140,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: 'rgba(31, 90, 70, 0.08)',
  },
  content: {
    flex: 1,
  },
});
