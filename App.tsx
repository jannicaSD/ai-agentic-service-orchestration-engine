import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import { Text, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    border: '#334155',
    primary: '#3B82F6',
  },
};

export default function App() {
  const APP_MODE = process.env.EXPO_PUBLIC_APP_MODE || 'mock';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={CustomDarkTheme}>
          {APP_MODE !== 'real' && (
            <View style={{ backgroundColor: '#7c3aed', padding: 6 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                Mock Mode — Supabase disabled. App runs with local demo data.
              </Text>
            </View>
          )}
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
