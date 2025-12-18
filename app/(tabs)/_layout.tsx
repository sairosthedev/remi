import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <ShoppingCart color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile" // We will create this as well for completeness
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
