import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ── Calculation Logic ─────────────────────────────────────────────

function calcFD(principal: number, rate: number, years: number, compFreq: number) {
  // A = P(1 + r/n)^(nt)
  const r = rate / 100;
  const n = compFreq;
  const t = years;
  const maturity = principal * Math.pow(1 + r / n, n * t);
  const interest = maturity - principal;
  return { maturity: Math.round(maturity), interest: Math.round(interest), principal };
}

function calcRD(monthly: number, rate: number, months: number) {
  // RD Maturity = P * n + P * n*(n+1)/2 * r/12  (simple formula used by banks)
  const r = rate / 100;
  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    maturity += monthly * Math.pow(1 + r / 4, (4 * (months - i + 1)) / 12);
  }
  const totalDeposit = monthly * months;
  const interest = maturity - totalDeposit;
  return {
    maturity: Math.round(maturity),
    interest: Math.round(interest),
    totalDeposit: Math.round(totalDeposit),
  };
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
function fmtL(n: number) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  return fmt(n);
}

const COMP_OPTIONS = [
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Half-Yearly', value: 2 },
  { label: 'Yearly', value: 1 },
];

const TENURE_FD = [
  { label: '6M', months: 0.5 },
  { label: '1Y', months: 1 },
  { label: '2Y', months: 2 },
  { label: '3Y', months: 3 },
  { label: '5Y', months: 5 },
];

const TENURE_RD = [
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '2Y', months: 24 },
  { label: '3Y', months: 36 },
  { label: '5Y', months: 60 },
];

