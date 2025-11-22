import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

const Colors = {
  light: {
    background: '#FFF4E6',
  },
  dark: {
    background: '#161b33',
  },
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