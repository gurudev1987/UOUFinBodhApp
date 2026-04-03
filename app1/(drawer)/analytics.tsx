import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const metrics = [
  { label: 'Total Views', value: '24.5K', change: '+12%', icon: 'eye-outline', color: '#4361ee' },
  { label: 'Engagement', value: '68%', change: '+5%', icon: 'heart-outline', color: '#f72585' },
  { label: 'Revenue', value: '$3.2K', change: '+8%', icon: 'cash-outline', color: '#06d6a0' },
  { label: 'New Users', value: '312', change: '+20%', icon: 'people-outline', color: '#f77f00' },
];

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Analytics</Text>
      <Text style={styles.subheading}>Last 30 days overview</Text>

      <View style={styles.grid}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: m.color + '22' }]}>
              <Ionicons name={m.icon as any} size={20} color={m.color} />
            </View>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <View style={styles.changeBadge}>
              <Ionicons name="trending-up-outline" size={11} color="#06d6a0" />
              <Text style={styles.changeText}>{m.change}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.chartPlaceholder}>
        <Ionicons name="bar-chart-outline" size={32} color="#4361ee" />
        <Text style={styles.chartLabel}>Chart visualization</Text>
        <Text style={styles.chartHint}>Integrate with Victory Native or React Native SVG Charts</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20 },
  heading: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subheading: { fontSize: 14, color: '#555', marginTop: 4, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  metricCard: {
    width: '47%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  metricLabel: { fontSize: 12, color: '#666', marginTop: 3 },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
  },
  changeText: { fontSize: 12, color: '#06d6a0', fontWeight: '700' },
  chartPlaceholder: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a40',
    borderStyle: 'dashed',
  },
  chartLabel: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 12 },
  chartHint: { color: '#555', fontSize: 12, marginTop: 4, textAlign: 'center' },
});
