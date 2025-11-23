import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  light: {
    background: '#ffffff',
    card: '#e3e8ff',
    primary: '#4a90ff',
    text: '#1a2340',
    heading: '#2c3878',
    tabActive: '#4a90ff',
    tabInactive: '#777',
  },
  dark: {
    background: '#0b0f19',
    card: '#1a1f33',
    primary: '#6aa8ff',
    text: '#d1dbff',
    heading: '#6aa8ff',
    tabActive: '#6aa8ff',
    tabInactive: '#777',
  }
};

export default function AuthTabsLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
          color: theme.text,
        },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={focused ? theme.tabActive : theme.tabInactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={26}
              color={focused ? theme.tabActive : theme.tabInactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}
