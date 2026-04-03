import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const navOptions = [
  {
    label: 'Tab Navigation',
    description: 'Bottom tab bar with 3 tabs',
    icon: 'apps-outline',
    route: '/(tabs)/',
    color: '#4361ee',
  },
  {
    label: 'Drawer Navigation',
    description: 'Side drawer with menu items',
    icon: 'menu-outline',
    route: '/(drawer)/',
    color: '#7209b7',
  },
  {
    label: 'Modal Menu',
    description: 'Popup overlay menu',
    icon: 'layers-outline',
    route: '/menu',
    color: '#f72585',
  },
  {
    label: 'Profile Screen',
    description: 'Navigate to profile page',
    icon: 'person-outline',
    route: '/profile',
    color: '#4cc9f0',
  },
  {
    label: 'Settings Screen',
    description: 'Navigate to settings page',
    icon: 'settings-outline',
    route: '/settings',
    color: '#f77f00',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Ionicons name="compass" size={56} color="#4361ee" />
        <Text style={styles.heroTitle}>Expo Router</Text>
        <Text style={styles.heroSubtitle}>Menu Navigation Demo</Text>
      </View>

      <Text style={styles.sectionLabel}>CHOOSE A MENU TYPE</Text>

      {navOptions.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.iconBox, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={26} color={item.color} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
  },
});
