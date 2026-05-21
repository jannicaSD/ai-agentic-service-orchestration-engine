import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Activity, CalendarClock, Home, Cpu } from 'lucide-react-native';
import React from 'react';

import { BookingTimelineScreen } from '../screens/BookingTimelineScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProviderChatScreen } from '../screens/ProviderChatScreen';
import { ProviderProfileScreen } from '../screens/ProviderProfileScreen';
import { TraceLogsScreen } from '../screens/TraceLogsScreen';
import { FuturisticDashboardScreen } from '../screens/FuturisticDashboardScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// NOTE: Since the prompt requested specific styling, we map Bottom Tabs properly:
// Background: #121A2B, Active: #4F8CFF
// Because the user specifies `@react-navigation/bottom-tabs` standard setup, we adapt normal navigation styling.

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121A2B',
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarActiveTintColor: '#4F8CFF',
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingTimelineScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CalendarClock size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      <Tab.Screen 
        name="Traces" 
        component={TraceLogsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Activity size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      <Tab.Screen 
        name="Nexus" 
        component={FuturisticDashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Cpu size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
      <Stack.Screen name="ProviderChat" component={ProviderChatScreen} />
    </Stack.Navigator>
  );
};
