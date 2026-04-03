import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons,AntDesign, MaterialIcons } from '@expo/vector-icons';

const quickCalcs = [
  { label: 'Insurance', icon: 'shield-checkmark', route: '/calculators/basic', color: '#00d4ff' },
  { label: 'Investments', icon: 'trending-up', route: '/calculators/bmi', color: '#f72585' },
  { label: 'Digital Payments', icon: 'card', route: '/calculators/age', color: '#f77f00' },
  { label: 'Loan', icon: 'cash-outline', route: '/calculators/loan', color: '#06d6a0' },
  { label: 'Government Schemes', icon: 'layers', route: '/calculators/Sim', color: '#06d6a0' },
];

const features = [
  { icon: 'flash-outline', title: 'Lightning Fast', desc: 'Instant real-time calculations' },
  { icon: 'shield-checkmark-outline', title: 'Accurate', desc: 'Precision-engineered formulas' },
  { icon: 'grid-outline', title: '6 Calculators', desc: 'All your math needs in one place' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      {/* <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="calculator" size={48} color="#00d4ff" />
        </View>
        <Text style={styles.heroTitle}>CalcSuite</Text>
        <Text style={styles.heroSub}>Professional calculators at your fingertips</Text>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/calculators')}
        >
          <Text style={styles.ctaBtnText}>Browse Calculators</Text>
          <Ionicons name="arrow-forward" size={16} color="#0a0e1a" />
        </TouchableOpacity>
      </View> */}

      {/* Quick Access */}
      {/* <Text style={styles.sectionLabel}>QUICK ACCESS</Text> */}
      <View style={styles.quickGrid}>
        {quickCalcs.map((c) => (
          <TouchableOpacity
            key={c.label}
            style={styles.quickCard}
            onPress={() => router.push(c.route as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.quickIcon, { backgroundColor: c.color + '20' }]}>
              <Ionicons name={c.icon as any} size={24} color={c.color} />
            </View>
            <Text style={styles.quickLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Features */}
      {/* <Text style={styles.sectionLabel}>WHY CALCSUITE</Text>
      {features.map((f) => (
        <View key={f.title} style={styles.featureRow}>
          <View style={styles.featureIconBox}>
            <Ionicons name={f.icon as any} size={20} color="#00d4ff" />
          </View>
          <View>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },
  hero: {
    alignItems: 'center',
    paddingVertical: 36,
    backgroundColor: '#0d1117',
    borderRadius: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#00d4ff12',
    borderWidth: 1,
    borderColor: '#00d4ff30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  heroSub: { fontSize: 14, color: '#4b5563', marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00d4ff',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 20,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#0a0e1a' },
  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  quickCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickLabel: { fontSize: 14, fontWeight: '700', color: '#e5e7eb' },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  featureIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#00d4ff12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  featureDesc: { fontSize: 12, color: '#4b5563', marginTop: 2 },
});
