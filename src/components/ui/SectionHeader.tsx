import { StyleSheet, Text, TextStyle } from 'react-native';

type Props = {
  title: string;
  style?: TextStyle;
};

export function SectionHeader({ title, style }: Props) {
  return <Text style={[styles.title, style]}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '700',
    color: '#4A2F1D',
  },
});
