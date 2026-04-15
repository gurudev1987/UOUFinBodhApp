import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const calculators = [
  {
    id: 'SI',
    title: 'Simple Interest Calculator',
    description: 'Calculate Simple Interest',
    icon: 'calculator-outline',
    color: '#00d4ff',
    tags: ['Investment', 'Saving'],
    route: '/calculators/SimpleInterestCalculators',
  },
  {
    id: 'CI',
    title: 'Compound Interest Calculator',
    description: 'Calculate Compound Interest',
    icon: 'calculator-outline',
    color: '#f72585',
    tags: ['Investment', 'Saving'],
    route: '/calculators/compound-interest',
  },
  {
    id: 'SIP',
    title: 'SIP Calculator',
    description: 'Calculate SIP',
    icon: 'calculator-outline',
    color: '#f77f00',
    tags: ['Investment', 'Mony'],
    route: '/calculators/sip',
  },
  {
    id: 'STEPSIP',
    title: 'Step-Up SIP Calculator',
    description: 'Step-Up SIP Calculator',
    icon: 'calculator-outline',
    color: '#06d6a0',
    tags: ['Finance', 'Travel'],
    route: '/calculators/StepUpSIP',
  },
  {
    id: 'FIC',
    title: 'Financial Independence Calculator',
    description: 'Calculate Financial Independence',
    icon: 'calculator-outline',
    color: '#a855f7',
    tags: ['Investment', 'Finance'],
    route: '/calculators/FICalculator',
  },
  
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'EMI, interest & repayment schedule',
    icon: 'calculator-outline',
    color: '#fbbf24',
    tags: ['Finance', 'Banking'],
    route: '/calculators/loan',
  },
  {
    id: 'sukanya',
    title: 'Sukanya Samridhi Yojna',
    description: 'EMI, interest & repayment schedule',
    icon: 'calculator-outline',
    color: '#00f790',
    tags: ['Finance', 'Banking'],
    route: '/calculators/SSYCalculator',
  },
];

export default function CalculatorsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>All Calculators</Text>
        <Text style={styles.headerSub}>{calculators.length} tools available</Text>
      </View>

      <Text style={styles.sectionLabel}>CHOOSE A CALCULATOR</Text>

      {calculators.map((calc) => (
        <TouchableOpacity
          key={calc.id}
          style={styles.card}
          onPress={() => router.push(calc.route as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.iconBox, { backgroundColor: calc.color + '20' }]}>
            <Ionicons name={calc.icon as any} size={26} color={calc.color} />
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{calc.title}</Text>
            <Text style={styles.cardDesc}>{calc.description}</Text>
            <View style={styles.tagsRow}>
              {calc.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: calc.color + '15' }]}>
                  <Text style={[styles.tagText, { color: calc.color }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.arrowBox, { backgroundColor: calc.color + '15' }]}>
            <Ionicons name="chevron-forward" size={18} color={calc.color} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffff' },
  content: { padding: 20, paddingBottom: 48 },
  headerBox: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#f3f4f6' },
  cardDesc: { fontSize: 12, color: '#4b5563', marginTop: 3 },
  tagsRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: { fontSize: 10, fontWeight: '700' },
  arrowBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
