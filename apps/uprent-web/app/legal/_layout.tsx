import { Stack } from 'expo-router';

export default function LegalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Back',
        presentation: 'card',
        animation: 'default',
      }}
    >
      <Stack.Screen
        name="terms"
        options={{
          title: 'Terms of Service',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy Policy',
        }}
      />
    </Stack>
  );
}

