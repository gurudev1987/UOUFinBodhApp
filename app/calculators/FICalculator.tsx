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

interface FIResult {
  yearsToFI: number;
  retirementAge: number;
  inflationAdjustedMonthlyExpense: number;
  annualExpenseAtFI: number;
  fiCorpusRequired: number;
  projectedCorpusAtFI: number;
  isOnTrack: boolean;
  corpusGap: number;
  corpusSurplus: number;
  monthlyExpenseToday: number;
  savingsRate: number;
  realReturnRate: number;
}

function calculateFI(
  currentAge: number,
  retirementAge: number,
  currentInvestments: number,
  monthlyInvestment: number,
  annualReturn: number,
  inflation: number,
  monthlyExpenses: number,
  swr: number
): FIResult {
  const years = retirementAge - currentAge;
  const monthlyRate = annualReturn / 12 / 100;
  const realReturnRate = ((1 + annualReturn / 100) / (1 + inflation / 100) - 1) * 100;

  // Inflation-adjusted monthly expense at FI
  const inflationAdjustedMonthlyExpense =
    monthlyExpenses * Math.pow(1 + inflation / 100, years);

  // Annual expense at FI
  const annualExpenseAtFI = inflationAdjustedMonthlyExpense * 12;

  // FI Corpus required using Safe Withdrawal Rate
  const fiCorpusRequired = (annualExpenseAtFI / swr) * 100;

  // Projected corpus: FV of current investments + FV of monthly SIP
  const fvCurrentInvestments =
    currentInvestments * Math.pow(1 + annualReturn / 100, years);

  const fvSIP =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const projectedCorpusAtFI = fvCurrentInvestments + fvSIP;

  const isOnTrack = projectedCorpusAtFI >= fiCorpusRequired;
  const corpusGap = isOnTrack ? 0 : fiCorpusRequired - projectedCorpusAtFI;
  const corpusSurplus = isOnTrack ? projectedCorpusAtFI - fiCorpusRequired : 0;

  // Monthly income assumed = monthlyExpenses + monthlyInvestment for savings rate
  const monthlyIncome = monthlyExpenses + monthlyInvestment;
  const savingsRate = (monthlyInvestment / monthlyIncome) * 100;

  return {
    yearsToFI: years,
    retirementAge,
    inflationAdjustedMonthlyExpense: parseFloat(inflationAdjustedMonthlyExpense.toFixed(2)),
    annualExpenseAtFI: parseFloat(annualExpenseAtFI.toFixed(2)),
    fiCorpusRequired: parseFloat(fiCorpusRequired.toFixed(2)),
    projectedCorpusAtFI: parseFloat(projectedCorpusAtFI.toFixed(2)),
    isOnTrack,
    corpusGap: parseFloat(corpusGap.toFixed(2)),
    corpusSurplus: parseFloat(corpusSurplus.toFixed(2)),
    monthlyExpenseToday: monthlyExpenses,
    savingsRate: parseFloat(savingsRate.toFixed(1)),
    realReturnRate: parseFloat(realReturnRate.toFixed(2)),
  };
}

type FieldKey =
  | 'currentAge'
  | 'retirementAge'
  | 'currentInvestments'
  | 'monthlyInvestment'
  | 'annualReturn'
  | 'inflation'
  | 'monthlyExpenses'
  | 'swr';

