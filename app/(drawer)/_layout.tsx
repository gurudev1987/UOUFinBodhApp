import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DrawerLayoutAndroid,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerContainer}
      contentContainerStyle={{ flex: 1 }}
    >
      {/* <View style={styles.drawerHeader}>
        <View style={styles.drawerAvatar}>
          <Ionicons name="person" size={28} color="#4361ee" />
        </View>
        <Text style={styles.drawerName}>Alex Johnson</Text>
        <Text style={styles.drawerEmail}>alex@example.com</Text>
      </View> */}

      <View style={styles.divider} />

      <DrawerItemList {...props} />

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color="#ff6b6b" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: '#4361ee',
          drawerInactiveTintColor: '#888',
          drawerActiveBackgroundColor: '#4361ee22',
          drawerStyle: {
            backgroundColor: '#0f0f1a',
            width: 260,
          },
          drawerLabelStyle: {
            fontSize: 15,
            fontWeight: '600',
          },
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="messages"
          options={{
            title: 'Messages',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#0f0f1a',
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'flex-start',
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4361ee22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4361ee',
    marginBottom: 12,
  },
  drawerName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  drawerEmail: { fontSize: 13, color: '#555', marginTop: 3 },
  divider: {
    height: 1,
    backgroundColor: '#2a2a40',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  drawerFooter: {
    padding: 20,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#2a2a40',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: { fontSize: 15, color: '#ff6b6b', fontWeight: '600' },
});
