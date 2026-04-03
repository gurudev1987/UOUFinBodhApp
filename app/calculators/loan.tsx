import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface LoanResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[];
}

function calculateLoan(principal: number, annualRate: number, tenureMonths: number): LoanResult {
  const r = annualRate / 12 / 100;
  let emi: number;
  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  }
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  let balance = principal;
  const schedule = [];
  for (let i = 1; i <= Math.min(tenureMonths, 12); i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    schedule.push({
      month: i,
      emi: parseFloat(emi.toFixed(2)),
      principal: parseFloat(principalPaid.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      balance: parseFloat(Math.max(balance, 0).toFixed(2)),
    });
  }

  return { emi: parseFloat(emi.toFixed(2)), totalPayment: parseFloat(totalPayment.toFixed(2)), totalInterest: parseFloat(totalInterest.toFixed(2)), schedule };
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureType, setTenureType] = useState<'months' | 'years'>('years');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = () => {
    const p = parseFloat(principal), r = parseFloat(rate);
    let t = parseFloat(tenure);
    if (!p || !r || !t || p <= 0 || r <= 0 || t <= 0) return;
    if (tenureType === 'years') t = t * 12;
    setResult(calculateLoan(p, r, Math.round(t)));
  };

  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const principalPct = result
    ? ((parseFloat(principal) / result.totalPayment) * 100).toFixed(1)
    : '0';
  const interestPct = result
    ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1)
    : '0';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Inputs */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LOAN AMOUNT</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 500000"
              placeholderTextColor="#374151"
              value={principal}
              onChangeText={setPrincipal}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ANNUAL INTEREST RATE (%)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 8.5"
              placeholderTextColor="#374151"
              value={rate}
              onChangeText={setRate}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>LOAN TENURE</Text>
              <View style={styles.tenureToggle}>
                {(['months', 'years'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tenureBtn, tenureType === t && styles.tenureBtnActive]}
                    onPress={() => setTenureType(t)}
                  >
                    <Text style={[styles.tenureBtnText, tenureType === t && styles.tenureBtnTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder={tenureType === 'years' ? 'e.g. 20' : 'e.g. 240'}
              placeholderTextColor="#374151"
              value={tenure}
              onChangeText={setTenure}
            />
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Ionicons name="cash-outline" size={18} color="#0a0e1a" />
            <Text style={styles.calcBtnText}>Calculate EMI</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <>
            {/* EMI Result */}
            <View style={styles.emiHero}>
              <Text style={styles.emiLabel}>Monthly EMI</Text>
              <Text style={styles.emiValue}>₹ {fmt(result.emi)}</Text>
            </View>

            {/* Breakdown */}
            <View style={styles.breakdownCard}>
              {[
                { label: 'Principal Amount', value: `₹ ${fmt(parseFloat(principal))}`, color: '#fbbf24', pct: principalPct },
                { label: 'Total Interest', value: `₹ ${fmt(result.totalInterest)}`, color: '#f72585', pct: interestPct },
                { label: 'Total Payment', value: `₹ ${fmt(result.totalPayment)}`, color: '#06d6a0', pct: '100' },
              ].map((item) => (
                <View key={item.label} style={styles.breakdownRow}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <Text style={[styles.breakdownValue, { color: item.color }]}>{item.value}</Text>
                  <Text style={styles.breakdownPct}>{item.pct}%</Text>
                </View>
              ))}

              {/* Visual bar */}
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { flex: parseFloat(principalPct), backgroundColor: '#fbbf24' }]} />
                <View style={[styles.barFill, { flex: parseFloat(interestPct), backgroundColor: '#f72585' }]} />
              </View>
            </View>

            {/* Schedule Toggle */}
            <TouchableOpacity
              style={styles.scheduleToggle}
              onPress={() => setShowSchedule(!showSchedule)}
            >
              <Text style={styles.scheduleToggleText}>
                {showSchedule ? 'Hide' : 'Show'} Repayment Schedule (First 12 Months)
              </Text>
              <Ionicons name={showSchedule ? 'chevron-up' : 'chevron-down'} size={16} color="#fbbf24" />
            </TouchableOpacity>

            {showSchedule && (
              <View style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  {['Mo.', 'EMI', 'Principal', 'Interest', 'Balance'].map((h) => (
                    <Text key={h} style={styles.scheduleHead}>{h}</Text>
                  ))}
                </View>
                {result.schedule.map((row) => (
                  <View key={row.month} style={styles.scheduleRow}>
                    <Text style={styles.scheduleCell}>{row.month}</Text>
                    <Text style={styles.scheduleCell}>{fmt(row.emi)}</Text>
                    <Text style={[styles.scheduleCell, { color: '#fbbf24' }]}>{fmt(row.principal)}</Text>
                    <Text style={[styles.scheduleCell, { color: '#f72585' }]}>{fmt(row.interest)}</Text>
                    <Text style={[styles.scheduleCell, { color: '#06d6a0' }]}>{fmt(row.balance)}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => { setPrincipal(''); setRate(''); setTenure(''); setResult(null); setShowSchedule(false); }}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },
  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 14,
  },
  inputGroup: { gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { fontSize: 11, color: '#6b7280', fontWeight: '800', letterSpacing: 1.2 },
  tenureToggle: {
    flexDirection: 'row',
    backgroundColor: '#131929',
    borderRadius: 8,
    padding: 2,
  },
  tenureBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tenureBtnActive: { backgroundColor: '#fbbf24' },
  tenureBtnText: { fontSize: 11, color: '#4b5563', fontWeight: '700' },
  tenureBtnTextActive: { color: '#0a0e1a' },
  input: {
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fbbf24',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  calcBtnText: { fontSize: 16, fontWeight: '800', color: '#0a0e1a' },
  emiHero: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fbbf2430',
  },
  emiLabel: { fontSize: 13, color: '#4b5563', fontWeight: '700', letterSpacing: 1 },
  emiValue: { fontSize: 48, fontWeight: '300', color: '#fbbf24', letterSpacing: -2, marginTop: 8 },
  breakdownCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 14,
  },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  breakdownLabel: { flex: 1, fontSize: 13, color: '#6b7280', fontWeight: '600' },
  breakdownValue: { fontSize: 14, fontWeight: '800' },
  breakdownPct: { fontSize: 12, color: '#374151', width: 36, textAlign: 'right' },
  barTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#1a2035',
    marginTop: 4,
  },
  barFill: { height: '100%' },
  scheduleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fbbf2430',
  },
  scheduleToggleText: { fontSize: 13, color: '#fbbf24', fontWeight: '700' },
  scheduleCard: {
    backgroundColor: '#0d1117',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  scheduleHeader: {
    flexDirection: 'row',
    backgroundColor: '#131929',
    padding: 10,
  },
  scheduleHead: { flex: 1, fontSize: 10, color: '#4b5563', fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  scheduleRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a2035',
  },
  scheduleCell: { flex: 1, fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  resetBtn: {
    alignItems: 'center',
    backgroundColor: '#1a2035',
    borderRadius: 14,
    paddingVertical: 14,
  },
  resetText: { fontSize: 14, color: '#6b7280', fontWeight: '700' },
});
