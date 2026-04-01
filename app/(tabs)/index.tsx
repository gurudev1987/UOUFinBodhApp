import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stats = [
  { label: 'Projects', value: '24', icon: 'folder-outline', color: '#4361ee' },
  { label: 'Tasks', value: '8', icon: 'checkmark-circle-outline', color: '#f72585' },
  { label: 'Messages', value: '3', icon: 'chatbubble-outline', color: '#4cc9f0' },
];

export default function TabHomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.welcomeBox}>
        <Text style={styles.greeting}>Good Morning 👋</Text>
        <Text style={styles.name}>Welcome Back</Text>
      </View>

      <Text style={styles.sectionLabel}>OVERVIEW</Text>
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statCard, { borderColor: s.color + '44' }]}>
            <Ionicons name={s.icon as any} size={22} color={s.color} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>Activity item {i}</Text>
            <Text style={styles.activityTime}>{i} hour{i > 1 ? 's' : ''} ago</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20, paddingBottom: 40 },
  welcomeBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  greeting: { fontSize: 14, color: '#888', marginBottom: 4 },
  name: { fontSize: 24, fontWeight: '800', color: '#fff' },
  sectionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4361ee',
    marginRight: 14,
  },
  activityText: { flex: 1 },
  activityTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  activityTime: { color: '#555', fontSize: 12, marginTop: 2 },
});
