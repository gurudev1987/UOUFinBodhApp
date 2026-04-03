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

type StepUpType = 'none' | 'amount' | 'percent';

interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  absoluteReturn: number;
  cagr: number;
  wealthRatio: number;
  yearlyBreakdown: {
    year: number;
    invested: number;
    returns: number;
    totalValue: number;
  }[];
}

function calculateSIP(
  monthly: number,
  annualRate: number,
  years: number,
  stepUpType: StepUpType,
  stepUpValue: number
): SIPResult {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  let totalInvested = 0;
  let totalValue = 0;
  let currentMonthly = monthly;
  const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

  for (let m = 1; m <= months; m++) {
    // Step-up at the start of each year (except first)
    if (m > 1 && (m - 1) % 12 === 0) {
      if (stepUpType === 'amount') currentMonthly += stepUpValue;
      else if (stepUpType === 'percent') currentMonthly *= 1 + stepUpValue / 100;
    }

    totalInvested += currentMonthly;
    totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);

    if (m % 12 === 0) {
      yearlyBreakdown.push({
        year: m / 12,
        invested: parseFloat(totalInvested.toFixed(2)),
        returns: parseFloat((totalValue - totalInvested).toFixed(2)),
        totalValue: parseFloat(totalValue.toFixed(2)),
      });
    }
  }

  const estimatedReturns = totalValue - totalInvested;
  const absoluteReturn = (estimatedReturns / totalInvested) * 100;
  const cagr = (Math.pow(totalValue / totalInvested, 1 / years) - 1) * 100;
  const wealthRatio = totalValue / totalInvested;

  return {
    investedAmount: parseFloat(totalInvested.toFixed(2)),
    estimatedReturns: parseFloat(estimatedReturns.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    cagr: parseFloat(cagr.toFixed(2)),
    wealthRatio: parseFloat(wealthRatio.toFixed(2)),
    yearlyBreakdown: yearlyBreakdown.slice(0, 20),
  };
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const PRESET_RATES = [8, 10, 12, 15, 18];
const PRESET_YEARS = [3, 5, 10, 15, 20];

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [stepUpType, setStepUpType] = useState<StepUpType>('none');
  const [stepUpValue, setStepUpValue] = useState('');
  const [result, setResult] = useState<SIPResult | null>(null);
  const [error, setError] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculate = () => {
    setError('');
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseFloat(years);

    if (!m || !r || !y || isNaN(m) || isNaN(r) || isNaN(y)) {
      setError('Please fill in all fields with valid numbers.');
      return;
    }
    if (m <= 0 || r <= 0 || y <= 0) {
      setError('All values must be greater than zero.');
      return;
    }
    if (r > 100) { setError('Expected return rate cannot exceed 100%.'); return; }
    if (y > 40)  { setError('Investment period cannot exceed 40 years.'); return; }

    const sv = stepUpType !== 'none' ? parseFloat(stepUpValue) : 0;
    if (stepUpType !== 'none' && (isNaN(sv) || sv < 0)) {
      setError('Please enter a valid step-up value.');
      return;
    }

    setResult(calculateSIP(m, r, y, stepUpType, sv));
    setShowBreakdown(false);
  };

  const reset = () => {
    setMonthly(''); setRate(''); setYears('');
    setStepUpType('none'); setStepUpValue('');
    setResult(null); setError(''); setShowBreakdown(false);
  };

  const fmt = (n: number) =>
    n >= 10000000
      ? `₹${(n / 10000000).toFixed(2)} Cr`
      : n >= 100000
      ? `₹${(n / 100000).toFixed(2)} L`
      : `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fmtFull = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const investedPct = result
    ? ((result.investedAmount / result.totalValue) * 100).toFixed(1)
    : '0';
  const returnsPct = result
    ? ((result.estimatedReturns / result.totalValue) * 100).toFixed(1)
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
            <Ionicons name="trending-up-outline" size={20} color="#a855f7" />
          </View>
          <View style={styles.formulaText}>
            <Text style={styles.formulaTitle}>SIP Returns Formula</Text>
            <Text style={styles.formulaEq}>M × [(1+i)ⁿ - 1] / i × (1+i)</Text>
          </View>
        </View> */}

        {/* Input Card */}
        <View style={styles.card}>

          {/* Monthly Investment */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="cash-outline" size={14} color="#a855f7" />
              <Text style={styles.inputLabel}>MONTHLY INVESTMENT (M)</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 5000"
                placeholderTextColor="#374151"
                value={monthly}
                onChangeText={(v) => { setMonthly(v); setResult(null); setError(''); }}
              />
            </View>
            {/* Preset chips */}
            <View style={styles.presetRow}>
              {PRESET_AMOUNTS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.preset, monthly === String(a) && styles.presetActive]}
                  onPress={() => { setMonthly(String(a)); setResult(null); }}
                >
                  <Text style={[styles.presetText, monthly === String(a) && styles.presetTextActive]}>
                    ₹{a >= 1000 ? `${a / 1000}K` : a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Expected Return */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="analytics-outline" size={14} color="#a855f7" />
              <Text style={styles.inputLabel}>EXPECTED ANNUAL RETURN (p.a.)</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 12"
                placeholderTextColor="#374151"
                value={rate}
                onChangeText={(v) => { setRate(v); setResult(null); setError(''); }}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
            <View style={styles.presetRow}>
              {PRESET_RATES.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.preset, rate === String(r) && styles.presetActive]}
                  onPress={() => { setRate(String(r)); setResult(null); }}
                >
                  <Text style={[styles.presetText, rate === String(r) && styles.presetTextActive]}>
                    {r}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Period */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="hourglass-outline" size={14} color="#a855f7" />
              <Text style={styles.inputLabel}>INVESTMENT PERIOD</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 10"
                placeholderTextColor="#374151"
                value={years}
                onChangeText={(v) => { setYears(v); setResult(null); setError(''); }}
              />
              <Text style={styles.inputSuffix}>Yrs</Text>
            </View>
            <View style={styles.presetRow}>
              {PRESET_YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[styles.preset, years === String(y) && styles.presetActive]}
                  onPress={() => { setYears(String(y)); setResult(null); }}
                >
                  <Text style={[styles.presetText, years === String(y) && styles.presetTextActive]}>
                    {y}Y
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Step-Up SIP */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="rocket-outline" size={14} color="#a855f7" />
              <Text style={styles.inputLabel}>ANNUAL STEP-UP (OPTIONAL)</Text>
            </View>
            <View style={styles.stepUpToggle}>
              {([
                { key: 'none', label: 'No Step-Up' },
                { key: 'percent', label: '% Increase' },
                { key: 'amount', label: '₹ Increase' },
              ] as { key: StepUpType; label: string }[]).map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.stepBtn, stepUpType === s.key && styles.stepBtnActive]}
                  onPress={() => { setStepUpType(s.key); setStepUpValue(''); setResult(null); }}
                >
                  <Text style={[styles.stepBtnText, stepUpType === s.key && styles.stepBtnTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {stepUpType !== 'none' && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>
                  {stepUpType === 'percent' ? '%' : '₹'}
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={stepUpType === 'percent' ? 'e.g. 10' : 'e.g. 500'}
                  placeholderTextColor="#374151"
                  value={stepUpValue}
                  onChangeText={(v) => { setStepUpValue(v); setResult(null); }}
                />
                <Text style={styles.inputSuffix}>per year</Text>
              </View>
            )}
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
            {/* Total Value Hero */}
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>Total Maturity Value</Text>
              <Text style={styles.heroValue}>{fmt(result.totalValue)}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.heroRow}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>Invested</Text>
                  <Text style={styles.heroStatValue}>{fmt(result.investedAmount)}</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>Returns</Text>
                  <Text style={[styles.heroStatValue, { color: '#a855f7' }]}>
                    {fmt(result.estimatedReturns)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Breakdown Bar */}
            <View style={styles.barCard}>
              <Text style={styles.sectionLabel}>PORTFOLIO SPLIT</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barSeg, { flex: parseFloat(investedPct), backgroundColor: '#06d6a0' }]} />
                <View style={[styles.barSeg, { flex: parseFloat(returnsPct), backgroundColor: '#a855f7' }]} />
              </View>
              <View style={styles.barLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#06d6a0' }]} />
                  <Text style={styles.legendLabel}>Invested</Text>
                  <Text style={[styles.legendPct, { color: '#06d6a0' }]}>{investedPct}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#a855f7' }]} />
                  <Text style={styles.legendLabel}>Returns</Text>
                  <Text style={[styles.legendPct, { color: '#a855f7' }]}>{returnsPct}%</Text>
                </View>
              </View>
            </View>

            {/* Key Metrics */}
            <Text style={styles.sectionLabel}>KEY METRICS</Text>
            <View style={styles.statsGrid}>
              {[
                {
                  label: 'Absolute Return',
                  value: `${result.absoluteReturn}%`,
                  icon: 'trending-up-outline',
                  color: '#a855f7',
                },
                {
                  label: 'Est. CAGR',
                  value: `${result.cagr}%`,
                  icon: 'stats-chart-outline',
                  color: '#00d4ff',
                },
                {
                  label: 'Wealth Ratio',
                  value: `${result.wealthRatio}x`,
                  icon: 'diamond-outline',
                  color: '#f59e0b',
                },
                {
                  label: 'Total Months',
                  value: `${parseFloat(years) * 12}`,
                  icon: 'calendar-outline',
                  color: '#06d6a0',
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

            {/* Step-Up note */}
            {stepUpType !== 'none' && (
              <View style={styles.stepUpNote}>
                <Ionicons name="rocket-outline" size={16} color="#a855f7" />
                <Text style={styles.stepUpNoteText}>
                  Step-up SIP applied:{' '}
                  <Text style={{ color: '#a855f7', fontWeight: '800' }}>
                    {stepUpType === 'percent' ? `${stepUpValue}%` : `₹${stepUpValue}`}
                  </Text>{' '}
                  increase every year.
                </Text>
              </View>
            )}

            {/* Year-by-Year Breakdown Toggle */}
            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setShowBreakdown(!showBreakdown)}
            >
              <Text style={styles.breakdownToggleText}>
                {showBreakdown ? 'Hide' : 'Show'} Year-by-Year Breakdown
              </Text>
              <Ionicons
                name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#a855f7"
              />
            </TouchableOpacity>

            {showBreakdown && (
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  {['Year', 'Invested', 'Returns', 'Value'].map((h) => (
                    <Text key={h} style={styles.tableHeadCell}>{h}</Text>
                  ))}
                </View>
                {result.yearlyBreakdown.map((row, idx) => (
                  <View
                    key={row.year}
                    style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}
                  >
                    <Text style={styles.tableCell}>{row.year}</Text>
                    <Text style={styles.tableCell}>{fmt(row.invested)}</Text>
                    <Text style={[styles.tableCell, { color: '#a855f7' }]}>
                      {fmt(row.returns)}
                    </Text>
                    <Text style={[styles.tableCell, { color: '#00d4ff' }]}>
                      {fmt(row.totalValue)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Summary Note */}
            <View style={styles.summaryNote}>
              <Ionicons name="information-circle-outline" size={16} color="#a855f7" />
              <Text style={styles.summaryNoteText}>
                Investing{' '}
                <Text style={styles.highlight}>₹{fmtFull(parseFloat(monthly))}/mo</Text> for{' '}
                <Text style={styles.highlight}>{years} years</Text> at{' '}
                <Text style={styles.highlight}>{rate}% p.a.</Text> grows your total investment of{' '}
                <Text style={styles.highlight}>{fmt(result.investedAmount)}</Text> to{' '}
                <Text style={styles.highlight}>{fmt(result.totalValue)}</Text> — a{' '}
                <Text style={styles.highlight}>{result.wealthRatio}x</Text> return on your money.
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
    backgroundColor: '#a855f712',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a855f730',
  },
  formulaIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#a855f720',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formulaText: { flex: 1 },
  formulaTitle: { fontSize: 12, color: '#6b7280', fontWeight: '700', letterSpacing: 0.5 },
  formulaEq: { fontSize: 13, color: '#a855f7', fontWeight: '800', marginTop: 3, letterSpacing: 0.2 },

  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 18,
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
  inputPrefix: { fontSize: 16, color: '#4b5563', fontWeight: '600', marginRight: 8 },
  inputSuffix: { fontSize: 14, color: '#4b5563', fontWeight: '600', marginLeft: 8 },
  input: { flex: 1, fontSize: 18, color: '#f3f4f6', paddingVertical: 14 },

  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  preset: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#131929',
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  presetActive: { backgroundColor: '#a855f7', borderColor: '#a855f7' },
  presetText: { fontSize: 12, color: '#4b5563', fontWeight: '700' },
  presetTextActive: { color: '#fff' },

  stepUpToggle: {
    flexDirection: 'row',
    backgroundColor: '#131929',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  stepBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  stepBtnActive: { backgroundColor: '#a855f7' },
  stepBtnText: { fontSize: 11, color: '#4b5563', fontWeight: '700' },
  stepBtnTextActive: { color: '#fff' },

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
    backgroundColor: '#a855f7',
    borderRadius: 14,
    paddingVertical: 14,
  },
  calcBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  hero: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a855f730',
  },
  heroLabel: { fontSize: 12, color: '#4b5563', fontWeight: '800', letterSpacing: 1.5 },
  heroValue: {
    fontSize: 44,
    fontWeight: '300',
    color: '#a855f7',
    letterSpacing: -1.5,
    marginTop: 6,
  },
  heroDivider: { height: 1, backgroundColor: '#1a2035', width: '100%', marginVertical: 18 },
  heroRow: { flexDirection: 'row', width: '100%' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatDivider: { width: 1, backgroundColor: '#1a2035' },
  heroStatLabel: { fontSize: 11, color: '#4b5563', fontWeight: '700', letterSpacing: 0.5 },
  heroStatValue: { fontSize: 15, fontWeight: '800', color: '#f3f4f6', marginTop: 4 },

  barCard: {
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
  barSeg: { height: '100%' },
  barLegend: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  legendPct: { fontSize: 13, fontWeight: '800' },

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
  statValue: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#4b5563', fontWeight: '600', textAlign: 'center' },

  stepUpNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#a855f712',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a855f725',
  },
  stepUpNoteText: { fontSize: 13, color: '#6b7280', flex: 1 },

  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#a855f730',
  },
  breakdownToggleText: { fontSize: 13, color: '#a855f7', fontWeight: '700' },

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
    backgroundColor: '#a855f710',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a855f725',
  },
  summaryNoteText: { flex: 1, fontSize: 13, color: '#6b7280', lineHeight: 20 },
  highlight: { color: '#a855f7', fontWeight: '700' },
});