// ── FD Screen ─────────────────────────────────────────────────────
function FDCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState(1);
  const [compFreq, setCompFreq] = useState(4);
  const [result, setResult] = useState<ReturnType<typeof calcFD> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const p = parseFloat(principal.replace(/,/g, '')) || 0;
  const r = parseFloat(rate) || 0;

  const handleCalc = () => {
    if (p <= 0 || r <= 0) return;
    const res = calcFD(p, r, years, compFreq);
    setResult(res);
    fadeAnim.setValue(0); slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const pct = result ? Math.round((result.interest / result.maturity) * 100) : 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Input Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>FD Details</Text>

        <Text style={styles.label}>Principal Amount</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 100000"
            placeholderTextColor="#3a4a60"
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
          />
        </View>

        <Text style={styles.label}>Interest Rate (% per annum)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="trending-up" size={15} color="#4b6080" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="e.g. 7.5"
            placeholderTextColor="#3a4a60"
            keyboardType="decimal-pad"
            value={rate}
            onChangeText={setRate}
          />
          <Text style={styles.inputSuffix}>%</Text>
        </View>

        {/* Tenure */}
        <Text style={styles.label}>Tenure</Text>
        <View style={styles.chipRow}>
          {TENURE_FD.map(t => (
            <TouchableOpacity
              key={t.label}
              style={[styles.chip, years === t.months && styles.chipActive]}
              onPress={() => setYears(t.months)}
            >
              <Text style={[styles.chipText, years === t.months && styles.chipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Compounding */}
        <Text style={styles.label}>Compounding Frequency</Text>
        <View style={styles.chipRow}>
          {COMP_OPTIONS.map(o => (
            <TouchableOpacity
              key={o.label}
              style={[styles.chip, compFreq === o.value && styles.chipActive]}
              onPress={() => setCompFreq(o.value)}
            >
              <Text style={[styles.chipText, compFreq === o.value && styles.chipTextActive]}>{o.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.calcBtn} onPress={handleCalc} activeOpacity={0.85}>
          <LinearGradient colors={['#f77f00', '#e06000']} style={styles.calcBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="calculator" size={16} color="#fff" />
            <Text style={styles.calcBtnText}>Calculate FD</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Result */}
      {result && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <LinearGradient colors={['#1e0f00', '#150a00']} style={[styles.resultCard, { borderColor: '#f77f0033' }]}>
            <View style={styles.resultTop}>
              <Ionicons name="trophy" size={18} color="#f77f00" />
              <Text style={[styles.resultLabel, { color: '#f77f00' }]}>  Maturity Amount</Text>
            </View>
            <Text style={[styles.resultAmount, { color: '#ffe0b2' }]}>{fmtL(result.maturity)}</Text>

            {/* Bar */}
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${100 - pct}%`, backgroundColor: '#f77f00' }]} />
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: '#06d6a0' }]} />
            </View>
            <View style={styles.barLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f77f00' }]} />
                <Text style={styles.legendText}>Principal {100 - pct}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                <Text style={styles.legendText}>Interest {pct}%</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="wallet-outline" size={16} color="#f77f00" />
              <Text style={styles.summaryVal}>{fmtL(result.principal)}</Text>
              <Text style={styles.summaryLabel}>Principal</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="add-circle-outline" size={16} color="#06d6a0" />
              <Text style={styles.summaryVal}>{fmtL(result.interest)}</Text>
              <Text style={styles.summaryLabel}>Interest Earned</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="time-outline" size={16} color="#00d4ff" />
              <Text style={styles.summaryVal}>{years < 1 ? '6 Mo' : `${years} Yr`}</Text>
              <Text style={styles.summaryLabel}>Tenure</Text>
            </View>
          </View>

          {/* TDS Note */}
          <View style={styles.noteCard}>
            <Ionicons name="information-circle-outline" size={15} color="#f77f00" />
            <Text style={styles.noteText}>  10% TDS deducted if interest &gt; ₹40,000/yr (₹50,000 for senior citizens)</Text>
          </View>
        </Animated.View>
      )}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ── RD Screen ─────────────────────────────────────────────────────
function RDCalculator() {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState(12);
  const [result, setResult] = useState<ReturnType<typeof calcRD> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const m = parseFloat(monthly.replace(/,/g, '')) || 0;
  const r = parseFloat(rate) || 0;

  const handleCalc = () => {
    if (m <= 0 || r <= 0) return;
    const res = calcRD(m, r, months);
    setResult(res);
    fadeAnim.setValue(0); slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const pct = result ? Math.round((result.interest / result.maturity) * 100) : 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>RD Details</Text>

        <Text style={styles.label}>Monthly Deposit</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5000"
            placeholderTextColor="#3a4a60"
            keyboardType="numeric"
            value={monthly}
            onChangeText={setMonthly}
          />
          <Text style={styles.inputSuffix}>/mo</Text>
        </View>

        {/* Quick amounts */}
        <View style={styles.chipRow}>
          {[1000, 2000, 5000, 10000].map(amt => (
            <TouchableOpacity
              key={amt}
              style={[styles.chip, monthly === String(amt) && styles.chipActiveGreen]}
              onPress={() => setMonthly(String(amt))}
            >
              <Text style={[styles.chipText, monthly === String(amt) && styles.chipTextActiveGreen]}>
                ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Interest Rate (% per annum)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="trending-up" size={15} color="#4b6080" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="e.g. 6.5"
            placeholderTextColor="#3a4a60"
            keyboardType="decimal-pad"
            value={rate}
            onChangeText={setRate}
          />
          <Text style={styles.inputSuffix}>%</Text>
        </View>

        <Text style={styles.label}>Tenure</Text>
        <View style={styles.chipRow}>
          {TENURE_RD.map(t => (
            <TouchableOpacity
              key={t.label}
              style={[styles.chip, months === t.months && styles.chipActiveGreen]}
              onPress={() => setMonths(t.months)}
            >
              <Text style={[styles.chipText, months === t.months && styles.chipTextActiveGreen]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.calcBtn} onPress={handleCalc} activeOpacity={0.85}>
          <LinearGradient colors={['#06d6a0', '#04a87d']} style={styles.calcBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="calculator" size={16} color="#fff" />
            <Text style={styles.calcBtnText}>Calculate RD</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {result && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <LinearGradient colors={['#001e14', '#00150e']} style={[styles.resultCard, { borderColor: '#06d6a033' }]}>
            <View style={styles.resultTop}>
              <Ionicons name="trophy" size={18} color="#06d6a0" />
              <Text style={[styles.resultLabel, { color: '#06d6a0' }]}>  Maturity Amount</Text>
            </View>
            <Text style={[styles.resultAmount, { color: '#b2ffe0' }]}>{fmtL(result.maturity)}</Text>

            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${100 - pct}%`, backgroundColor: '#06d6a0' }]} />
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: '#00d4ff' }]} />
            </View>
            <View style={styles.barLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                <Text style={styles.legendText}>Deposit {100 - pct}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#00d4ff' }]} />
                <Text style={styles.legendText}>Interest {pct}%</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="wallet-outline" size={16} color="#06d6a0" />
              <Text style={styles.summaryVal}>{fmtL(result.totalDeposit)}</Text>
              <Text style={styles.summaryLabel}>Total Deposit</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="add-circle-outline" size={16} color="#00d4ff" />
              <Text style={styles.summaryVal}>{fmtL(result.interest)}</Text>
              <Text style={styles.summaryLabel}>Interest Earned</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="time-outline" size={16} color="#f77f00" />
              <Text style={styles.summaryVal}>{months < 12 ? `${months}Mo` : `${months / 12}Yr`}</Text>
              <Text style={styles.summaryLabel}>Tenure</Text>
            </View>
          </View>

          {/* Monthly breakdown note */}
          <View style={styles.noteCard}>
            <Ionicons name="calendar-outline" size={15} color="#06d6a0" />
            <Text style={styles.noteText}>
              {'  '}Har mahine <Text style={{ color: '#e2f4ff', fontWeight: '700' }}>{fmt(m)}</Text> jama karo aur{' '}
              <Text style={{ color: '#06d6a0', fontWeight: '700' }}>{fmtL(result.maturity)}</Text> pao!
            </Text>
          </View>
        </Animated.View>
      )}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ── Main Screen ───────────────────────────────────────────────────
export default function FDRDCalculator() {
  const [activeTab, setActiveTab] = useState<'fd' | 'rd'>('fd');
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: 'fd' | 'rd') => {
    setActiveTab(tab);
    Animated.spring(indicatorAnim, {
      toValue: tab === 'fd' ? 0 : 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const indicatorX = indicatorAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0d1b3e', '#0a1628']} style={styles.header}>
        <View style={styles.headerIconRow}>
          <View style={[styles.headerIcon, { backgroundColor: '#f77f0015', borderColor: '#f77f0033' }]}>
            <Ionicons name="business" size={22} color="#f77f00" />
          </View>
          <View style={[styles.headerIcon, { backgroundColor: '#06d6a015', borderColor: '#06d6a033' }]}>
            <Ionicons name="repeat" size={22} color="#06d6a0" />
          </View>
        </View>
        <Text style={styles.headerTitle}>FD & RD Calculator</Text>
        <Text style={styles.headerSub}>Fixed Deposit · Recurring Deposit</Text>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'fd' && styles.tabBtnActiveFD]}
            onPress={() => switchTab('fd')}
            activeOpacity={0.8}
          >
            <Ionicons name="business" size={14} color={activeTab === 'fd' ? '#fff' : '#4b6080'} />
            <Text style={[styles.tabBtnText, activeTab === 'fd' && { color: '#fff' }]}>  Fixed Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'rd' && styles.tabBtnActiveRD]}
            onPress={() => switchTab('rd')}
            activeOpacity={0.8}
          >
            <Ionicons name="repeat" size={14} color={activeTab === 'rd' ? '#fff' : '#4b6080'} />
            <Text style={[styles.tabBtnText, activeTab === 'rd' && { color: '#fff' }]}>  Recurring Deposit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {activeTab === 'fd' ? <FDCalculator /> : <RDCalculator />}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080c14' },

  header: {
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2535',
  },
  headerIconRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#e2f4ff', letterSpacing: 0.3 },
  headerSub: { fontSize: 12, color: '#4b6080', marginTop: 3, marginBottom: 18 },

  tabBar: { flexDirection: 'row', gap: 10 },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2535',
    backgroundColor: '#0d1117',
  },
  tabBtnActiveFD: { backgroundColor: '#f77f00', borderColor: '#f77f00' },
  tabBtnActiveRD: { backgroundColor: '#06d6a0', borderColor: '#06d6a0' },
  tabBtnText: { fontSize: 13, fontWeight: '700', color: '#4b6080' },

  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1a2535',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 12, fontWeight: '800', color: '#4b6080', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },

  label: { fontSize: 12, color: '#4b6080', marginBottom: 6, marginTop: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#080c14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2535',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  rupee: { fontSize: 16, color: '#4b6080', marginRight: 6 },
  input: { flex: 1, height: 46, fontSize: 16, color: '#e2f4ff' },
  inputSuffix: { fontSize: 13, color: '#4b6080' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4, marginTop: 6 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a2535',
    backgroundColor: '#080c14',
  },
  chipActive: { borderColor: '#f77f00', backgroundColor: '#f77f0015' },
  chipActiveGreen: { borderColor: '#06d6a0', backgroundColor: '#06d6a015' },
  chipText: { fontSize: 12, color: '#4b6080', fontWeight: '700' },
  chipTextActive: { color: '#f77f00' },
  chipTextActiveGreen: { color: '#06d6a0' },

  calcBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 16 },
  calcBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  resultCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  resultTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  resultLabel: { fontSize: 12, fontWeight: '700' },
  resultAmount: { fontSize: 36, fontWeight: '900', marginBottom: 16 },

  barBg: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  barFill: { height: 8 },
  barLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#4b6080' },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2535',
    gap: 5,
  },
  summaryVal: { fontSize: 13, fontWeight: '900', color: '#e2f4ff', textAlign: 'center' },
  summaryLabel: { fontSize: 10, color: '#4b6080', textAlign: 'center' },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0d1117',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1a2535',
    marginBottom: 12,
  },
  noteText: { fontSize: 11, color: '#4b6080', flex: 1, lineHeight: 17 },
});
