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

type TimeUnit = 'years' | 'months';
type CompoundFreq = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

interface CIResult {
  compoundInterest: number;
  totalAmount: number;
  simpleInterest: number;
  extraEarned: number;
  effectiveRate: number;
  yearlyBreakdown: {
    year: number;
    openingBalance: number;
    interest: number;
    closingBalance: number;
  }[];
}

const FREQ_MAP: Record<CompoundFreq, { n: number; label: string }> = {
  annually:      { n: 1,   label: 'Annually (1x/yr)' },
  'semi-annually': { n: 2, label: 'Semi-Annual (2x/yr)' },
  quarterly:     { n: 4,   label: 'Quarterly (4x/yr)' },
  monthly:       { n: 12,  label: 'Monthly (12x/yr)' },
  daily:         { n: 365, label: 'Daily (365x/yr)' },
};

function calculateCI(
  principal: number,
  rate: number,
  time: number,
  timeUnit: TimeUnit,
  freq: CompoundFreq
): CIResult {
  const n = FREQ_MAP[freq].n;
  const r = rate / 100;
  const t = timeUnit === 'months' ? time / 12 : time;
  const years = Math.ceil(t);

  // A = P(1 + r/n)^(nt)
  const totalAmount = principal * Math.pow(1 + r / n, n * t);
  const compoundInterest = totalAmount - principal;
  const simpleInterest = principal * r * t;
  const extraEarned = compoundInterest - simpleInterest;

  // Effective annual rate
  const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

  // Year-by-year breakdown
  const yearlyBreakdown = [];
  for (let y = 1; y <= Math.min(years, 10); y++) {
    const opening = principal * Math.pow(1 + r / n, n * (y - 1));
    const closing = principal * Math.pow(1 + r / n, n * y);
    yearlyBreakdown.push({
      year: y,
      openingBalance: parseFloat(opening.toFixed(2)),
      interest: parseFloat((closing - opening).toFixed(2)),
      closingBalance: parseFloat(closing.toFixed(2)),
    });
  }

  return {
    compoundInterest: parseFloat(compoundInterest.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    simpleInterest: parseFloat(simpleInterest.toFixed(2)),
    extraEarned: parseFloat(extraEarned.toFixed(2)),
    effectiveRate: parseFloat(effectiveRate.toFixed(4)),
    yearlyBreakdown,
  };
}

const freqKeys = Object.keys(FREQ_MAP) as CompoundFreq[];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years');
  const [freq, setFreq] = useState<CompoundFreq>('annually');
  const [result, setResult] = useState<CIResult | null>(null);
  const [error, setError] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

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
    setResult(calculateCI(p, r, t, timeUnit, freq));
    setShowBreakdown(false);
  };

  const reset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setTimeUnit('years');
    setFreq('annually');
    setResult(null);
    setError('');
    setShowBreakdown(false);
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const principalPct = result
    ? ((parseFloat(principal) / result.totalAmount) * 100).toFixed(1)
    : '0';
  const interestPct = result
    ? ((result.compoundInterest / result.totalAmount) * 100).toFixed(1)
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
            <Ionicons name="stats-chart-outline" size={20} color="#06d6a0" />
          </View>
          <View style={styles.formulaText}>
            <Text style={styles.formulaTitle}>Compound Interest Formula</Text>
            <Text style={styles.formulaEq}>A = P(1 + r/n)^(n×t)</Text>
          </View>
        </View> */}

        {/* Input Card */}
        <View style={styles.card}>

          {/* Principal */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="cash-outline" size={14} color="#06d6a0" />
              <Text style={styles.inputLabel}>PRINCIPAL AMOUNT (P)</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 100000"
                placeholderTextColor="#374151"
                value={principal}
                onChangeText={(v) => { setPrincipal(v); setResult(null); setError(''); }}
              />
            </View>
          </View>

          {/* Rate */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="trending-up-outline" size={14} color="#06d6a0" />
              <Text style={styles.inputLabel}>ANNUAL INTEREST RATE (r)</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 10"
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
              <Ionicons name="time-outline" size={14} color="#06d6a0" />
              <Text style={styles.inputLabel}>TIME PERIOD (t)</Text>
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g. 5"
                  placeholderTextColor="#374151"
                  value={time}
                  onChangeText={(v) => { setTime(v); setResult(null); setError(''); }}
                />
              </View>
              <View style={styles.unitToggle}>
                {(['years', 'months'] as TimeUnit[]).map((u) => (
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

          {/* Compounding Frequency */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="repeat-outline" size={14} color="#06d6a0" />
              <Text style={styles.inputLabel}>COMPOUNDING FREQUENCY (n)</Text>
            </View>
            <View style={styles.freqGrid}>
              {freqKeys.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.freqBtn, freq === f && styles.freqBtnActive]}
                  onPress={() => { setFreq(f); setResult(null); }}
                >
                  <Text style={[styles.freqBtnText, freq === f && styles.freqBtnTextActive]}>
                    {FREQ_MAP[f].label}
                  </Text>
                </TouchableOpacity>
              ))}
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

        {/* Results */}
        {result && (
          <>
            {/* CI Hero */}
            <View style={styles.ciHero}>
              <Text style={styles.ciHeroLabel}>Compound Interest</Text>
              <Text style={styles.ciHeroValue}>₹ {fmt(result.compoundInterest)}</Text>
              <View style={styles.ciHeroDivider} />
              <View style={styles.ciHeroRow}>
                <View style={styles.ciHeroStat}>
                  <Text style={styles.ciHeroStatLabel}>Principal</Text>
                  <Text style={styles.ciHeroStatValue}>₹ {fmt(parseFloat(principal))}</Text>
                </View>
                <View style={styles.ciHeroStatDivider} />
                <View style={styles.ciHeroStat}>
                  <Text style={styles.ciHeroStatLabel}>Total Amount</Text>
                  <Text style={[styles.ciHeroStatValue, { color: '#06d6a0' }]}>
                    ₹ {fmt(result.totalAmount)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Breakdown Bar */}
            <View style={styles.breakdownCard}>
              <Text style={styles.sectionLabel}>AMOUNT BREAKDOWN</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barSegment, { flex: parseFloat(principalPct), backgroundColor: '#06d6a0' }]} />
                <View style={[styles.barSegment, { flex: parseFloat(interestPct), backgroundColor: '#00d4ff' }]} />
              </View>
              <View style={styles.barLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                  <Text style={styles.legendLabel}>Principal</Text>
                  <Text style={[styles.legendPct, { color: '#06d6a0' }]}>{principalPct}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#00d4ff' }]} />
                  <Text style={styles.legendLabel}>CI Earned</Text>
                  <Text style={[styles.legendPct, { color: '#00d4ff' }]}>{interestPct}%</Text>
                </View>
              </View>
            </View>

            {/* CI vs SI Comparison */}
            <Text style={styles.sectionLabel}>CI vs SI COMPARISON</Text>
            <View style={styles.compareCard}>
              <View style={styles.compareRow}>
                <View style={styles.compareItem}>
                  <Text style={styles.compareItemLabel}>Simple Interest</Text>
                  <Text style={[styles.compareItemValue, { color: '#f59e0b' }]}>
                    ₹ {fmt(result.simpleInterest)}
                  </Text>
                </View>
                <View style={styles.compareVs}>
                  <Text style={styles.compareVsText}>VS</Text>
                </View>
                <View style={styles.compareItem}>
                  <Text style={styles.compareItemLabel}>Compound Interest</Text>
                  <Text style={[styles.compareItemValue, { color: '#06d6a0' }]}>
                    ₹ {fmt(result.compoundInterest)}
                  </Text>
                </View>
              </View>
              <View style={styles.extraEarnedBox}>
                <Ionicons name="rocket-outline" size={16} color="#06d6a0" />
                <Text style={styles.extraEarnedText}>
                  You earn extra{' '}
                  <Text style={{ color: '#06d6a0', fontWeight: '800' }}>
                    ₹ {fmt(result.extraEarned)}
                  </Text>{' '}
                  with compounding!
                </Text>
              </View>
            </View>

            {/* Stats Grid */}
            <Text style={styles.sectionLabel}>KEY METRICS</Text>
            <View style={styles.statsGrid}>
              {[
                {
                  label: 'Effective Rate',
                  value: `${result.effectiveRate}%`,
                  icon: 'analytics-outline',
                  color: '#a855f7',
                },
                {
                  label: 'Compounding',
                  value: FREQ_MAP[freq].label.split(' ')[0],
                  icon: 'repeat-outline',
                  color: '#00d4ff',
                },
                {
                  label: 'Total Interest',
                  value: `₹ ${fmt(result.compoundInterest)}`,
                  icon: 'trending-up-outline',
                  color: '#06d6a0',
                },
                {
                  label: 'Maturity Amount',
                  value: `₹ ${fmt(result.totalAmount)}`,
                  icon: 'wallet-outline',
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

            {/* Year-by-Year Breakdown Toggle */}
            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setShowBreakdown(!showBreakdown)}
            >
              <Text style={styles.breakdownToggleText}>
                {showBreakdown ? 'Hide' : 'Show'} Year-by-Year Breakdown
                {result.yearlyBreakdown.length === 10 ? ' (First 10 Years)' : ''}
              </Text>
              <Ionicons
                name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#06d6a0"
              />
            </TouchableOpacity>

            {showBreakdown && (
              <View style={styles.tableCard}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  {['Year', 'Opening', 'Interest', 'Closing'].map((h) => (
                    <Text key={h} style={styles.tableHeadCell}>{h}</Text>
                  ))}
                </View>
                {/* Table Rows */}
                {result.yearlyBreakdown.map((row, idx) => (
                  <View
                    key={row.year}
                    style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}
                  >
                    <Text style={styles.tableCell}>{row.year}</Text>
                    <Text style={styles.tableCell}>{fmt(row.openingBalance)}</Text>
                    <Text style={[styles.tableCell, { color: '#06d6a0' }]}>
                      +{fmt(row.interest)}
                    </Text>
                    <Text style={[styles.tableCell, { color: '#00d4ff' }]}>
                      {fmt(row.closingBalance)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Summary Note */}
            <View style={styles.summaryNote}>
              <Ionicons name="information-circle-outline" size={16} color="#06d6a0" />
              <Text style={styles.summaryNoteText}>
                Investing{' '}
                <Text style={styles.highlight}>₹{fmt(parseFloat(principal))}</Text> at{' '}
                <Text style={styles.highlight}>{rate}% p.a.</Text> compounded{' '}
                <Text style={styles.highlight}>{freq}</Text> for{' '}
                <Text style={styles.highlight}>{time} {timeUnit}</Text> grows to{' '}
                <Text style={styles.highlight}>₹{fmt(result.totalAmount)}</Text>, earning{' '}
                <Text style={styles.highlight}>₹{fmt(result.compoundInterest)}</Text> in interest.
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
    backgroundColor: '#06d6a012',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#06d6a030',
  },
  formulaIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#06d6a020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formulaText: { flex: 1 },
  formulaTitle: { fontSize: 12, color: '#6b7280', fontWeight: '700', letterSpacing: 0.5 },
  formulaEq: { fontSize: 15, color: '#06d6a0', fontWeight: '800', marginTop: 3, letterSpacing: 0.3 },

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
  inputLabel: { fontSize: 11, color: '#6b7280', fontWeight: '800', letterSpacing: 1.2 },
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
  unitBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9 },
  unitBtnActive: { backgroundColor: '#06d6a0' },
  unitBtnText: { fontSize: 12, color: '#4b5563', fontWeight: '700' },
  unitBtnTextActive: { color: '#0a0e1a' },

  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#131929',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  freqBtnActive: { backgroundColor: '#06d6a0', borderColor: '#06d6a0' },
  freqBtnText: { fontSize: 12, color: '#4b5563', fontWeight: '700' },
  freqBtnTextActive: { color: '#0a0e1a' },

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
    backgroundColor: '#06d6a0',
    borderRadius: 14,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 15, fontWeight: '800', color: '#0a0e1a' },

  ciHero: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#06d6a030',
  },
  ciHeroLabel: { fontSize: 12, color: '#4b5563', fontWeight: '800', letterSpacing: 1.5 },
  ciHeroValue: {
    fontSize: 44,
    fontWeight: '300',
    color: '#06d6a0',
    letterSpacing: -1.5,
    marginTop: 6,
  },
  ciHeroDivider: { height: 1, backgroundColor: '#1a2035', width: '100%', marginVertical: 18 },
  ciHeroRow: { flexDirection: 'row', width: '100%' },
  ciHeroStat: { flex: 1, alignItems: 'center' },
  ciHeroStatDivider: { width: 1, backgroundColor: '#1a2035' },
  ciHeroStatLabel: { fontSize: 11, color: '#4b5563', fontWeight: '700', letterSpacing: 0.5 },
  ciHeroStatValue: { fontSize: 15, fontWeight: '800', color: '#f3f4f6', marginTop: 4 },

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

  compareCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 16,
  },
  compareRow: { flexDirection: 'row', alignItems: 'center' },
  compareItem: { flex: 1, alignItems: 'center', gap: 6 },
  compareItemLabel: { fontSize: 12, color: '#4b5563', fontWeight: '700', textAlign: 'center' },
  compareItemValue: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  compareVs: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a2035',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compareVsText: { fontSize: 11, color: '#374151', fontWeight: '800' },
  extraEarnedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#06d6a012',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#06d6a025',
  },
  extraEarnedText: { fontSize: 13, color: '#6b7280', flex: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
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
  statValue: { fontSize: 14, fontWeight: '800', textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#4b5563', fontWeight: '600', textAlign: 'center' },

  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#06d6a030',
  },
  breakdownToggleText: { fontSize: 13, color: '#06d6a0', fontWeight: '700' },

  tableCard: {
    backgroundColor: '#0d1117',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#131929',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeadCell: {
    flex: 1,
    fontSize: 10,
    color: '#4b5563',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2035',
  },
  tableRowAlt: { backgroundColor: '#0a0f1e' },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '600',
  },

  summaryNote: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#06d6a010',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#06d6a025',
  },
  summaryNoteText: { flex: 1, fontSize: 13, color: '#6b7280', lineHeight: 20 },
  highlight: { color: '#06d6a0', fontWeight: '700' },
});
