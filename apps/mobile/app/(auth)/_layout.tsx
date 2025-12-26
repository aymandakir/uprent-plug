import { Stack } from 'expo-router';

export default function AuthLayout() {
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
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: 'Sign In', headerShown: true }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up', headerShown: true }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset Password', headerShown: true }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}