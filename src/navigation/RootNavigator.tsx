import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ItemScreen } from '../screens/ItemScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { AccountScreen } from '../screens/AccountScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF7ED',
    card: '#4A2F1D',
    text: '#FFF7ED',
    primary: '#D8A25E',
    border: '#4A2F1D',
  },
};

const headerOptions = {
  headerStyle: { backgroundColor: '#4A2F1D' },
  headerTintColor: '#FFF7ED',
  contentStyle: { backgroundColor: '#FFF7ED' },
} as const;

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Home" screenOptions={headerOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Salt & Yeast' }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
        <Stack.Screen name="Item" component={ItemScreen} options={{ title: 'Item Detail' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
