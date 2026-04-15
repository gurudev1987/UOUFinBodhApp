import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ── Tax Slabs FY 2024-25 ──────────────────────────────────────────
function calcOldRegime(income: number, deductions: number) {
  const taxable = Math.max(0, income - deductions - 50000); // 50k standard deduction
  let tax = 0;
  if (taxable <= 250000) tax = 0;
  else if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
  else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.2;
  else tax = 112500 + (taxable - 1000000) * 0.3;
  // Rebate u/s 87A
  if (taxable <= 500000) tax = 0;
  const cess = tax * 0.04;
  return { tax, cess, total: tax + cess, taxable };
}

function calcNewRegime(income: number) {
  const taxable = Math.max(0, income - 75000); // 75k standard deduction new regime
  let tax = 0;
  if (taxable <= 300000) tax = 0;
  else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
  else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.1;
  else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
  else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.2;
  else tax = 140000 + (taxable - 1500000) * 0.3;
  // Rebate u/s 87A (new regime: upto 7L)
  if (taxable <= 700000) tax = 0;
  const cess = tax * 0.04;
  return { tax, cess, total: tax + cess, taxable };
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

type Slab = { range: string; rate: string; tax: number };

function getOldSlabs(taxable: number): Slab[] {
  return [
    { range: 'Up to ₹2.5L', rate: '0%', tax: 0 },
    { range: '₹2.5L – ₹5L', rate: '5%', tax: taxable > 250000 ? Math.min(taxable - 250000, 250000) * 0.05 : 0 },
    { range: '₹5L – ₹10L', rate: '20%', tax: taxable > 500000 ? Math.min(taxable - 500000, 500000) * 0.2 : 0 },
    { range: 'Above ₹10L', rate: '30%', tax: taxable > 1000000 ? (taxable - 1000000) * 0.3 : 0 },
  ];
}

function getNewSlabs(taxable: number): Slab[] {
  return [
    { range: 'Up to ₹3L', rate: '0%', tax: 0 },
    { range: '₹3L – ₹7L', rate: '5%', tax: taxable > 300000 ? Math.min(taxable - 300000, 400000) * 0.05 : 0 },
    { range: '₹7L – ₹10L', rate: '10%', tax: taxable > 700000 ? Math.min(taxable - 700000, 300000) * 0.1 : 0 },
    { range: '₹10L – ₹12L', rate: '15%', tax: taxable > 1000000 ? Math.min(taxable - 1000000, 200000) * 0.15 : 0 },
    { range: '₹12L – ₹15L', rate: '20%', tax: taxable > 1200000 ? Math.min(taxable - 1200000, 300000) * 0.2 : 0 },
    { range: 'Above ₹15L', rate: '30%', tax: taxable > 1500000 ? (taxable - 1500000) * 0.3 : 0 },
  ];
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'old'>('new');
  const [calculated, setCalculated] = useState(false);

  const inc = parseFloat(income.replace(/,/g, '')) || 0;
  const ded = parseFloat(deductions.replace(/,/g, '')) || 0;

  const oldResult = calcOldRegime(inc, ded);
  const newResult = calcNewRegime(inc);

  const better = newResult.total <= oldResult.total ? 'new' : 'old';
  const saving = Math.abs(oldResult.total - newResult.total);

  const oldSlabs = getOldSlabs(oldResult.taxable);
  const newSlabs = getNewSlabs(newResult.taxable);

  const activeResult = activeTab === 'new' ? newResult : oldResult;
  const activeSlabs  = activeTab === 'new' ? newSlabs  : oldSlabs;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <LinearGradient colors={['#0d1b3e', '#0a1628']} style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="receipt-outline" size={26} color="#00d4ff" />
        </View>
        <Text style={styles.headerTitle}>Income Tax Calculator</Text>
        <Text style={styles.headerSub}>FY 2024-25 · AY 2025-26</Text>
      </LinearGradient>

      {/* Inputs */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Income Details</Text>

        <Text style={styles.label}>Annual Income (Gross)</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 800000"
            placeholderTextColor="#3a4a60"
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
          />
        </View>

        <Text style={styles.label}>Deductions (80C, 80D, HRA etc.) — Old Regime</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 150000"
            placeholderTextColor="#3a4a60"
            keyboardType="numeric"
            value={deductions}
            onChangeText={setDeductions}
          />
        </View>

        <TouchableOpacity
          style={styles.calcBtn}
          onPress={() => setCalculated(true)}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#00d4ff', '#0099cc']} style={styles.calcBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="calculator" size={16} color="#fff" />
            <Text style={styles.calcBtnText}>Calculate Tax</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {calculated && inc > 0 && (
        <>
          {/* Best Regime Banner */}
          <LinearGradient
            colors={better === 'new' ? ['#06d6a022', '#06d6a008'] : ['#f7258522', '#f7258508']}
            style={styles.bestBanner}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={better === 'new' ? '#06d6a0' : '#f72585'}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.bestTitle, { color: better === 'new' ? '#06d6a0' : '#f72585' }]}>
                {better === 'new' ? 'New Regime' : 'Old Regime'} is better for you!
              </Text>
              <Text style={styles.bestSub}>You save {fmt(saving)} by choosing this regime</Text>
            </View>
          </LinearGradient>

          {/* Comparison Cards */}
          <View style={styles.compareRow}>
            {/* New Regime */}
            <TouchableOpacity
              style={[styles.compareCard, activeTab === 'new' && styles.compareCardActive, { borderColor: activeTab === 'new' ? '#00d4ff' : '#1a2535' }]}
              onPress={() => setActiveTab('new')}
              activeOpacity={0.8}
            >
              {better === 'new' && (
                <View style={styles.bestTag}>
                  <Text style={styles.bestTagText}>BEST</Text>
                </View>
              )}
              <Text style={styles.regimeLabel}>New Regime</Text>
              <Text style={[styles.regimeTax, { color: '#00d4ff' }]}>{fmt(newResult.total)}</Text>
              <Text style={styles.regimeSub}>Total Tax + Cess</Text>
            </TouchableOpacity>

            {/* Old Regime */}
            <TouchableOpacity
              style={[styles.compareCard, activeTab === 'old' && styles.compareCardActive, { borderColor: activeTab === 'old' ? '#f72585' : '#1a2535' }]}
              onPress={() => setActiveTab('old')}
              activeOpacity={0.8}
            >
              {better === 'old' && (
                <View style={[styles.bestTag, { backgroundColor: '#f7258522', borderColor: '#f7258544' }]}>
                  <Text style={[styles.bestTagText, { color: '#f72585' }]}>BEST</Text>
                </View>
              )}
              <Text style={styles.regimeLabel}>Old Regime</Text>
              <Text style={[styles.regimeTax, { color: '#f72585' }]}>{fmt(oldResult.total)}</Text>
              <Text style={styles.regimeSub}>Total Tax + Cess</Text>
            </TouchableOpacity>
          </View>

          {/* Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {activeTab === 'new' ? 'New' : 'Old'} Regime Breakdown
            </Text>

            <View style={styles.breakRow}>
              <Text style={styles.breakLabel}>Gross Income</Text>
              <Text style={styles.breakVal}>{fmt(inc)}</Text>
            </View>
            {activeTab === 'old' && (
              <View style={styles.breakRow}>
                <Text style={styles.breakLabel}>Deductions (80C etc.)</Text>
                <Text style={[styles.breakVal, { color: '#06d6a0' }]}>− {fmt(ded)}</Text>
              </View>
            )}
            <View style={styles.breakRow}>
              <Text style={styles.breakLabel}>Standard Deduction</Text>
              <Text style={[styles.breakVal, { color: '#06d6a0' }]}>
                − {activeTab === 'new' ? '₹75,000' : '₹50,000'}
              </Text>
            </View>
            <View style={[styles.breakRow, styles.breakRowHighlight]}>
              <Text style={styles.breakLabelBold}>Taxable Income</Text>
              <Text style={styles.breakValBold}>{fmt(activeResult.taxable)}</Text>
            </View>
            <View style={styles.breakRow}>
              <Text style={styles.breakLabel}>Income Tax</Text>
              <Text style={styles.breakVal}>{fmt(activeResult.tax)}</Text>
            </View>
            <View style={styles.breakRow}>
              <Text style={styles.breakLabel}>Health & Edu Cess (4%)</Text>
              <Text style={styles.breakVal}>{fmt(activeResult.cess)}</Text>
            </View>
            <View style={[styles.breakRow, styles.breakRowTotal]}>
              <Text style={styles.breakLabelBold}>Total Tax Payable</Text>
              <Text style={[styles.breakValBold, { color: activeTab === 'new' ? '#00d4ff' : '#f72585' }]}>
                {fmt(activeResult.total)}
              </Text>
            </View>

            {/* Monthly */}
            <View style={styles.monthlyBox}>
              <Ionicons name="calendar-outline" size={14} color="#4b6080" />
              <Text style={styles.monthlyText}>
                Monthly TDS ≈ <Text style={{ color: '#e2f4ff', fontWeight: '700' }}>{fmt(activeResult.total / 12)}</Text>
              </Text>
            </View>
          </View>

          {/* Slab wise */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Slab-wise Tax Breakup</Text>
            {activeSlabs.map((s, i) => (
              <View key={i} style={styles.slabRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.slabRange}>{s.range}</Text>
                  <Text style={styles.slabRate}>{s.rate}</Text>
                </View>
                <Text style={[styles.slabTax, { color: s.tax > 0 ? '#f77f00' : '#2d4060' }]}>
                  {s.tax > 0 ? fmt(s.tax) : '—'}
                </Text>
              </View>
            ))}
          </View>

          {/* Effective Rate */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Effective Tax Rate</Text>
            <View style={styles.rateRow}>
              <View style={styles.rateBox}>
                <Text style={styles.rateVal}>
                  {inc > 0 ? ((newResult.total / inc) * 100).toFixed(1) : '0.0'}%
                </Text>
                <Text style={styles.rateLabel}>New Regime</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateBox}>
                <Text style={styles.rateVal}>
                  {inc > 0 ? ((oldResult.total / inc) * 100).toFixed(1) : '0.0'}%
                </Text>
                <Text style={styles.rateLabel}>Old Regime</Text>
              </View>
            </View>
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080c14' },
  content: { paddingBottom: 48 },

  header: {
    padding: 24,
    paddingTop: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00d4ff22',
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#00d4ff15',
    borderWidth: 1,
    borderColor: '#00d4ff33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#e2f4ff', letterSpacing: 0.3 },
  headerSub: { fontSize: 12, color: '#4b6080', marginTop: 4 },

  card: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1a2535',
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#7bafd4', marginBottom: 16, letterSpacing: 0.5 },

  label: { fontSize: 12, color: '#4b6080', marginBottom: 6, marginTop: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#080c14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2535',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  rupee: { fontSize: 16, color: '#4b6080', marginRight: 6 },
  input: { flex: 1, height: 44, fontSize: 16, color: '#e2f4ff' },

  calcBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  calcBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  bestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06d6a033',
  },
  bestTitle: { fontSize: 14, fontWeight: '800' },
  bestSub: { fontSize: 12, color: '#4b6080', marginTop: 2 },

  compareRow: { flexDirection: 'row', margin: 16, marginBottom: 0, gap: 12 },
  compareCard: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  compareCardActive: { backgroundColor: '#0f1825' },
  bestTag: {
    backgroundColor: '#00d4ff22',
    borderWidth: 1,
    borderColor: '#00d4ff44',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  bestTagText: { fontSize: 10, fontWeight: '800', color: '#00d4ff', letterSpacing: 1 },
  regimeLabel: { fontSize: 12, color: '#4b6080', marginBottom: 4 },
  regimeTax: { fontSize: 22, fontWeight: '900' },
  regimeSub: { fontSize: 11, color: '#2d4060', marginTop: 2 },

  breakRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0f1825' },
  breakRowHighlight: { backgroundColor: '#0f1825', marginHorizontal: -18, paddingHorizontal: 18, borderBottomColor: '#1a2535' },
  breakRowTotal: { borderBottomWidth: 0, marginTop: 4 },
  breakLabel: { fontSize: 13, color: '#4b6080' },
  breakLabelBold: { fontSize: 13, fontWeight: '700', color: '#e2f4ff' },
  breakVal: { fontSize: 13, color: '#e2f4ff' },
  breakValBold: { fontSize: 14, fontWeight: '800', color: '#e2f4ff' },

  monthlyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#080c14',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  monthlyText: { fontSize: 12, color: '#4b6080' },

  slabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f1925',
  },
  slabRange: { fontSize: 13, color: '#c8d8e8' },
  slabRate: { fontSize: 11, color: '#4b6080', marginTop: 2 },
  slabTax: { fontSize: 13, fontWeight: '700' },

  rateRow: { flexDirection: 'row', alignItems: 'center' },
  rateBox: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  rateVal: { fontSize: 28, fontWeight: '900', color: '#e2f4ff' },
  rateLabel: { fontSize: 12, color: '#4b6080', marginTop: 4 },
  rateDivider: { width: 1, height: 50, backgroundColor: '#1a2535' },
});