const FIELDS: {
  key: FieldKey;
  label: string;
  sublabel: string;
  icon: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
}[] = [
  {
    key: 'currentAge',
    label: 'CURRENT AGE',
    sublabel: 'Your age today',
    icon: 'person-outline',
    placeholder: 'e.g. 28',
    suffix: 'yrs',
  },
  {
    key: 'retirementAge',
    label: 'FI AGE (RETIREMENT AGE)',
    sublabel: 'Age you want to retire',
    icon: 'flag-outline',
    placeholder: 'e.g. 45',
    suffix: 'yrs',
  },
  {
    key: 'currentInvestments',
    label: 'CURRENT INVESTMENTS',
    sublabel: 'Total portfolio value today',
    icon: 'wallet-outline',
    placeholder: 'e.g. 500000',
    prefix: '₹',
  },
  {
    key: 'monthlyInvestment',
    label: 'MONTHLY INVESTMENT',
    sublabel: 'Amount you invest each month',
    icon: 'cash-outline',
    placeholder: 'e.g. 25000',
    prefix: '₹',
  },
  {
    key: 'annualReturn',
    label: 'EXPECTED ANNUAL RETURN',
    sublabel: 'Expected portfolio growth rate',
    icon: 'trending-up-outline',
    placeholder: 'e.g. 12',
    suffix: '%',
  },
  {
    key: 'inflation',
    label: 'EXPECTED INFLATION',
    sublabel: 'Long-term inflation estimate',
    icon: 'arrow-up-circle-outline',
    placeholder: 'e.g. 6',
    suffix: '%',
  },
  {
    key: 'monthlyExpenses',
    label: 'MONTHLY EXPENSES TODAY',
    sublabel: 'Current monthly spending',
    icon: 'receipt-outline',
    placeholder: 'e.g. 50000',
    prefix: '₹',
  },
  {
    key: 'swr',
    label: 'SAFE WITHDRAWAL RATE',
    sublabel: '4% rule is widely used',
    icon: 'shield-checkmark-outline',
    placeholder: 'e.g. 4',
    suffix: '%',
  },
];

