import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  useEffect,
  useRef,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect as useEffectNative, useRef as useRefNative } from 'react';
import { Animated as RNAnimated } from 'react-native';

const menuItems = [
  { label: 'Home', icon: 'home-outline', route: '/', color: '#4361ee' },
  { label: 'Explore', icon: 'compass-outline', route: '/(tabs)/explore', color: '#7209b7' },
  { label: 'Profile', icon: 'person-outline', route: '/profile', color: '#f72585' },
  { label: 'Settings', icon: 'settings-outline', route: '/settings', color: '#f77f00' },
  { label: 'Messages', icon: 'chatbubble-outline', route: '/(drawer)/messages', color: '#4cc9f0' },
];

export default function MenuModal() {
  const fadeAnim = useRefNative(new RNAnimated.Value(0)).current;
  const slideAnim = useRefNative(new RNAnimated.Value(40)).current;

  useEffectNative(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 40,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => router.back());
  };

  const handleNavigate = (route: string) => {
    router.back();
    setTimeout(() => router.push(route as any), 100);
  };

  return (
    <RNAnimated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

      <RNAnimated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Navigation</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => handleNavigate(item.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#333" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </RNAnimated.View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#2a2a40',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#222235',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  cancelBtn: {
    marginTop: 16,
    backgroundColor: '#2a2a40',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#888',
  },
});
