import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface SIResult {
  simpleInterest: number;
  totalAmount: number;
  dailyInterest: number;
  monthlyInterest: number;
}

function calculateSI(principal: number, rate: number, time: number, timeUnit: TimeUnit): SIResult {
  // Convert time to years
  let timeInYears = time;
  if (timeUnit === 'months') timeInYears = time / 12;
  if (timeUnit === 'days') timeInYears = time / 365;

  const simpleInterest = (principal * rate * timeInYears) / 100;
  const totalAmount = principal + simpleInterest;
  const dailyInterest = (principal * rate) / (100 * 365);
  const monthlyInterest = (principal * rate) / (100 * 12);

  return {
    simpleInterest: parseFloat(simpleInterest.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    dailyInterest: parseFloat(dailyInterest.toFixed(2)),
    monthlyInterest: parseFloat(monthlyInterest.toFixed(2)),
  };
}

type TimeUnit = 'years' | 'months' | 'days';

const timeUnits: TimeUnit[] = ['years', 'months', 'days'];

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years');
  const [result, setResult] = useState<SIResult | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) {
      setError('Please fill in all fields with valid numbers.');
      return;
    }
    if (p <= 0 || r <= 0 || t <= 0) {
      setError('All values must be greater than zero.');
      return;
    }
    if (r > 100) {
      setError('Interest rate cannot exceed 100%.');
      return;
    }

    setResult(calculateSI(p, r, t, timeUnit));
  };

  const reset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setTimeUnit('years');
    setResult(null);
    setError('');
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const principalPct = result
    ? ((parseFloat(principal) / result.totalAmount) * 100).toFixed(1)
    : '0';
  const interestPct = result
    ? ((result.simpleInterest / result.totalAmount) * 100).toFixed(1)
    : '0';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Formula Card */}
        {/* <View style={styles.formulaCard}>
          <View style={styles.formulaIconBox}>
            <Ionicons name="school-outline" size={20} color="#f59e0b" />
          </View>
          <View style={styles.formulaText}>
            <Text style={styles.formulaTitle}>Simple Interest Formula</Text>
            <Text style={styles.formulaEq}>SI = (P × R × T) / 100</Text>
          </View>
        </View> */}

        {/* Input Card */}
        <View style={styles.card}>

          {/* Principal */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="cash-outline" size={14} color="#f59e0b" />
              <Text style={styles.inputLabel}>PRINCIPAL AMOUNT (P)</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 50000"
                placeholderTextColor="#374151"
                value={principal}
                onChangeText={(v) => { setPrincipal(v); setResult(null); setError(''); }}
              />
            </View>
          </View>

          {/* Rate */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="trending-up-outline" size={14} color="#f59e0b" />
              <Text style={styles.inputLabel}>ANNUAL INTEREST RATE (R)</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 8.5"
                placeholderTextColor="#374151"
                value={rate}
                onChangeText={(v) => { setRate(v); setResult(null); setError(''); }}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>

          {/* Time */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="time-outline" size={14} color="#f59e0b" />
              <Text style={styles.inputLabel}>TIME PERIOD (T)</Text>
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g. 2"
                  placeholderTextColor="#374151"
                  value={time}
                  onChangeText={(v) => { setTime(v); setResult(null); setError(''); }}
                />
              </View>
              <View style={styles.unitToggle}>
                {timeUnits.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitBtn, timeUnit === u && styles.unitBtnActive]}
                    onPress={() => { setTimeUnit(u); setResult(null); }}
                  >
                    <Text style={[styles.unitBtnText, timeUnit === u && styles.unitBtnTextActive]}>
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#f72585" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Ionicons name="refresh-outline" size={18} color="#6b7280" />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
              <Ionicons name="calculator-outline" size={18} color="#0a0e1a" />
              <Text style={styles.calcBtnText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Result Section */}
        {result && (
          <>
            {/* SI Hero */}
            <View style={styles.siHero}>
              <Text style={styles.siHeroLabel}>Simple Interest</Text>
              <Text style={styles.siHeroValue}>₹ {fmt(result.simpleInterest)}</Text>
              <View style={styles.siHeroDivider} />
              <View style={styles.siHeroRow}>
                <View style={styles.siHeroStat}>
                  <Text style={styles.siHeroStatLabel}>Principal</Text>
                  <Text style={styles.siHeroStatValue}>₹ {fmt(parseFloat(principal))}</Text>
                </View>
                <View style={styles.siHeroStatDivider} />
                <View style={styles.siHeroStat}>
                  <Text style={styles.siHeroStatLabel}>Total Amount</Text>
                  <Text style={[styles.siHeroStatValue, { color: '#f59e0b' }]}>
                    ₹ {fmt(result.totalAmount)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Breakdown Bar */}
            <View style={styles.breakdownCard}>
              <Text style={styles.sectionLabel}>AMOUNT BREAKDOWN</Text>

              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barSegment,
                    { flex: parseFloat(principalPct), backgroundColor: '#06d6a0' },
                  ]}
                />
                <View
                  style={[
                    styles.barSegment,
                    { flex: parseFloat(interestPct), backgroundColor: '#f59e0b' },
                  ]}
                />
              </View>

              <View style={styles.barLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                  <Text style={styles.legendLabel}>Principal</Text>
                  <Text style={[styles.legendPct, { color: '#06d6a0' }]}>{principalPct}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.legendLabel}>Interest</Text>
                  <Text style={[styles.legendPct, { color: '#f59e0b' }]}>{interestPct}%</Text>
                </View>
              </View>
            </View>

            {/* Per-Period Stats */}
            <Text style={styles.sectionLabel}>INTEREST ACCRUAL</Text>
            <View style={styles.statsGrid}>
              {[
                {
                  label: 'Per Day',
                  value: `₹ ${fmt(result.dailyInterest)}`,
                  icon: 'sunny-outline',
                  color: '#f72585',
                },
                {
                  label: 'Per Month',
                  value: `₹ ${fmt(result.monthlyInterest)}`,
                  icon: 'calendar-outline',
                  color: '#a855f7',
                },
                {
                  label: `Per ${timeUnit === 'days' ? 'Day' : timeUnit === 'months' ? 'Month' : 'Year'}`,
                  value: `₹ ${fmt(result.simpleInterest / parseFloat(time))}`,
                  icon: 'trending-up-outline',
                  color: '#00d4ff',
                },
                {
                  label: 'Total Interest',
                  value: `₹ ${fmt(result.simpleInterest)}`,
                  icon: 'cash-outline',
                  color: '#f59e0b',
                },
              ].map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: s.color + '20' }]}>
                    <Ionicons name={s.icon as any} size={18} color={s.color} />
                  </View>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Summary Note */}
            <View style={styles.summaryNote}>
              <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
              <Text style={styles.summaryNoteText}>
                On a principal of{' '}
                <Text style={styles.highlight}>₹{fmt(parseFloat(principal))}</Text> at{' '}
                <Text style={styles.highlight}>{rate}% p.a.</Text> for{' '}
                <Text style={styles.highlight}>{time} {timeUnit}</Text>, you earn{' '}
                <Text style={styles.highlight}>₹{fmt(result.simpleInterest)}</Text> as interest,
                making the total maturity amount{' '}
                <Text style={styles.highlight}>₹{fmt(result.totalAmount)}</Text>.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 48 },

  formulaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f59e0b12',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f59e0b30',
  },
  formulaIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f59e0b20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formulaText: { flex: 1 },
  formulaTitle: { fontSize: 12, color: '#6b7280', fontWeight: '700', letterSpacing: 0.5 },
  formulaEq: {
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '800',
    marginTop: 3,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 16,
  },
  inputGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  inputLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131929',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    paddingHorizontal: 14,
  },
  inputPrefix: { fontSize: 18, color: '#4b5563', fontWeight: '600', marginRight: 8 },
  inputSuffix: { fontSize: 18, color: '#4b5563', fontWeight: '600', marginLeft: 8 },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#f3f4f6',
    paddingVertical: 14,
  },

  timeRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  unitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
  },
  unitBtnActive: { backgroundColor: '#f59e0b' },
  unitBtnText: { fontSize: 12, color: '#4b5563', fontWeight: '700' },
  unitBtnTextActive: { color: '#0a0e1a' },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f7258512',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f7258530',
  },
  errorText: { fontSize: 13, color: '#f72585', fontWeight: '600', flex: 1 },

  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1a2035',
    borderRadius: 14,
    paddingVertical: 14,
  },
  resetText: { fontSize: 15, fontWeight: '700', color: '#6b7280' },
  calcBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 15, fontWeight: '800', color: '#0a0e1a' },

  siHero: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b30',
  },
  siHeroLabel: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  siHeroValue: {
    fontSize: 46,
    fontWeight: '300',
    color: '#f59e0b',
    letterSpacing: -1.5,
    marginTop: 6,
  },
  siHeroDivider: {
    height: 1,
    backgroundColor: '#1a2035',
    width: '100%',
    marginVertical: 18,
  },
  siHeroRow: { flexDirection: 'row', width: '100%' },
  siHeroStat: { flex: 1, alignItems: 'center' },
  siHeroStatDivider: { width: 1, backgroundColor: '#1a2035' },
  siHeroStatLabel: { fontSize: 11, color: '#4b5563', fontWeight: '700', letterSpacing: 0.5 },
  siHeroStatValue: { fontSize: 16, fontWeight: '800', color: '#f3f4f6', marginTop: 4 },

  breakdownCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  barTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#131929',
  },
  barSegment: { height: '100%' },
  barLegend: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  legendPct: { fontSize: 13, fontWeight: '800' },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2035',
    alignItems: 'center',
    gap: 8,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { fontSize: 15, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#4b5563', fontWeight: '600' },

  summaryNote: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#f59e0b10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f59e0b25',
  },
  summaryNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  highlight: { color: '#f59e0b', fontWeight: '700' },
});
