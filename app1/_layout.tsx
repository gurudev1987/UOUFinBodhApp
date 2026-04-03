import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My App',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/menu')}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="menu" size={26} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(drawer)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}


// import { Tabs } from 'expo-router';

// export default function TabLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen name="index" options={{ title: 'Home' }} />
//     </Tabs>
//   );
// }
