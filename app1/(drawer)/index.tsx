import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerHomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.tipBox}>
        <Ionicons name="information-circle-outline" size={20} color="#4cc9f0" />
        <Text style={styles.tipText}>Swipe from the left edge to open the drawer menu</Text>
      </View>

      <Text style={styles.heading}>Drawer Home</Text>
      <Text style={styles.body}>
        This screen is part of the Drawer navigation. Use the hamburger icon in the header or
        swipe from the left to open the side drawer.
      </Text>

      {[
        { icon: 'bar-chart-outline', label: 'Analytics', color: '#f72585' },
        { icon: 'chatbubble-outline', label: 'Messages', color: '#4cc9f0' },
        { icon: 'settings-outline', label: 'Settings', color: '#f77f00' },
      ].map((item) => (
        <View key={item.label} style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: item.color + '22' }]}>
            <Ionicons name={item.icon as any} size={22} color={item.color} />
          </View>
          <Text style={styles.featureLabel}>{item.label}</Text>
          <Text style={styles.featureHint}>Available in drawer</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20 },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#4cc9f011',
    borderWidth: 1,
    borderColor: '#4cc9f033',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  tipText: { flex: 1, color: '#4cc9f0', fontSize: 13, lineHeight: 18 },
  heading: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 10 },
  body: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 24 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#fff' },
  featureHint: { fontSize: 12, color: '#444' },
});
