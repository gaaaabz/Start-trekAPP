import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

export default function Layout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        contentStyle: { backgroundColor: theme.background }, 
      }}
    >
    </Stack>
  );
}