export default function FinancialIndependenceCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    currentAge: '',
    retirementAge: '',
    currentInvestments: '',
    monthlyInvestment: '',
    annualReturn: '',
    inflation: '',
    monthlyExpenses: '',
    swr: '',
  });
  const [result, setResult] = useState<FIResult | null>(null);
  const [error, setError] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const updateValue = (key: FieldKey, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setResult(null);
    setError('');
  };

  const calculate = () => {
    setError('');
    const v = values;
    const nums: Record<FieldKey, number> = {
      currentAge: parseFloat(v.currentAge),
      retirementAge: parseFloat(v.retirementAge),
      currentInvestments: parseFloat(v.currentInvestments),
      monthlyInvestment: parseFloat(v.monthlyInvestment),
      annualReturn: parseFloat(v.annualReturn),
      inflation: parseFloat(v.inflation),
      monthlyExpenses: parseFloat(v.monthlyExpenses),
      swr: parseFloat(v.swr),
    };

    for (const [k, n] of Object.entries(nums)) {
      if (isNaN(n) || n <= 0) {
        setError(`Please enter a valid value for ${FIELDS.find((f) => f.key === k)?.label}.`);
        return;
      }
    }
    if (nums.retirementAge <= nums.currentAge) {
      setError('FI Age must be greater than Current Age.');
      return;
    }
    if (nums.annualReturn >= 50) {
      setError('Expected return seems too high. Please enter a realistic value.');
      return;
    }
    if (nums.inflation >= nums.annualReturn) {
      setError('Inflation should be lower than expected return for positive real returns.');
      return;
    }
    if (nums.swr <= 0 || nums.swr > 20) {
      setError('Safe Withdrawal Rate should be between 1% and 20%.');
      return;
    }

    setResult(
      calculateFI(
        nums.currentAge,
        nums.retirementAge,
        nums.currentInvestments,
        nums.monthlyInvestment,
        nums.annualReturn,
        nums.inflation,
        nums.monthlyExpenses,
        nums.swr
      )
    );
    setShowBreakdown(false);
  };

  const reset = () => {
    setValues({
      currentAge: '', retirementAge: '', currentInvestments: '',
      monthlyInvestment: '', annualReturn: '', inflation: '',
      monthlyExpenses: '', swr: '',
    });
    setResult(null);
    setError('');
    setShowBreakdown(false);
  };

  const fmt = (n: number) =>
    n >= 10000000
      ? `₹${(n / 10000000).toFixed(2)} Cr`
      : n >= 100000
      ? `₹${(n / 100000).toFixed(2)} L`
      : `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const fmtFull = (n: number) =>
    `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const corpusPct = result
    ? Math.min((result.projectedCorpusAtFI / result.fiCorpusRequired) * 100, 100).toFixed(1)
    : '0';

  // Yearly projected corpus for mini milestone cards
  const getMilestones = () => {
    if (!result) return [];
    const years = result.yearsToFI;
    const checkpoints = [
      Math.floor(years * 0.25),
      Math.floor(years * 0.5),
      Math.floor(years * 0.75),
      years,
    ].filter((y) => y > 0);

    const monthlyRate = parseFloat(values.annualReturn) / 12 / 100;
    const annualReturn = parseFloat(values.annualReturn) / 100;
    const ci = parseFloat(values.currentInvestments);
    const mi = parseFloat(values.monthlyInvestment);

    return checkpoints.map((y) => {
      const fvCI = ci * Math.pow(1 + annualReturn, y);
      const fvSIP =
        mi * ((Math.pow(1 + monthlyRate, y * 12) - 1) / monthlyRate) * (1 + monthlyRate);
      return { year: y, age: parseFloat(values.currentAge) + y, corpus: fvCI + fvSIP };
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="flame-outline" size={24} color="#f59e0b" />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Financial Independence</Text>
            <Text style={styles.bannerSub}>
              Calculate your FIRE number and retirement readiness
            </Text>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>YOUR FINANCIAL DETAILS</Text>

          {FIELDS.map((field, idx) => (
            <View key={field.key} style={styles.inputGroup}>
              {/* Divider between sections */}
              {idx === 2 && <View style={styles.sectionDivider} />}
              {idx === 4 && <View style={styles.sectionDivider} />}
              {idx === 6 && <View style={styles.sectionDivider} />}

              <View style={styles.labelRow}>
                <Ionicons name={field.icon as any} size={13} color="#f59e0b" />
                <Text style={styles.inputLabel}>{field.label}</Text>
              </View>
              <Text style={styles.sublabel}>{field.sublabel}</Text>
              <View style={styles.inputWrapper}>
                {field.prefix && (
                  <Text style={styles.inputAffix}>{field.prefix}</Text>
                )}
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={field.placeholder}
                  placeholderTextColor="#374151"
                  value={values[field.key]}
                  onChangeText={(v) => updateValue(field.key, v)}
                />
                {field.suffix && (
                  <Text style={styles.inputAffix}>{field.suffix}</Text>
                )}
              </View>
            </View>
          ))}

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
              <Ionicons name="flame-outline" size={18} color="#0a0e1a" />
              <Text style={styles.calcBtnText}>Calculate FI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RESULTS ── */}
        {result && (
          <>
            {/* Status Badge */}
            <View style={[styles.statusBadge, result.isOnTrack ? styles.statusGreen : styles.statusRed]}>
              <Ionicons
                name={result.isOnTrack ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={result.isOnTrack ? '#06d6a0' : '#f72585'}
              />
              <Text style={[styles.statusText, { color: result.isOnTrack ? '#06d6a0' : '#f72585' }]}>
                {result.isOnTrack
                  ? `You're on track! Surplus corpus of ${fmt(result.corpusSurplus)}`
                  : `Corpus gap of ${fmt(result.corpusGap)} — increase investments`}
              </Text>
            </View>

            {/* Primary Outputs */}
            <Text style={styles.sectionLabel}>FINANCIAL INDEPENDENCE SUMMARY</Text>

            {/* Years to FI — Hero */}
            <View style={styles.fiHero}>
              <View style={styles.fiHeroLeft}>
                <Text style={styles.fiHeroSmall}>YEARS TO FINANCIAL INDEPENDENCE</Text>
                <Text style={styles.fiHeroYears}>{result.yearsToFI}</Text>
                <Text style={styles.fiHeroYearsLabel}>years</Text>
              </View>
              <View style={styles.fiHeroDividerV} />
              <View style={styles.fiHeroRight}>
                <View style={styles.fiHeroStat}>
                  <Text style={styles.fiHeroStatLabel}>Current Age</Text>
                  <Text style={styles.fiHeroStatVal}>{values.currentAge}</Text>
                </View>
                <Ionicons name="arrow-forward" size={14} color="#374151" style={{ marginVertical: 4 }} />
                <View style={styles.fiHeroStat}>
                  <Text style={styles.fiHeroStatLabel}>FI Age</Text>
                  <Text style={[styles.fiHeroStatVal, { color: '#f59e0b' }]}>
                    {result.retirementAge}
                  </Text>
                </View>
              </View>
            </View>

            {/* 5 Key Output Cards */}
            <View style={styles.outputGrid}>

              <View style={[styles.outputCard, styles.outputCardFull, { borderColor: '#f59e0b40' }]}>
                <View style={styles.outputCardHeader}>
                  <View style={[styles.outputIcon, { backgroundColor: '#f59e0b20' }]}>
                    <Ionicons name="library-outline" size={18} color="#f59e0b" />
                  </View>
                  <Text style={styles.outputCardLabel}>FI CORPUS REQUIRED</Text>
                </View>
                <Text style={[styles.outputCardValue, { color: '#f59e0b', fontSize: 30 }]}>
                  {fmt(result.fiCorpusRequired)}
                </Text>
                <Text style={styles.outputCardSub}>
                  Based on {values.swr}% SWR × Annual Expense
                </Text>
              </View>

              <View style={[styles.outputCard, styles.outputCardFull, {
                borderColor: result.isOnTrack ? '#06d6a040' : '#f7258540'
              }]}>
                <View style={styles.outputCardHeader}>
                  <View style={[styles.outputIcon, {
                    backgroundColor: result.isOnTrack ? '#06d6a020' : '#f7258520'
                  }]}>
                    <Ionicons
                      name="stats-chart-outline"
                      size={18}
                      color={result.isOnTrack ? '#06d6a0' : '#f72585'}
                    />
                  </View>
                  <Text style={styles.outputCardLabel}>PROJECTED CORPUS AT FI</Text>
                </View>
                <Text style={[styles.outputCardValue, {
                  color: result.isOnTrack ? '#06d6a0' : '#f72585', fontSize: 30
                }]}>
                  {fmt(result.projectedCorpusAtFI)}
                </Text>
                <Text style={styles.outputCardSub}>
                  {result.isOnTrack
                    ? `${((result.projectedCorpusAtFI / result.fiCorpusRequired) * 100).toFixed(1)}% of required corpus`
                    : `${corpusPct}% of required corpus`}
                </Text>

                {/* Corpus progress bar */}
                <View style={styles.corpusBarTrack}>
                  <View style={[styles.corpusBarFill, {
                    width: `${corpusPct}%` as any,
                    backgroundColor: result.isOnTrack ? '#06d6a0' : '#f72585'
                  }]} />
                </View>
              </View>

              <View style={[styles.outputCard, { borderColor: '#a855f740' }]}>
                <View style={styles.outputCardHeader}>
                  <View style={[styles.outputIcon, { backgroundColor: '#a855f720' }]}>
                    <Ionicons name="calendar-outline" size={16} color="#a855f7" />
                  </View>
                  <Text style={styles.outputCardLabel}>MONTHLY EXPENSE AT FI</Text>
                </View>
                <Text style={[styles.outputCardValue, { color: '#a855f7' }]}>
                  {fmt(result.inflationAdjustedMonthlyExpense)}
                </Text>
                <Text style={styles.outputCardSub}>
                  Inflation-adjusted at {values.inflation}% p.a.
                </Text>
              </View>

              <View style={[styles.outputCard, { borderColor: '#00d4ff40' }]}>
                <View style={styles.outputCardHeader}>
                  <View style={[styles.outputIcon, { backgroundColor: '#00d4ff20' }]}>
                    <Ionicons name="receipt-outline" size={16} color="#00d4ff" />
                  </View>
                  <Text style={styles.outputCardLabel}>ANNUAL EXPENSE AT FI</Text>
                </View>
                <Text style={[styles.outputCardValue, { color: '#00d4ff' }]}>
                  {fmt(result.annualExpenseAtFI)}
                </Text>
                <Text style={styles.outputCardSub}>
                  Monthly × 12 at FI
                </Text>
              </View>
            </View>

            {/* Investor Stats */}
            <Text style={styles.sectionLabel}>INVESTOR METRICS</Text>
            <View style={styles.metricsRow}>
              {[
                {
                  label: 'Savings Rate',
                  value: `${result.savingsRate}%`,
                  icon: 'save-outline',
                  color: '#06d6a0',
                  sub: 'of income invested',
                },
                {
                  label: 'Real Return',
                  value: `${result.realReturnRate}%`,
                  icon: 'trending-up-outline',
                  color: '#f59e0b',
                  sub: 'after inflation',
                },
              ].map((m) => (
                <View key={m.label} style={styles.metricCard}>
                  <View style={[styles.metricIcon, { backgroundColor: m.color + '20' }]}>
                    <Ionicons name={m.icon as any} size={18} color={m.color} />
                  </View>
                  <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                  <Text style={styles.metricSub}>{m.sub}</Text>
                </View>
              ))}
            </View>

            {/* Corpus Journey Milestones */}
            <Text style={styles.sectionLabel}>CORPUS JOURNEY MILESTONES</Text>
            <View style={styles.milestonesCard}>
              {getMilestones().map((m, idx) => {
                const pct = Math.min((m.corpus / result.fiCorpusRequired) * 100, 100);
                const isLast = idx === getMilestones().length - 1;
                return (
                  <View key={m.year} style={styles.milestone}>
                    <View style={styles.milestoneLeft}>
                      <View style={[
                        styles.milestoneDot,
                        { backgroundColor: isLast ? '#f59e0b' : '#374151' }
                      ]} />
                      {idx < getMilestones().length - 1 && (
                        <View style={styles.milestoneLine} />
                      )}
                    </View>
                    <View style={styles.milestoneBody}>
                      <View style={styles.milestoneTop}>
                        <Text style={styles.milestoneYear}>
                          Year {m.year} · Age {m.age}
                        </Text>
                        <Text style={[styles.milestoneCorpus, isLast && { color: '#f59e0b' }]}>
                          {fmt(m.corpus)}
                        </Text>
                      </View>
                      <View style={styles.milestoneBarTrack}>
                        <View style={[
                          styles.milestoneBarFill,
                          {
                            width: `${pct}%` as any,
                            backgroundColor: isLast ? '#f59e0b' : '#a855f7',
                          }
                        ]} />
                      </View>
                      <Text style={styles.milestonePct}>{pct.toFixed(1)}% of FI Corpus</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Breakdown Toggle */}
            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setShowBreakdown(!showBreakdown)}
            >
              <Text style={styles.breakdownToggleText}>
                {showBreakdown ? 'Hide' : 'Show'} Full Calculation Breakdown
              </Text>
              <Ionicons
                name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#f59e0b"
              />
            </TouchableOpacity>

            {showBreakdown && (
              <View style={styles.breakdownCard}>
                {[
                  { label: 'Current Monthly Expenses', value: fmtFull(result.monthlyExpenseToday) },
                  { label: `Inflation Rate`, value: `${values.inflation}%` },
                  { label: 'Years to FI', value: `${result.yearsToFI} years` },
                  { label: 'Inflation-Adj. Monthly Expense', value: fmtFull(result.inflationAdjustedMonthlyExpense) },
                  { label: 'Annual Expense at FI', value: fmtFull(result.annualExpenseAtFI) },
                  { label: `FI Corpus (Annual ÷ ${values.swr}%)`, value: fmtFull(result.fiCorpusRequired) },
                  { label: 'Current Portfolio FV', value: fmt(parseFloat(values.currentInvestments) * Math.pow(1 + parseFloat(values.annualReturn) / 100, result.yearsToFI)) },
                  { label: 'SIP Future Value', value: fmt(result.projectedCorpusAtFI - parseFloat(values.currentInvestments) * Math.pow(1 + parseFloat(values.annualReturn) / 100, result.yearsToFI)) },
                  { label: 'Total Projected Corpus', value: fmtFull(result.projectedCorpusAtFI) },
                  { label: result.isOnTrack ? 'Surplus Corpus' : 'Corpus Gap', value: fmtFull(result.isOnTrack ? result.corpusSurplus : result.corpusGap) },
                ].map((row) => (
                  <View key={row.label} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{row.label}</Text>
                    <Text style={styles.breakdownValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Summary Note */}
            <View style={styles.summaryNote}>
              <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
              <Text style={styles.summaryNoteText}>
                At age <Text style={styles.highlight}>{result.retirementAge}</Text>, you'll need a corpus of{' '}
                <Text style={styles.highlight}>{fmt(result.fiCorpusRequired)}</Text> to cover monthly expenses of{' '}
                <Text style={styles.highlight}>{fmt(result.inflationAdjustedMonthlyExpense)}</Text> (inflation-adjusted).
                Your projected corpus is{' '}
                <Text style={[styles.highlight, { color: result.isOnTrack ? '#06d6a0' : '#f72585' }]}>
                  {fmt(result.projectedCorpusAtFI)}
                </Text>
                {result.isOnTrack
                  ? ` — you're ahead by ${fmt(result.corpusSurplus)}. 🎯`
                  : `. Increase your monthly investment to close the gap of ${fmt(result.corpusGap)}.`}
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
  content: { padding: 20, paddingBottom: 56 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f59e0b12',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f59e0b30',
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f59e0b20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: -0.3 },
  bannerSub: { fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 17 },

  card: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
    gap: 14,
  },
  cardSectionTitle: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#1a2035',
    marginVertical: 4,
  },
  inputGroup: { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  inputLabel: { fontSize: 11, color: '#6b7280', fontWeight: '800', letterSpacing: 1 },
  sublabel: { fontSize: 11, color: '#374151', marginTop: -2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131929',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a2035',
    paddingHorizontal: 14,
  },
  inputAffix: { fontSize: 16, color: '#4b5563', fontWeight: '600' },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#f3f4f6',
    paddingVertical: 13,
    paddingHorizontal: 8,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusGreen: { backgroundColor: '#06d6a012', borderColor: '#06d6a030' },
  statusRed: { backgroundColor: '#f7258512', borderColor: '#f7258530' },
  statusText: { flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 18 },

  sectionLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },

  fiHero: {
    flexDirection: 'row',
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b30',
    alignItems: 'center',
  },
  fiHeroLeft: { flex: 1.4, alignItems: 'center' },
  fiHeroSmall: { fontSize: 9, color: '#4b5563', fontWeight: '800', letterSpacing: 1, textAlign: 'center' },
  fiHeroYears: { fontSize: 72, fontWeight: '200', color: '#f59e0b', letterSpacing: -4, lineHeight: 80 },
  fiHeroYearsLabel: { fontSize: 14, color: '#4b5563', fontWeight: '700', marginTop: -4 },
  fiHeroDividerV: { width: 1, height: 80, backgroundColor: '#1a2035', marginHorizontal: 20 },
  fiHeroRight: { flex: 1, alignItems: 'center', gap: 4 },
  fiHeroStat: { alignItems: 'center' },
  fiHeroStatLabel: { fontSize: 10, color: '#374151', fontWeight: '700', letterSpacing: 0.5 },
  fiHeroStatVal: { fontSize: 22, fontWeight: '800', color: '#f3f4f6' },

  outputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  outputCard: {
    width: '47%',
    backgroundColor: '#0d1117',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  outputCardFull: { width: '100%' },
  outputCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  outputIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outputCardLabel: { fontSize: 10, color: '#4b5563', fontWeight: '800', letterSpacing: 1, flex: 1 },
  outputCardValue: { fontSize: 22, fontWeight: '800' },
  outputCardSub: { fontSize: 11, color: '#374151' },

  corpusBarTrack: {
    height: 6,
    backgroundColor: '#1a2035',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  corpusBarFill: { height: '100%', borderRadius: 3 },

  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metricCard: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2035',
    alignItems: 'center',
    gap: 6,
  },
  metricIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: { fontSize: 20, fontWeight: '800' },
  metricLabel: { fontSize: 12, color: '#6b7280', fontWeight: '700' },
  metricSub: { fontSize: 10, color: '#374151', textAlign: 'center' },

  milestonesCard: {
    backgroundColor: '#0d1117',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  milestone: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  milestoneLeft: { alignItems: 'center', width: 14 },
  milestoneDot: { width: 14, height: 14, borderRadius: 7, marginTop: 2 },
  milestoneLine: { width: 2, flex: 1, backgroundColor: '#1a2035', marginTop: 4 },
  milestoneBody: { flex: 1, gap: 6 },
  milestoneTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  milestoneYear: { fontSize: 12, color: '#6b7280', fontWeight: '700' },
  milestoneCorpus: { fontSize: 14, fontWeight: '800', color: '#f3f4f6' },
  milestoneBarTrack: {
    height: 5,
    backgroundColor: '#1a2035',
    borderRadius: 3,
    overflow: 'hidden',
  },
  milestoneBarFill: { height: '100%', borderRadius: 3 },
  milestonePct: { fontSize: 10, color: '#374151' },

  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d1117',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f59e0b30',
  },
  breakdownToggleText: { fontSize: 13, color: '#f59e0b', fontWeight: '700' },

  breakdownCard: {
    backgroundColor: '#0d1117',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a2035',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2035',
  },
  breakdownLabel: { fontSize: 12, color: '#6b7280', flex: 1 },
  breakdownValue: { fontSize: 13, color: '#f3f4f6', fontWeight: '700', textAlign: 'right' },

  summaryNote: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#f59e0b10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f59e0b25',
  },
  summaryNoteText: { flex: 1, fontSize: 13, color: '#6b7280', lineHeight: 20 },
  highlight: { color: '#f59e0b', fontWeight: '700' },
});
