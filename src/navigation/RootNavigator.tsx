import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ItemScreen } from '../screens/ItemScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { LocationPickerScreen } from '../screens/LocationPickerScreen';
import { OrderStatusScreen } from '../screens/OrderStatusScreen';
import { useCartStore } from '../store/useCartStore';
import type { MainTabParamList, RootStackParamList } from './types';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.bg,
    card: theme.colors.cocoa,
    text: theme.colors.cream,
    primary: theme.colors.crust,
    border: theme.colors.cocoa,
  },
};

function MainTabs() {
  const cartCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.cocoa },
        headerTintColor: theme.colors.cream,
        headerTitleStyle: { fontSize: 22, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: theme.colors.bgSoft,
          borderTopColor: theme.colors.border,
          height: 70,
          paddingTop: 8,
          borderTopWidth: 0,
          borderRadius: 22,
          marginHorizontal: 10,
          marginBottom: 8,
          position: 'absolute',
        },
        tabBarActiveTintColor: theme.colors.cocoa,
        tabBarInactiveTintColor: theme.colors.mutedLight,
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12, marginBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          const iconByRoute: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home-outline',
            Menu: 'restaurant-outline',
            Cart: 'bag-handle-outline',
            Orders: 'receipt-outline',
            Account: 'person-outline',
          };
          return <Ionicons name={iconByRoute[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Salt & Yeast' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.berry,
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '700',
          },
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.cocoa },
          headerTintColor: theme.colors.cream,
          headerTitleStyle: { fontSize: 22, fontWeight: '700' },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Item" component={ItemScreen} options={{ title: 'Bakery Detail' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
        <Stack.Screen name="OrderStatus" component={OrderStatusScreen} options={{ title: 'Order Status' }} />
        <Stack.Screen name="LocationPicker" component={LocationPickerScreen} options={{ title: 'Select Location' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
