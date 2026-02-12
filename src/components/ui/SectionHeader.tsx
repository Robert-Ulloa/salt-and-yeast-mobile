import { StyleSheet, Text, TextStyle } from 'react-native';
import { theme } from '../../utils/theme';

type Props = {
  title: string;
  style?: TextStyle;
};

export function SectionHeader({ title, style }: Props) {
  return <Text style={[styles.title, style]}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 14,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: theme.colors.ink,
  },
});
